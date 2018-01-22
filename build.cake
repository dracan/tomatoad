#tool "nuget:?package=GitVersion.CommandLine"
#addin nuget:?package=Cake.DoInDirectory
#addin Cake.Powershell
#addin "Cake.Npm"
#tool "nuget:?package=GitVersion.CommandLine"
#addin "nuget:?package=MagicChunks"
#tool "nuget:?package=gitreleasemanager"

var target = Argument("target", "Default");
var configuration = Argument("configuration", "Release");
var isLocalBuild = Argument("isLocalBuild", false);
string semVersion = null;

Task("CalculateVersionNumber")
    .Does(() => {
        GitVersion assertedVersions = GitVersion(new GitVersionSettings { OutputType = GitVersionOutput.Json });
        semVersion = assertedVersions.LegacySemVerPadded;
        Information("Calculated Semantic Version: {0}", semVersion);
    });

Task("UpdateProjectJsonVersion")
    .IsDependentOn("CalculateVersionNumber")
    .WithCriteria(() => !isLocalBuild)
    .Does(() => {
        DoInDirectory(@"src", () => {
            Information("Updating package.json version to {0}", semVersion);

            TransformConfig("package.json", "package.json", new TransformationCollection {
                { "version", semVersion }
            });
        });
    });

Task("NpmInstall")
    .Does(() => {
        DoInDirectory(@"src", () => {
            NpmInstall();
        });
    });

Task("ElectronBuild")
    .IsDependentOn("NpmInstall")
    .IsDependentOn("UpdateProjectJsonVersion")
    .Does(() => {
        DoInDirectory(@"src", () => {
            NpmRunScript("dist");
        });
    });

Task("ChocolateyUpdateVersionNumbers")
    .IsDependentOn("CalculateVersionNumber")
    .Does(() => {
        DoInDirectory(@"chocolatey", () => {
            TransformConfig("tomatoad.nuspec", "tomatoad.nuspec", new TransformationCollection {
                { "package/metadata/version", semVersion }
            });

            // Update chocolateyinstall.ps1
            var content = $"Install-ChocolateyPackage 'Tomatoad' 'exe' '/S' 'https://github.com/dracan/tomatoad/releases/download/{semVersion}/Tomatoad.Setup.0.1.0.exe'";
            System.IO.File.WriteAllText("tools/chocolateyinstall.ps1", content);
        });
    });

Task("ChocolateyPack")
    .IsDependentOn("ChocolateyUpdateVersionNumbers")
    .Does(() => {
        DoInDirectory(@"chocolatey", () => {
            ChocolateyPack("tomatoad.nuspec", new ChocolateyPackSettings());
        });
    });

Task("ChocolateyPush")
    .IsDependentOn("ChocolateyPack")
    .Does(() => {
        DoInDirectory(@"chocolatey", () => {
            var apiKey = EnvironmentVariable("TomatoadChocolateyApiKey");
            if(apiKey == null) {
                throw new NullReferenceException("TomatoadChocolateyApiKey environment variable must be set!");
            }

            ChocolateyPush($"tomatoad.{semVersion}.nupkg", new ChocolateyPushSettings {
                ApiKey = apiKey,
            });
        });
    });

Task("UpdateGit")
    .IsDependentOn("UpdateProjectJsonVersion")
    .IsDependentOn("ChocolateyUpdateVersionNumbers")
    .Does(() => {
        // Using StartProcess instead of Cake.Git because its GitCommit requires an explicit name and email.
        // As this isn't yet going through a build server - I don't this hardcoded.
        StartProcess("git", new ProcessSettings { Arguments = "add -A ." });
        StartProcess("git", new ProcessSettings { Arguments = $"commit -m \"Updated version info to {semVersion}\"" });
        StartProcess("git", new ProcessSettings { Arguments = $"tag {semVersion}" });
        StartProcess("git", new ProcessSettings { Arguments = "push" });
        StartProcess("git", new ProcessSettings { Arguments = "push --tags" });
    });

Task("GitHubRelease")
    .IsDependentOn("CalculateVersionNumber")
    .IsDependentOn("ElectronBuild")
    .IsDependentOn("UpdateGit")
    .Does(() => {
        var gitHubUsername = EnvironmentVariable("TomatoadGitHubUsername");
        var gitHubPassword = EnvironmentVariable("TomatoadGitHubPassword");

        GitReleaseManagerCreate(gitHubUsername, gitHubPassword, "dracan", "tomatoad", new GitReleaseManagerCreateSettings {
                Milestone       = semVersion,
                Name            = semVersion,
                Prerelease      = true,
                TargetCommitish = "master"
            });

        var packageFile = File($"src/dist/Tomatoad Setup {semVersion}.exe");

        GitReleaseManagerAddAssets(gitHubUsername, gitHubPassword, "dracan", "tomatoad", semVersion, packageFile);
        GitReleaseManagerClose(gitHubUsername, gitHubPassword, "dracan", "tomatoad", semVersion);
        GitReleaseManagerPublish(gitHubUsername, gitHubPassword, "dracan", "tomatoad", semVersion);
    });

Task("Publish")
    // .IsDependentOn("ChocolateyPush")
    .IsDependentOn("GitHubRelease")
    .Does(() => {
    });

Task("Default")
    .IsDependentOn("Publish")
    .Does(() => {
    });

RunTarget(target);

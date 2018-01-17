#tool "nuget:?package=GitVersion.CommandLine"
#addin nuget:?package=Cake.DoInDirectory
#addin Cake.Powershell
#addin "Cake.Npm"
#tool "nuget:?package=GitVersion.CommandLine"
#addin "nuget:?package=MagicChunks"

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

Task("UpdateGit")
    .IsDependentOn("ElectronBuild")
    .Does(() => {
        // Using StartProcess instead of Cake.Git because its GitCommit requires an explicit name and email.
        // As this isn't yet going through a build server - I don't this hardcoded.
        StartProcess("git", new ProcessSettings { Arguments = "add -A ." });
        StartProcess("git", new ProcessSettings { Arguments = $"commit -m \"Updated version info to {semVersion}\"" });
        StartProcess("git", new ProcessSettings { Arguments = $"tag {semVersion}" });
        StartProcess("git", new ProcessSettings { Arguments = "push" });
        StartProcess("git", new ProcessSettings { Arguments = "push --tags" });
    });

Task("Default")
    .IsDependentOn("UpdateGit")
    .Does(() => {
    });

RunTarget(target);

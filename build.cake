#tool "nuget:?package=GitVersion.CommandLine"
#addin nuget:?package=Cake.DoInDirectory
#addin Cake.Powershell
#addin "Cake.Npm"

var target = Argument("target", "Default");
var configuration = Argument("configuration", "Release");

Task("NpmInstall")
    .Does(() => {
        DoInDirectory(@"src", () => {
            NpmInstall();
        });
    });

Task("ElectronBuild")
    .IsDependentOn("NpmInstall")
    .Does(() => {
        DoInDirectory(@"src", () => {
            NpmRunScript("dist");
        });
    });

Task("Default")
    .IsDependentOn("ElectronBuild")
    .Does(() => {
    });

RunTarget(target);

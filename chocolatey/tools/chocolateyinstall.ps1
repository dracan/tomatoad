$name = 'Tomatoad'
$installerType = 'exe'
$url  = 'https://github.com/dracan/tomatoad/releases/download/0.1.0/Tomatoad.Setup.0.1.0.exe'
$silentArgs = '/S'

Install-ChocolateyPackage $name $installerType $silentArgs $url
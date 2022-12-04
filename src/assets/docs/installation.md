# Installation
Glint is available for Windows, macOS, and Linux from the [download page](/download).

By downloading and using Glint, you agree to the [license agreement](/eula), [terms of service](/terms) and [privacy policy](/privacy).

## Linux

### AppImage
After downloading, the AppImage file must be given the executable flag:
```
chmod +x Glint-v1.0.0.AppImage
```
Additionally, the `libfuse2` package is required to run AppImage files. If not already installed on your distribution (e.g. Ubuntu 22.04) then install it with this command:
```
apt install libfuse2
```
After these steps have been completed, the AppImage should run.

### Snap
The snap package should run without any additional steps. If you need access to your SSH key directory (`~/.ssh`), then you will need to enable this permission for the snap manually.

## macOS
Glint supports both x64 and arm64 (Mac M1) architectures with the same installer. There are no extra steps required to install.

## Windows
The VC++ runtime is required, but this is included in the installer package and should be installed automatically. If you need to install manually, you can download it from <a href="https://learn.microsoft.com/en-US/cpp/windows/latest-supported-vc-redist" target="_blank">here</a>.

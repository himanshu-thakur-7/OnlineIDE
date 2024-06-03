# Start from a base image
FROM nixos/nix

# Add your additional Dockerfile commands here
# For example:
# COPY my-nix-config.nix /etc/nixos/configuration.nix

# Disable seccomp filtering for Nix
CMD ["/run/current-system/sw/bin/nix-daemon", "--filter-syscalls=false"]

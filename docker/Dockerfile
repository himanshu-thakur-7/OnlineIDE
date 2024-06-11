# Dockerfile
FROM nixos/nix

# Disable seccomp filtering for Nix
CMD ["/run/current-system/sw/bin/nix-daemon", "--filter-syscalls=false"]

# Install nodejs and socket.io
RUN nix-env -iA nixpkgs.nodejs nixpkgs.python3 nixpkgs.python311Packages.pip nixpkgs.gnumake nixpkgs.gcc nixpkgs.coreutils nixpkgs.findutils nixpkgs.gnugrep nixpkgs.gnused nixpkgs.gawk


WORKDIR /web-socket-server

COPY web-socket-server/package*.json ./

# Install dependencies
RUN npm install -g npm@10.8.1
RUN npm install

# Copy the rest of the application code to the working directory
COPY web-socket-server .
# Expose the port for socket.io server
EXPOSE 6000


const Docker = require('dockerode');
const portfinder = require("portfinder");

// Initialize variables
const docker = new Docker();

const containers = {};

// function to find 'count' number of available ports on the host machine
async function findAvailablePorts(count) {
    const ports = [];
    portfinder.basePort = 7000; // starting point for the port search

    for (let i = 0; i < count; i++) {
        const port = await portfinder.getPortPromise();
        ports.push(port);
        portfinder.basePort = port + 2; // increment basePort to find the next available port
    }

    return ports;
}

// function to fetch container info by name
async function getContainerByName(containerName) {
    const containers = await docker.listContainers({ all: true });
    const containerInfo = containers.find(c => c.Names.includes(`/${containerName}`));
    return containerInfo ? docker.getContainer(containerInfo.Id) : null;
}

// function to check if a package is already installed in container
async function isPackageInstalled(container, packageName) {
    if (packageName === 'react') packageName = "nodejs";
    const exec = await container.exec({
        AttachStdout: true,
        AttachStderr: true,
        Cmd: ['nix-env', '-q', packageName]
    });
    const stream = await exec.start();
    const output = await new Promise((resolve, reject) => {
        let output = '';
        stream.on('data', data => {
            output += data.toString();
        });
        stream.on('end', () => {
            resolve(output)
        });
        stream.on('error', err => reject(err));
    });
    return !output.includes(`error: selector '${packageName}'`);
}

// function to install a package in the container 
async function installPackage(container, packageName) {
    if (packageName === 'react') packageName = "nodejs";
    const exec = await container.exec({
        AttachStdout: true,
        AttachStderr: true,
        Cmd: ['nix-env', '-iA', 'nixpkgs.' + packageName]
    });
    try {
        console.log(`${packageName} Installing...`);
        const stream = await exec.start();
        await new Promise((resolve, reject) => {
            stream.on('data', data => console.log(data.toString()));
            stream.on('end', resolve);
            stream.on('error', reject);
        });
        console.log(`${packageName} installed!`);
    } catch (e) {
        console.log(`Error installing ${packageName}: `, e.message);
    }
}

// function to start the web server
async function startWebServer(container) {
    const exec = await container.exec({
        AttachStdout: true,
        AttachStderr: true,
        Cmd: ['node', '/web-socket-server/index.js']
    });
    await exec.start();

}


async function startContainer(containerName, env) {

    let ports = [];
    let container = await getContainerByName(containerName);
    // If no container is present,create a new one
    if (!container) {
        // get available ports
        ports = await findAvailablePorts(2);

        container = await docker.createContainer({
            Image: 'my-nix-node-image',
            Tty: true,
            Cmd: ['/bin/sh'],
            name: containerName,
            HostConfig: {
                SecurityOpt: ['seccomp=unconfined'],
                PortBindings: {
                    '6000/tcp': [{ HostPort: `${ports[0]}` }],
                    '3000/tcp': [{ HostPort: `${ports[1]}` }]
                }
            },
            ExposedPorts: {
                '6000/tcp': {},
                '3000/tcp': {}
            },
            AttachStdin: false,
            AttachStdout: true,
            AttachStderr: true,
            OpenStdin: false,
            StdinOnce: false
        });
        console.log(container.Id);
    }
    try {
        await container.start();
        console.log("Container started");
    } catch (e) {
        console.log(e.message);
    }
    // check if environment is already set up in container, if not install it
    if (!await isPackageInstalled(container, env)) {
        await installPackage(container, env);
    } else {
        console.log(`Package ${env} already installed!`);
    }
    // Start web socket server inside the container
    await startWebServer(container);
    const containerId = container.id;

    containers[containerId] = container;

    // Get ports information from the container
    const data = await container.inspect();
    const webSocketPort = data.NetworkSettings.Ports['6000/tcp'] ? data.NetworkSettings.Ports['6000/tcp'][0].HostPort : -1;
    const devPort = data.NetworkSettings.Ports['3000/tcp'] ? data.NetworkSettings.Ports['3000/tcp'][0].HostPort : -1;

    return { containerId: containerId, webSocketPort: webSocketPort, devPort: devPort };
}

// function to stop and remove the container
async function stopContainer(containerId) {
    const container = containers[containerId];

    if (container) {
        await container.stop();
        await container.remove();
        delete containers[containerId];
    }

}

module.exports = { startContainer, stopContainer };

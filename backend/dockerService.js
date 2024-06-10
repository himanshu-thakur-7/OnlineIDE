const Docker = require('dockerode');
const portfinder = require("portfinder");
const docker = new Docker();
const pty = require('node-pty');

const containers = {};
const terminals = {};

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
async function getContainerByName(containerName) {
    const containers = await docker.listContainers({ all: true });
    const containerInfo = containers.find(c => c.Names.includes(`/${containerName}`));
    return containerInfo ? docker.getContainer(containerInfo.Id) : null;
}

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
        stream.on('end', () => resolve(output));
        stream.on('error', err => reject(err));
    });
    return output.includes(packageName);
}

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

async function startWebServer(container) {
    const exec = await container.exec({
        AttachStdout: true,
        AttachStderr: true,
        Cmd: ['node', '/web-socket-server/index.js']
    });
    await exec.start();

}


async function startContainer(containerName, env) {

    // let ports = [];
    let ports = [];
    let container = await getContainerByName(containerName);
    if (!container) {
        ports = await findAvailablePorts(2);

        console.log("PORTS::::", ports);
        container = await docker.createContainer({
            Image: 'my-nix-node-image',
            Tty: true,
            Cmd: ['/bin/sh'], // Ensure the server starts directly
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

    if (!await isPackageInstalled(container, env)) {
        await installPackage(container, env);
    } else {
        console.log(`Package ${env} already installed!`);
    }
    await startWebServer(container);
    const containerId = container.id;
    containers[containerId] = container;

    if (!terminals[containerId]) {
        // Create a pseudo-terminal session
        const terminal = pty.spawn('docker', ['exec', '-it', containerId, '/bin/sh'], {
            name: 'xterm-color',
            cols: 80,
            rows: 30
        });
        terminals[containerId] = terminal;
    }
    const data = await container.inspect();
    const webSocketPort = data.NetworkSettings.Ports['6000/tcp'] ? data.NetworkSettings.Ports['6000/tcp'][0].HostPort : -1;
    const devPort = data.NetworkSettings.Ports['3000/tcp'] ? data.NetworkSettings.Ports['3000/tcp'][0].HostPort : -1;

    // console.log("PORTS:::", ports)
    return { containerId: containerId, webSocketPort: webSocketPort, devPort: devPort };
}

async function stopContainer(containerId) {
    const container = containers[containerId];
    const terminal = terminals[containerId];

    if (container) {
        await container.stop();
        await container.remove();
        delete containers[containerId];
    }

    if (terminal) {
        terminal.kill();
        delete terminals[containerId];
    }
}

module.exports = { startContainer, stopContainer, terminals };

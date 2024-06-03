const Docker = require('dockerode');
const docker = new Docker();
const pty = require('node-pty');

const containers = {};
const terminals = {};

async function getContainerByName(containerName) {
    const containers = await docker.listContainers({ all: true });
    const containerInfo = containers.find(c => c.Names.includes(`/${containerName}`));
    return containerInfo ? docker.getContainer(containerInfo.Id) : null;
}
async function isPackageInstalled(container, packageName) {
    const exec = await container.exec({ Cmd: ['nix-env', '-q', packageName] });
    const inspect = await exec.inspect();
    return inspect.ExitCode === 0;
}

async function installPackage(container, packageName) {
    const exec = await container.exec({ Cmd: ['nix-env', '-iA', 'nixpkgs.' + packageName] });
    try {
        console.log(`${packageName} Installing........`);
        await exec.start();
        console.log(`${packageName} installed!`)
    }
    catch (e) {
        console.log(`Error installing ${packageName}: `, e.message);
    }
}

async function startContainer(containerName, env) {
    let container = await getContainerByName(containerName);
    // console.log(container.State);
    if (!container) {
        container = await docker.createContainer({
            Image: 'my-nix-node-image',
            Tty: true,
            Cmd: ['/bin/sh'],
            name: containerName,
            HostConfig: {
                SecurityOpt: ['seccomp=unconfined']
            }
        });
        console.log(container.Id)
    }
    try {
        await container.start();
    }
    catch (e) {
        console.log(e.message);
    }

    // container.exec({
    //     Cmd: ['nix-env', '--install', env],
    //     AttachStdout: true,
    //     AttachStderr: true,
    // }, function (err, exec) {
    //     if (err) {
    //         console.error('Error executing command:', err);
    //         return;
    //     }

    //     exec.start(function (err, stream) {
    //         if (err) {
    //             console.error('Error starting stream:', err);
    //             return;
    //         }

    //         // Log output of the command
    //         container.modem.demuxStream(stream, process.stdout, process.stderr);
    //     });
    // });

    if (!await isPackageInstalled(container, env)) {
        await installPackage(container, env);
    }
    else {
        console.log(`Package ${env} already installed!`)
    }

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

    return containerId;
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

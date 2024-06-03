const Docker = require('dockerode');
const docker = new Docker();

async function startContainer(containerName, envPackages) {
    let container;
    const nixShellCmd = `nix-shell -p ${envPackages.join(' ')} --run "/bin/sh"`;

    try {
        container = await docker.createContainer({
            Image: 'nixos/nix:master',
            Tty: true,
            Cmd: ['/bin/sh', '-c', nixShellCmd],
            name: containerName,
            HostConfig: {
                SecurityOpt: ['seccomp=unconfined']
            }
        });

        await container.start();
        console.log('Container started successfully');
    } catch (err) {
        console.error('Error starting container:', err);
    }
}

const packages = ['nodejs', 'python3']; // Specify the packages you need here
startContainer('test-container', packages);

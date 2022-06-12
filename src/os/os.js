import os from 'os';

export const osOperations = (value) => {
    let operation = value.slice(2);

    switch (operation) {
      case 'EOL':
        console.log(JSON.stringify(os.EOL) + '\n');
        console.log(`You are currently in ${process.cwd()} \n`);
        break;

      case 'cpus':
        console.log(`Overall amount of CPUs: ${os.cpus().length}`);
        console.log(
          os.cpus().map((item) => {
            return { model: item.model, speed: Math.round(item.speed / 1000) };
          })
        );
        console.log(`You are currently in ${process.cwd()} \n`);
        break;

      case 'homedir':
        console.log(os.homedir() + '\n');
        console.log(`You are currently in ${process.cwd()} \n`);
        break;

      case 'username':
        console.log(os.userInfo().username + '\n');
        console.log(`You are currently in ${process.cwd()} \n`);
        break;

      case 'architecture':
        console.log(os.arch() + '\n');
        console.log(`You are currently in ${process.cwd()} \n`);
        break;

      default:
        console.log(new Error('Invalid input'));
        console.log(`You are currently in ${process.cwd()} \n`);
    }
  };
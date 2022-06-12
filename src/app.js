import { parseArgs } from './util/args.js';
import { goUppper, goToFolder, listAllFiles } from './navigation/navigation.js';
import {
  createFile,
  renameFile,
  deleteFile
} from './filesOperations/fsOperations.js';
import { readFile, copyFile, moveFile } from './filesOperations/fsStreams.js';
import { calcHash } from './hash/calcHash.js';
import { compress, decompress } from './zlib/zlib.js';
import { osOperations } from './os/os.js';

import os from 'os';
import readline from 'readline';

export const app = async () => {
  const userName = parseArgs();
  process.env.NODE_ENV = 'production';

  const welcome = `Welcome to the File Manager, ${userName}!`;
  const goodbye = `Thank you for using File Manager, ${userName}!`;
  let pathMessage = `You are currently in ${process.cwd()} \n`;

  let actualPath = os.homedir();
  process.chdir(actualPath);

  if (userName) {
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });

    console.log(welcome + '\n');
    console.log(pathMessage);

    rl.on('line', (input) => {
      let operation = input.split(' ')[0];
      let args = input.split(' ');
      args.shift();
      args = args.join(' ');

      switch (operation) {
        case 'up':
          goUppper();
          break;

        case 'cd':
          goToFolder(args);
          break;

        case 'ls':
          listAllFiles();
          break;

        case 'cat':
          readFile(args);
          break;

        case 'add':
          createFile(args);
          break;

        case 'rn':
          renameFile(args);
          break;

        case 'cp':
          copyFile(args);
          break;

        case 'mv':
          moveFile(args);
          break;

        case 'rm':
          deleteFile(args);
          break;

        case 'os':
          osOperations(args);
          break;

        case 'hash':
          calcHash(args);
          break;

        case 'compress':
          if (args && args.split(' ').length == 2) {
            compress(args);
          } else {
            console.log(new Error('Invalid input'));
          }
          break;

        case 'decompress':
          if (args && args.split(' ').length == 2) {
            decompress(args);
          } else {
            console.log(new Error('Invalid input'));
          }

          break;

        case '.exit':
          console.log(goodbye);
          rl.close(actualPath);
          break;

        default:
          operation.trim() === ''
            ? console.log('Enter the operation!')
            : console.log(new Error('Invalid input'));
      }
    });

    rl.on('SIGINT', () => {
      console.log(goodbye);
      rl.close();
    });
  }
};

app();

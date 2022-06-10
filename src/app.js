import { parseArgs } from './util/args.js';

import path, { dirname, join } from 'path';
import { fileURLToPath } from 'url';

import { access, readdir } from 'fs/promises';
import { createWriteStream, createReadStream } from 'fs';

import os from 'os';

import readline from 'readline';

export const app = async () => {
  const userName = parseArgs();
  const welcome = `Welcome to the File Manager, ${userName}!`;
  const goodbye = `Thank you for using File Manager, ${userName}!`;
  let actualPath =
    process.env[process.platform == 'win32' ? 'USERPROFILE' : 'HOME'];
  let pathMessage = `You are currently in ${actualPath}`;
  const root = actualPath.split(path.sep)[0];

  const up = () => {
    if (actualPath !== root) {
      actualPath = actualPath.split('\\');
      actualPath.pop();
      actualPath = actualPath.join('\\');
    }
    console.log(`You are currently in ${actualPath}`);
  };

  const cd = (input) => {
    input = input.split(' ');
    input.shift();
    input = input.join(' ');

    console.log(input);

    const path = input.includes(root) ? input : join(actualPath, input);
    access(path).then(() => {
      actualPath = path;
      console.log(`You are currently in ${actualPath}`);
    }).catch((err) => {
      console.error(new Error('Operation failed'));
      console.log(`You are currently in ${actualPath}`);
    })
  };

  const ls = async() => {
    try {
      await readdir(actualPath).then((files) => {
        for (const file of files) console.log(file);
      });
    } catch (error) {
      console.error(new Error('Operation failed'));
    }
  }

  if (userName) {
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });

    console.log(welcome + '\n');
    console.log(pathMessage);

    rl.on('line', (input) => {
      let operation = input.split(' ')[0];
      console.log(`Received: ${operation}`);
      
      switch (operation) {
        case 'up':
          up();
          break;

        case 'cd':
          cd(input);
          break;

        case 'ls':
          ls();
          break;

        case '.exit':
          console.log(goodbye);
          rl.close(actualPath);
          break;
      }
    });

    rl.on('SIGINT', () => {
      console.log(goodbye);
      rl.close();
    });
  }
};

app();

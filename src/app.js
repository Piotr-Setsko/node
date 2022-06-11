import { parseArgs } from './util/args.js';

import path, { dirname, join } from 'path';
import { fileURLToPath } from 'url';

import { access, readdir, open, rename, rm } from 'fs/promises';
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

  process.chdir(actualPath);

  const up = () => {
    if (actualPath !== root) {
      actualPath = actualPath.split('\\');
      actualPath.pop();
      actualPath = actualPath.join('\\');
      process.chdir(actualPath);
    }
    console.log(`You are currently in ${actualPath}`);
  };

  const cd = (input) => {
    const path = input.includes(root) ? input : join(actualPath, input);
    access(path)
      .then(() => {
        actualPath = path;
        process.chdir(actualPath);
        console.log(`You are currently in ${actualPath}`);
      })
      .catch((err) => {
        console.error(new Error('Operation failed'));
        console.log(`You are currently in ${actualPath}`);
      });
  };

  const ls = async () => {
    try {
      await readdir(actualPath).then((files) => {
        for (const file of files) console.log(file);
      });
    } catch (error) {
      console.error(new Error('Operation failed'));
    }
  };

  const cat = (pathFile) => {
    const input = createReadStream(pathFile, 'utf-8');
    const output = process.stdout;
    input.pipe(output);
    input.on('error', (error) => console.error(new Error('Operation failed')));
    input.on('end', () =>
      console.log('\n' + `You are currently in ${actualPath}`)
    );
  };

  const add = async (nameFile) => {
    try {
      await open(nameFile, 'wx+');
      console.log('\n' + `You are currently in ${actualPath}`);
    } catch (error) {
      console.log(new Error('Operation failed'));
    }
  };

  const getFilePath = (value) => {
    let filePath;
    let newFileName;
    let newFilePath;

    [filePath, newFileName] = value.split(' ');
    if (filePath.split('/').length > 1) {
      newFilePath = filePath.split('/');
      newFilePath.pop();
      newFilePath = newFilePath + '/' + newFileName;
    } else {
      newFilePath = newFileName;
    }

    return [filePath, newFilePath];
  };

  const rn = async (value) => {
    let filePath;
    let newFilePath;

    [filePath, newFilePath] = getFilePath(value);

    try {
      await access(newFilePath).then(
        () => {
          console.log(new Error('FS operation failed'));
        },
        () => {
          return;
        }
      );

      await rename(filePath, newFilePath);
    } catch (error) {
      console.log(new Error('FS operation failed'));
    }
  };

  const copy = async (value) => {
    let filePath;
    let newDirPath;

    [filePath, newDirPath] = value.split(' ');
    let file = filePath.split('/').pop();
    let newFilePath = join(newDirPath, file);

    await access(newFilePath).then(
      () => {
        console.log(new Error('FS operation failed'));
      },
      () => {
        return;
      }
    );

    createReadStream(filePath)
      .on('error', (err) => {
        console.log(new Error('FS operation failed'));
      })
      .pipe(createWriteStream(newFilePath))
      .on('error', (err) => {
        console.log(new Error('FS operation failed'));
      });
  };

  const remove = async (value) => {
    try {
      await rm(value);
    } catch (error) {
      console.log(new Error('FS operation failed'));
    }
  }

  const move = async (value) => {
    let filePath;
    let newDirPath;

    [filePath, newDirPath] = value.split(' ');

    await copy(value);
    await remove(filePath);
  };

  if (userName) {
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });

    console.log(welcome + '\n');
    console.log(`You are currently in ${process.cwd()}`);

    rl.on('line', (input) => {
      let operation = input.split(' ')[0];
      let args = input.split(' ');
      args.shift();
      args = args.join(' ');

      console.log(`Received: ${operation}`);

      switch (operation) {
        case 'up':
          up();
          break;

        case 'cd':
          cd(args);
          break;

        case 'ls':
          ls();
          break;

        case 'cat':
          cat(args);
          break;

        case 'add':
          add(args);
          break;

        case 'rn':
          rn(args);
          break;

        case 'cp':
          copy(args);
          break;

        case 'mv':
          move(args);
          break;

        case 'rm':
          remove(args);
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

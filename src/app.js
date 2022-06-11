import { parseArgs } from './util/args.js';
import {goUppper, goToFolder, listAllFiles} from './navigation/navigation.js'

import path, { dirname, join } from 'path';
import { fileURLToPath } from 'url';

import { access, readdir, open, rename, rm } from 'fs/promises';
import { createWriteStream, createReadStream } from 'fs';

import os from 'os';
import { createHash } from 'crypto';
import { createBrotliDecompress, createBrotliCompress } from 'zlib';

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
  };

  const move = async (value) => {
    let filePath;
    let newDirPath;

    [filePath, newDirPath] = value.split(' ');

    await copy(value);
    await remove(filePath);
  };

  const calcHash = (value) => {
    const hash = createHash('sha256');
    const stream = createReadStream(value);

    stream.on('error', () => {
      console.log(new Error('FS operation failed'));
    });
    stream.on('data', (data) => {
      const result = hash.update(data).digest('hex');
      console.log(result);
    });
    stream.on('end', () => {
      console.log(`You are currently in ${actualPath}`);
    });
  };

  const compress = (value) => {
    let inputFile;
    let outputFile;

    [inputFile, outputFile] = value.split(' ');
    const readStream = createReadStream(inputFile);
    const writeStream = createWriteStream(outputFile);

    const brotli = createBrotliCompress();
    const stream = readStream.pipe(brotli).pipe(writeStream);

    stream.on('finish', () => {
      console.log(`You are currently in ${process.cwd()}`);
    });
  };

  const decompress = (value) => {
    let inputFile;
    let outputFile;

    [inputFile, outputFile] = value.split(' ');
    const readStream = createReadStream(inputFile);
    const writeStream = createWriteStream(outputFile);

    const brotli = createBrotliDecompress();
    const stream = readStream.pipe(brotli).pipe(writeStream);

    stream.on('finish', () => {
      console.log(`You are currently in ${process.cwd()}`);
    });
  };

  const osOperations = (value) => {
    let operation = value.slice(2);

    switch (operation) {
      case 'EOL':
        console.log(JSON.stringify(os.EOL));
        break;

      case 'cpus':
        console.log(`Overall amount of CPUs: ${os.cpus().length}`);
        console.log(os.cpus().map((item) => item.model));
        break;

      case 'homedir':
        console.log(os.homedir());
        break;

      case 'username':
        console.log(os.userInfo().username);
        break;

      case 'architecture':
        console.log(os.arch());
        break;

      default:
        console.log(new Error('Invalid input'));
    }
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
          goUppper();
          break;

        case 'cd':
          goToFolder(args);
          break;

        case 'ls':
          listAllFiles();
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

        case 'os':
          osOperations(args);
          break;

        case 'hash':
          calcHash(args);
          break;

        case 'compress':
          compress(args);
          break;

        case 'decompress':
          decompress(args);
          break;

        case '.exit':
          console.log(goodbye);
          rl.close(actualPath);
          break;

        default:
          console.log(new Error('Invalid input'));
      }
    });

    rl.on('SIGINT', () => {
      console.log(goodbye);
      rl.close();
    });
  }
};

app();

import { createWriteStream, createReadStream } from 'fs';
import { join } from 'path';
import { access } from 'fs/promises';
import { unlink } from 'fs/promises';

export const readFile = (pathFile) => {
  const input = createReadStream(pathFile, 'utf-8');
  const output = process.stdout;

  input.pipe(output);
  input.on('error', (error) => console.error(new Error('Operation failed')));
  input.on('end', () =>
    console.log('\n' + `You are currently in ${process.cwd()} \n`)
  );
};

export const copyFile = async (value) => {
  let filePath;
  let newDirPath;
  let newFilePath;

  [filePath, newDirPath] = value.split(' ');
  let file = filePath.split('/').pop();
  if (filePath && newDirPath) {
    newFilePath = join(newDirPath, file);
  }

  await access(newFilePath).then(
    () => {
      console.log(new Error('FS operation failed'));
    },
    () => {
      return;
    }
  );

  const read = createReadStream(filePath);
  read.once('error', (err) => {
    console.log(new Error('FS operation failed'));
  });

  read.once('open', () => {
    read.pipe(
      createWriteStream(newFilePath).on('error', (err) => {
        console.log(new Error('FS operation failed'));
      })
    );
  });
  read.once('end', () => {
    console.log('\n' + `You are currently in ${process.cwd()} \n`);
  });
};

export const moveFile = async (value) => {
  let filePath;
  let newDirPath;
  let newFilePath;

  [filePath, newDirPath] = value.split(' ');
  let file = filePath.split('/').pop();
  if (filePath && newDirPath) {
    newFilePath = join(newDirPath, file);
  }

  await access(newFilePath).then(
    () => {
      console.log(new Error('FS operation failed'));
    },
    () => {
      return;
    }
  );

  const read = createReadStream(filePath);
  read.once('error', (err) => {
    console.log(new Error('FS operation failed'));
  });

  read.once('open', () => {
    read.pipe(
      createWriteStream(newFilePath).on('error', (err) => {
        console.log(new Error('FS operation failed'));
      })
    );
  });
  read.once('end', async () => {
    await unlink(filePath)
      .then(() => {
        console.log('\n' + `You are currently in ${process.cwd()} \n`);
      })
      .catch((err) => {
        console.log(new Error('FS operation failed'));
      });
  });
};

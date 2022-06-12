import { createBrotliDecompress, createBrotliCompress } from 'zlib';
import { createWriteStream, createReadStream } from 'fs';
import { access } from 'fs/promises';

export const compress = async (value) => {
  let inputFile;
  let outputFile;

  [inputFile, outputFile] = value.split(' ');

  await access(outputFile).then(
    () => {
      console.log(new Error('FS operation failed'));
    },
    () => {
      return;
    }
  );

  const read = createReadStream(inputFile);
  const brotli = createBrotliCompress();

  read.once('error', (err) => {
    console.log(new Error('FS operation failed'));
  });

  read.once('open', () => {
    read.pipe(brotli).pipe(
      createWriteStream(outputFile).on('error', (err) => {
        console.log(new Error('FS operation failed'));
      })
    );
  });

  read.once('end', () => {
    console.log('\n' + `You are currently in ${process.cwd()} \n`);
  });
};

export const decompress = async (value) => {
  let inputFile;
  let outputFile;

  [inputFile, outputFile] = value.split(' ');

  await access(outputFile).then(
    () => {
      console.log(new Error('FS operation failed'));
    },
    () => {
      return;
    }
  );
  const read = createReadStream(inputFile);
  const brotli = createBrotliDecompress();

  read.once('error', (err) => {
    console.log(new Error('FS operation failed'));
  });

  read.once('open', () => {
    read.pipe(brotli).pipe(
      createWriteStream(outputFile).on('error', (err) => {
        console.log(new Error('FS operation failed'));
      })
    );
  });

  read.once('end', () => {
    console.log('\n' + `You are currently in ${process.cwd()} \n`);
  });
};

import { createBrotliDecompress, createBrotliCompress } from 'zlib';
import { createWriteStream, createReadStream } from 'fs';

export const compress = (value) => {
  let inputFile;
  let outputFile;

  [inputFile, outputFile] = value.split(' ');
  const readStream = createReadStream(inputFile);
  const writeStream = createWriteStream(outputFile);

  const brotli = createBrotliCompress();
  const stream = readStream.pipe(brotli).pipe(writeStream);

  stream.on('finish', () => {
    console.log(`You are currently in ${process.cwd()} \n`);
  });
};

export const decompress = (value) => {
  let inputFile;
  let outputFile;

  [inputFile, outputFile] = value.split(' ');
  const readStream = createReadStream(inputFile);
  const writeStream = createWriteStream(outputFile);

  const brotli = createBrotliDecompress();
  const stream = readStream.pipe(brotli).pipe(writeStream);

  stream.on('finish', () => {
    console.log(`You are currently in ${process.cwd()} \n`);
  });
};

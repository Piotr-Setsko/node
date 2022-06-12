import { createHash } from 'crypto';
import { createReadStream } from 'fs';

export const calcHash = (value) => {
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
    console.log(`You are currently in ${process.cwd()} \n`);
  });
};

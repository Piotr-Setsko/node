import path from 'path';
import { access, readdir } from 'fs/promises';

export const goUppper = () => {
  let actualPath = process.cwd();
  const root = actualPath.split(path.sep)[0];

  if (actualPath !== root) {
    actualPath = actualPath.split('\\');
    actualPath.pop();
    actualPath = actualPath.join('\\');
  }
  process.chdir(actualPath);

  console.log(`You are currently in ${process.cwd()} \n`);
};

export const goToFolder = (input) => {
  let actualPath = process.cwd();
  const filePath = path.isAbsolute(input)
    ? input
    : path.join(actualPath, input);

  access(filePath)
    .then(() => {
      actualPath = filePath;
      process.chdir(actualPath);
      console.log(`You are currently in ${process.cwd()} \n`);
    })
    .catch((err) => {
      console.error(new Error('Operation failed: no such path or directory exists'));
      console.log(`You are currently in ${process.cwd()} \n`);
    });
};

export const listAllFiles = async () => {
  let actualPath = process.cwd();
  try {
    await readdir(actualPath).then((files) => {
      console.log(files)
    });
  } catch (error) {
    console.log(new Error('Operation failed'));
  }
};

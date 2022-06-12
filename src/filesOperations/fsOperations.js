import { getFilePath } from '../util/getFilePath.js';
import { open, access, rename, rm } from 'fs/promises';

export const createFile = async (nameFile) => {
  try {
    await open(nameFile, 'wx+');
    console.log('\n' + `You are currently in ${process.cwd()} \n`);
  } catch (error) {
    console.log(new Error('Operation failed'));
  }
};

export const renameFile = async (value) => {
  let filePath;
  let newFilePath;

  [filePath, newFilePath] = getFilePath(value);

  try {
    await access(newFilePath).then(
      (err) => {
        throw err;
      },
      () => {
        return;
      }
    );

    await rename(filePath, newFilePath).then(() => {
      console.log('\n' + `You are currently in ${process.cwd()} \n`);
    });
  } catch (error) {
    console.log(new Error('FS operation failed'));
  }
};

export const deleteFile = async (value) => {
  try {
    await rm(value).then(() => {
      console.log('\n' + `You are currently in ${process.cwd()} \n`);
    });
  } catch (error) {
    console.log(new Error('FS operation failed'));
  }
};

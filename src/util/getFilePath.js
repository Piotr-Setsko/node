import { join } from 'path';

export const getFilePath = (value) => {
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

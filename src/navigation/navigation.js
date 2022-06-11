export const goUppper = () => {
  if (actualPath !== root) {
    actualPath = actualPath.split('\\');
    actualPath.pop();
    actualPath = actualPath.join('\\');
    process.chdir(actualPath);
  }
  console.log(`You are currently in ${actualPath}`);
};

export const goToFolder = (input) => {
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

export const listAllFiles = async () => {
  try {
    await readdir(actualPath).then((files) => {
      for (const file of files) console.log(file);
    });
  } catch (error) {
    console.error(new Error('Operation failed'));
  }
};

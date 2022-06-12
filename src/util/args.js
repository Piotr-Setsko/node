export const parseArgs = () => {
  const value = process.argv.slice(2)[0];
  if (
    value &&
    value.startsWith('--username') &&
    value.includes('=') &&
    value.split('=')[1]
  ) {
    return value.split('=')[1];
  } else {
    throw new Error(
      'Invalid input: fill your Username "--username=your_username"'
    );
  }
};

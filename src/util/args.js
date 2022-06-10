export const parseArgs = () => {
  const value = process.argv.slice(2)[0];
  if (value && value.startsWith('--username') && value.includes('=')) {
    return value.split('=')[1];
  } else {
    throw new Error('Invalid input');
  }
};

export const makeNewUuid: () => string = () => {
  const hyphenIndexes = [8, 12, 16, 20];
  let uuid: string = '';
  for (let i = 0; i < 32; i += 1) {
    if (hyphenIndexes.includes(i)) {
      uuid += '-';
    }
    const hex = Math.floor(Math.random() * 16)
      .toString(16)
      .toLowerCase();
    uuid += hex;
  }
  return uuid;
};

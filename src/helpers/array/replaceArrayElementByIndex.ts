export const replaceArrayElementByIndex = <T>(array: T[], position: number, newData: T) => {
  return array.map((item, index) => {
    if (index === position) {
      return newData;
    }
    return item;
  });
};

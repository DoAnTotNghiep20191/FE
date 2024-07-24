export const removeArrayItemByIndex = <T>(array: T[], _index: number) => {
  return array.filter((_, index) => {
    return index !== _index;
  });
};

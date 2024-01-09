export const invalidTokenHandler = (history, pathname) => {
  localStorage.clear();
  history.push(pathname);
};

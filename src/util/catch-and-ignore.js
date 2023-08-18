export default (fn) => async () => {
  try {
    await fn();
  } catch (e) { /* ignored */ }
};

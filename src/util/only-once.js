const state = {};
module.exports = async (identified, fn) => {
  if (!(identified in state) || (new Date() / 1000 - state[identified]) > 5) {
    state[identified] = new Date() / 1000;
    await fn();
    delete state[identified];
  }
};

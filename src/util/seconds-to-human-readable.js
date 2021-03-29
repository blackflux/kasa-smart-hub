module.exports = (totalSeconds) => {
  const hours = Math.floor(totalSeconds / 3600);
  const remainingSeconds = totalSeconds % 3600;
  const minutes = Math.floor(remainingSeconds / 60);
  const seconds = remainingSeconds % 60;
  return [hours, minutes, seconds].map((e) => (e < 10 ? `0${e}` : e)).join(':');
};

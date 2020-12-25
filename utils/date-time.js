function durationMs(start, end = new Date()) {
  if (!end) return new Date() - start;
  return end - start;
}

module.exports = { durationMs };

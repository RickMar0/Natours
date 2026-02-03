module.exports = (fn) => {
  return (req, res, nxt) => {
    fn(req, res, nxt).catch(nxt);
  };
};

const getWeighings = async (req, res, next) => {
  res.json({ message: 'getWeighings' });
};

const addWeighing = async (req, res, next) => {
  res.json({ message: 'addWeighings' });
};

module.exports = {
  getWeighings,
  addWeighing,
};

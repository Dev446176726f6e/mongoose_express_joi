const errorHandler = (res, error) => {
  console.error(error);
  res.status(400).send({ error });
};

module.exports = {
  errorHandler,
};

function checkExistsId(req, res, next) {
  const { id } = req.params;

  if (!id) {
    return res.status(400).json({ error: 'Id is required' });
  }

  req.id = id;

  return next();
}

export default checkExistsId;

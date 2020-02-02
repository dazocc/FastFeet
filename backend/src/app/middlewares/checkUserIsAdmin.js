import User from '../models/User';

async function checkUserIsAdmin(req, res, next) {
  const user = await User.findByPk(req.userId);

  if (user.email !== 'admin@fastfeet.com') {
    return res.status(400).json({ error: 'User is not admin' });
  }

  req.isAdmin = true;

  return next();
}

export default checkUserIsAdmin;

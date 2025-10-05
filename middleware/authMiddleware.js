import User from '../models/Users.js';

export const protect = async (req, res, next) => {
  if (req.session.userId) {

    req.user = await User.findById(req.session.userId).select('-password');
    next();
  } else {
    res.status(401).json({ message: 'Not authorized, no session' });
  }
};
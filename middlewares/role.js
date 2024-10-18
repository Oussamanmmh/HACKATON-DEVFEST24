const jwt = require('jsonwebtoken');
const User = require('../models/User');

const authRole = (roles) => {
  return async (req, res, next) => {
    const token = req.header('Authorization')?.split(' ')[1];

    try {
      if (!token) {
        return res.status(401).json({ msg: 'No token, authorization denied' });
      }

      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = decoded;

      const user = await User.findOne({ id: req.user.id });
      if (!user) {
        return res.status(404).json({ msg: 'User not found' });
      }

      // Automatically grant admin all permissions
      if (user.role === 'admin' || roles.includes(user.role)) {
        return next();
      }

      // Allow access if user has the required role
      if (!roles.includes(user.role) && user.id !== parseInt(req.params.id)) {
        return res.status(403).json({ msg: 'Unauthorized' });
      }

      next();
    } catch (error) {
      console.error(error.message);

      if (error.name === 'TokenExpiredError') {
        return res.status(401).json({ msg: 'Token is expired' });
      }

      res.status(500).json({ msg: 'Internal Server Error' });
    }
  };
};

module.exports = authRole;

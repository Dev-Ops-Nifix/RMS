const jwt = require('jsonwebtoken');
require('dotenv').config();

const auth = (roles) => {
  return (req, res, next) => {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    if (!token) return res.status(401).json({ message: 'No token, authorization denied' });

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = decoded;
      if (roles && !roles.includes(decoded.role)) {
        return res.status(403).json({ message: 'Access denied' });
      }
      next();
    } catch (err) {
      res.status(401).json({ message: 'Token is invalid' });
    }
  };
};

module.exports = auth;
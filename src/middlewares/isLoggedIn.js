import jwt from 'jsonwebtoken';

export const isLoggedIn = (req, res, next) => {
  try {
    console.log("isLoggedIn middleware");
    let token;
    if (req.cookies && req.cookies.token) {
        console.log("req.cookies.token", req.cookies.token);
        token = req.cookies.token;
    }

    else if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }
    console.log("token", token);

    if (!token) {
      throw new Error('Authentication token not found.');
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.user = decoded;

    next(); 
  } catch (error) {
    console.error(error.message);

    if (req.originalUrl.startsWith('/api')) {
      return res.status(401).json({ message: 'Unauthorized access.' });
    } else {
      return res.status(401).render('pages/error', { message: 'Unauthorized access.' });
    }
  }
};

import jwt from 'jsonwebtoken';

export const isLoggedIn = (req, res, next) => {
  try {
 
  //   let token;
  //   if (req.cookies && req.cookies.token) {
  //       token = req.cookies.token;
  //   }

  //   if (!token) {
  //     return res.redirect('/login');
  //   }

  //   const decoded = jwt.verify(token, process.env.JWT_SECRET);
  //   req.user = decoded;
    next(); 
  } catch (error) {
    console.error(error.message);
    
    // if (req.originalUrl.startsWith('/api')) {
    //   return res.status(401).json({ message: 'Unauthorized access.' });
    // } else {
    //   return res.status(401).render('pages/error', { message: 'Unauthorized access.' });
    // }
    return res.redirect('/login');

  }
};

const notFoundHandler = (req, res, next) => {
    const err = new Error('Not Found');
    err.status = 404;
    if (req.originalUrl.startsWith('/api')) {
      return res.status(404).json({
        error: {
          message: 'Not Found',
        },
      });
    }
    return res.status(404).render('pages/404', {
      message: 'Page Not Found',
      title: '404',
    });
};


export default notFoundHandler;

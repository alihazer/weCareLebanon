const notFoundHandler = (req, res, next) => {
    const err = new Error('Not Found');
    err.status = 404;
    if (req.accepts('json')) {
      return res.status(404).json({
        error: {
          message: 'Not Found',
        },
      });
    }
    res.status(404).render('404', {
      message: 'Page Not Found',
    });
};


export default notFoundHandler;

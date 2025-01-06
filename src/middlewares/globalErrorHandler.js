const globalErrorHandler = (err, req, res, next) => {
    console.error(err.stack);
    const isDev = process.env.NODE_ENV === 'development';
    
    if (req.accepts('json')) {
      return res.status(err.status || 500).json({
        error: {
          message: isDev ? err.message : 'Something went wrong, please try again later.',
          stack: isDev ? err.stack : undefined,
        },
      });
    }
  
    res.status(err.status || 500).render('error', {
      message: isDev ? err.message : 'Something went wrong, please try again later.',
      error: isDev ? err : {},
    });
};

export default globalErrorHandler;
  
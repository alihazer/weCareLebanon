const globalErrorHandler = (err, req, res, next) => {
    console.log(err);
    const isDev = process.env.NODE_ENV === 'development';
    if (req.originalUrl.startsWith('/api')) {
        return res.status(err.status || 500).json({
          error: {
            message: isDev ? err.message : 'Something went wrong, please try again later.',
            stack: isDev ? err.stack : undefined,
          },
        });
  }

    return res.status(err.status || 500).render('error', {
          message: isDev ? err.message : 'Something went wrong, please try again later.',
          error: isDev ? err : {},
        });

};

export default globalErrorHandler;
  
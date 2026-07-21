export const checkAdminPassword = (req, res, next) => {
  const clientKey = req.headers["x-api-key"];

  if (!clientKey || clientKey !== process.env.API_SECRET_KEY) {
    return res.status(401).json({
      success: false,
      message: "Unauthorized!",
    });
  }

  next();
};

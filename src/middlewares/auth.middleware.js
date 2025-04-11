import dotenv from "dotenv";
dotenv.config();
import AppError from "../utils/error.utils.js";
import jwt from 'jsonwebtoken';

export const isLoggedIn = (req,res,next) => {
  try{
      const { token } = req.cookies;

      if(!token){
          return next(new AppError('Unauthenicated , please login again' , 401))
      }
      
      // console.log(token);
      // console.log("Rohan");
      const userDetails = jwt.verify(token, process.env.JWT_SECRET);
      
      req.user = userDetails;

      next();
      
  }catch(e){
      return next(
          new AppError(e.message , 505)
      )
  }
}

export const isAuth = async (req, _res, next) => {
  const access_token = req.cookies.access_token;

  if (!access_token) {
    return next(new AppError("Please login to access this resource", 400));
  }

  const decoded = jwt.verify(access_token, process.env.ACCESS_TOKEN_SECRET);

  if (!decoded) {
    return next(new AppError("Invalid access token", 400));
  }

  req.user = decoded.user;
  next();
};

export const authorizeRoles = (...roles) => {
  return (req, _res, next) => {
    if (!req.user?.role) {
      return next(
        new AppError(
          `Role: ${req.user?.role} is not allowed to access this resource.`,
          403
        )
      );
    }
    next();
  };
};

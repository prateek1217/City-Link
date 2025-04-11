import User from "../models/user.model.js";
import AppError from "../utils/error.utils.js";

const cookieOptions = {
  maxAge: 7 * 24 * 60 * 60 * 1000, // 7days
  httpOnly: true,
  sameSite: "lax",
  secure: false,
};

const register = async (req, res, next) => {
  try {
    const { fullName, email, password, mobileNumber } = req.body;

    if (!fullName || !email || !password || !mobileNumber) {
      return next(new AppError("All field are required"));
    }

    const userExists = await User.findOne({ mobileNumber });

    if (userExists) {
      return next(new AppError("Email already exists", 400));
    }

    const user = await User.create({
      fullName,
      email,
      password,
      mobileNumber,
    });

    if (!user) {
      return next(new AppError("User registration failed , please try again"));
    }

    await user?.save();

    user.password = undefined;
    const token = await user.generateJWTToken();

    res.cookie("token", token, cookieOptions);

    res.status(201).json({
      success: true,
      message: "User registered successfully",
      user,
    });
  } catch (error) {
    return next(new AppError(error.message, 500));
  }
};

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return next(new AppError("All fields are required", 400));
    }

    const user = await User.findOne({ email }).select("+password");

    if (!user) {
      return next(new AppError("Email or password does not match", 400));
    }

    // Await the comparePassword method
    const isPasswordValid = await user.comparePassword(password);

    if (!isPasswordValid) {
      return next(new AppError("Email or password does not match", 400));
    }

    const token = await user.generateJWTToken();
    user.password = undefined;
    res.cookie("token", token, cookieOptions);

    res.status(200).json({
      success: true,
      message: "User logged-in successfully",
      user,
    });
  } catch (error) {
    return next(new AppError(error.message, 500));
  }
};

const logout = (req,res) => {

  res.cookie('token' , null, {
      secure: true,
      maxAge: 0,
      httpOnly: true
  });

  res.status(200).json({
      success: true,
      message: 'User logged out successfully'
  })

};

const getProfile = async (req,res) => {

  try{
      const userId = req.user.id;
      const user = await User.findById(userId)

      res.status(200).json({
          success: true,
          message: 'User details',
          user
      });
  }catch(e){
      return next(new AppError('Failed to fetch user detail' , 500))
  }
  

};

export { register, login  , logout , getProfile};

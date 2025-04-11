import { Schema, model } from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

const userSchema = new Schema(
  {
    fullName: {
      type: "String",
      required: [true, "Name is required"],
      minLength: [5, "Name must be at least 5 charcter"],
      maxLength: [50, "Name should be less than 50 char"],
      lowercase: true,
      trim: true,
    },
    email: {
      type: String,
      required: [true, "user email is required"],
      lowercase: true,
      unique: [true, "already registered"],
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minLength: [8, "Password must be at least 8 char"],
    },
    mobileNumber: {
      type: String,
      required: [true, "Mobile Number is required."],
      unique: [true, "already registered"],
    },
    role: {
      type: "String",
      enum: ["USER", "ADMIN", "SUPER-ADMIN"],
      default: "USER",
    },
    forgotPasswordToken: {
      type: String,
    },
    forgotPasswordExpiryDate: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

userSchema.pre('save' , async function(next){
    if(!this.isModified('password')){
        return next();
    }
    this.password = await bcrypt.hash(this.password, 10)
});

userSchema.methods = {
    generateJWTToken: async function () {
        return jwt.sign(
        { id: this._id, email: this.email, role: this.role },
        process.env.JWT_SECRET,
        {
            expiresIn: process.env.JWT_EXPIRY,
        }
        );
    },
    comparePassword: async function(plainTextPassword){
        return await bcrypt.compare(plainTextPassword, this.password)
    }
}


const User = model("User", userSchema);

export default User;

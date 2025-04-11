import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { useRegisterUserMutation } from "../redux/api/authApi"; 
import { clearError } from "../redux/slices/authSlice";

const Register = () => {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    mobileNumber: "",
  });

  const [registerUser, { isLoading, isError, error, isSuccess }] =
    useRegisterUserMutation(); // Use the hook

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isAuthenticated } = useSelector((state) => state.auth); //Get authentication state.

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/", { replace: true });
    }
  }, [isAuthenticated, navigate]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await registerUser({
        name: formData.fullName,
        email: formData.email,
        password: formData.password,
        mobileNumber: formData.mobileNumber,
      }).unwrap(); // unwrap() to get the payload or throw an error
    } catch (err) {
      console.error("Registration failed:", err);
    }
  };

  useEffect(() => {
    if (isError) {
      console.error(
        "Registration Error:",
        error?.data?.message || "An error occurred"
      );
      dispatch(clearError());
    }
  }, [isError, error, dispatch]);

  useEffect(() => {
    if (isSuccess) {
      navigate("/"); // Redirect after successful registration
    }
  }, [isSuccess, navigate]);

  return (
    <section className="bg-[black] w-full h-screen flex items-center justify-center text-white">
      <div className="border border-gray-300 rounded-lg p-6 flex flex-col items-center w-[29%]">
        <h1 className="text-3xl font-semibold mb-6">Register</h1>
        {isError && (
          <p className="text-red-500 mb-2">
            {error?.data?.message || "Registration failed"}
          </p>
        )}
        {isLoading ? (
          <Loader2 className="animate-spin" />
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col gap-6 w-full">
            <div className="grid w-full items-center gap-1.5">
              <Label htmlFor="fullName">Full Name</Label>
              <Input
                id="fullName"
                type="text"
                name="fullName"
                placeholder="Full Name"
                value={formData.fullName}
                onChange={handleChange}
                required
              />
            </div>

            <div className="grid w-full items-center gap-1.5">
              <Label htmlFor="mobileNumber">Mobile Number</Label>
              <Input
                id="mobileNumber"
                type="text"
                name="mobileNumber"
                placeholder="Mobile Number"
                value={formData.mobileNumber}
                onChange={handleChange}
                required
              />
            </div>

            <div className="grid w-full items-center gap-1.5">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                name="email"
                placeholder="Email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>
            <div className="grid w-full items-center gap-1.5">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                name="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
                required
              />
            </div>
            <div className="flex items-center justify-center w-full mt-4">
              <Button
                type="submit"
                disabled={isLoading}
                variant="secondary"
                className="cursor-pointer w-[50%]"
              >
                Register
              </Button>
            </div>
          </form>
        )}

        <small className="mt-4">
          Already have an account?
          <Link to="/login" className="text-blue-500">
            Login
          </Link>
        </small>
      </div>
    </section>
  );
};

export default Register;
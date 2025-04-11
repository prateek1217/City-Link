import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Loader2 } from "lucide-react";
import { useLoginUserMutation } from "../redux/api/authApi"; 
import { clearError } from "../redux/slices/authSlice";

function Login() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [loginUser, { isLoading, isError, error }] = useLoginUserMutation(); // Use the hook

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  // Determine the redirect path after login
  const redirectPath = location.state?.from?.pathname || "/";

  const { isAuthenticated } = useSelector((state) => state.auth);

  useEffect(() => {
    if (isAuthenticated) {
      navigate(redirectPath, { replace: true });
    }
  }, [isAuthenticated, navigate, redirectPath]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await loginUser(formData).unwrap();
      navigate(redirectPath);
    } catch (err) {
      console.error("Login failed:", err);
    }
  };

  useEffect(() => {
    if (isError) {
      console.error("Login Error:", error?.data?.message || "An error occurred");
      dispatch(clearError());
    }
  }, [isError, error, dispatch]);

  return (
    <section className="bg-[black] w-full h-screen flex items-center justify-center text-white">
      <div className="border border-gray-300 rounded-lg p-6 flex flex-col items-center w-[25%]">
        <h1 className="text-3xl font-semibold mb-6">Login</h1>
        {isError && <p className="text-red-500 mb-2">{error?.data?.message || "Login failed"}</p>}
        {isLoading ? (
          <Loader2 className="animate-spin" />
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col gap-6 w-full">
            <div className="grid w-full items-center gap-1.5">
              <Label htmlFor="email">Email</Label>
              <Input
                type="email"
                id="email"
                placeholder="Email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>
            <div className="grid w-full items-center gap-1.5">
              <Label htmlFor="password">Password</Label>
              <Input
                type="password"
                id="password"
                placeholder="password"
                name="password"
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
                Login
              </Button>
            </div>
          </form>
        )}

        <small className="mt-4">
          Don't have an account?
          <Link to="/register" className="text-blue-500">
            Register
          </Link>
        </small>
      </div>
    </section>
  );
}

export default Login;
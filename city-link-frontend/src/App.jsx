import Register from "./Components/Register";
import Login from "./Components/Login";
import ProtectedRoute from "./Components/ProtectedComponent";
import { BrowserRouter, Route, Routes, useNavigate } from "react-router-dom";
import Dashboard from "./Components/Dashboard";
import store from "./redux/store";
import { useGetUserQuery } from "./redux/api/authApi";
import { Loader2 } from "lucide-react";
import { useDispatch } from "react-redux";
import { useEffect } from "react";

function App() {
  const { data: user, isLoading, isError, isSuccess } = useGetUserQuery(); // Fetch user data
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    if (isSuccess && user) {
      navigate("/");
    }

    if (isError) {
      navigate("/login");
    }
  }, [isSuccess, isError, dispatch, navigate, user]);

  if (isLoading) {
    return (
      <div>
        <Loader2 />
      </div>
    );
  }

  return (
    <>
      <Routes>
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
      </Routes>
    </>
  );
}

export default App;

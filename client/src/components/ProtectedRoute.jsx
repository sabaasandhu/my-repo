import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { logoutUser } from "../redux/actions/authAction";
import { useNavigate, Link } from "react-router-dom";

const Dashboard = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);

  if (!user) {
    navigate("/login");
  }

  const handleLogout = () => {
    dispatch(logoutUser());
    navigate("/login");
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Welcome, {user?.name || "User"}!</h1>

      <div className="flex flex-col gap-3">
        <Link to="/profile" className="text-blue-600 hover:underline">Profile Settings</Link>
        <Link to="/orders" className="text-blue-600 hover:underline">My Orders</Link>
        <button
          onClick={handleLogout}
          className="bg-red-600 text-white py-2 rounded hover:bg-red-700"
        >
          Logout
        </button>
      </div>
    </div>
  );
};

export default Dashboard;

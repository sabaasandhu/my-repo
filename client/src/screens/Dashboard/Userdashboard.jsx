import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { logoutUser } from "../../redux/actions/authAction";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

const Userdashboard = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const handleLogout = () => {
    dispatch(logoutUser());
    toast.success("Logged out successfully 👋");
    navigate("/login");
  };

  return (
    <div className="flex h-screen bg-orange-50">
      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 z-40 w-64 h-full bg-white border-r border-gray-200 overflow-y-auto transform ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } transition-transform duration-300 sm:translate-x-0`}
      >
        <div className="px-4 py-6 text-purple-700">
          <h2 className="text-xl font-bold mb-6 text-gray-700">
            {user ? `Hello, ${user.username}` : "Welcome!"}
          </h2>
          <ul className="space-y-2 text-black">
            <li>
              <Link
                to="/dashboard"
                className="flex items-center px-2 py-2 rounded hover:bg-gray-200"
              >
                Dashboard
              </Link>
            </li>
            <li>
              <button
                className="flex items-center justify-between w-full px-2 py-2 rounded hover:bg-red-700"
                onClick={() => setDropdownOpen(!dropdownOpen)}
              >
                E-commerce
                <svg
                  className={`w-5 h-5 transform transition-transform ${
                    dropdownOpen ? "rotate-180" : ""
                  }`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </button>
              {dropdownOpen && (
                <ul className="pl-6 mt-1 space-y-1">
                  <li>
                    <Link
                      to="/products"
                      className="block px-2 py-1 rounded hover:bg-gray-100"
                    >
                      Products
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/billing"
                      className="block px-2 py-1 rounded hover:bg-gray-100"
                    >
                      Billing
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/invoice"
                      className="block px-2 py-1 rounded hover:bg-gray-100"
                    >
                      Invoice
                    </Link>
                  </li>
                </ul>
              )}
            </li>
            <li>
              <Link
                to="/orders"
                className="flex items-center px-2 py-2 rounded hover:bg-gray-200"
              >
                Orders
              </Link>
            </li>
            <li>
              <Link
                to="/users"
                className="flex items-center px-2 py-2 rounded hover:bg-gray-200"
              >
                Users
              </Link>
            </li>
            <li>
              <Link
                to="/support"
                className="flex items-center px-2 py-2 rounded hover:bg-gray-200"
              >
                Support
              </Link>
            </li>
          </ul>

          <div className="mt-6 text-blue-700 border-t border-gray-200 pt-4">
            {user ? (
              <button
                onClick={handleLogout}
                className="w-full text-left px-2 py-2 rounded hover:bg-red-200 text-red-600 font-semibold"
              >
                Logout
              </button>
            ) : (
              <>
                <Link
                  to="/login"
                  className="block px-2 py-2  rounded hover:bg-orange-400  font-bold text-orange-700"
                >
                  Login
                </Link>
                <Link
                  to="/signup"
                  className="block mt-2 px-2 py-2 rounded hover:bg-green-200 text-green-700 font-semibold"
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      </aside>

      {/* Mobile toggle button */}
      <button
        onClick={() => setSidebarOpen(!sidebarOpen)}
        className="sm:hidden fixed top-4 left-4 z-50 p-2 bg-white border rounded shadow"
      >
        <span className="sr-only">Open sidebar</span>
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M4 6h16M4 12h16M4 18h16"
          />
        </svg>
      </button>

      {/* Main content */}
      <main className="flex-1 p-6 sm:ml-64 overflow-y-auto">
        <h1 className="text-2xl font-bold mb-6">Dashboard Overview</h1>

        {/* Example stats cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="p-4 bg-white rounded-xl shadow flex items-center justify-between">
            <div>
              <h2 className="text-sm text-gray-500">Total Orders</h2>
              <p className="text-xl font-bold">120</p>
            </div>
            <div className="text-gray-400">
              <svg
                className="w-8 h-8"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 3h18v18H3V3z"
                />
              </svg>
            </div>
          </div>

          <div className="p-4 bg-white rounded-xl shadow flex items-center justify-between">
            <div>
              <h2 className="text-sm text-gray-500">Products</h2>
              <p className="text-xl font-bold">45</p>
            </div>
            <div className="text-gray-400">
              <svg
                className="w-8 h-8"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
          </div>

          <div className="p-4 bg-white rounded-xl shadow flex items-center justify-between">
            <div>
              <h2 className="text-sm text-orange-500">Users</h2>
              <p className="text-xl font-bold">300</p>
            </div>
            <div className="text-gray-400">
              <svg
                className="w-8 h-8"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 12h14M12 5v14"
                />
              </svg>
            </div>
          </div>
        </div>

        {/* Placeholder for additional content */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-6 bg-white rounded-xl shadow h-48 flex items-center justify-center text-black">
            Analytics Chart Placeholder
          </div>
          <div className="p-6 bg-white rounded-xl shadow h-48 flex items-center justify-center text-black">
            Recent Orders Placeholder
          </div>
        </div>
      </main>
    </div>
  );
};

export default Userdashboard;

import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { registerUser } from "../../redux/actions/authAction";
import { useNavigate, Link } from "react-router-dom";
import toast from "react-hot-toast";

const Signup = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error, user } = useSelector((state) => state.auth);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    if (user) {
      toast.success("Account created successfully 🎉");
      navigate("/");
    }
  }, [user, navigate]);

  useEffect(() => {
    if (error) {
      toast.error(error);
    }
  }, [error]);
// File: src/components/auth/Signup.jsx

const handleSubmit = (e) => {
  e.preventDefault();

  if (!name || !email || !password) {
    toast.error("Please fill all fields");
    return;
  }

  // pass navigate & toast
  dispatch(registerUser(name, email, password, navigate, toast));
};


  return (
    <div className="container mx-auto p-6 max-w-md">
      <h1 className="text-2xl text-black font-bold mb-4">Sign Up</h1>

      <form onSubmit={handleSubmit} className="flex flex-col gap-3 text-black text-lg">
        <input
          type="text"
          placeholder="Full Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="p-2 border rounded"
        />
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="p-2 border rounded"
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="p-2 border rounded"
        />

        <button
          type="submit"
          disabled={loading}
          className="bg-green-600 text-white py-2 rounded"
        >
          {loading ? "Creating..." : "Sign Up"}
        </button>
      </form>

      <p className="mt-3 text-sm">
        Already have an account?{" "}
        <Link to="/login" className="text-blue-600">
          Login
        </Link>
      </p>
    </div>
  );
};

export default Signup;

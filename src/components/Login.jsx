import React, { useState } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, isAuthenticated } = useAuth();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});

  if (isAuthenticated) {
    return <section className="panel"><h2>You are already logged in</h2><Link to="/products">Continue shopping</Link></section>;
  }

  const handleSubmit = (event) => {
    event.preventDefault();
    const nextErrors = {};
    if (!username.trim()) nextErrors.username = "Username or email is required.";
    if (!password) nextErrors.password = "Password is required.";
    else if (password.length < 4) nextErrors.password = "Password must contain at least 4 characters.";
    if (Object.keys(nextErrors).length) {
      setErrors(nextErrors);
      return;
    }
    if (!login(username, password)) {
      setErrors({ login: "Invalid username or password." });
      return;
    }
    navigate(location.state?.from || "/products", { replace: true });
  };

  return (
    <section className="login-page">
      <form className="login-box" onSubmit={handleSubmit} noValidate>
        <h1>Welcome Back</h1>
        <p>Login to continue shopping</p>
        {location.state?.signedUp && <p className="success-message">Account created. Please log in.</p>}
        <label htmlFor="username">Username / Email</label>
        <input id="username" value={username} onChange={(e) => setUsername(e.target.value)} placeholder="Enter username or email" />
        {errors.username && <p className="error-message">{errors.username}</p>}
        <label htmlFor="password">Password</label>
        <input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Enter password" />
        {errors.password && <p className="error-message">{errors.password}</p>}
        {errors.login && <p className="error-message">{errors.login}</p>}
        <button type="submit">Login</button>
        <p className="demo-login">Don't have an account?</p><Link className="button-link signup-link" to="/signup">Sign Up</Link>
      </form>
    </section>
  );
}

export default Login;
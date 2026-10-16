import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function SignUp() {
  const { signUp } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ username: "", email: "", password: "", confirmPassword: "" });
  const [error, setError] = useState("");
  const change = (event) => setForm({ ...form, [event.target.name]: event.target.value });
  const submit = (event) => {
    event.preventDefault(); setError("");
    if (!form.username.trim() || !form.email.trim() || !form.password || !form.confirmPassword) return setError("Please fill in all fields.");
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) return setError("Enter a valid email address.");
    if (form.password.length < 4) return setError("Password must contain at least 4 characters.");
    if (form.password !== form.confirmPassword) return setError("Passwords do not match.");
    if (!signUp(form)) return setError("Username or email already exists.");
    navigate("/login", { state: { signedUp: true } });
  };
  return <section className="login-page"><form className="login-box" onSubmit={submit} noValidate><h1>Create Account</h1><p>Sign up to start shopping</p>
    <label htmlFor="signup-username">Username</label><input id="signup-username" name="username" value={form.username} onChange={change} placeholder="Choose a username" />
    <label htmlFor="signup-email">Email</label><input id="signup-email" name="email" type="email" value={form.email} onChange={change} placeholder="Enter email address" />
    <label htmlFor="signup-password">Password</label><input id="signup-password" name="password" type="password" value={form.password} onChange={change} placeholder="Create password" />
    <label htmlFor="signup-confirm">Confirm Password</label><input id="signup-confirm" name="confirmPassword" type="password" value={form.confirmPassword} onChange={change} placeholder="Confirm password" />
    {error && <p className="error-message">{error}</p>}<button type="submit">Sign Up</button><p className="demo-login">Already have an account? <Link to="/login">Login</Link></p></form></section>;
}
export default SignUp;

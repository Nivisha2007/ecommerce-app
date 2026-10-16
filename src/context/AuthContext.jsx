import React, { createContext, useContext, useState } from "react";

const AuthContext = createContext(null);
const USERS_KEY = "ecommerce-registered-users";
const SESSION_KEY = "ecommerce-user";
const TOKEN_KEY = "token";

function createAccessToken(username) {
  // Educational demo token: generated in the browser, not a server-signed JWT.
  const randomBytes = new Uint8Array(32);
  if (window.crypto?.getRandomValues) {
    window.crypto.getRandomValues(randomBytes);
  } else {
    for (let i = 0; i < randomBytes.length; i++) randomBytes[i] = Math.floor(Math.random() * 256);
  }
  const randomPart = Array.from(randomBytes, byte => byte.toString(16).padStart(2, "0")).join("");
  const payload = btoa(JSON.stringify({ sub: username, iat: Date.now() }));
  return `demo.${payload}.${randomPart}`;
}

function readUsers() {
  try {
    const value = JSON.parse(localStorage.getItem(USERS_KEY) || "[]");
    return Array.isArray(value) ? value : [];
  } catch {
    return [];
  }
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try { return JSON.parse(localStorage.getItem(SESSION_KEY)) || null; }
    catch { return null; }
  });

  // Any registered user can sign in with their username/email and password.
  const login = (usernameOrEmail, password) => {
    const entered = usernameOrEmail.trim().toLowerCase();
    const account = readUsers().find((item) =>
      (String(item.username || "").toLowerCase() === entered ||
       String(item.email || "").toLowerCase() === entered) &&
      item.password === password
    );

    // Only users who created an account can log in. No fixed demo credentials.
    if (!account) return false;
    const loggedInUser = { username: account.username, email: account.email || "" };
    const token = createAccessToken(account.username);
    setUser(loggedInUser);
    localStorage.setItem(SESSION_KEY, JSON.stringify(loggedInUser));
    localStorage.setItem(TOKEN_KEY, token);
    return true;
  };

  const signUp = ({ username, email, password }) => {
    const cleanUsername = username.trim();
    const cleanEmail = email.trim().toLowerCase();
    if (!cleanUsername || !cleanEmail || !password) return false;
    const users = readUsers();
    const alreadyExists = users.some((item) =>
      String(item.username || "").toLowerCase() === cleanUsername.toLowerCase() ||
      String(item.email || "").toLowerCase() === cleanEmail
    );
    if (alreadyExists) return false;
    users.push({ username: cleanUsername, email: cleanEmail, password });
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
    return true;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem(SESSION_KEY);
    localStorage.removeItem(TOKEN_KEY);
  };

  return <AuthContext.Provider value={{ user, login, signUp, logout, isAuthenticated: Boolean(user) }}>{children}</AuthContext.Provider>;
}

export function useAuth() { return useContext(AuthContext); }

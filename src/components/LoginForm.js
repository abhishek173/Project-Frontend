import React, { useState } from 'react';
import $ from 'jquery';
import { useNavigate } from 'react-router-dom';

const LoginForm = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [token, setToken] = useState('');

  const navigate = useNavigate()

  const handleLogin = (e) => {
    e.preventDefault();

    if (!username || !password) {
      setError('Username and password are required');
      return;
    }

    $.ajax({
      url: 'http://127.0.0.1:8000/api/login/',
      type: 'POST',
      data: JSON.stringify({ username, password }),
      contentType: 'application/json',
      success: (response) => {
        if (response.status === 'success' && response.token) {
          sessionStorage.setItem('username', username);
          sessionStorage.setItem('token', response.token); // Save token for authenticated API use
          setIsLoggedIn(true);
          setToken(response.token);
          setError('');
          navigate("/projects")
        } else {
          setError(response.message || 'Login failed');
        }
      },
      error: (err) => {
        console.error(err);
        setError('Login request failed');
      }
    });
  };

  return (
    <div className="login-container">
      {!isLoggedIn ? (
        <form onSubmit={handleLogin}>
          <h2>Login</h2>

          <div className="form-group">
            <label>Username:</label>
            <input
              type="text"
              className="form-control"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label>Password:</label>
            <input
              type="password"
              className="form-control"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          {error && <div className="alert alert-danger">{error}</div>}

          <button type="submit" className="btn btn-primary">Login</button>
        </form>
      ) : (
        <div>
          <h3>Welcome, {username}</h3>
          <p>You are now logged in.</p>
          <p><strong>Token:</strong> {token}</p>
        </div>
      )}
    </div>
  );
};

export default LoginForm;

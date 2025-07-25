import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './App.css'; // Make sure this is inside `src`

function Auth() {
  const [isLogin, setIsLogin] = useState(true);
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    role: 'user',
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const baseUrl = 'https://leftover-chef-backend-production.up.railway.app';
    const url = isLogin ? `${baseUrl}/api/v1/auth/login` : `${baseUrl}/api/v1/auth/register`;

    try {
      const res = await axios.post(url, form);
      localStorage.setItem('token', res.data.token);
      navigate('/');
    } catch (err) {
      alert(err.response?.data?.message || 'Authentication failed');
    }
  };

  return (
    <div className="auth-box">
      <h2>{isLogin ? 'Login' : 'Register'}</h2>
      <form onSubmit={handleSubmit}>
        {!isLogin && (
          <input
            type="text"
            name="name"
            placeholder="Name"
            value={form.name}
            onChange={handleChange}
            required
          />
        )}
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
          required
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={form.password}
          onChange={handleChange}
          required
        />
        {!isLogin && (
          <select name="role" value={form.role} onChange={handleChange}>
            <option value="user">User</option>
            <option value="admin">Admin</option>
          </select>
        )}
        <button type="submit">{isLogin ? 'Login' : 'Register'}</button>
      </form>
      <p>
        {isLogin ? "Don't have an account?" : 'Already have an account?'}{' '}
        <span
          style={{ color: 'blue', cursor: 'pointer' }}
          onClick={() => setIsLogin(!isLogin)}
        >
          {isLogin ? 'Register' : 'Login'}
        </span>
      </p>
    </div>
  );
}

export default Auth;

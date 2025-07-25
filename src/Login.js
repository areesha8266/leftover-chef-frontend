import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function Login() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError('');
    setSuccess('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(
        'https://leftover-chef-backend-production.up.railway.app/api/v1/auth/login',
        form
      );
      const { token } = res.data;
      localStorage.setItem('token', token);
      setSuccess('Login successful!');
      setError('');

      setTimeout(() => navigate('/'), 1000);
    } catch (err) {
      console.error(err.response?.data || err.message);
      setError(err.response?.data?.message || 'Login failed');
      setSuccess('');
    }
  };

  return (
    <div style={styles.container}>
      <h2>Login</h2>
      <form onSubmit={handleSubmit} style={styles.form}>
        <input
          name="email"
          type="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
          style={styles.input}
          required
        />
        <input
          name="password"
          type="password"
          placeholder="Password"
          value={form.password}
          onChange={handleChange}
          style={styles.input}
          required
        />
        <button type="submit" style={styles.button}>Login</button>
      </form>
      {error && <p style={styles.error}>{error}</p>}
      {success && <p style={styles.success}>{success}</p>}
    </div>
  );
}

const styles = {
  container: {
    maxWidth: '400px',
    margin: 'auto',
    marginTop: '50px',
    backgroundColor: '#fffaf3',
    padding: '2rem',
    borderRadius: '10px',
    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
    textAlign: 'center',
    fontFamily: 'sans-serif',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
  },
  input: {
    padding: '0.6rem',
    fontSize: '1rem',
    borderRadius: '6px',
    border: '1px solid #ccc',
  },
  button: {
    padding: '0.6rem',
    fontSize: '1rem',
    backgroundColor: '#c89f72',
    color: 'white',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
  },
  error: {
    marginTop: '1rem',
    color: 'red',
  },
  success: {
    marginTop: '1rem',
    color: 'green',
  },
};

export default Login;

import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function Register() {
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    role: 'user',
  });

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
        'https://leftover-chef-backend-production.up.railway.app/api/v1/auth/register',
        form
      );
      localStorage.setItem('token', res.data.token);
      setSuccess('Registration successful!');
      setTimeout(() => navigate('/'), 1000);
    } catch (err) {
      console.error(err.response?.data || err.message);
      setError(err.response?.data?.message || 'Registration failed');
    }
  };

  return (
    <div style={styles.container}>
      <h2>Register</h2>
      <form onSubmit={handleSubmit} style={styles.form}>
        <input
          type="text"
          name="name"
          placeholder="Name"
          value={form.name}
          onChange={handleChange}
          style={styles.input}
          required
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
          style={styles.input}
          required
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={form.password}
          onChange={handleChange}
          style={styles.input}
          required
        />
        <select name="role" value={form.role} onChange={handleChange} style={styles.input}>
          <option value="user">User</option>
          <option value="admin">Admin</option>
        </select>
        <button type="submit" style={styles.button}>Register</button>
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

export default Register;

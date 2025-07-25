import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Home from './Home';
import Auth from './Auth';
import RecipeDetails from './RecipeDetails';
import { Toaster } from 'react-hot-toast';
import './App.css';

function App() {
  return (
    <>
      <Router>
        <Routes>
          <Route path="/login" element={<Auth />} />
          <Route
            path="/"
            element={
              localStorage.getItem('token') ? <Home /> : <Navigate to="/login" />
            }
          />
          <Route path="/recipe/:id" element={<RecipeDetails />} />
        </Routes>
        <Toaster />
      </Router>
    </>
  );
}

export default App;

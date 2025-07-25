import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useLocation } from 'react-router-dom';
import './App.css';
import BackButton from './BackButton';
import toast from 'react-hot-toast';

function Home() {
  const [ingredients, setIngredients] = useState('');
  const [recipes, setRecipes] = useState([]);
  const [savedRecipes, setSavedRecipes] = useState([]);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }

    const fromRecipeDetails = location.state?.fromRecipeDetails;
    const previousRecipes = location.state?.recipes;

    if (fromRecipeDetails && previousRecipes) {
      setRecipes(previousRecipes);
    } else {
      setRecipes([]);
    }

    fetchSavedRecipes();
  }, [location.state]);

  const fetchSavedRecipes = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get(
        'https://leftover-chef-backend-production.up.railway.app/api/v1/recipes/saved',
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setSavedRecipes(res.data);
    } catch (err) {
      console.error('❌ Error fetching saved recipes:', err);
    }
  };

  const handleSearch = async () => {
    try {
      const token = localStorage.getItem('token');
      const trimmedIngredients = ingredients.trim();
      if (!trimmedIngredients) {
        toast.error('⚠️ Please enter ingredients to search');
        return;
      }

      const res = await axios.get(
        'https://leftover-chef-backend-production.up.railway.app/api/v1/recipes/search',
        {
          params: { ingredients: trimmedIngredients },
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setRecipes(res.data.recipes);
    } catch (err) {
      toast.error('❌ Error searching recipes');
      console.error('❌ Error searching recipes:', err);
    }
  };

  const handleCardClick = (id) => {
    navigate(`/recipe/${id}`, { state: { recipes, fromHome: true } });
  };

  const handleSave = async (recipe) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        toast.error('⚠️ Please log in to save recipes');
        navigate('/login');
        return;
      }

      await axios.post(
        'https://leftover-chef-backend-production.up.railway.app/api/v1/recipes/save',
        {
          title: recipe.title,
          image: recipe.image,
          sourceUrl: recipe.sourceUrl || `https://spoonacular.com/recipes/${recipe.id}`,
          spoonacularId: recipe.id,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success('✨ Recipe saved!');
      fetchSavedRecipes();
    } catch (err) {
      toast.error('❌ Error saving recipe');
      console.error(err);
    }
  };

  const handleDelete = async (recipeId) => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(
        `https://leftover-chef-backend-production.up.railway.app/api/v1/recipes/delete/${recipeId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success('🗑️ Deleted');
      fetchSavedRecipes();
    } catch (err) {
      toast.error('❌ Error deleting recipe');
      console.error(err);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <div className="app">
      <BackButton />

      <div className="header">
        <h1 className="title">
          <img src="/stickers/chef-hat.png" alt="hat" style={{ width: '60px', marginRight: '10px' }} />
          Enchanted Leftovers
        </h1>
        <button onClick={handleLogout} className="logout-btn">Logout</button>
      </div>

      <p className="subtitle">Find a recipe by ingredient</p>

      <div className="search-box">
        <input
          type="text"
          placeholder="Search for ingredients..."
          value={ingredients}
          onChange={(e) => setIngredients(e.target.value)}
        />
        <button onClick={handleSearch}>Search</button>
      </div>

      {recipes.length === 0 && (
        <div className="welcome-message">
          <p><strong>Where grandmother's wisdom meets culinary magic</strong></p>
          <p>Transform your leftover treasures into extraordinary feasts with our collection of time-honored recipes.</p>
        </div>
      )}

      {recipes.length > 0 && (
        <>
          <h2 className="subtitle">🔍 Search Results</h2>
          <div className="recipes">
            {recipes.map((recipe) => (
              <div className="card" key={`search-${recipe.id}`} onClick={() => handleCardClick(recipe.id)}>
                <img src={recipe.image} alt={recipe.title} />
                <h3>{recipe.title}</h3>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleSave(recipe);
                  }}
                >
                  Save Recipe
                </button>
              </div>
            ))}
          </div>
        </>
      )}

      <h2 className="subtitle">📚 Saved Recipes</h2>
      {savedRecipes.length === 0 ? (
        <p style={{ color: 'gray' }}>You haven’t saved any recipes yet.</p>
      ) : (
        <div className="recipes">
          {savedRecipes.map((recipe) => (
            <div className="card" key={`saved-${recipe._id}`}>
              <img
                src={recipe.image || '/placeholder.jpg'}
                alt={recipe.title}
                onClick={() => {
                  if (recipe.spoonacularId) {
                    navigate(`/recipe/${recipe.spoonacularId}`);
                  } else if (recipe.sourceUrl) {
                    window.open(recipe.sourceUrl, '_blank');
                  }
                }}
                style={{ cursor: 'pointer' }}
                onError={(e) => (e.target.src = '/placeholder.jpg')}
              />
              <h3>{recipe.title}</h3>
              <button
                style={{ backgroundColor: '#b74141', marginTop: '0.5rem' }}
                onClick={() => handleDelete(recipe._id)}
              >
                Delete
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Home;
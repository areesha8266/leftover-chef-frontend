import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import './RecipeDetails.css';

function RecipeDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [recipe, setRecipe] = useState(null);

  const previousRecipes = location.state?.recipes;

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const res = await axios.get(
          `https://api.spoonacular.com/recipes/${id}/information`,
          {
            params: {
              apiKey: process.env.REACT_APP_SPOONACULAR_API_KEY,
            },
          }
        );
        
        setRecipe(res.data);
      } catch (err) {
        console.error('Error fetching recipe details', err);
      }
    };

    fetchDetails();
  }, [id]);

  return (
    <div className="recipe-details">
      <button
        className="back-btn"
        onClick={() =>
          navigate('/', {
            state: { fromRecipeDetails: true, recipes: previousRecipes },
          })
        }
      >
        ← Back
      </button>

      {recipe ? (
        <>
          <h1>{recipe.title}</h1>
          <img src={recipe.image} alt={recipe.title} className="recipe-image" />
          <h2>Ingredients:</h2>
          <ul>
            {recipe.extendedIngredients?.map((item) => (
              <li key={item.id}>{item.original}</li>
            ))}
          </ul>
          <h2>Instructions:</h2>
          <div dangerouslySetInnerHTML={{ __html: recipe.instructions }} />
        </>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
}

export default RecipeDetails;

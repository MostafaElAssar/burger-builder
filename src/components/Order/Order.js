import React from 'react';
import classes from './Order.module.css';

const Order = ({ price, ingredients }) => {
  const transformedIngredients = [];
  for (let ingredientName in ingredients) {
    transformedIngredients.push({
      name: ingredientName,
      amount: ingredients[ingredientName],
    });
  }
  const ingredientsOutput = transformedIngredients.map((ig) => {
    return (
      <span
        style={{
          textTransform: 'capitalize',
          display: 'inline-block',
          margin: '0 8px',
          border: '1px solid #ccc',
          padding: '5px',
        }}
        key={ig.name}
      >
        {ig.name} ({ig.amount})
      </span>
    );
  });
  return (
    <div className={classes.Order}>
      <p>Ingredients: {ingredientsOutput}</p>
      <p>
        Price: <strong>USD {price.toFixed(2)}</strong>
      </p>
    </div>
  );
};

export default Order;

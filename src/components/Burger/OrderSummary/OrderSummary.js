import React from 'react';
import Button from '../../UI/Button/Button';

const OrderSummary = ({
  ingredients,
  purchaseCancelled,
  purchaseContinued,
  price
}) => {
  const ingredientsSummary = Object.keys(ingredients).map(igKey => (
    <li key={igKey}>
      <span
        style={{
          textTransform: 'capitalize'
        }}
      >
        {igKey}
      </span>
      : {ingredients[igKey]}
    </li>
  ));
  return (
    <React.Fragment>
      <h3>Your Order</h3>
      <p>A delicious burger with the following ingredients:</p>
      <ul>{ingredientsSummary}</ul>
      <p>
        <strong>Total Price: {price.toFixed(2)} </strong>
      </p>
      <p>Continue to Checkout?</p>
      <Button btnType={'Danger'} clicked={purchaseCancelled}>
        CANCEL
      </Button>
      <Button btnType={'Success'} clicked={purchaseContinued}>
        CONTINUE
      </Button>
    </React.Fragment>
  );
};

export default OrderSummary;

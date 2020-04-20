import React, { useState, useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import axios from '../../axios-orders';
import Burger from '../../components/Burger/Burger';
import BuildControls from '../../components/Burger/BuildControls/BuildControls';
import Modal from '../../components/UI/Modal/Modal';
import OrderSummary from '../../components/Burger/OrderSummary/OrderSummary';
import Spinner from '../../components/UI/Spinner/Spinner';
import withErrorHandler from '../../hoc/withErrorHandler/withErrorHandler';
import * as actions from '../../store/actions/';

export const BurgerBuilder = ({ history }) => {
  const [purchasing, setPurchasing] = useState(false);

  const ingredients = useSelector((state) => {
    return state.burgerBuilder.ingredients;
  });

  const totalPrice = useSelector((state) => {
    return state.burgerBuilder.totalPrice;
  });

  const error = useSelector((state) => {
    return state.burgerBuilder.error;
  });

  const isAuthenticated = useSelector((state) => {
    return state.auth.token !== null;
  });

  const dispatch = useDispatch();

  const onIngredientAdded = (ingredientName) =>
    dispatch(actions.addIngredient(ingredientName));

  const onIngredientRemoved = (ingredientName) =>
    dispatch(actions.removeIngredient(ingredientName));

  const onInitIngredients = useCallback(
    () => dispatch(actions.initIngredients()),
    [dispatch]
  );

  const onPurchaseInit = () => dispatch(actions.purchaseInit());

  const onSetAuthRedirectPath = (path) =>
    dispatch(actions.setAuthRedirectPath(path));

  useEffect(() => {
    onInitIngredients();
  }, [onInitIngredients]);

  const updatePurchaseState = (ingredients) => {
    const sum = Object.keys(ingredients)
      .map((igKey) => ingredients[igKey])
      .reduce((sum, el) => sum + el, 0);
    return sum > 0;
  };

  const purchaseHandler = () => {
    if (isAuthenticated) {
      setPurchasing(true);
    } else {
      onSetAuthRedirectPath('/checkout');
      history.push('/auth');
    }
  };

  const purchaseCancelHandler = () => {
    setPurchasing(false);
  };

  const purchaseContinueHandler = () => {
    onPurchaseInit();
    history.push('/checkout');
  };

  const disabledInfo = { ...ingredients };
  for (let key in disabledInfo) {
    disabledInfo[key] = disabledInfo[key] <= 0;
  }
  let orderSummary = null;
  let burger = error ? <p>Ingredients can't be loaded!</p> : <Spinner />;
  if (ingredients) {
    burger = (
      <React.Fragment>
        <Burger ingredients={ingredients} />
        <BuildControls
          isAuth={isAuthenticated}
          ingredientAdded={onIngredientAdded}
          ingredientRemoved={onIngredientRemoved}
          disabled={disabledInfo}
          price={totalPrice}
          purchasable={updatePurchaseState(ingredients)}
          ordered={purchaseHandler}
        />
      </React.Fragment>
    );
    orderSummary = (
      <OrderSummary
        ingredients={ingredients}
        purchaseCancelled={purchaseCancelHandler}
        purchaseContinued={purchaseContinueHandler}
        price={totalPrice}
      />
    );
  }
  return (
    <React.Fragment>
      <Modal show={purchasing} modalClosed={purchaseCancelHandler}>
        {orderSummary}
      </Modal>
      {burger}
    </React.Fragment>
  );
};

export default withErrorHandler(BurgerBuilder, axios);

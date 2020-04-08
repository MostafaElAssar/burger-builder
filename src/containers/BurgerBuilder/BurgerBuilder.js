import React from 'react';
import { connect } from 'react-redux';
import axios from '../../axios-orders';
import Burger from '../../components/Burger/Burger';
import BuildControls from '../../components/Burger/BuildControls/BuildControls';
import Modal from '../../components/UI/Modal/Modal';
import OrderSummary from '../../components/Burger/OrderSummary/OrderSummary';
import Spinner from '../../components/UI/Spinner/Spinner';
import withErrorHandler from '../../hoc/withErrorHandler/withErrorHandler';
import * as actions from '../../store/actions/';

class BurgerBuilder extends React.Component {
  state = {
    purchasing: false,
  };

  componentDidMount() {
    this.props.onInitIngredients();
  }

  updatePurchaseState = (ingredients) => {
    const sum = Object.keys(ingredients)
      .map((igKey) => ingredients[igKey])
      .reduce((sum, el) => sum + el, 0);
    return sum > 0;
  };

  purchaseHandler = () => {
    this.setState({
      purchasing: true,
    });
  };

  purchaseCancelHandler = () => {
    this.setState({
      purchasing: false,
    });
  };

  purchaseContinueHandler = () => {
    const { history, onPurchaseInit } = this.props;
    onPurchaseInit();
    history.push('/checkout');
  };

  render() {
    const { purchasing } = this.state;
    const { ingredients, totalPrice, error } = this.props;
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
            ingredientAdded={this.props.onIngredientAdded}
            ingredientRemoved={this.props.onIngredientRemoved}
            disabled={disabledInfo}
            price={totalPrice}
            purchasable={this.updatePurchaseState(ingredients)}
            ordered={this.purchaseHandler}
          />
        </React.Fragment>
      );
      orderSummary = (
        <OrderSummary
          ingredients={ingredients}
          purchaseCancelled={this.purchaseCancelHandler}
          purchaseContinued={this.purchaseContinueHandler}
          price={totalPrice}
        />
      );
    }
    return (
      <React.Fragment>
        <Modal show={purchasing} modalClosed={this.purchaseCancelHandler}>
          {orderSummary}
        </Modal>
        {burger}
      </React.Fragment>
    );
  }
}

const mapStateToProps = (state) => ({
  ingredients: state.burgerBuilder.ingredients,
  totalPrice: state.burgerBuilder.totalPrice,
  error: state.burgerBuilder.error,
});

const mapDispatchToProps = (dispatch) => ({
  onIngredientAdded: (ingredientName) =>
    dispatch(actions.addIngredient(ingredientName)),
  onIngredientRemoved: (ingredientName) =>
    dispatch(actions.removeIngredient(ingredientName)),
  onInitIngredients: () => dispatch(actions.initIngredients()),
  onPurchaseInit: () => dispatch(actions.purchaseInit()),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withErrorHandler(BurgerBuilder, axios));

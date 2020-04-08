import React from 'react';
import { connect } from 'react-redux';
import axios from '../../axios-orders';
import Burger from '../../components/Burger/Burger';
import BuildControls from '../../components/Burger/BuildControls/BuildControls';
import Modal from '../../components/UI/Modal/Modal';
import OrderSummary from '../../components/Burger/OrderSummary/OrderSummary';
import Spinner from '../../components/UI/Spinner/Spinner';
import withErrorHandler from '../../hoc/withErrorHandler/withErrorHandler';
import * as actionTypes from '../../store/actions';

class BurgerBuilder extends React.Component {
  state = {
    purchasing: false,
    loading: false,
    error: false,
  };

  // componentDidMount() {
  //   axios
  //     .get('https://burger-builder-7c290.firebaseio.com/ingredients.json')
  //     .then((response) => {
  //       this.setState({
  //         ingredients: response.data,
  //       });
  //     })
  //     .catch((error) => {
  //       this.setState({
  //         error: true,
  //       });
  //     });
  // }

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
    const { history } = this.props;
    history.push('/checkout');
  };

  render() {
    const { purchasing, loading, error } = this.state;
    const { ingredients, totalPrice } = this.props;
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
    if (loading) {
      orderSummary = <Spinner />;
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
  ingredients: state.ingredients,
  totalPrice: state.totalPrice,
});

const mapDispatchToProps = (dispatch) => ({
  onIngredientAdded: (ingredientName) =>
    dispatch({ type: actionTypes.ADD_INGREDIENT, ingredientName }),
  onIngredientRemoved: (ingredientName) =>
    dispatch({ type: actionTypes.REMOVE_INGREDIENT, ingredientName }),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withErrorHandler(BurgerBuilder, axios));

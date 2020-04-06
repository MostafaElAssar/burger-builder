import React from 'react';
import axios from '../../../axios-orders';
import Button from '../../../components/UI/Button/Button';
import Spinner from '../../../components/UI/Spinner/Spinner';
import classes from './ContactData.module.css';

class ContactData extends React.Component {
  state = {
    name: '',
    email: '',
    address: {
      street: '',
      postalCode: '',
    },
    loading: false,
  };

  orderHandler = (event) => {
    event.preventDefault();
    const { ingredients, price, history } = this.props;
    this.setState({
      loading: true,
    });
    const order = {
      ingredients,
      price,
      customer: {
        name: 'Mostafa',
        address: {
          street: 'Teststreet 1',
          zipCode: '11835',
          country: 'Egypt',
        },
        email: 'test@test.com',
      },
      deliveryMethod: 'fastest',
    };
    axios
      .post('/orders.json', order)
      .then(() => {
        this.setState({
          loading: false,
        });
        history.push('/');
      })
      .catch(() =>
        this.setState({
          loading: false,
        })
      );
  };

  render() {
    const { loading } = this.state;
    let form = (
      <form>
        <input
          className={classes.Input}
          type="text"
          name="name"
          placeholder="Your Name"
        />
        <input
          className={classes.Input}
          type="email"
          name="email"
          placeholder="Your Email"
        />
        <input
          className={classes.Input}
          type="text"
          name="street"
          placeholder="Street"
        />
        <input
          className={classes.Input}
          type="text"
          name="postal"
          placeholder="Postal Code"
        />
        <Button btnType="Success" clicked={this.orderHandler}>
          ORDER
        </Button>
      </form>
    );
    if (loading) {
      form = <Spinner />;
    }
    return (
      <div className={classes.ContactData}>
        <h4>Enter your Contact Date</h4>
        {form}
      </div>
    );
  }
}

export default ContactData;

const mongodb = require('mongodb');
const getDb = require('../util/database').getDb;

const ObjectId = mongodb.ObjectId;

class User {
  constructor(username, email, cart, id) {
    this.name = username;
    this.email = email;
    this.cart = cart; // { items: [ { productId: ..., quantity: ... } ] }
    this._id = id ? new ObjectId(id) : null;
  }

  save() {
    const db = getDb();
    return db
      .collection('users')
      .insertOne(this)
      .then((result) => {
        console.log('User saved', result);
      })
      .catch((err) => {
        console.log('Error saving user', err);
      });
  }

  addToCart(product) {
    const cartProductIndex = this.cart.items.findIndex((cp) => {
      return cp.productId.toString() === product._id.toString();
    });

    let newQuantity = 1;
    const updatedCartItems = [...this.cart.items];

    if (cartProductIndex >= 0) {
      newQuantity = this.cart.items[cartProductIndex].quantity + 1;
      updatedCartItems[cartProductIndex].quantity = newQuantity;
    } else {
      updatedCartItems.push({
        productId: new ObjectId(product._id),
        quantity: newQuantity,
      });
    }

    const updatedCart = {
      items: updatedCartItems,
    };

    const db = getDb();
    return db
      .collection('users')
      .updateOne({ _id: this._id }, { $set: { cart: updatedCart } })
      .then((result) => {
        console.log('Updated cart', result);
      })
      .catch((err) => {
        console.log('Error updating cart', err);
      });
  }

  getCart() {
    const db = getDb();
    const productIds = this.cart.items.map((i) => i.productId);

    return db
      .collection('products')
      .find({ _id: { $in: productIds } })
      .toArray()
      .then((products) => {
        return products.map((p) => {
          return {
            ...p,
            quantity: this.cart.items.find((i) => {
              return i.productId.toString() === p._id.toString();
            }).quantity,
          };
        });
      })
      .catch((err) => {
        console.log('Error fetching cart products', err);
      });
  }

  deleteItemFromCart(productId) {
    const updatedCartItems = this.cart.items.filter((item) => {
      return item.productId.toString() !== productId.toString();
    });
    const db = getDb();
    return db
      .collection('users')
      .updateOne({ _id: this._id }, { $set: { cart: { items: updatedCartItems } } });
  }

  addOrder() {
    const db = getDb();
    return this.getCart()
      .then((products) => {
        const order = {
          items: products,
          user: {
            _id: this._id,
            name: this.name,
          },
        };
        return db.collection('orders').insertOne(order);
      })
      .then((result) => {
        console.log('Order placed', result);
        this.cart = { items: [] };
        return db
          .collection('users')
          .updateOne({ _id: this._id }, { $set: { cart: { items: [] } } });
      })
      .catch((err) => {
        console.log('Error placing order', err);
      });
  }

  getOrders() {
    const db = getDb();
    return db
      .collection('orders')
      .find({ 'user._id': new ObjectId(this._id) })
      .toArray()
      .then((orders) => {
        console.log('Fetched orders', orders);
        return orders;
      })
      .catch((err) => {
        console.log('Error fetching orders', err);
      });
  }

  static findById(userId) {
    const db = getDb();
    return db
      .collection('users')
      .findOne({ _id: new ObjectId(userId) })
      .then((user) => {
        console.log('fetched user', user);
        return user;
      })
      .catch((err) => {
        console.log('Error fetching user', err);
      });
  }
}

module.exports = User;

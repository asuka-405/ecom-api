const CART = require("../../models/cart")
const ORDERS = require("../../models/orders")

module.exports = {
  getCart,
  addToCart,
  removeFromCart,
  updateCart,
  clearCart,
  checkout,
  orderHistory,
}

// expects username
// returns cart items as an array
async function getCart(username) {
  return await CART.findOne({ username })
    .then((doc) => {
      return doc.items
    })
    .catch((err) => {
      throw err
    })
}

// expects username and item
// adds item to cart
async function addToCart(username, item) {
  await CART.findOne({ username })
    .then((doc) => {
      doc.items.push(item)
      doc.save()
    })
    .catch((err) => {
      throw err
    })
}

// expects username and item
// removes item from cart
async function removeFromCart(username, item) {
  console.log(username, item)
  await CART.findOne({ username })
    .then((doc) => {
      doc.items = doc.items.filter((cartItem) => {
        console.log(cartItem.id, item)
        return cartItem.id - item !== 0
      })
      console.log(doc.items)
      doc.save()
    })
    .catch((err) => {
      throw err
    })
}

// expects username and item
// updates cart with new item
async function updateCart(username, item) {
  console.log(item)
  return await CART.findOne({ username })
    .then((doc) => {
      doc.items = [...doc.items, item]
      doc.save()
    })
    .catch((err) => {
      throw err
    })
}

// expects username
// clears cart
async function clearCart(username) {
  await CART.findOne({ username })
    .then((doc) => {
      doc.items = []
      doc.save()
    })
    .catch((err) => {
      throw err
    })
}

// expects username and cart
// adds cart to orders and clears cart
async function checkout(username, cart) {
  await ORDERS.findOneAndUpdate({ username })
    .then((doc) => {
      if (!doc) {
        doc = new ORDERS({ username })
        doc.orders = [cart]
      } else doc.orders.push(cart)
      doc.save()
      clearCart(username)
    })
    .catch((err) => {
      throw err
    })
}

// expects username
// returns order history
async function orderHistory(username) {
  return await ORDERS.findOne({ username })
    .then((doc) => {
      return doc.orders
    })
    .catch((err) => {
      throw err
    })
}

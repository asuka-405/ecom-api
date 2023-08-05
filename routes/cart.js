const jwt = require("jsonwebtoken")
const EXPRESS = require("express")
const AXIOS = require("axios")
const CART_ROUTER = EXPRESS.Router()
const { ENDPOINTS } = require("./storeHelpers/endpoints")

// utility function to handle cart operations
const {
  updateCart,
  removeFromCart,
  getCart,
  checkout,
  orderHistory,
} = require("./storeHelpers/utils")

// this PASSPORT is imported from ./authHelpers/passport.config.js
// it is connected with the JWT_OPTIONS in ./authHelpers/passport.config.js
const { PASSPORT } = require("./auth")

/**
 * @route GET /cart
 * @desc get cart
 * @access private
 * @param {string} username - username of user
 * @returns {object} cart - cart of user
 * @returns {string} message - message
 * @returns {object} error - error
 * @example
 * GET /cart
 * {
 *    "cart": {
 *       "items": [
 *         {
 *          "id": 1,
 *          "title": "Fjallraven - Foldsack No. 1 Backpack, Fits 15 Laptops",
 *          "price": 109.95,
 *           ...
 *        }
 *     ],
 *    "username": "user1"
 * }
 */
CART_ROUTER.get(
  "/",
  PASSPORT.authenticate("local", { session: false }),
  async (req, res) => {
    try {
      await getCart(req.user.username)
        .then((cart) => {
          res.json({ cart })
        })
        .catch((err) => res.json({ message: err.message }))
    } catch (error) {
      res.status(500).json({ message: "unable to retrieve your cart", error })
    }
  }
)

/**
 * @route PATCH /cart/add/:id
 * @desc add item to cart
 * @access private
 * @param {string} username - username of user
 * @param {string} id - id of item to add to cart
 * @param {number} quantity - quantity of item to add to cart
 * @returns {string} message - message
 * @returns {object} error - error
 * @example
 * PATCH /cart/add/1
 * {
 *   "quantity": 1
 * }
 *
 * {
 *  "message": "item added to cart"
 * }
 *
 */
CART_ROUTER.patch(
  "/add/:id",
  PASSPORT.authenticate("local", { session: false }),
  async (req, res) => {
    try {
      const { quantity } = req.body
      const { data } = await AXIOS.get(
        `${ENDPOINTS.getProductById}${req.params.id}`
      )
      const username = jwt.decode(
        req.headers.authorization.split(" ")[1]
      ).username
      const cartItem = { ...data, quantity }
      await updateCart(username, cartItem)
      res.json({ message: "item added to cart" })
    } catch (error) {
      res.status(500).json({ message: "unable to add item to cart", error })
    }
  }
)

/**
 * @route DELETE /cart/remove/:id
 * @desc remove item from cart
 * @access private
 * @param {string} username - username of user
 * @param {string} id - id of item to remove from cart
 * @returns {string} message - message
 * @returns {object} error - error
 * @example
 * DELETE /cart/remove/1
 * {
 * "message": "item removed from cart"
 * }
 */

CART_ROUTER.delete(
  "/remove/:id",
  PASSPORT.authenticate("local", { session: false }),
  async (req, res) => {
    try {
      const username = jwt.decode(
        req.headers.authorization.split(" ")[1]
      ).username

      await removeFromCart(username, req.params.id)
      res.json({ message: "item removed from cart" })
    } catch (error) {
      res
        .status(500)
        .json({ message: "unable to remove item from cart", error })
    }
  }
)

/**
 * @route POST /cart/checkout
 * @desc checkout cart
 * @access private
 * @param {string} username - username of user
 * @returns {string} message - message
 * @returns {object} order - order
 * @returns {object} error - error
 * @example
 * POST /cart/checkout
 * {
 *    "message": "order placed",
 *    "order": {
 *     "items": [
 *                {
 *   "id": 1,
 *   "title": "Fjallraven - Foldsack No. 1 Backpack, Fits 15 Laptops",
 *   "price": 109.95,
 *   ...
 *                }
 *              ],
 *      "username": "user1"
 * }
 */

CART_ROUTER.post(
  "/checkout",
  PASSPORT.authenticate("local", { session: false }),
  async (req, res) => {
    try {
      const { username } = jwt.decode(req.headers.authorization.split(" ")[1])
      const order = await getCart(username)
      await checkout(username, order)
      res.json({ message: "order placed", order })
    } catch (error) {
      res.status(500).json({ message: "unable to place order", error })
    }
  }
)

/**
 * @route GET /cart/history
 * @desc get order history
 * @access private
 * @param {string} username - username of user
 * @returns {string} message - message
 * @returns {object} history - order history
 * @returns {object} error - error
 * @example
 * GET /cart/history
 * {
 *      "message": "order history retrieved",
 *      "history": [
 *                    {
 *                        "items": [
 *                                    {
 *                                       "id": 1,
 *                                       "title": "Fjallraven - Foldsack No. 1 Backpack, Fits 15 Laptops",
 *                                       "price": 109.95,
 *                                       ...
 *                                     }
 *                                  ],
 *                         "username": "user1"
 *                    }
 *                  ]
 * }
 */

CART_ROUTER.get(
  "/history",
  PASSPORT.authenticate("local", { session: false }),
  async (req, res) => {
    try {
      const { username } = jwt.decode(req.headers.authorization.split(" ")[1])
      const history = await orderHistory(username)
      console.log(history)
      res.json({ message: "order history retrieved", history })
    } catch (error) {
      res
        .status(500)
        .json({ message: "unable to retrieve order history", error })
    }
  }
)

module.exports = CART_ROUTER

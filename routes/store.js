const EXPRESS = require("express")
const STORE_ROUTER = EXPRESS.Router()
const AXIOS = require("axios")
const { ENDPOINTS } = require("./storeHelpers/endpoints")

/**
 * @route GET /store
 * @desc get list of products
 * @access public
 * @returns {string} message - message
 * @returns {object} products - list of products
 * @returns {object} error - error
 * @example
 * GET /store
 * {
 *    "products": [
 *                    {
 *                        "id": 1,
 *                        "title": "Fjallraven - Foldsack No. 1 Backpack, Fits 15 Laptops",
 *                        "price": 109.95,
 *                        ...
 *                    }
 *                ]
 * }
 */

STORE_ROUTER.get("/", async (req, res) => {
  try {
    const PRODUCTS = (await AXIOS.get(ENDPOINTS.getListOfProducts)).data
    res.json(PRODUCTS)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

/**
 * @route GET /store/categories
 * @desc get list of categories
 * @access public
 * @returns {string} message - message
 * @returns {object} categories - list of categories
 * @returns {object} error - error
 * @example
 * GET /store/categories
 *
 * [
 *    "jwellery",
 *    "electronics",
 * ]
 */

STORE_ROUTER.get("/categories", async (req, res) => {
  try {
    const CATEGORIES = (await AXIOS.get(ENDPOINTS.getCategories)).data
    res.json(CATEGORIES)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

/**
 * @route GET /store/product/:id
 * @desc get product by its id
 * @access public
 * @param {string} id - id of product
 * @returns {string} message - message
 * @returns {object} product - product
 * @returns {object} error - error
 * @example
 * GET /store/product/1
 * {
 *   "product": {
 *                  "id": 1,
 *                  "title": "Fjallraven - Foldsack No. 1 Backpack, Fits 15 Laptops",
 *                  "price": 109.95,
 *                  ...
 *              }
 * }
 */

STORE_ROUTER.get("/product/:id", async (req, res) => {
  try {
    const PRODUCT = (await AXIOS.get(ENDPOINTS.getProductById + req.params.id))
      .data
    res.json(PRODUCT)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

module.exports = STORE_ROUTER

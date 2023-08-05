const url = "https://fakestoreapi.com/"

/**
 * @typedef {Object} ENDPOINTS
 * @property {string} getCategories - get list of categories
 * @property {string} getListOfProducts - get list of products
 * @property {string} getProductById - get product by its id
 * @example
 * {
 *   getCategories:         "https://fakestoreapi.com/products/categories",
 *   getListOfProducts:     "https://fakestoreapi.com/products",
 *   getProductById:        "https://fakestoreapi.com/products/",
 * }
 */
const ENDPOINTS = {
  getCategories: `${url}products/categories`,
  getListOfProducts: `${url}products`,
  getProductById: `${url}products/`,
}

module.exports = { ENDPOINTS }

const MONGOOSE = require("mongoose")

const CART_SCHEMA = new MONGOOSE.Schema({
  username: { type: String, required: true },
  items: { type: [MONGOOSE.Schema.Types.Mixed], default: [] },
})
const CART = MONGOOSE.model("CART", CART_SCHEMA)

module.exports = CART

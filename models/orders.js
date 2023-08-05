const MONGOOSE = require("mongoose")

const ORDERS_SCHEMA = new MONGOOSE.Schema({
  username: { type: String, required: true },
  orders: { type: [[MONGOOSE.Schema.Types.Mixed]], default: [[]] },
})
const ORDERS = MONGOOSE.model("ORDERS", ORDERS_SCHEMA)

module.exports = ORDERS

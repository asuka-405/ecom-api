if (process.env.NODE_ENV !== "production") {
  require("dotenv").config()
}

const EXPRESS = require("express")
const PORT = process.env.PORT || 3333
const APP = EXPRESS()

// dependencies
const CORS = require("cors")
const initializeMongoose = require("./initDB.js")
const rateLimiter = require("express-rate-limit")
const PASSPORT = require("passport")

// subrouters
const { AUTH_ROUTER } = require("./routes/auth.js")
const STORE_ROUTER = require("./routes/store.js")
const CART_ROUTER = require("./routes/cart.js")

// to allow request to be made to @url fakestoreapi
const CORS_OPTIONS = {
  origin: "*",
  optionsSuccessStatus: 200,
}

// Define rate limiting options
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // maximum 100 requests per windowMs
})

// middleware
app.use(limiter)
APP.use(CORS(CORS_OPTIONS))
APP.use(EXPRESS.json())
APP.use(COOKIE_PARSER())
APP.use(PASSPORT.initialize())

// initialize database
initializeMongoose()

// routes
APP.use("/auth", AUTH_ROUTER)
APP.use("/store", STORE_ROUTER)
APP.use("/cart", CART_ROUTER)

// catch all
APP.all("*", (req, res) => {
  res.status(404).json({ message: "Route not found" })
})

// start server
APP.listen(PORT, () => {
  console.log(`✨✨listening on port ${PORT}⚡⚡`)
})

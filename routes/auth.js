const EXPRESS = require("express")
const PASSPORT = require("passport")
const { registerProcess, loginProcess } = require("./authHelpers/utils")
const { initPassport } = require("./authHelpers/passport.config")
const jwt = require("jsonwebtoken")
const CART = require("../models/cart")

const JWT_OPTIONS = initPassport(PASSPORT)

const AUTH_ROUTER = EXPRESS.Router()

// expects username and password in from req.body in json format
// returns a jwt token
// this token is used to authenticate the user
// the token is sent in the header of every request
// the token is verified in the middleware
// if the token is valid, the request is allowed to proceed
// else the request is rejected
// the token is valid for 1 day
// the token is generated using the username
// the token is signed using the secretOrKey
//
// login process middleware is defined in authHelpers/utils.js
// the middleware checks if the user exists in the database
// if the user exists, it checks if the password is correct
// if the password is correct, it calls next() to proceed to the next middleware
// else it returns an error message
AUTH_ROUTER.post("/login", loginProcess, (req, res) => {
  // create token
  var token = jwt.sign({ username: req.body.username }, JWT_OPTIONS.secretOrKey)
  // return token
  res.json({ message: "ok", token: token })
})

AUTH_ROUTER.get(
  "/secret",
  PASSPORT.authenticate("local", { session: false }),
  (req, res) => {
    res.send("Success! You can not see this without a token")
  }
)

// expects username and password in from req.body in json format
AUTH_ROUTER.post("/register", async (req, res) => {
  // destructure username and password from req.body
  const { username, password } = req.body

  try {
    // check if user already exists and if not, create user else return error message
    const CREATED_USER = await registerProcess({
      username,
      password,
    })
    if (!CREATED_USER) res.json({ message: "User already exists" })
    else {
      // create cart for user
      await CART.create({ username })
        .then((doc) => {
          doc.save()
        })
        .catch((err) => {
          res.json({ message: err.message })
        })
      // return success message
      res.status(201).json({ message: "User created, Login to proceed" })
    }
  } catch (error) {
    // return error message
    res
      .status(500)
      .json({ message: "User creation failed", err: error.message })
  }
})

module.exports = { AUTH_ROUTER, PASSPORT }

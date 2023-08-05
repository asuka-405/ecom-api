module.exports = { initPassport }

if (process.env.NODE_ENV !== "production") require("dotenv").config()
const { getUser } = require("./utils.js")
const PASSPORT_JWT = require("passport-jwt")
const JWT_STRATEGY = PASSPORT_JWT.Strategy
const EXTRACT_JWT = PASSPORT_JWT.ExtractJwt

// configure passport options for JWT strategy (see passport-jwt docs)
const JWT_OPTIONS = {
  jwtFromRequest: EXTRACT_JWT.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.ACCESS_TOKEN_SECRET,
}

// initialize passport with JWT strategy
function initPassport(passport) {
  /**
   * @param {object} jwt_payload - the payload from the JWT token
   * @param {function} next - callback function
   * @returns {object} - the user object
   * @returns {boolean} - false if no user is found
   * @description - this function is called by passport.authenticate
   * when a protected route is accessed. It checks the JWT token
   * to see if it is valid and returns the user object if it is.
   * If the token is invalid, it returns false.
   *
   */
  passport.use(
    "local",
    new JWT_STRATEGY(JWT_OPTIONS, async function (jwt_payload, next) {
      var user = await getUser({ username: jwt_payload.username })
      if (user) {
        next(null, user)
      } else {
        next(null, false)
      }
    })
  )

  /**
   * @param {object} user - the user object
   * @param {function} done - callback function
   * @description - this function is called by passport.authenticate
   * when a protected route is accessed. It serializes the user
   * object and passes it to the done callback function.
   *
   */
  passport.serializeUser((user, done) => {
    done(null, user._id)
  })

  passport.deserializeUser(async (_id, done) => {
    const user = await getUser({ _id })
    done(null, user)
  })

  return JWT_OPTIONS
}

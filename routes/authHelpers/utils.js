const USER = require("../../models/user")

module.exports = {
  registerProcess,
  getUser,
  matchPassword,
  loginProcess,
}

// Function to compare passwords
function matchPassword(password, savedPassword) {
  return password === savedPassword
}

// Function to register a user
async function registerProcess({ username, password }) {
  try {
    // Check if user already exists
    const existingUser = await getUser({ username })
    if (existingUser) return undefined

    // Create new user and save it to the database
    const newUser = new USER({ username, password })
    await saveUser(newUser)
    return newUser
  } catch (error) {
    throw error
  }
}

/**
 * @desc middleware to check if user exists and if password is correct
 * @param {object} req - request object
 * @param {object} res - response object
 * @param {function} next - next function
 * @returns {string} message - message
 * @returns {object} error - error
 * @example
 * POST /auth/login
 * {
 *   "username": "user1",
 *  "password": "password"
 * }
 *
 * {
 *  "message": "ok",
 *  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9eyJ1c2VybmFtZSI6InVzZXIxIiwiaWF0IjoxNjI0MjU0NjQ2LCJleHAiOjE2MjQzNDEwNDZ9"
 * }
 */
async function loginProcess(req, res, next) {
  const { username, password } = req.body
  try {
    const USER = await getUser({ username })
    if (!USER) return res.send({ message: "No user with that username" })

    const passwordMatches = matchPassword(password, USER.password)
    if (passwordMatches) next()
    else return res.send({ message: "Password incorrect" })
  } catch (error) {
    res.send({ message: "Login failed", error })
  }
}

// Function to get user from database
async function getUser(param) {
  return await USER.findOne(param)
}

// Function to save user to database
async function saveUser(user) {
  await user.save()
}

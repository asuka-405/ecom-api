if (process.env.NODE_ENV !== "production") require("dotenv").config()

const MONGOOSE = require("mongoose")

// initialize database
function initializeMongoose() {
  MONGOOSE.connect(process.env.MONGO_URL)
    .then(() => {
      console.log("Connected to the database!")
    })
    .catch((error) => {
      console.log("Failed to connect to the database:", error)
    })
}

module.exports = initializeMongoose

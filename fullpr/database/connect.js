const mongoose = require("mongoose")

const DB_URL = "mongodb://localhost:27017/full_pr"

async function connectToDataBase() {
    try {
        await mongoose.connect(DB_URL)
        console.log("Connected to MongoDB")
    }
    catch(err) {
        console.log("Error during connection to MogoDB: " + err)
    }
}

module.exports = connectToDataBase
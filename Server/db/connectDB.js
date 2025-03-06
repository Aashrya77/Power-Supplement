const mongoose = require('mongoose')

const connectDB = async (url) => {
    try {
        await mongoose.connect(url)
        console.log("MongoDB connected..")
    } catch (error) {
        console.error(error)
    }
}

module.exports = connectDB
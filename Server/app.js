require('dotenv').config()
const express = require('express')
const cors = require('cors')
const path = require('path')
const app = express()
const port = process.env.PORT || 5500
const connectDB = require('./db/connectDB')

// Import routes
const authRoutes = require('./Routes/Auth')
const productRoutes = require('./Routes/Product')
const categoryRoutes = require('./Routes/Category')
const flavorRoutes = require('./Routes/Flavor')
const cartRoutes = require('./Routes/Cart')
const paymentRoutes = require('./routes/paymentRoutes')
const orderRoutes = require('./routes/orderRoutes')

// Middleware
app.use(cors())
app.use(express.json())

// Serve static files from uploads directory
app.use('/uploads', express.static(path.join(__dirname, 'uploads')))

// Route registrations
app.use('/api/v1/auth', authRoutes)
app.use('/api/v1/products', productRoutes)
app.use('/api/v1/categories', categoryRoutes)
app.use('/api/v1/flavors', flavorRoutes)
app.use('/api/v1/cart', cartRoutes)
app.use('/api/v1/payments', paymentRoutes)
app.use('/api/v1/orders', orderRoutes)

const startServer = async () => {
    try {
        await connectDB(process.env.MONGO_URI)
        app.listen(port, () => {
            console.log(`Server listening on port ${port}...`)
        })
    } catch (error) {
        console.log(error)
    }
}

startServer();
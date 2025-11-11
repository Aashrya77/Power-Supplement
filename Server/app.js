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
const paymentRoutes = require('./Routes/paymentRoutes')
const orderRoutes = require('./Routes/orderRoutes')
const searchRoutes = require('./Routes/searchRoutes')
const sitemapRoutes = require('./Routes/sitemapRoutes')
const blogRoutes = require('./Routes/blogRoutes')

// Middleware
app.use(cors({
    origin: ['https://powersupplement.net','https://powersupplement.onrender.com', 'http://localhost:5173'],
    credentials: true,  
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization']
}))
app.use(express.json({ limit: '100mb' }))
app.use(express.urlencoded({ extended: true, limit: '10mb' }))

// Add SEO-friendly headers
app.use((req, res, next) => {
    // Add cache control for static assets
    if (req.url.match(/\.(css|js|jpg|jpeg|png|gif|ico|svg|webp)$/)) {
        res.setHeader('Cache-Control', 'public, max-age=31536000'); // 1 year
    } else {
        res.setHeader('Cache-Control', 'public, max-age=0, must-revalidate');
    }
    next();
})

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
app.use('/api/v1/search', searchRoutes)
app.use('/api/v1/blogs', blogRoutes)

// SEO routes - sitemap and robots.txt
app.use('/', sitemapRoutes)

// Add a health check endpoint
app.get('/api/health', (req, res) => {
    res.status(200).json({ status: 'ok', message: 'Server is running' })
})

// Handle 404 errors
app.use((req, res) => {
    res.status(404).json({ message: 'Route not found' })
})

// Global error handler
app.use((err, req, res, next) => {
    console.error('Server error:', err.stack)
    res.status(500).json({ 
        message: 'Internal server error', 
        error: process.env.NODE_ENV === 'development' ? err.message : undefined 
    })
})

const startServer = async () => {
    try {
        // Connect to database with retry logic
        let retries = 5
        while (retries) {
            try {
                await connectDB(process.env.MONGO_URI)
                console.log('Connected to MongoDB')
                break
            } catch (error) {
                retries -= 1
                console.log(`Database connection failed, retries left: ${retries}`)
                if (retries === 0) throw error
                // Wait before retrying
                await new Promise(resolve => setTimeout(resolve, 1000))
            }
        }
        
        // Start the server
        app.listen(port, () => {
            console.log(`Server listening on port ${port}...`)
        })
    } catch (error) {
        console.error('Failed to start server:', error)
        process.exit(1)
    }
}

startServer();
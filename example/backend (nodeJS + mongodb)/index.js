require('dotenv').config()
const express = require('express')
const cors = require('cors')
const cookieParser = require('cookie-parser')
const mongoose = require('mongoose')
const authRouter = require('./authAPI/router')
const errorMiddleware = require('./authAPI/middleware/errorMiddleware')
const adminRouter = require('./adminAPI/router')
const apiRouter = require('./api/router')

const port = process.env.PORT || 5000

const app = express()
app.use(express.json())
app.use(cookieParser())
app.use(cors({
    credentials: true,
    origin: `${process.env.CLIENT_URL}`
}))
app.use('/auth', authRouter)
app.use('/admin', adminRouter)
app.use('/api', apiRouter)
authRouter.use(errorMiddleware)
adminRouter.use(errorMiddleware)
apiRouter.use(errorMiddleware)

const start = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URL, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        })
        app.listen(port, () => console.log(`Server started on port: ${port}`))
    } catch (e) {
        console.log(e)
    }
}

start()
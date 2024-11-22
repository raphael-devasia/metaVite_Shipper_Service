import connectDB from "./config/database.config"

connectDB()
    .then(() => {
        console.log("Connected to MongoDB")
    })
    .catch((err) => {
        console.error("Error connecting to MongoDB:", err)
    })

import "./services/grpc.server"
import "./services/shipper.service"

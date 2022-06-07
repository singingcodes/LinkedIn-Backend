import express from "express"
import cors from "cors"
import mongoose from "mongoose"
import listEndPoints from "express-list-endpoints"
import {
  handleBadRequest,
  handleNotFound,
  handleUnauthorized,
  genericServerError,
} from "./errorHandlers.js"

const server = express()

server.use(cors())
server.use(express.json())

//Endpoint 1
//Endpoint 2
//Endpoint 3
//Endpoint 4

const port = process.env.PORT || 5001

server.use(handleBadRequest)
server.use(handleNotFound)
server.use(handleUnauthorized)
server.use(genericServerError)

mongoose.connect(process.env.MONGODB_CONNECTION_STRING)

mongoose.connection.on("connected", () => {
  console.log("connected to mongo")
  server.listen(port, () => {
    console.table(listEndPoints(server))
    console.log(`server is running on port ${port}`)
  })
})

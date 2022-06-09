import express from "express"
import cors from "cors"
import mongoose from "mongoose"
import listEndPoints from "express-list-endpoints"
import profileRouter from "./apis/profiles/index.js"
import postRouter from "./apis/posts/index.js"
import {
  handleBadRequest,
  handleNotFound,
  handleUnauthorized,
  genericServerError,
} from "./errorHandlers.js"
import experienceRouter from "./apis/experiences/index.js"
import likeRouter from './apis/likes/index.js'

const server = express()

server.use(cors())
server.use(express.json())

server.use("/experiences", experienceRouter)
//Endpoint 2
server.use("/profile", profileRouter)
server.use('/posts', likeRouter)
server.use("/posts", postRouter)
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

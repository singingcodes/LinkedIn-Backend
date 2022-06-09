import express from "express"
import createError from "http-errors"
import postModel from "./model.js"
import multer from "multer"
import { CloudinaryStorage } from "multer-storage-cloudinary"
import { v2 as cloudinary } from "cloudinary"

const postRouter = express.Router()

const cloudinaryUploader = multer({
  storage: new CloudinaryStorage({
    cloudinary,
    params: {
      folder: "LinkedIn Profile Images",
    },
  }),
  fileFilter: (req, file, multerNext) => {
    if (file.mimetype !== "image/jpeg" && file.mimetype !== "image/png") {
      multerNext(createError(400, "Only PNG or JPEG allowed!"))
    } else {
      multerNext(null, true)
    }
  },
  limits: { fileSize: 100 * 1024 * 1024 },
}).single("picture")

//GET /api/posts
postRouter.get("/", async (req, res, next) => {
  try {
    const posts = await postModel.find().populate({ path: "user" })
    res.send(posts)
  } catch (err) {
    next(err)
  }
})
//GET /api/posts/:id
postRouter.get("/:id", async (req, res, next) => {
  try {
    const post = await postModel
      .findById(req.params.id)
      .populate({ path: "user" })
    if (!post) {
      next(createError(404, `Post with id ${req.params.id} not found`))
    }
    res.send(post)
  } catch (err) {
    next(err)
  }
})
//POST /api/posts
postRouter.post("/", async (req, res, next) => {
  try {
    const newPost = new postModel(req.body)
    const { _id } = await newPost.save()
    res.status(201).send({ _id })
  } catch (err) {
    next(err)
  }
})
//PUT /api/posts/:id
postRouter.put("/:id", async (req, res, next) => {
  try {
    const post = await postModel.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    })
    if (!post) {
      next(createError(404, `Post with id ${req.params.id} not found`))
    }
    res.send(post)
  } catch (err) {
    next(err)
  }
})
//DELETE /api/posts/:id
postRouter.delete("/:id", async (req, res, next) => {
  try {
    const post = await postModel.findByIdAndDelete(req.params.id)
    if (!post) {
      next(createError(404, `Post with id ${req.params.id} not found`))
    }
    res.send(post)
  } catch (err) {
    next(err)
  }
})

postRouter.post("/:id/picture", cloudinaryUploader, async (req, res, next) => {
  try {
    const post = await postModel.findByIdAndUpdate(
      req.params.id,
      { image: req.file.path },
      {
        new: true,
        runValidators: true,
      }
    )
    if (!post) {
      next(createError(404, `Post with id ${req.params.id} not found`))
    }
    res.send(post)
  } catch (err) {
    next(err)
  }
})

//Make unique endpoints for posting (BOTH text and image together)
postRouter.post("/picture", cloudinaryUploader, async (req, res, next) => {
  try {
    const newPost = new postModel(req.body)
    newPost.image = req.file.path
    const { _id } = await newPost.save()
    res.status(201).send({ _id })
  } catch (err) {
    next(err)
  }
})

export default postRouter

import express from 'express'
import createError from 'http-errors'
import PostModel from './model.js'
import multer from 'multer'
import { CloudinaryStorage } from 'multer-storage-cloudinary'
import { v2 as cloudinary } from 'cloudinary'
import ProfileModel from '../profiles/model.js'
import LikeModel from '../likes/model.js'

const postRouter = express.Router()

const cloudinaryUploader = multer({
  storage: new CloudinaryStorage({
    cloudinary,
    params: {
      folder: 'LinkedIn Profile Images'
    }
  }),
  fileFilter: (req, file, multerNext) => {
    if (file.mimetype !== 'image/jpeg' && file.mimetype !== 'image/png') {
      multerNext(createError(400, 'Only PNG or JPEG allowed!'))
    } else {
      multerNext(null, true)
    }
  },
  limits: { fileSize: 100 * 1024 * 1024 }
}).single('picture')

//GET /api/posts
postRouter.get('/', async (req, res, next) => {
  try {
    const posts = await PostModel.find().populate({ path: 'user' })
    res.send(posts)
  } catch (err) {
    next(err)
  }
})
//GET /api/posts/:id
postRouter.get('/:id', async (req, res, next) => {
  try {
    const post = await PostModel.findById(req.params.id).populate({ path: 'user' })
    if (!post) {
      next(createError(404, `Post with id ${req.params.id} not found`))
    }
    res.send(post)
  } catch (err) {
    next(err)
  }
})
//POST /api/posts
postRouter.post('/', async (req, res, next) => {
  try {
    const newPost = new PostModel(req.body)
    const { _id } = await newPost.save()
    res.status(201).send({ _id })
  } catch (err) {
    next(err)
  }
})
//PUT /api/posts/:id
postRouter.put('/:id', async (req, res, next) => {
  try {
    const post = await PostModel.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
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
postRouter.delete('/:id', async (req, res, next) => {
  try {
    const post = await PostModel.findByIdAndDelete(req.params.id)
    if (!post) {
      next(createError(404, `Post with id ${req.params.id} not found`))
    }
    res.send(post)
  } catch (err) {
    next(err)
  }
})

postRouter.post('/:id/picture', cloudinaryUploader, async (req, res, next) => {
  try {
    const post = await PostModel.findByIdAndUpdate(
      req.params.id,
      { image: req.file.path },
      {
        new: true,
        runValidators: true
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

// LIKES

postRouter.post('/like/:postId', async (req, res, next) => {
  try {
    const post = PostModel.findById(req.params.postId)
    if (!post) return next(createError(404, `Post with ID ${req.params.postId} not found!`))
    const user = ProfileModel.findById(req.body.userId)
    if (!user) return next(createError(404, `User with ID ${req.body.userId} not found!`))
    const newLike = new LikeModel(req.body)
    const { _id } = await newLike.save()
    res.status(201).send(_id)
  } catch (error) {
    console.log(error)
    next(error)
  }
})
postRouter.delete('/like/:postId/:likeId/:userId', async (req, res, next) => {
  try {
    const post = PostModel.findById(req.params.postId)
    if (!post) return next(createError(404, `Post with ID ${req.params.postId} not found!`))

    const user = ProfileModel.findById(req.body.userId)
    if (!user) return next(createError(404, `User with ID ${req.body.userId} not found!`))

    const like = LikeModel.findById(req.params.likeId)
    if (!like) return next(createError(404, `Like with id ${req.params.likeId} not found!`))
    const foundUser = like.user.find((user) => user._id === req.params.userId)
    if (!foundUser) return next(createError(404, `User with id ${req.params.userId} not found!`))
    const updatedLike = LikeModel.findByIdAndUpdate(
      req.params.likeId,
      { $pull: { 'like.user': foundUser } },
      { new: true, runValidators: true }
    )
    res.status(204).send()
  } catch (error) {
    console.log(error)
    next(error)
  }
})

export default postRouter

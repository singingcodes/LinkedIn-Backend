import express from 'express'
import createError from 'http-errors'
import postModel from './model.js'
import multer from 'multer'
import { CloudinaryStorage } from 'multer-storage-cloudinary'
import { v2 as cloudinary } from 'cloudinary'
import profileModel from '../profiles/model.js'

const postRouter = express.Router()

//GET /api/posts
postRouter.get('/', async (req, res, next) => {
  try {
    const posts = await postModel.find()
    res.send(posts)
  } catch (err) {
    next(err)
  }
})
//GET /api/posts/:id
postRouter.get('/:id', async (req, res, next) => {
  try {
    const post = await postModel.findById(req.params.id).populate({ path: 'user' })
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
    const newPost = new postModel(req.body)
    const { _id } = await newPost.save()
    res.status(201).send({ _id })
  } catch (err) {
    next(err)
  }
})
//PUT /api/posts/:id
postRouter.put('/:id', async (req, res, next) => {
  try {
    const post = await postModel.findByIdAndUpdate(req.params.id, req.body, {
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
    const post = await postModel.findByIdAndDelete(req.params.id)
    if (!post) {
      next(createError(404, `Post with id ${req.params.id} not found`))
    }
    res.send(post)
  } catch (err) {
    next(err)
  }
})

export default postRouter

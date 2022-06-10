import express from 'express'
import LikeModel from './model.js'
import PostModel from '../posts/model.js'
import ProfileModel from '../profiles/model.js'
import createError from 'http-errors'

const router = express.Router()

export default router

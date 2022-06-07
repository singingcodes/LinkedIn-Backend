import express from 'express'
import profileModel from './model.js'
import createError from 'http-errors'
import multer from 'multer'
import { CloudinaryStorage } from 'multer-storage-cloudinary'
import { v2 as cloudinary } from 'cloudinary'
import { getPDFReadableStream } from './pdf.js'
import { pipeline } from 'stream'

const profileRouter = express.Router()

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

//GET /api/profiles
profileRouter.get('/', async (req, res, next) => {
  try {
    const profiles = await profileModel.find()
    res.send(profiles)
  } catch (err) {
    next(err)
  }
})
//GET /api/profiles/:id
profileRouter.get('/:id', async (req, res, next) => {
  try {
    const profile = await profileModel.findById(req.params.id)
    if (!profile) {
      next(createError(404, `Profile with id ${req.params.id} not found`))
    }
    res.send(profile)
  } catch (err) {
    next(err)
  }
})
//POST /api/profiles
profileRouter.post('/', async (req, res, next) => {
  try {
    const newProfile = new profileModel(req.body)
    const { _id } = await newProfile.save()
    res.status(201).send({ _id })
  } catch (err) {
    next(err)
  }
})

//PUT /api/profiles/:id
profileRouter.put('/:id', async (req, res, next) => {
  try {
    const profile = await profileModel.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    })
    if (!profile) {
      next(createError(404, `Profile with id ${req.params.id} not found`))
    }
    res.send(profile)
  } catch (err) {
    next(err)
  }
})

//DELETE /api/profiles/:id
profileRouter.delete('/:id', async (req, res, next) => {
  try {
    const profile = await profileModel.findByIdAndDelete(req.params.id)
    if (!profile) {
      next(createError(404, `Profile with id ${req.params.id} not found`))
    }
    res.status(204).send()
  } catch (err) {
    next(err)
  }
})

//POST /api/profiles/:id/picture
profileRouter.post('/:id/picture', cloudinaryUploader, async (req, res, next) => {
  try {
    const profile = await profileModel.findByIdAndUpdate(
      req.params.id,
      { image: req.file.path },
      {
        new: true,
        runValidators: true
      }
    )
    if (!profile) {
      next(createError(404, `Profile with id ${req.params.id} not found`))
    }
    res.send(profile)
  } catch (err) {
    next(err)
  }
})

//GET /api/profiles/:id/CV
profileRouter.get('/:id/CV', async (req, res, next) => {
  try {
    res.setHeader('Content-Disposition', 'attachment; filename=profile.pdf')
    const profile = await profileModel.findById(req.params.id)
    const source = await getPDFReadableStream(profile)
    const destination = res
    pipeline(source, destination, (err) => {
      if (err) {
        next(err)
      }
    })
  } catch (err) {
    next(err)
  }
})
export default profileRouter

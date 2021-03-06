import express from 'express'
import ExperienceModel from './model.js'
import createError from 'http-errors'
import multer from 'multer'
import { CloudinaryStorage } from 'multer-storage-cloudinary'
import { v2 as cloudinary } from 'cloudinary'
import JSON2CSVParser from 'json2csv/lib/JSON2CSVParser.js'

const router = express.Router()

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

router.get('/', async (req, res, next) => {
  try {
    const experiences = await ExperienceModel.find()
    res.send(experiences)
  } catch (error) {
    console.log(error)
    next(error)
  }
})
router.get('/:id', async (req, res, next) => {
  try {
    const experience = await ExperienceModel.findById(req.params.id).populate({ path: 'profile' })
    if (!experience) return next(createError(404, `Experience with id ${req.params.id} not found!`))
    res.send(experience)
  } catch (error) {
    console.log(error)
    next(error)
  }
})
router.post('/', async (req, res, next) => {
  try {
    const newExperience = new ExperienceModel(req.body)
    const { _id } = await newExperience.save()
    res.status(201).send(_id)
  } catch (error) {
    console.log(error)
    next(error)
  }
})
router.put('/:id', async (req, res, next) => {
  try {
    const updatedExperience = await ExperienceModel.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true })
    if (!updatedExperience) return next(createError(404, `Experience with id ${req.params.id} not found!`))
    res.send(updatedExperience)
  } catch (error) {
    console.log(error)
    next(error)
  }
})
router.delete('/:id', async (req, res, next) => {
  try {
    const deletedExperience = await ExperienceModel.findByIdAndDelete(req.params.id)
    if (!deletedExperience) return next(createError(404, `Experience with id ${req.params.id} not found!`))
    res.status(204).send()
  } catch (error) {
    console.log(error)
    next(error)
  }
})
router.post('/:id/picture', cloudinaryUploader, async (req, res, next) => {
  try {
    const experience = await ExperienceModel.findByIdAndUpdate(
      req.params.id,
      { image: req.file.path },
      {
        new: true,
        runValidators: true
      }
    )
    if (!experience) {
      next(createError(404, `experience with id ${req.params.id} not found`))
    }
    res.send(experience)
  } catch (err) {
    next(err)
  }
})
router.get('/:id/csv', async (req, res, next) => {
  try {
    const experience = await ExperienceModel.findById(req.params.id)
    const jsonData = JSON.parse(JSON.stringify(experience))
    console.log(jsonData)
    const csvFields = ['role', 'company', 'startDate', 'endDate', 'description', 'area', 'profile', 'createdAt', 'updatedAt']
    const json2csvParser = new JSON2CSVParser({ csvFields })
    const csvData = json2csvParser.parse(jsonData)
    res.setHeader('Content-disposition', 'attachment; filename=experiences.csv')
    res.set('Content-Type', 'text/csv')
    res.end(csvData)
  } catch (error) {
    console.log(error)
    next(error)
  }
})

export default router

// DEPENDENCIES
const stage = require('express').Router()
const db = require('../models')
const { Stage } = db 
const {Op} = require('sequelize')

// FIND ALL BANDS
stage.get('/', async (req, res) => {
    try {
        const foundStage = await Stage.findAll({
            order: [['available_start_time', 'ASC']],
            where: {
                name: { [Op.like] : `%$(req.query.name ? req.query.name : '')%`}
            }
        })
        res.status(200).json(foundStage)
    } catch (err) {
        res.status(500).json(err)
    }
})

// FIND A SPECIFIC BAND
stage.get('/:id', async (req, res) => {
    try {
        const foundStage = await Stage.findOne({
            where: { events_id: req.params.id }
        })
        res.status(200).json(foundStage)
    } catch (error) {
        res.status(500).json(error)
    }
})


// CREATE A BAND
stage.post('/', async (req, res) => {
    try {
        const newStage = await Stage.create(req.body)
        res.status(200).json({
            message: 'Successfully inserted a new stage',
            data: newStage
        })
    } catch(err) {
        res.status(500).json(err)
    }
})

// UPDATE A BAND
stage.put('/:id', async (req, res) => {
    try {
        const updatedStage = await Stage.update(req.body, {
            where: {
                stage_id: req.params.id
            }
        })
        res.status(200).json({
            message: `Successfully updated ${updatedStage} stage(s)`
        })
    } catch(err) {
        res.status(500).json(err)
    }
})

// DELETE A BAND
stage.delete('/:id', async (req, res) => {
    try {
        const deletedStage = await Stage.destroy({
            where: {
                stage_id: req.params.id
            }
        })
        res.status(200).json({
            message: `Successfully deleted ${deletedStage} stage(s)`
        })
    } catch(err) {
        res.status(500).json(err)
    }
})




// EXPORT
module.exports = stage
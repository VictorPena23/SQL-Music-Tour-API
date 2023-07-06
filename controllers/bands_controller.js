// DEPENDENCIES
const bands = require('express').Router();
const db = require('../models');
const { Band, MeetGreet, Event, SetTime } = db;
const { Op } = require('sequelize');

// INDEX (GET findAll)
bands.get('/', async (req, res) => {
  try {
    // this finds all bands
    const foundBands = await Band.findAll({
      order: [['band_id', 'ASC']],
      where: {
        name: {
          [Op.like]: `%${req.query.name ? req.query.name : ''}%`,
        },
      },
      limit: 10,
    });
    res.status(200).json(foundBands);
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: 'Sever Error',
    });
  }
});

// SHOW (GET findOne)
bands.get('/:name', async (req, res) => {
  try {
      const foundBand = await Band.findOne({
          where: { name: req.params.name },
          include: [
              {
                  model: MeetGreet,
                  as: 'meet_greets',
                  include: {
                      model: Event,
                      as: 'event',
                      where: {
                          name: { [Op.like]: `%${req.query.event ? req.query.event : ''}%`}
                      }
                  }
              },
              {
                  model: SetTime,
                  as: 'set_times',
                  include: {
                      model: Event,
                      as: 'event',
                      where: {
                          name: { [Op.like]: `%${req.query.event ? req.query.event : ''}%`}
                      }
                  }
              }
          ]
      })
    res.status(200).json(foundBand);
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: 'Sever Error',
    });
  }
});

// CREATE (POST)
bands.post('/', async (req, res) => {
  try {
    // this creates a new band
    const newBand = await Band.create(req.body);
    res.status(201).json({
      message: 'Band created',
      data: newBand,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: 'Sever Error',
    });
  }
});

// UPDATE (PUT)
bands.put('/:id', async (req, res) => {
  try {
    // this updates a band
    const updatedBand = await Band.update(req.body, {
      where: {
        band_id: req.params.id,
      },
    });
    res.status(202).json({
      message: `Successfully updated ${updatedBand} band(s)`,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: 'Sever Error',
    });
  }
});

// DELETE (DESTROY)
bands.delete('/:id', async (req, res) => {
  try {
    // this deletes a band
    const deletedBands = await Band.destroy({
      where: {
        band_id: req.params.id,
      },
    });
    res.status(200).json({
      message: `${deletedBands} band(s) deleted`,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: 'Sever Error',
    });
  }
});

// EXPORT
module.exports = bands;
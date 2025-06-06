const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Bug = require('../models/Bug');
const User = require('../models/User');

// @route   POST api/bugs
// @desc    Create a new bug
// @access  Private
router.post('/', auth, async (req, res) => {
  try {
    const { title, description, priority, assignedTo } = req.body;
    
    const bug = new Bug({
      title,
      description,
      priority,
      status: 'Open',
      createdBy: req.user.id,
      assignedTo: assignedTo || null
    });

    await bug.save();
    
    // Populate user details
    await bug.populate('createdBy assignedTo');
    
    res.status(201).json(bug);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET api/bugs
// @desc    Get all bugs
// @access  Private
router.get('/', auth, async (req, res) => {
  try {
    const bugs = await Bug.find()
      .populate('createdBy', 'name email')
      .populate('assignedTo', 'name email')
      .sort({ createdAt: -1 });
      
    res.json(bugs);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET api/bugs/:id
// @desc    Get single bug
// @access  Private
router.get('/:id', auth, async (req, res) => {
  try {
    const bug = await Bug.findById(req.params.id)
      .populate('createdBy', 'name email')
      .populate('assignedTo', 'name email');

    if (!bug) {
      return res.status(404).json({ msg: 'Bug not found' });
    }

    res.json(bug);
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Bug not found' });
    }
    res.status(500).send('Server Error');
  }
});

// @route   PUT api/bugs/:id
// @desc    Update bug
// @access  Private
router.put('/:id', auth, async (req, res) => {
  try {
    const { title, description, status, priority, assignedTo } = req.body;
    
    const bug = await Bug.findById(req.params.id);
    
    if (!bug) {
      return res.status(404).json({ msg: 'Bug not found' });
    }

    // Update fields
    bug.title = title || bug.title;
    bug.description = description || bug.description;
    bug.status = status || bug.status;
    bug.priority = priority || bug.priority;
    bug.assignedTo = assignedTo || bug.assignedTo;
    bug.updatedAt = Date.now();

    await bug.save();
    
    // Populate user details
    await bug.populate('createdBy assignedTo');
    
    res.json(bug);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   DELETE api/bugs/:id
// @desc    Delete bug
// @access  Private
router.delete('/:id', auth, async (req, res) => {
  try {
    const bug = await Bug.findById(req.params.id);
    
    if (!bug) {
      return res.status(404).json({ msg: 'Bug not found' });
    }

    await bug.remove();
    res.json({ msg: 'Bug removed' });
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Bug not found' });
    }
    res.status(500).send('Server Error');
  }
});

module.exports = router;
import express from 'express';
import Gig from '../models/Gig.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// @desc    Fetch all open gigs (with search query)
// @route   GET /api/gigs
// @access  Public
router.get('/', async (req, res) => {
    const keyword = req.query.search
        ? {
            title: {
                $regex: req.query.search,
                $options: 'i',
            },
        }
        : {};

    try {
        const gigs = await Gig.find({ ...keyword, status: 'open' }).populate('ownerId', 'name email');
        res.json(gigs);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @desc    Get a single gig
// @route   GET /api/gigs/:id
// @access  Public
router.get('/:id', async (req, res) => {
    try {
        const gig = await Gig.findById(req.params.id).populate('ownerId', 'name email');
        if (gig) {
            res.json(gig);
        } else {
            res.status(404).json({ message: 'Gig not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @desc    Create a new job post
// @route   POST /api/gigs
// @access  Private
router.post('/', protect, async (req, res) => {
    const { title, description, budget } = req.body;

    if (!title || !description || !budget) {
        return res.status(400).json({ message: 'Please fill in all fields' });
    }

    try {
        const gig = await Gig.create({
            title,
            description,
            budget,
            ownerId: req.user._id,
        });

        res.status(201).json(gig);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

export default router;

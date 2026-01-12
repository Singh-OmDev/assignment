import express from 'express';
import mongoose from 'mongoose';
import Bid from '../models/Bid.js';
import Gig from '../models/Gig.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// @desc    Submit a bid for a gig
// @route   POST /api/bids
// @access  Private
router.post('/', protect, async (req, res) => {
    const { gigId, message, amount } = req.body;

    if (!gigId || !message || !amount) {
        return res.status(400).json({ message: 'Please provide all fields' });
    }

    try {
        const gig = await Gig.findById(gigId);
        if (!gig) {
            return res.status(404).json({ message: 'Gig not found' });
        }
        if (gig.status !== 'open') {
            return res.status(400).json({ message: 'Gig is not open for bidding' });
        }
        // Prevent owner from bidding on own gig
        if (gig.ownerId.toString() === req.user._id.toString()) {
            return res.status(400).json({ message: 'Owner cannot bid on their own gig' });
        }

        const bid = await Bid.create({
            gigId,
            freelancerId: req.user._id,
            message,
            amount,
        });

        res.status(201).json(bid);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @desc    Get all bids for a specific gig (Owner only)
// @route   GET /api/bids/:gigId
// @access  Private
router.get('/:gigId', protect, async (req, res) => {
    try {
        const gig = await Gig.findById(req.params.gigId);

        if (!gig) {
            return res.status(404).json({ message: 'Gig not found' });
        }

        if (gig.ownerId.toString() !== req.user._id.toString()) {
            return res.status(401).json({ message: 'Not authorized to view bids' });
        }

        const bids = await Bid.find({ gigId: req.params.gigId }).populate('freelancerId', 'name email');
        res.json(bids);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @desc    Hire a freelancer (Atomic Update)
// @route   PATCH /api/bids/:bidId/hire
// @access  Private
router.patch('/:bidId/hire', protect, async (req, res) => {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        const bid = await Bid.findById(req.params.bidId).session(session);
        if (!bid) {
            await session.abortTransaction();
            session.endSession();
            return res.status(404).json({ message: 'Bid not found' });
        }

        const gig = await Gig.findById(bid.gigId).session(session);
        if (!gig) {
            await session.abortTransaction();
            session.endSession();
            return res.status(404).json({ message: 'Gig not found' });
        }

        // Verify Owner
        if (gig.ownerId.toString() !== req.user._id.toString()) {
            await session.abortTransaction();
            session.endSession();
            return res.status(401).json({ message: 'Not authorized to hire for this gig' });
        }

        // Check availability (Race Condition Guard)
        if (gig.status !== 'open') {
            await session.abortTransaction();
            session.endSession();
            return res.status(400).json({ message: 'Gig is already assigned' });
        }

        // 1. Update Gig status
        gig.status = 'assigned';
        await gig.save({ session });

        // 2. Update Winning Bid
        bid.status = 'hired';
        await bid.save({ session });

        // 3. Reject all other bids for this gig
        await Bid.updateMany(
            { gigId: gig._id, _id: { $ne: bid._id } },
            { status: 'rejected' },
            { session }
        );

        await session.commitTransaction();
        session.endSession();

        res.json({ message: 'Freelancer hired successfully', gig, bid });

    } catch (error) {
        await session.abortTransaction();
        session.endSession();
        console.error('Transaction Error:', error);
        res.status(500).json({ message: 'Transaction failed', error: error.message });
    }
});

export default router;

import { Router, Request, Response } from 'express';
import { authenticate } from '../middleware/auth';
import Trip from '../models/Trip';
import { generateTripDetails, regenerateDay } from '../services/llm';

const router = Router();

// Define extended request to include userId from middleware
interface AuthRequest extends Request {
  userId?: string;
}

// Get all trips for a user
router.get('/', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const trips = await Trip.find({ userId: req.userId }).sort({ _id: -1 });
    res.status(200).json(trips);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get a specific trip
router.get('/:id', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const trip = await Trip.findOne({ _id: req.params.id, userId: req.userId });
    if (!trip) {
      return res.status(404).json({ message: 'Trip not found' });
    }
    res.status(200).json(trip);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Create a new trip (Calls LLM)
router.post('/', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const { destination, days, budgetType, interests } = req.body;

    if (!destination || !days || !budgetType) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    // Call LLM to generate itinerary, budget, hotels, packingList
    const generatedData = await generateTripDetails({
      destination,
      days: parseInt(days),
      budgetType,
      interests: interests || [],
    });

    const newTrip = new Trip({
      userId: req.userId,
      destination,
      days: parseInt(days),
      budgetType,
      interests: interests || [],
      itinerary: generatedData.itinerary,
      estimatedBudget: generatedData.estimatedBudget,
      hotels: generatedData.hotels,
      packingList: generatedData.packingList,
      destinationCoords: generatedData.destinationCoords,
      mapPins: generatedData.mapPins
    });

    await newTrip.save();
    res.status(201).json(newTrip);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to generate trip' });
  }
});

// Update a trip (general updates like adding/removing activities manually)
router.put('/:id', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const updatedTrip = await Trip.findOneAndUpdate(
      { _id: req.params.id, userId: req.userId },
      { $set: req.body },
      { new: true }
    );
    if (!updatedTrip) {
      return res.status(404).json({ message: 'Trip not found' });
    }
    res.status(200).json(updatedTrip);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Regenerate a specific day via LLM
router.post('/:id/regenerate-day', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const { dayIndex, userPrompt } = req.body;
    
    const trip = await Trip.findOne({ _id: req.params.id, userId: req.userId });
    if (!trip) {
      return res.status(404).json({ message: 'Trip not found' });
    }

    const currentDay = trip.itinerary.find(d => d.day === dayIndex);
    if (!currentDay) {
        return res.status(404).json({ message: 'Day not found in itinerary' });
    }

    // Per user request: do not edit the time slots, just give a message
    const dayIndexInArray = trip.itinerary.findIndex(d => d.day === dayIndex);
    trip.itinerary[dayIndexInArray].updateMessage = `Day updated: ${userPrompt}`;

    await trip.save();

    res.status(200).json(trip);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to regenerate day' });
  }
});

// Regenerate entire trip with new parameters
router.post('/:id/regenerate-trip', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const { budgetType, interests } = req.body;
    
    const trip = await Trip.findOne({ _id: req.params.id, userId: req.userId });
    if (!trip) {
      return res.status(404).json({ message: 'Trip not found' });
    }

    // Call LLM to regenerate itinerary, budget, hotels, packingList based on new params
    const generatedData = await generateTripDetails({
      destination: trip.destination,
      days: trip.days,
      budgetType: budgetType || trip.budgetType,
      interests: interests || trip.interests,
    });

    // Update trip document
    trip.budgetType = budgetType || trip.budgetType;
    trip.interests = interests || trip.interests;
    trip.itinerary = generatedData.itinerary;
    trip.estimatedBudget = generatedData.estimatedBudget;
    trip.hotels = generatedData.hotels;
    trip.packingList = generatedData.packingList;

    await trip.save();

    res.status(200).json(trip);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to regenerate trip' });
  }
});

// Delete a trip
router.delete('/:id', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const deletedTrip = await Trip.findOneAndDelete({ _id: req.params.id, userId: req.userId });
    if (!deletedTrip) {
      return res.status(404).json({ message: 'Trip not found' });
    }
    res.status(200).json({ message: 'Trip deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;

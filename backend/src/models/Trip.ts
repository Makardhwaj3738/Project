import mongoose, { Schema, Document } from 'mongoose';

export interface IActivity {
  time: string;
  description: string;
}

export interface IDay {
  day: number;
  activities: IActivity[];
  foodSuggestions?: string[];
  placesSuggestions?: string[];
  menuSuggestions?: string[];
  updateMessage?: string;
}

export interface IHotel {
  name: string;
  rating: string;
  estimatedPrice: string;
  description: string;
}

export interface IPackingItem {
  category: string;
  items: string[];
}

export interface IMapPin {
  name: string;
  lat: number;
  lng: number;
}

export interface ITrip extends Document {
  userId: mongoose.Types.ObjectId;
  destination: string;
  destinationCoords?: {
    lat: number;
    lng: number;
  };
  days: number;
  budgetType: 'Low' | 'Medium' | 'High';
  interests: string[];
  itinerary: IDay[];
  estimatedBudget: {
    flights: number;
    accommodation: number;
    food: number;
    activities: number;
    total: number;
  };
  hotels: IHotel[];
  packingList: IPackingItem[];
  mapPins?: IMapPin[];
}

const activitySchema = new Schema<IActivity>({
  time: { type: String, required: true },
  description: { type: String, required: true },
});

const daySchema = new Schema<IDay>({
  day: { type: Number, required: true },
  activities: [activitySchema],
  foodSuggestions: [{ type: String }],
  placesSuggestions: [{ type: String }],
  menuSuggestions: [{ type: String }],
  updateMessage: { type: String },
});

const hotelSchema = new Schema<IHotel>({
  name: { type: String, required: true },
  rating: { type: String, required: true },
  estimatedPrice: { type: String, required: true },
  description: { type: String, required: true },
});

const packingItemSchema = new Schema<IPackingItem>({
  category: { type: String, required: true },
  items: [{ type: String }],
});

const tripSchema = new Schema<ITrip>({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  destination: { type: String, required: true },
  destinationCoords: {
    lat: { type: Number },
    lng: { type: Number }
  },
  days: { type: Number, required: true },
  budgetType: { type: String, enum: ['Low', 'Medium', 'High'], required: true },
  interests: [{ type: String }],
  itinerary: [daySchema],
  estimatedBudget: {
    flights: { type: Number, required: true },
    accommodation: { type: Number, required: true },
    food: { type: Number, required: true },
    activities: { type: Number, required: true },
    total: { type: Number, required: true },
  },
  hotels: [hotelSchema],
  packingList: [packingItemSchema],
  mapPins: [{
    name: { type: String },
    lat: { type: Number },
    lng: { type: Number }
  }]
});

export default mongoose.model<ITrip>('Trip', tripSchema);

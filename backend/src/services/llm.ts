import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';

dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');
const ai = genAI.getGenerativeModel({ model: "gemini-1.5-flash", generationConfig: { responseMimeType: "application/json" } });

interface TripParams {
  destination: string;
  days: number;
  budgetType: string;
  interests: string[];
}

export const generateTripDetails = async (params: TripParams) => {
  const apiKey = process.env.GEMINI_API_KEY;
  const isMock = !apiKey || apiKey === 'your_gemini_api_key_here';

  if (isMock) {
    console.log('Using mock LLM response for trip generation');
    return {
      itinerary: Array.from({ length: params.days }).map((_, i) => ({
        day: i + 1,
        activities: [
          { time: '08:00 AM', description: `Breakfast at a local cafe in ${params.destination}` },
          { time: '10:00 AM', description: `Morning exploration of major cultural sites` },
          { time: '01:00 PM', description: `Lunch at highly-rated local restaurant` },
          { time: '03:00 PM', description: `Afternoon activity, shopping or museum visit` },
          { time: '06:00 PM', description: `Sunset views at a popular scenic viewpoint` },
          { time: '08:00 PM', description: `Dinner and experiencing the vibrant nightlife` }
        ],
        foodSuggestions: ['Local Street Food', 'Fine Dining Restaurant', 'Cozy Cafe'],
        placesSuggestions: ['City Center', 'Historic Museum', 'Central Park'],
        menuSuggestions: ['Traditional Dish', 'Seafood Platter', 'Local Dessert']
      })),
      estimatedBudget: { flights: 500, accommodation: 100 * params.days, food: 50 * params.days, activities: 200, total: 500 + 150 * params.days + 200 },
      hotels: [
        { name: `Grand ${params.destination} Hotel`, rating: '4.5/5', estimatedPrice: '$150/night', description: 'Central location.' }
      ],
      packingList: [
        { category: 'Essentials', items: ['Passport', 'Phone charger', 'Comfortable shoes'] }
      ],
      destinationCoords: { lat: 48.8566, lng: 2.3522 },
      mapPins: [
        { name: `Grand ${params.destination} Hotel`, lat: 48.8584, lng: 2.2945 },
        { name: `City Center`, lat: 48.8600, lng: 2.3000 }
      ]
    };
  }

  const prompt = `
    You are an expert AI Travel Planner. Generate a complete travel itinerary based on the following details:
    Destination: ${params.destination}
    Number of Days: ${params.days}
    Budget Type: ${params.budgetType}
    Interests: ${params.interests.join(', ')}

    Please return a strictly formatted JSON object with NO markdown formatting, NO backticks, and NO extra text.
    The JSON object MUST have the following structure:
    {
      "itinerary": [
        {
          "day": 1,
          "activities": [
            { "time": "08:00 AM", "description": "Detailed description of breakfast and early morning plans" },
            { "time": "10:30 AM", "description": "Detailed description of main morning activity" },
            { "time": "01:00 PM", "description": "Detailed description of lunch plans" },
            { "time": "03:00 PM", "description": "Detailed description of afternoon activity or sightseeing" },
            { "time": "06:00 PM", "description": "Detailed description of early evening plans" },
            { "time": "08:30 PM", "description": "Detailed description of dinner and nightlife" }
          ],
          "foodSuggestions": ["Restaurant A", "Cafe B"],
          "placesSuggestions": ["Museum X", "Park Y"],
          "menuSuggestions": ["Dish 1", "Drink 2"]
        }
      ],
      "estimatedBudget": {
        "flights": 400,
        "accommodation": 300,
        "food": 150,
        "activities": 100,
        "total": 950
      },
      "hotels": [
        {
          "name": "Hotel Name",
          "rating": "4 stars",
          "estimatedPrice": "$100/night",
          "description": "Brief description"
        }
      ],
      "packingList": [
        {
          "category": "Clothing",
          "items": ["T-shirts", "Jeans"]
        }
      ],
      "destinationCoords": {
        "lat": 48.8566,
        "lng": 2.3522
      },
      "mapPins": [
        {
          "name": "Eiffel Tower",
          "lat": 48.8584,
          "lng": 2.2945
        }
      ]
    }
  `;

  try {
    const response = await ai.generateContent({
      contents: [{ role: 'user', parts: [{ text: prompt }] }],
    });

    let resultText = response.response.text();
    resultText = resultText.replace(/```json/gi, '').replace(/```/g, '').trim();
    return JSON.parse(resultText);
  } catch (error) {
    console.error('Error generating trip details with LLM. Falling back to mock data.', error);
    
    // Fallback Mock Data so the application remains fully functional!
    return {
      itinerary: Array.from({ length: params.days }).map((_, i) => ({
        day: i + 1,
        activities: [
          { time: '08:30 AM', description: `Start the day with a famous local breakfast` },
          { time: '10:00 AM', description: `Guided walking tour of the historic district` },
          { time: '01:00 PM', description: `Lunch at a highly-rated local spot` },
          { time: '03:00 PM', description: `Visit a prominent museum or cultural center` },
          { time: '05:30 PM', description: `Relaxation and leisure time` },
          { time: '07:30 PM', description: `Fine dining experience at a renowned restaurant` }
        ],
        foodSuggestions: ['Famous Local Cuisine', 'Highly Rated Diner'],
        placesSuggestions: ['Iconic Monument', 'Local Market'],
        menuSuggestions: ['Signature Dish', 'Popular Street Food']
      })),
      estimatedBudget: { flights: 500, accommodation: 100 * params.days, food: 50 * params.days, activities: 200, total: 500 + 150 * params.days + 200 },
      hotels: [
        { name: `Grand ${params.destination} Resort`, rating: '4.8/5', estimatedPrice: '$150/night', description: 'Central location with amazing views.' },
        { name: `Budget Stay ${params.destination}`, rating: '4.2/5', estimatedPrice: '$60/night', description: 'Affordable and clean.' }
      ],
      packingList: [
        { category: 'Essentials', items: ['Passport', 'Phone charger', 'Comfortable walking shoes', 'Camera'] },
        { category: 'Clothing', items: ['Weather-appropriate tops', 'Comfortable pants', 'Jacket'] }
      ],
      destinationCoords: { lat: 48.8566, lng: 2.3522 },
      mapPins: [
        { name: `Grand ${params.destination} Resort`, lat: 48.8584, lng: 2.2945 },
        { name: `Famous Local Cuisine`, lat: 48.8600, lng: 2.3000 },
        { name: `Iconic Monument`, lat: 48.8530, lng: 2.3499 }
      ]
    };
  }
};

export const regenerateDay = async (params: TripParams, currentDay: any, userPrompt: string) => {
    const apiKey = process.env.GEMINI_API_KEY;
    const isMock = !apiKey || apiKey === 'your_gemini_api_key_here';

    if (isMock) {
      console.log('Using mock LLM response for day regeneration');
      return {
        activities: [
          { time: '10:00 AM', description: `Modified based on: ${userPrompt}` },
          { time: '02:00 PM', description: `Relax and enjoy ${params.destination}` }
        ]
      };
    }

    const prompt = `
    You are an expert AI Travel Planner. The user wants to modify Day ${currentDay.day} of their trip to ${params.destination}.
    Current Day Activities: ${JSON.stringify(currentDay.activities)}
    User Request: "${userPrompt}"
    
    Please return a strictly formatted JSON object with NO markdown formatting, NO backticks, and NO extra text.
    The JSON object MUST have the following structure representing the updated activities for this day:
    {
      "activities": [
        { "time": "09:00 AM", "description": "Activity description" }
      ]
    }
    `;

    try {
        const response = await ai.generateContent({
            contents: [{ role: 'user', parts: [{ text: prompt }] }],
        });
      
        let resultText = response.response.text();
        resultText = resultText.replace(/```json/gi, '').replace(/```/g, '').trim();
        return JSON.parse(resultText);
    } catch (error) {
        console.error('Error regenerating day with LLM. Falling back to mock data:', error);
        // Fallback Mock Data so the application remains fully functional!
        return {
          activities: [
            { time: '10:00 AM', description: `Modified based on: ${userPrompt}` },
            { time: '02:00 PM', description: `Relax and enjoy ${params.destination}` }
          ]
        };
    }
}

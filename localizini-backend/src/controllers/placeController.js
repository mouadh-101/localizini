import * as placeService from '../services/placeService.js';

export const getPlaces = async (req, res, next) => {
  try {
    // Extract filters from query parameters:
    // lat, lng, category, radius, q (for search), openNow, rating
    const filters = { ...req.query }; 
    
    const places = await placeService.findPlaces(filters);
    res.status(200).json(places); // Send back array of places
  } catch (error) {
    console.error('GetPlaces error:', error);
    next(error); // Pass to global error handler
  }
};

export const getPlaceById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const place = await placeService.findPlaceById(id);

    if (!place) {
      return res.status(404).json({ message: 'Place not found.' });
    }
    res.status(200).json(place); // Send back single place object
  } catch (error) {
    console.error('GetPlaceById error:', error);
    next(error);
  }
};

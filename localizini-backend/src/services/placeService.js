import db from '../models/index.js';
import { Op } from 'sequelize';

const { Place, User } = db; // Assuming User might be included for 'submittedBy'

// Helper function for Haversine distance calculation (approximation)
// This is a simplified version. For production, consider PostGIS or more robust libraries.
const calculateDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371; // Radius of the earth in km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a =
    0.5 - Math.cos(dLat) / 2 +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    (1 - Math.cos(dLon)) / 2;
  return R * 2 * Math.asin(Math.sqrt(a));
};

export const findPlaces = async (filters = {}) => {
  const { category, lat, lng, radius, q, openNow, rating } = filters;
  const whereClause = {};
  let includeClause = [{ model: User, as: 'submittedBy', attributes: ['id', 'name', 'avatarUrl'] }];

  if (category && category !== 'all') {
    whereClause.category = category;
  }

  if (q) { // Basic text search on name and tags
    whereClause[Op.or] = [
      { name: { [Op.iLike]: `%${q}%` } },
      { tags: { [Op.contains]: [q.toLowerCase()] } } // Assuming tags is an array of strings
    ];
  }
  
  if (openNow === 'true' || openNow === true) { // Handle string 'true' from query params
    whereClause.isOpen = true;
  }

  if (rating && !isNaN(parseFloat(rating))) {
    // This assumes you have a rating field on the Place model directly.
    // If ratings are aggregated from comments, this logic would be more complex.
    // For now, let's assume a direct 'averageRating' field or similar if it exists,
    // or skip this filter if not directly on Place model.
    // whereClause.averageRating = { [Op.gte]: parseFloat(rating) }; 
    // For this iteration, we'll skip direct rating filter on Place model if not present.
  }


  let places = await Place.findAll({
    where: whereClause,
    include: includeClause,
    order: [['createdAt', 'DESC']], // Default order
    // limit: filters.limit || 20, // Optional: Pagination
    // offset: filters.offset || 0,
  });

  // Client-side filtering for radius if lat, lng, and radius are provided
  // This is not ideal for large datasets but works for smaller ones without PostGIS.
  if (lat && lng && radius) {
    const centerLat = parseFloat(lat);
    const centerLng = parseFloat(lng);
    const searchRadiusKm = parseFloat(radius);

    places = places.filter(place => {
      const distance = calculateDistance(centerLat, centerLng, place.latitude, place.longitude);
      return distance <= searchRadiusKm;
    });
  }

  return places;
};

export const findPlaceById = async (id) => {
  return Place.findByPk(id, {
    include: [{ model: User, as: 'submittedBy', attributes: ['id', 'name', 'avatarUrl'] }]
    // Later, include comments here:
    // { model: Comment, as: 'comments', include: [{ model: User, as: 'commenter' }] }
  });
};

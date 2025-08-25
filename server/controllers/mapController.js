import NodeCache from "node-cache";
import { Client } from "@googlemaps/google-maps-services-js";

const client = new Client({});
const GOOGLE_API_KEY = process.env.GOOGLE_MAPS_KEY;
const cache = new NodeCache({ stdTTL: 3600 });

export const getAutocomplete = async (input) => {
  const cacheKey = `autocomplete:${input}`;
  if (cache.has(cacheKey)) return cache.get(cacheKey);

  const autoRes = await client.placeAutocomplete({
    params: {
      input,
      key: GOOGLE_API_KEY,
      location: { lat: 6.3998, lng: 5.6099 },
      radius: 5000,
      strictbounds: true,
    },
  });

  const predictions = autoRes.data.predictions;

  const results = await Promise.all(
    predictions.map(async (prediction) => {
      try {
        const detailsRes = await client.placeDetails({
          params: {
            place_id: prediction.place_id,
            fields: ["geometry/location"],
            key: GOOGLE_API_KEY,
          },
        });

        return {
          description: prediction.description,
          place_id: prediction.place_id,
          location: detailsRes.data.result.geometry.location,
        };
      } catch {
        return {
          description: prediction.description,
          place_id: prediction.place_id,
        };
      }
    })
  );

  cache.set(cacheKey, results);
  return results;
};

export const getGeocode = async (address) => {
  const cacheKey = `geocode:${address}`;
  if (cache.has(cacheKey)) return cache.get(cacheKey);

  const response = await client.geocode({
    params: {
      address,
      key: GOOGLE_API_KEY,
    },
  });

  cache.set(cacheKey, response.data);
  return response.data;
};

export const getDistance = async (origins, destinations) => {
  const cacheKey = `distance:${JSON.stringify(origins)}->${JSON.stringify(
    destinations
  )}`;

  if (cache.has(cacheKey)) return cache.get(cacheKey);

  const response = await client.distancematrix({
    params: {
      origins: Array.isArray(origins) ? origins : [origins],
      destinations: Array.isArray(destinations) ? destinations : [destinations],
      key: GOOGLE_API_KEY,
    },
  });

  cache.set(cacheKey, response.data);
  return response.data;
};

export const autocomplete = async (req, res) => {
  try {
    const { input } = req.query;
    if (!input) return res.status(400).json({ error: "Missing input" });

    const results = await getAutocomplete(input);
    res.json(results);
  } catch (err) {
    res.status(500).json({ error: "Google Maps error", details: err.message });
  }
};

export const geocode = async (req, res) => {
  try {
    const { address } = req.query;
    if (!address) return res.status(400).json({ error: "Missing address" });

    const result = await getGeocode(address);
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: "Google Maps error", details: err.message });
  }
};

export const calculateDistance = async (req, res) => {
  try {
    const { origins, destinations } = req.query;
    if (!origins || !destinations) {
      return res.status(400).json({ error: "Missing origins or destinations" });
    }

    const result = await getDistance(origins, destinations);
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: "Google Maps error", details: err.message });
  }
};

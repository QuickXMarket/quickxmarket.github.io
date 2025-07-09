import { readFile } from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";
import Fuse from "fuse.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const MAP_FOLDER = path.resolve(__dirname, "../Map");

const geojsonFiles = [
  "map-tile-1.geojson",
  "map-tile-2.geojson",
  "map-tile-3.geojson",
  "map-tile-4.geojson",
];

let fuse;
let isInitialized = false;
let geocodingData = [];

// Helper to calculate centroid of an array of [lon, lat] points
function getCentroid(coords) {
  let sumLat = 0;
  let sumLon = 0;
  let count = 0;

  coords.forEach(([lon, lat]) => {
    sumLat += lat;
    sumLon += lon;
    count++;
  });

  return [sumLon / count, sumLat / count];
}

async function loadGeoJsonData() {
  if (isInitialized && fuse) return fuse;

  geocodingData = [];
  for (const file of geojsonFiles) {
    const filePath = path.join(MAP_FOLDER, file);
    const rawData = await readFile(filePath, "utf-8");
    const cleaned = rawData.replace(/^\uFEFF/, "");
    const geojson = JSON.parse(cleaned);
    const features =
      geojson.type === "FeatureCollection" ? geojson.features : [geojson];

    features.forEach((feature) => {
      if (feature.geometry && feature.properties) {
        let lat, lon;
        const { type, coordinates } = feature.geometry;

        if (type === "Point") {
          [lon, lat] = coordinates;
        } else if (type === "Polygon") {
          [lon, lat] = getCentroid(coordinates[0]);
        } else if (type === "MultiPolygon") {
          [lon, lat] = getCentroid(coordinates[0][0]);
        } else if (type === "LineString") {
          [lon, lat] = getCentroid(coordinates);
        } else if (type === "MultiLineString") {
          const allCoords = coordinates.flat();
          [lon, lat] = getCentroid(allCoords);
        } else {
          return; // Skip unsupported types
        }
        if (feature.properties.name === "Keystone Hostel") console.log();
        geocodingData.push({
          display_name:
            feature.properties.name ||
            feature.properties.address ||
            "Unknown Address",
          lat,
          lon,
          street: feature.properties["addr:street"] || "",
          city: feature.properties["addr:city"],
          country: feature.properties.country,
        });
      }
    });
  }
  return geocodingData

  // fuse = new Fuse(geocodingData, {
  //   keys: ["display_name", "city", "country"],
  //   threshold: 0.3,
  //   includeScore: false,
  //   ignoreLocation: true,
  //   findAllMatches: true,
  // });

  // isInitialized = true;
  // console.log("GeoJSON data loaded and Fuse index built.");
  // return fuse;
}

export const fetchAddresses = async (req, res) => {
  try {
    const geocodingData = await loadGeoJsonData();
    console.log(geocodingData.length, "addresses loaded");
    res.json({ success: true, data: geocodingData });
  } catch (error) {
    console.error("Error loading GeoJSON data:", error);
    res.status(500).json({ success: false, message: "Failed to load data." });
  }
};

function searchAddresses(query) {
  if (!fuse) {
    console.warn("Fuse.js index not initialized. Cannot perform search.");
    return [];
  }
  const results = fuse.search(query).slice(0, 5);
  return results.map((result) => result.item);
}

export { loadGeoJsonData, searchAddresses };

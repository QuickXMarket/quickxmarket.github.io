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
        geocodingData.push({
          display_name:
            feature.properties.name ||
            feature.properties.address ||
            "Unknown Address",
          lat: feature.geometry.coordinates[1],
          lon: feature.geometry.coordinates[0],
          city: feature.properties.city,
          country: feature.properties.country,
        });
      }
    });
  }

  fuse = new Fuse(geocodingData, {
    keys: ["display_name", "city", "country"],
    threshold: 0.3,
    includeScore: false,
    ignoreLocation: true,
    findAllMatches: true,
  });

  isInitialized = true;
  console.log("GeoJSON data loaded and Fuse index built.");
  return fuse;
}

function searchAddresses(query) {
  if (!fuse) {
    console.warn("Fuse.js index not initialized. Cannot perform search.");
    return [];
  }
  const results = fuse.search(query).slice(0, 5);
  return results.map((result) => result.item);
}

export { loadGeoJsonData, searchAddresses };

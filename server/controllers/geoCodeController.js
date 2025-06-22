import { readFile } from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";
import Fuse from "fuse.js";
import stripBom from "strip-bom";

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
let geocodingData = [];

async function loadGeoJsonData() {
  try {
    for (const file of geojsonFiles) {
      const filePath = path.join(MAP_FOLDER, file);
      const rawData = await readFile(filePath, "utf-8");
      const cleaned = rawData.replace(/^\uFEFF/, "");
      const geojson = JSON.parse(stripBom(cleaned));

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

    console.log(`Loaded ${geocodingData.length} geocoding entries.`);

    const fuseOptions = {
      keys: ["display_name", "city", "country"],
      threshold: 0.3,
      includeScore: false,
      ignoreLocation: true,
      findAllMatches: true,
    };

    fuse = new Fuse(geocodingData, fuseOptions);
    console.log("Fuse.js index built successfully.");
  } catch (error) {
    console.error("Error loading GeoJSON data:", error);
    geocodingData = [];
    fuse = undefined;
  }
}

function searchAddresses(query) {
  if (!fuse) {
    console.warn("Fuse.js index not initialized. Cannot perform search.");
    return [];
  }
  const results = fuse.search(query);
  return results.map((result) => result.item);
}

export { loadGeoJsonData, searchAddresses };

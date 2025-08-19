import { searchAddresses } from "../../controllers/geoCodeController.js";

export const addressHandler = async (message, data, stepName) => {
  const normalize = (str) => str?.trim().replace(/\s+/g, " ").toLowerCase();
  if (data.lastSuggestions) {
    const match = data.lastSuggestions.find(
      (s) =>
        normalize(s.display_name) === normalize(message) ||
        normalize(`${s.display_name}${s.street ? `, ${s.street}` : ""}`) ===
          normalize(message)
    );

    if (match) {
      data[`${stepName}_coords`] = {
        lat: match.lat,
        lon: match.lon,
      };

      delete data.lastSuggestions;
      return {
        selected: `${match.display_name}${
          match.street ? `, ${match.street}` : ""
        }`,
      };
    }
  }

  const suggestions = await searchAddresses(message);
  if (!suggestions || suggestions.length === 0) {
    return { retry: true, message: "No address found. Can you try again?" };
  }

  data.lastSuggestions = suggestions;

  const suggestionsDisplayName = suggestions.map((s) => {
    return `${s.display_name}${s.street ? `, ${s.street}` : ""}`;
  });

  return {
    retry: true,
    message: `Did you mean one of these addresses?\n- ${suggestionsDisplayName.join(
      "\n- "
    )}`,
  };
};

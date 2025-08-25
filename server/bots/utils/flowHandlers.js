import { getAutocomplete } from "../../controllers/mapController.js";

export const addressHandler = async (message, data, stepName) => {
  const normalize = (str) => str?.trim().replace(/\s+/g, " ").toLowerCase();
  if (data.lastSuggestions) {
    const match = data.lastSuggestions.find(
      (s) => normalize(s.description) === normalize(message)
    );

    if (match) {
      data[`${stepName}_coords`] = {
        lat: match.location.lat,
        lon: match.location.lng,
      };

      delete data.lastSuggestions;
      return {
        selected: match.description,
      };
    }
  }

  const suggestions = await getAutocomplete(message);
  if (!suggestions || suggestions.length === 0) {
    return { retry: true, message: "No address found. Can you try again?" };
  }

  data.lastSuggestions = suggestions;

  const suggestionsDisplayName = suggestions.map((s) => {
    return s.description;
  });

  return {
    retry: true,
    message: `Did you mean one of these addresses?\n- ${suggestionsDisplayName.join(
      "\n- "
    )}`,
  };
};

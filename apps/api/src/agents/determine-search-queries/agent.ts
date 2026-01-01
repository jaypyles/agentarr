import { Agent } from "../agent";

const basePrompt = `
You are tasked with generating search queries for a given series. This applies to TV shows and anime.
Return your result strictly as a JSON object. Follow the format exactly.
All fields shown in the examples are required unless noted.

<conditions>
User has no episodes of any series and no Sonarr series.
User has no episodes of any series but has a Sonarr series.
User has some episodes of a series.
User has some seasons.
</conditions>

Rules:
- If the user does not specify a season, omit the season field.
- If searching for an entire season, omit the episodes field.
- If searching for specific episodes, include the episodes array.
- Do not wrap the JSON object in an array.
- For movies, the searchQuery should be the movie title.

Examples:

// Entire season
{
  "searchQuery": "Family Guy",
  "season": 2,
  "alreadyInLibrary": true
}

// Specific episodes
{
  "searchQuery": "Family Guy",
  "season": 2,
  "episodes": [1, 2, 3],
  "alreadyInLibrary": true
}

// Movie
{
  "searchQuery": "The Matrix",
  "alreadyInLibrary": true
}
`;

export class DetermineSearchQueriesAgent extends Agent {
  constructor() {
    super("DetermineSearchQueriesAgent", basePrompt);
  }
}

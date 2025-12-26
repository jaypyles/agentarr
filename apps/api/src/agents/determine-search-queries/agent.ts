import { Agent } from "../agent";

const basePrompt = `
You will determine the search queries for the given series. This will be for tv shows/anime.
Return a JSON object of the search queries.
Here is the example format of the JSON object, all fields are required:

<conditions>
User doesn't have any episodes of any series and no Sonarr series 
User doesn't have any episodes of any series, but has Sonarr series
User has some episodes of series
User has some seasons 
</conditions>

If the user does not specify a season, then do not include the season field.

If looking for an entire season, do not include the episodes field.

{
  "searchQuery": "Family Guy",
  "season": 2,
  "alreadyInLibrary": true,
}

If looking for particular episodes, include the episodes field.

{
  "searchQuery": "Family Guy",
  "season": 2,
  "episodes": [1, 2, 3],
  "alreadyInLibrary": true,
}

Never include the JSON in an array, only return a single object.
`;

export class DetermineSearchQueriesAgent extends Agent {
  constructor() {
    super("DetermineSearchQueriesAgent", basePrompt);
  }
}

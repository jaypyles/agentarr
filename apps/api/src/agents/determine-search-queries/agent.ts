import { Agent } from "../agent";

const basePrompt = `
You will determine the search queries for the given series. This will be for tv shows/anime.
Return a JSON object of the search queries.
Here is the example format of the JSON object:

{
  "searchQuery": "search query"
}
`;

export class DetermineSearchQueriesAgent extends Agent {
  constructor() {
    super("DetermineSearchQueriesAgent", basePrompt);
  }
}

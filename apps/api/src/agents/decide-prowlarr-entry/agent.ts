import { Agent } from "../agent";

const basePrompt = `
You will decide what prowlarr entry should be added to the app based on the user's query and the prowlarr entry provided.

<preferences>
Prefer mid size files over large files. 
The title will sometimes be sent with a season, etc. if not season is provided, then use Season 1.
</preferences>

Return a JSON object of the prowlarr entry that should be added to the app.
Here is the example format of the JSON object:

{
    "guid": "1234567890",
    "indexerId": 1234567890,
}
`;

export class DecideProwlarrEntryAgent extends Agent {
  constructor() {
    super("DecideProwlarrEntryAgent", basePrompt);
  }
}

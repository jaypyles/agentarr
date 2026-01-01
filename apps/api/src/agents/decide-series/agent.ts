import dotenv from "dotenv";
import { Agent } from "../agent";

dotenv.config();

const basePrompt = `
You will decide what series/movie should be added to the app based on the user's query and the series/movie provided.
Return a JSON object of the series/movie that should be added to the app.
Also add an extra key to the object called "reasoning" which is a string that explains why you chose the series/movie.

Here is the example format of the JSON object:

{
    "title": "Series/Movie Title",
    ...
}

<important>
Only INCLUDE a single series/movie in the JSON object.
</important>
`;

export class DecideSeriesAgent extends Agent {
  constructor() {
    super("DecideSeriesAgent", basePrompt);
  }
}

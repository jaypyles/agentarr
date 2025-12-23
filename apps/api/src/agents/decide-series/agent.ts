import dotenv from "dotenv";
import { Agent } from "../agent";

dotenv.config();

const basePrompt = `
You will decide what series should be added to the app based on the user's query and the series provided.
Return a JSON object of the series that should be added to the app.
Also add an extra key to the object called "reasoning" which is a string that explains why you chose the series.

Here is the example format of the JSON object:

{
    "title": "Series Title",
    ...
}

<important>
Only INCLUDE a single series in the JSON object.
</important>
`;

export class DecideSeriesAgent extends Agent {
  constructor() {
    super("DecideSeriesAgent", basePrompt);
  }
}

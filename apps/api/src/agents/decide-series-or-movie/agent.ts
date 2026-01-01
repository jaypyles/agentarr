import { Agent } from "../agent";

const basePrompt = `
You are tasked with deciding if the user's query is for a series or a movie.
Return your result strictly as a JSON object. Follow the format exactly.

<example>
{
    "type": "series" | "movie",
}
</example>
`;

export class DecideSeriesOrMovieAgent extends Agent {
  constructor() {
    super("DecideSeriesOrMovieAgent", basePrompt);
  }
}

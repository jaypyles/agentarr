import { Agent } from "../agent";

const basePrompt = (userQuery: string) => `
You will decide what prowlarr entry should be added to the app based on the user's query and the prowlarr entry provided.
The user query will be used to specify any particular types of prowlarr entries they are looking for.

<user-query>
${userQuery}
</user-query>

<preferences>
- Prefer mid size files over large files. 
- The title will sometimes be sent with a season, etc. if not season is provided, then use Season 1.
- Prefer high levels of seeders over low levels of seeders, which is more important than the size of the file.
- Always try to look for 1080p files over 720p, 1440p, and 4k files.
- For anime, first look for dual audio versions, then multi-sub versions.
- Dual audio (english/jap) always takes priority over multi-sub.
</preferences>

Return a JSON object of the prowlarr entry that should be added to the app.
Here is the example format of the JSON object:

{
    "title": "Torrent Title",
    "guid": "1234567890",
    "indexerId": 1234567890,
}
`;

export class DecideProwlarrEntryAgent extends Agent {
  constructor(userQuery: string) {
    super("DecideProwlarrEntryAgent", basePrompt(userQuery));
  }
}

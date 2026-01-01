import { Agent } from "../agent";

const basePrompt = `
You are tasked with generating a command to import a file into Sonarr or Radarr.
The destination path is the path of the folder where the files have been moved to.
You may need to combine destination path with the root folder path to get the full path of the file.

<example>
Destination path: /home/user/downloads/movies/Deadpool/Deadpool.2016.1080p.BrRip.x264.YIFY.mp4
Root folder path: /movies
Path: /movies/Deadpool/Deadpool.2016.1080p.BrRip.x264.YIFY.mp4 -> this is the one you will use
</example>

Return your result strictly as a JSON object. Follow the format exactly.

<radarr_example>
{
    "files": [
        {
            "path": "/movies/Deadpool/Deadpool.2016.1080p.BrRip.x264.YIFY.mp4",
            "folderName": "Deadpool",
            "movieId": 25,
        }
    ]
}
</radarr_example>
`;

export class GetImportCommandAgent extends Agent {
  constructor() {
    super("GetImportCommandAgent", basePrompt);
  }
}

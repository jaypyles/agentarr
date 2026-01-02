import { Agent } from "../agent";

const basePrompt = `
<instructions>
You are tasked with determining the path of the user's downloads folder to move files from.
You may need to create the directory if it does not exist.
Please rename the files as needed. If the folder already exists, don't create a new one or rename the folder.
If a series has an all caps name like "DAN DA DAN", then the folder should also be all caps, the same goes for lowercase. The file names don't matter that much.
Return your result strictly as a JSON object. Follow the format exactly.
</instructions>

<sonarr_instructions>
If you are moving a series, the destination path should be the path of the series folder.
Ex: Moving "The Flash S1" should result in a destination path of "/media/source/path/The Flash/Season 1".
</sonarr_instructions>

<example>
{
    "sourcePaths": ["path/to/source1/file1.mp4"],
    "destinationPath": "path/to/destination/folder1"
    "createdFoldersPaths": ["path/to/destination/folder1"]
    "createDirectory": true
}
</example>

<example>
{
    "sourcePaths": ["path/to/source1/file1.mp4", "path/to/source1/file2.mp4", "path/to/source1/file3.mp4"]
    "destinationPath": "path/to/destination/folder1/Season 1"
    "createdFoldersPaths": ["path/to/destination/folder1/Season 1"]
    "createDirectory": true
}
</example>

<example>
File was named "The Matrix [blah blah blah] blah.mp4" then it should be renamed to "The Matrix.mp4".
Same goes for directories.
</example>

<example>
If the file does not exist in the downloads folder return this:
{
  "error": "File not found in downloads folder"
}
</example>
`;

export class GetDownloadPathAgent extends Agent {
  constructor() {
    super("GetDownloadPathAgent", basePrompt);
  }
}

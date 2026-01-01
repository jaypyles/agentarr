import { Agent } from "../agent";

const basePrompt = `
<instructions>
You are tasked with determining the path of the user's downloads folder to move files from.
You may need to create the directory if it does not exist.
Please rename the files as needed. Don't include the year in the file/folder name.
Return your result strictly as a JSON object. Follow the format exactly.
</instructions>

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

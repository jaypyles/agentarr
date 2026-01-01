import { DecideSeriesOrMovieAgent } from "@/agents/decide-series-or-movie/agent";
import { GetDownloadPathAgent } from "@/agents/get-download-path";
import { GetImportCommandAgent } from "@/agents/get-import-command";
import { createDirectory } from "@/files/create-directory";
import { listFiles } from "@/files/list-files";
import { moveFile } from "@/files/move-file";
import { mounts } from "@/mounts";
import { jellyfinService } from "@/services/jellyfin/service";
import { ManualImportCommand } from "@/services/radarr/manual-import";
import { radarrService } from "@/services/radarr/service";
import { Movie } from "@repo/global-types";
import { logger } from "@repo/logger";
import { FastifyReply } from "fastify";
import { Workflow } from "../workflow";

type MoveFilesResponse = {
  sourcePaths: string[];
  destinationPath: string;
  createdFoldersPaths: string[];
  createDirectory: boolean;
  error?: string;
};

export class MoveFilesWorkflow extends Workflow {
  res: FastifyReply;
  userQuery: string;

  constructor(res: FastifyReply) {
    super("Move Files Workflow");
    this.res = res;
    this.userQuery = "";
  }

  private async getMoveFilesInstructions() {
    const files = await listFiles(mounts.downloads ?? "");
    const query = `
    <user-query>
    ${this.userQuery}
    </user-query>

    <users-mounts>
    ${JSON.stringify(mounts)}
    </users-mounts>

    I have the following files in my downloads folder:
    ${files.map((file) => file.name).join("\n")}
    Please determine the path of the user's downloads folder to move files from.
    `;

    const response = await new GetDownloadPathAgent().run<MoveFilesResponse>(
      JSON.stringify({
        query: query,
      })
    );

    this.send(this.res, {
      status: "progress",
      message: "Getting move files instructions",
    });

    if (response.error) {
      throw new Error(response.error);
    }

    return response;
  }

  private async createDirectories(paths: string[]) {
    this.send(this.res, {
      status: "progress",
      message: "Creating directories: " + paths.join(", "),
    });

    for (const path of paths) {
      await createDirectory(path);
    }
  }

  private async moveFiles(sourcePaths: string[], destinationPath: string) {
    this.send(this.res, {
      status: "progress",
      message:
        "Moving files: " + sourcePaths.join(", ") + " to " + destinationPath,
    });

    for (const sourcePath of sourcePaths) {
      await moveFile(sourcePath, destinationPath);
    }
  }

  private async getRadarrRootFolder() {
    const response = await radarrService.getRootFolder();
    return response;
  }

  private async getRadarrMovies() {
    const response = await radarrService.getMovies();
    return response.map((movie: Movie) => ({
      title: movie.title,
      id: movie.id,
    }));
  }

  private async importFilesToRadarr(destinationPath: string) {
    const rootFolder = await this.getRadarrRootFolder();
    const movies = await this.getRadarrMovies();
    const rootFolderPath = rootFolder.map((folder: any) => folder.path);

    const files = await listFiles(destinationPath);

    const args = `
    <root_folder_path>
    ${rootFolderPath}
    </root_folder_path>

    <movies>
    ${movies
      .map((movie: any) => {
        return `{
        "title": "${movie.title}",
        "movieId": ${movie.id}
      }`;
      })
      .join("\n")}
    </movies>

    <files>
    ${JSON.stringify(files)}
    </files>
    `;

    const importCommand =
      await new GetImportCommandAgent().run<ManualImportCommand>(args);

    this.send(this.res, {
      status: "progress",
      message: `Importing "${importCommand.files?.map((file: any) => file.path).join(", ")}" for Movie: "${importCommand.files?.map((file: any) => file.folderName).join(", ")}" in Radarr`,
    });

    await radarrService.manualImport(importCommand);
  }

  private async scanJellyfinLibrary() {
    this.send(this.res, {
      status: "progress",
      message: "Scanning Jellyfin library",
    });

    await jellyfinService.scanLibrary();
  }

  private async decideSonarrOrRadarr(userQuery: string) {
    const response = await new DecideSeriesOrMovieAgent().run<{
      type: "series" | "movie";
    }>(
      JSON.stringify({
        originalQuery: userQuery,
      })
    );

    return response.type;
  }

  async run(data: { query: string }) {
    try {
      await this.start(this.res);

      const { query } = data;
      this.userQuery = query;
      const moveFilesInstructions = await this.getMoveFilesInstructions();

      const {
        sourcePaths,
        destinationPath,
        createdFoldersPaths,
        createDirectory,
      } = moveFilesInstructions;

      if (createDirectory) {
        await this.createDirectories(createdFoldersPaths ?? []);
      }

      await this.moveFiles(sourcePaths, destinationPath);

      const type = await this.decideSonarrOrRadarr(query);

      if (type === "movie") {
        logger.info("Importing files to Radarr");
        await this.importFilesToRadarr(destinationPath);
      } else {
        // TODO: Import files to Sonarr
      }

      await this.scanJellyfinLibrary();

      await this.end(this.res);
    } catch (error) {
      logger.error({ err: error }, "Workflow error");
      try {
        await this.send(this.res, {
          status: "error",
          message:
            error instanceof Error
              ? error.message
              : "An unknown error occurred",
        });
        await this.end(this.res);
      } catch (sendError) {
        // If we can't send the error, the connection is likely already closed
        logger.error({ err: sendError }, "Failed to send error response");
      }
    }
  }
}

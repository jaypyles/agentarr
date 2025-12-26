import { FastifyReply } from "fastify";

export type Step = {
  name: string;
  description: string;
  input: any;
  output: any;
  run: (args: any) => Promise<void>;
};

export abstract class Workflow {
  public readonly name: string;
  public steps: Step[] = [];

  constructor(name: string) {
    this.name = name;
  }

  protected async send(res: FastifyReply, data: any) {
    if (!res.sse) {
      throw new Error("SSE is not initialized.");
    }

    await res.sse({ data: JSON.stringify(data)});
  }

  abstract run(args: any, res: FastifyReply): Promise<any>;
}

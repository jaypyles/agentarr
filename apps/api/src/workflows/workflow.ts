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

  abstract run(args: any): Promise<any>;
}

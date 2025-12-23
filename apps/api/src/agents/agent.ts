import { openai } from "@ai-sdk/openai";
import { generateText } from "ai";
import dotenv from "dotenv";

dotenv.config();

export class Agent {
  public readonly name: string;
  public readonly prompt: string;

  constructor(name?: string, prompt?: string) {
    this.name = name ?? "Agent";
    this.prompt = prompt ?? "You are a helpful assistant.";
  }

  private basePrompt = `
  <instructions>
  You are only to responde with a JSON object. Do not use markdown or any other formatting.
  Just pure JSON, ex:

  { 'key': 'value' }

  <instructions/>
  `;

  private async generateText(input: string): Promise<object> {
    const response = await generateText({
      model: openai(process.env.MODEL ?? "gpt-4o-mini"),
      system: this.basePrompt + "\n" + this.prompt,
      messages: [
        {
          role: "user",
          content: input,
        },
      ],
    });

    return JSON.parse(response.text);
  }

  public async run<T>(input: string): Promise<T> {
    return this.generateText(input) as T;
  }
}

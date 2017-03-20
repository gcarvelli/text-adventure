import { Command } from "../Parse/IParser";
import { EngineMode } from "./Engine";

export interface IExecutionStrategy {
    Execute(command: Command): EngineMode;
}

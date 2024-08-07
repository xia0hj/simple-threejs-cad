import {
  MODULE_NAME,
  Module,
  ModuleGetter,
} from "@src/modules/module_registry";
import { CommandExecutionResult } from "@src/modules/command_executor/command_execution_result";
import { checkIsUndoableCommand } from "@src/utils";

export type Command = {
  name: string;
  execute: (getModule: ModuleGetter) => Promise<CommandExecutionResult>;
  undo?: (getModule: ModuleGetter) => Promise<CommandExecutionResult>;
};

export type UndoableCommand = Command & Required<Command["undo"]>;

export class CommandExecutor implements Module {
  name = MODULE_NAME.CommandExecutor;
  getModule: ModuleGetter;

  #modificationHistory: UndoableCommand[] = [];

  constructor(getModule: ModuleGetter) {
    this.getModule = getModule;
  }

  async executeCommand(command: Command) {
    const result = await command.execute(this.getModule);
    const { debug } = this.getModule(MODULE_NAME.Configurator).getOptions();
    result.match(
      () => {
        if (checkIsUndoableCommand(command)) {
          this.#modificationHistory.push(command);
        }
      },
      (error) => {
        if (debug) {
          console.error(error);
        }
      },
    );
    return result;
  }
}

import {
  MODULE_NAME,
  Module,
  ModuleGetter,
  ModuleNameMap,
  ModuleNameUnion,
  initAllModules,
} from "@src/modules";
import { CommandSystem } from "@src/modules/command_system";
import { COMMAND_KEY } from "@src/modules/command_system/all_commands";
import { Configurator, Options } from "@src/modules/configurator";
import { StateStore } from "@src/modules/state_store";
import { SceneBuilder } from "@src/modules/scene_builder";
import { ValueOf } from "@src/utils";

export class TinyThreejsSketcher {
  #moduleMap: Map<ModuleNameUnion, Module>;
  public getModule: ModuleGetter;

  constructor(canvasElement: HTMLCanvasElement, options?: Partial<Options>) {
    const { moduleMap, getModule } = initAllModules(canvasElement, options);
    this.#moduleMap = moduleMap;
    this.getModule = getModule;
  }

  public startRender() {
    this.getModule(MODULE_NAME.SceneBuilder).startRender();
    this.getModule(MODULE_NAME.CommandSystem).runCommand(
      COMMAND_KEY.fitCameraToScene,
    );
    this.getModule(MODULE_NAME.OperationModeSwitcher).startListenCanvas();
    this.getModule(MODULE_NAME.SketchObjectManager).refreshTree();
  }

  public runCommand(key: ValueOf<typeof COMMAND_KEY>, parameter?: any) {
    return this.getModule(MODULE_NAME.CommandSystem).runCommand(key, parameter);
  }

  public dispose() {
    Array.from(this.#moduleMap.values())
      .reverse()
      .forEach((module) => {
        module.dispose?.();
      });
  }
}
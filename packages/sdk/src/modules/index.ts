import { CommandSystem } from "@src/modules/command_system";
import { Configurator, Options } from "@src/modules/configurator";
import { GlobalStore } from "@src/modules/global_store";
import { OperationModeSwitcher } from "@src/modules/operation_mode_switcher";
import { SceneBuilder } from "@src/modules/scene_builder";
import { SketchObjectManager } from "@src/modules/sketch_object_manager";
import { ThreeCadEditor } from "@src/three_cad_editor";
import { ValueOf } from "@src/utils";

// register module name, then use module in initAllModules()
export const MODULE_NAME = Object.freeze({
  Configurator: "Configurator",
  SceneBuilder: "SceneBuilder",
  GlobalStore: "GlobalStore",
  CommandSystem: "CommandSystem",
  SketchObjectManager: "SketchObjectManager",
  OperationModeSwitcher: "OperationModeSwitcher",
});
export type ModuleNameMap = {
  Configurator: Configurator;
  SceneBuilder: SceneBuilder;
  GlobalStore: GlobalStore;
  CommandSystem: CommandSystem;
  SketchObjectManager: SketchObjectManager;
  OperationModeSwitcher: OperationModeSwitcher;
};
export function initAllModules(
  canvasElement: HTMLCanvasElement,
  options?: Partial<Options>,
) {
  const moduleMap = new Map();
  const useModule = (module: Module) => moduleMap.set(module.name, module);
  const getModule: ModuleGetter = (moduleName) => moduleMap.get(moduleName);

  useModule(new Configurator(options));
  useModule(new SceneBuilder(getModule, canvasElement));
  useModule(new GlobalStore());
  useModule(new CommandSystem(getModule));
  useModule(new SketchObjectManager(getModule));
  useModule(new OperationModeSwitcher(getModule));

  return { moduleMap, getModule };
}

export type Module = {
  name: ModuleNameUnion;
  getModule?: ModuleGetter;
  dispose?: () => void;
};

export type ModuleGetter = <K extends ModuleNameUnion>(
  moduleName: K,
) => ModuleNameMap[K];
export type ModuleNameUnion = ValueOf<typeof MODULE_NAME>;

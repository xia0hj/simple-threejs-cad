import { CAMERA_TYPE } from "@src/constant/enum";
import { MODULE_NAME, Module } from "@src/modules/module_registry";
import { SketchObject } from "@src/modules/sketch_object";
import { SketchObjectTreeItem } from "@src/modules/sketch_object_manager";
import { ValueOf } from "@src/utils";
import mitt from "mitt";
import { Vector3 } from "three";

export type SketcherState = {
  curCameraType: ValueOf<typeof CAMERA_TYPE>;
  sketchObjectTreeRoot?: SketchObjectTreeItem;
  selectedObjects: SketchObject[];

  /** 用于区分是否处于 2d 草图模式 */
  editingBasePlane?: SketchObject;

  // 记录正在绘制的线段信息，通知完成绘制
  drawingLine2dStartPoint?: Vector3;
  drawingLine2dEndPoint?: Vector3;
};

export class StateStore implements Module {
  name = MODULE_NAME.StateStore;
  emitter = mitt<SketcherState>();

  state: SketcherState = {
    curCameraType: CAMERA_TYPE.perspectiveCamera,
    selectedObjects: [],
  };

  public getState(): SketcherState {
    return this.state;
  }

  public setState(state: Partial<SketcherState>) {
    Object.entries(state).forEach(([key, value]) => {
      this.state[key as keyof SketcherState] = value as any;
      this.emitter.emit(key as keyof SketcherState, value);
    });
  }

  public listenState<K extends keyof SketcherState>(
    key: K,
    listener: (value: SketcherState[K]) => void,
  ) {
    this.emitter.on(key, listener);
    return () => this.emitter.off(key, listener);
  }

  dispose() {
    this.emitter.all.clear();
  }
}

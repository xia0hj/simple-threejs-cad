import { Command } from "@src/command_system/type";
import {
  SCENE_PLANE_COLOR,
  SCENE_PLANE_LENGTH,
  SCENE_PLANE_OPACITY,
} from "@src/constant/config";
import { SketchObject, SketchObjectUserData } from "@src/sketch_object/type";
import {
  BufferGeometry,
  DoubleSide,
  Mesh,
  MeshStandardMaterial,
  Vector3,
} from "three";

export const COMMAND_KEY_CREATE_PLANE = "create_plane";
export type CreatePlaneParameter = {
  parallelTo: "XY" | "XZ" | "YZ";
  offset: number;
};
export const CommandCreatePlane: Command = {
  key: COMMAND_KEY_CREATE_PLANE,
  modification: true,
  run(context, commandParameter) {
    const plane = new Plane(commandParameter);
    context.sceneRenderer?.addSketchObjectToScene(plane);
    return {
      key: COMMAND_KEY_CREATE_PLANE,
      parameter: commandParameter,
      rollback() {
        plane.removeFromParent();
        plane.dispose();
      },
    };
  },
} as const;

export class Plane extends SketchObject {
  userData: SketchObjectUserData;
  constructor(createPlaneParameter: CreatePlaneParameter) {
    super(
      buildPlaneGeomtry(createPlaneParameter, SCENE_PLANE_LENGTH),
      new MeshStandardMaterial({
        vertexColors: false,
        color: SCENE_PLANE_COLOR,
        side: DoubleSide,
        transparent: true,
        opacity: SCENE_PLANE_OPACITY,
      }),
    );
  }
  onMouseEnter(): void {
    throw new Error("Method not implemented.");
  }
  onMouseLeave(): void {
    throw new Error("Method not implemented.");
  }
  onSelect(): void {
    throw new Error("Method not implemented.");
  }
  onDeselect(): void {
    throw new Error("Method not implemented.");
  }
  dispose(): void {
    this.geometry.dispose();
    this.material.dispose();
  }
}

function buildPlaneGeomtry(
  { parallelTo, offset }: CreatePlaneParameter,
  planeLength: number,
): BufferGeometry {
  const distance = planeLength / 2;
  if (parallelTo === "XY") {
    const minPosition = new Vector3(-distance, -distance, offset);
    const maxPosition = new Vector3(distance, distance, offset);
    return new BufferGeometry().setFromPoints([
      new Vector3().copy(minPosition), // 左下
      new Vector3(maxPosition.x, minPosition.y, offset), // 右下
      new Vector3().copy(maxPosition), // 右上
      new Vector3().copy(maxPosition), // 右上
      new Vector3(minPosition.x, maxPosition.y, offset), // 左上
      new Vector3().copy(minPosition), // 左下
    ]);
  } else if (parallelTo === "XZ") {
    const minPosition = new Vector3(-distance, offset, -distance);
    const maxPosition = new Vector3(distance, offset, distance);
    return new BufferGeometry().setFromPoints([
      new Vector3().copy(minPosition), // 左下
      new Vector3(maxPosition.x, offset, minPosition.z), // 右下
      new Vector3().copy(maxPosition), // 右上
      new Vector3().copy(maxPosition), // 右上
      new Vector3(minPosition.x, offset, maxPosition.z), // 左上
      new Vector3().copy(minPosition), // 左下
    ]);
  } else {
    const minPosition = new Vector3(offset, -distance, -distance);
    const maxPosition = new Vector3(offset, distance, distance);
    return new BufferGeometry().setFromPoints([
      new Vector3().copy(minPosition), // 左下
      new Vector3(offset, maxPosition.y, minPosition.z), // 右下
      new Vector3().copy(maxPosition), // 右上
      new Vector3().copy(maxPosition), // 右上
      new Vector3(offset, minPosition.y, maxPosition.z), // 左上
      new Vector3().copy(minPosition), // 左下
    ]);
  }
}

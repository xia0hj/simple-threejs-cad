import { Command } from "@src/command_system";
import { CAMERA_TYPE } from "@src/constant/enum";

export const CommandSetPerspectiveCamera: Command<'set_perspective_camera'> = {
  key: "set_perspective_camera",
  modification: false,
  run(context) {
    context.sceneRenderer?.setCameraType(CAMERA_TYPE.perspectiveCamera);
  },
};

export const CommandSetOrthographicCamera: Command<"set_orthographic_camera"> = {
  key: "set_orthographic_camera",
  modification: false,
  run(context) {
    context.sceneRenderer?.setCameraType(CAMERA_TYPE.orthographicCamera);
  },
};

export const CommandUndo: Command<"undo", {step:number}> = {
  key: "undo",
  modification: false,
  run(context, {step}) {
    context.commandSystem?.undo(step);
  },
};

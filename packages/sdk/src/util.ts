export type ValueOf<OBJ extends { [key: string]: any }> = OBJ[keyof OBJ];

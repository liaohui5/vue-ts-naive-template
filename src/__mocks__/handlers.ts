const handlerModules = import.meta.glob("./handlers/**.ts", { eager: true });

// @ts-ignore
export const handlers = Object.values(handlerModules).flatMap(Object.values);

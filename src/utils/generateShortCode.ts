import { nanoid } from "nanoid";

export const generateShortCode = (size: number = 8): string => {
  return nanoid(size);
};

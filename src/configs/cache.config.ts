import { NextFunction, Request, Response } from "express";

const TEN_MINUTES = 1000 * 60 * 10;

export const setCache = (req: Request, res: Response, next: NextFunction) => {
  if (req.method === "GET") {
    res.set("Cache-Control", `public, max-age=${TEN_MINUTES}`);
  } else {
    res.removeHeader("Cache-Control");
  }

  next();
};

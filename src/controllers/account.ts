import { Request, Response } from "express";
import asyncHandler from "express-async-handler";
// @ts-ignore
import handleResponse from "../util/handleResponse";
import * as ACC from "../services/account";

/**
 * Creates a new account.
 * @param req - The request object.
 * @param res - The response object.
 */
export const create = asyncHandler(async (req: Request, res: Response) => {
  const user = await ACC.create(req.body);
  handleResponse(Promise.resolve(user), res);
});

/**
 * Logs in a user.
 * @param req - The request object.
 * @param res - The response object.
 */
export const login = asyncHandler(async (req: Request, res: Response) => {
  const user = await ACC.login(req.body);
  handleResponse(Promise.resolve(user), res);
});

/**
 * Fetches the user's information.
 * @param req - The request object.
 * @param res - The response object.
 */
export const me = asyncHandler(async (req: Request, res: Response) => {
  const user = await ACC.me((req as any).token);
  handleResponse(Promise.resolve(user), res);
});

/**
 * Updates the user's information.
 * @param req - The request object.
 * @param res - The response object.
 */
export const update = asyncHandler(async (req: Request, res: Response) => {
  const user = await ACC.update((req as any).user.username, req.body);
  handleResponse(Promise.resolve(user), res);
});

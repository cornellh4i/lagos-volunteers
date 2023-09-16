import { Response } from "express";
import { errorJson, successJson } from "./jsonResponses";

/**
 * Attempts the given controller and sends a success code or error code as necessary
 * @param successCode is the success code
 * @param controller is the function called from the controller
 */
export const attempt = async (
  res: Response,
  successCode: number,
  controller: () => Promise<unknown>
) => {
  try {
    res.status(successCode).send(successJson(await controller()));
  } catch (error: any) {
    res.status(500).send(errorJson(error.message));
  }
};

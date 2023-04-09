import { Response } from "express";
import { errorJson } from "./jsonResponses";

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
    res.status(successCode).send(await controller());
  } catch (error) {
    res.status(500).send(errorJson(error));
  }
};

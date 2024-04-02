import { Response } from "express";
import { errorJson, successJson } from "./jsonResponses";
import { WebSocket } from "ws";
import { wss } from "..";

/**
 * Attempts the given controller and sends a success code or error code as necessary
 * @param successCode is the success code
 * @param controller is the function called from the controller
 */
export const attempt = async (
  res: Response,
  successCode: number,
  controller: () => Promise<any>
) => {
  try {
    res.status(successCode).send(successJson(await controller()));
  } catch (error: any) {
    res.status(500).send(errorJson(error.message));
  }
};

/**
 * Sends a message from the WebSocket server to all WebSocket-connected clients
 * @param resource is the API resource endpoint that has been updated. For example,
 * if a specific user with uuid "1234" was updated, the resource would be "/users/1234"
 */
export const socketNotify = (resource: string) => {
  const dataToSend = {
    resource: resource,
    message: "The resource has been updated!",
  };
  wss.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(JSON.stringify(dataToSend));
    }
  });
};

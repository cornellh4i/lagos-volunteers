import { BASE_URL } from "@/utils/constants";
import { auth } from "@/utils/firebase";

/**
 * Retrieves the Firebase token of the current user session
 * @returns a promise of the user token
 */
const retrieveToken = () => {
  if (auth.currentUser) {
    return auth.currentUser.getIdToken();
  } else {
    return Promise.reject("Failed to retrieve token: user is null");
  }
};

/**
 * Performs a GET request to the specified URL
 * @param url is the resource url
 * @param token is whether a user token is needed for the request
 * @returns the response
 */
const get = (url: string, token = true) => {
  return handleRequest("GET", url, token);
};

/**
 * Performs a POST request to the specified URL
 * @param url is the resource url
 * @param body is the request body
 * @param token is whether a user token is needed for the request
 * @returns the response
 */
const post = (url: string, body: object, token = true) => {
  const headers = { "Content-Type": "application/json" };
  return handleRequest("POST", url, token, headers, body);
};

/**
 * Performs a PUT request to the specified URL
 * @param url is the resource url
 * @param body is the request body
 * @param token is whether a user token is needed for the request
 * @returns the response
 */
const put = (url: string, body: object, token = true) => {
  const headers = { "Content-Type": "application/json" };
  return handleRequest("PUT", url, token, headers, body);
};

/**
 * Performs a PATCH request to the specified URL
 * @param url is the resource url
 * @param body is the request body
 * @param token is whether a user token is needed for the request
 * @returns the response
 */
const patch = (url: string, body: object, token = true) => {
  const headers = { "Content-Type": "application/json" };
  return handleRequest("PATCH", url, token, headers, body);
};

/**
 * Performs a DELETE request to the specified URL
 * @param url is the resource url
 * @param token is whether a user token is needed for the request
 * @returns the response
 */
const del = (url: string, token = true) => {
  return handleRequest("DELETE", url, token);
};

/**
 * Handles the request of a fetch request
 * @param method is the request method
 * @param url is the resource url
 * @param headers are the request headers
 * @param body is the request body
 * @param requiresToken is whether a user token is needed for the request
 * @returns the response data
 */
const handleRequest = async (
  method: string,
  url: string,
  requiresToken: boolean,
  headers?: { [key: string]: string },
  body?: object,
) => {
  let options;
  if (requiresToken) {
    const token = await retrieveToken();
    options = {
      method: method,
      headers: { Authorization: `Bearer ${token}`, ...headers },
      body: JSON.stringify(body),
    };
  } else {
    options = {
      method: method,
      headers: headers,
      body: JSON.stringify(body),
    };
  }
  const response = await fetch(BASE_URL + url, options);
  return handleResponse(response);
};

/**
 * Handles the response of a fetch request
 * @param response is the response
 * @returns the response data
 */
const handleResponse = async (response: Response) => {
  if (response.ok) {
    let data;
    const content = response.headers.get("Content-Type");
    if (content?.includes("application/json")) {
      data = await response.json();
    } else {
      data = await response.blob();
    }
    return { response: response, data: data };
  } else {
    return Promise.reject(`Request failed with status ${response.status}`);
  }
};

export const api = { get, post, put, patch, delete: del };

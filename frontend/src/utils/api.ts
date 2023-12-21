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
 * @returns the response
 */
const get = async (url: string) => {
  const token = await retrieveToken();
  const options = {
    method: "GET",
    headers: { Authorization: `Bearer ${token}` },
  };
  const response = await fetch(BASE_URL + url, options);
  return handleResponse(response);
};

/**
 * Performs a POST request to the specified URL
 * @param url is the resource url
 * @param body is the request body
 * @returns the response
 */
const post = async (url: string, body: object) => {
  const token = await retrieveToken();
  const options = {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  };
  const response = await fetch(BASE_URL + url, options);
  return handleResponse(response);
};

/**
 * Performs a PUT request to the specified URL
 * @param url is the resource url
 * @param body is the request body
 * @returns the response
 */
const put = async (url: string, body: object) => {
  const token = await retrieveToken();
  const options = {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  };
  const response = await fetch(BASE_URL + url, options);
  return handleResponse(response);
};

/**
 * Performs a PATCH request to the specified URL
 * @param url is the resource url
 * @param body is the request body
 * @returns the response
 */
const patch = async (url: string, body: object) => {
  const token = await retrieveToken();
  const options = {
    method: "PATCH",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  };
  const response = await fetch(BASE_URL + url, options);
  return handleResponse(response);
};

/**
 * Performs a DELETE request to the specified URL
 * @param url is the resource url
 * @returns the response
 */
const del = async (url: string) => {
  const token = await retrieveToken();
  const options = {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` },
  };
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

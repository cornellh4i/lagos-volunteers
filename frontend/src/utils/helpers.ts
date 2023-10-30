import { BASE_URL } from "@/utils/constants";
const url = BASE_URL as string;

export const fetchUserIdFromDatabase = async (email: string, token: string) => {
	try {
		const fetchUrl = `${url}/users/search/?email=${email}`;
		const response = await fetch(fetchUrl, {
			method: "GET",
			headers: {
				Authorization: `Bearer ${token}`,
			},
		});
		if (response.ok) {
			const data = await response.json();
			return data["data"][0]["id"];
		} else {
			console.error("User Retrieval failed with status:", response.status);
		}
	} catch (error) {
		console.log("Error in User Info Retrieval.");
		console.log(error);
	}
};

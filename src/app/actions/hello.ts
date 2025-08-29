"use server";

export async function getHelloMessage() {
  try {
    const response = await fetch(`${process.env.API_BASE_URL_SERVER}/hello`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return { success: true, data };
  } catch (error) {
    console.error("Error fetching hello message:", error);
    return { success: false, error: "Failed to fetch hello message" };
  }
}

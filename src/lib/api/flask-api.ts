export const MetProAiAPI = {
  sendChatMessage: async (message: string): Promise<any> => {
    try {
      const response = await fetch("http://localhost:3001/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message }),
      });
      return await response.json();
    } catch (error) {
      console.error("Error sending message:", error);
      return { response: "Error connecting to the server" };
    }
  },
};
import { GoogleGenerativeAI } from "@google/generative-ai";

// Access your API key as an environment variable
const API_KEY = import.meta.env.VITE_API_KEY;

// Check if API key is provided
if (!API_KEY) {
  console.error("API key is missing. Please add VITE_API_KEY to your .env file.");
}

const genAI = new GoogleGenerativeAI(API_KEY);

// Function to run the chat model
export async function runchat(prompt) {
  // Check if API key is provided
  if (!API_KEY) {
    throw new Error("API key is missing. Please add VITE_API_KEY to your .env file.");
  }
  
  try {
    // For text-only input, use the gemini-1.5-flash model
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    return text;
  } catch (error) {
    console.error("Error in runchat:", error);
    throw error;
  }
}

// Alternative function for chat-based interactions
export async function runChatModel(prompt, history = []) {
  // Check if API key is provided
  if (!API_KEY) {
    throw new Error("API key is missing. Please add VITE_API_KEY to your .env file.");
  }
  
  try {
    // For chat-based interactions, use the gemini-1.5-flash model
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    
    // Prepare the chat history
    const chat = model.startChat({
      history: history,
      generationConfig: {
        maxOutputTokens: 1000,
      },
    });
    
    const result = await chat.sendMessage(prompt);
    const response = await result.response;
    const text = response.text();
    
    return text;
  } catch (error) {
    console.error("Error in runChatModel:", error);
    throw error;
  }
}
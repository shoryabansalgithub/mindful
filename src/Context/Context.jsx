import { createContext, useState } from "react";
import { runchat } from "../config/gemini.jsx";

export const Context = createContext();

const ContextProvider = (props) => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);

  const onSent = async (prompt) => {
    try {
      setLoading(true);
      
      // Add user message to chat
      const userMessage = { text: prompt, sender: "user" };
      setMessages(prev => [...prev, userMessage]);
      
      // Get response from AI
      const response = await runchat(prompt);
      
      // Add AI response to chat
      const aiMessage = { text: response, sender: "ai" };
      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      console.error("Error in onSent:", error);
      // Add error message to chat
      let errorText = "Sorry, I encountered an error. Please try again.";
      if (error.message && error.message.includes("API key is missing")) {
        errorText = "API key is missing. Please add VITE_API_KEY to your .env file.";
      } else if (error.message) {
        errorText = error.message;
      }
      const errorMessage = { text: errorText, sender: "ai", error: true };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  const contextValue = {
    messages,
    loading,
    onSent,
    setMessages
  };

  return (
    <Context.Provider value={contextValue}>
      {props.children}
    </Context.Provider>
  );
};

export default ContextProvider;
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { AuthContextProvider } from './context/AuthContext';
import { Toaster } from 'react-hot-toast';
import ChatBot from "./Components/ChatBot/ChatBot"

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <AuthContextProvider>
      <App />
      <ChatBot/>
      <Toaster /> 
    </AuthContextProvider>
);
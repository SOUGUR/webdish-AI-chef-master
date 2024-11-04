import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { AuthContextProvider } from './context/AuthContext.jsx'
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { TranslationProvider } from './context/TranslationContext';
import ChatBot from "./components/ChatBot.tsx";

ReactDOM.createRoot(document.getElementById('root')).render(
    <AuthContextProvider>
       <TranslationProvider>
            <App />
        </TranslationProvider>
            <ChatBot/>
        <ToastContainer />
    </AuthContextProvider>
)

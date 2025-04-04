import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router";
import App from "./App";
import "./styles/index.css";
import { SocketContextProvider } from "./context/SocketContext";

createRoot(document.getElementById("root")).render(
    <BrowserRouter>
        <SocketContextProvider>
            <App />
        </SocketContextProvider>
    </BrowserRouter>
);

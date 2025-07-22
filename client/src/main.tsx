import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";

// Removed global autofill prevention that was causing keyboard input issues

createRoot(document.getElementById("root")!).render(<App />);

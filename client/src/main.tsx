import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";

// Global anti-autofill script
const disableAutofill = () => {
  // Disable autofill on all forms
  const forms = document.querySelectorAll('form');
  forms.forEach(form => {
    form.setAttribute('autocomplete', 'off');
  });

  // Disable autofill on all inputs
  const inputs = document.querySelectorAll('input, textarea, select');
  inputs.forEach(input => {
    input.setAttribute('autocomplete', 'off');
    input.setAttribute('readonly', 'readonly');
    setTimeout(() => {
      input.removeAttribute('readonly');
    }, 100);
  });
};

// Run on page load
document.addEventListener('DOMContentLoaded', disableAutofill);

// Run periodically to catch dynamically added forms
setInterval(disableAutofill, 1000);

createRoot(document.getElementById("root")!).render(<App />);

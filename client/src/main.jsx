import React from "react";
import { createRoot } from "react-dom/client";
import { App } from "./App";
import { ThirdwebProvider } from "thirdweb/react";
import "./index.css";
import { BrowserRouter } from "react-router";
import Web3Context from "./context/Web3Context";

createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <ThirdwebProvider>
      <BrowserRouter>
        <Web3Context>
          <App />
        </Web3Context>
      </BrowserRouter>
    </ThirdwebProvider>
  </React.StrictMode>
);

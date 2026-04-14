import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { BrowserRouter } from "react-router-dom";
import { GoogleOAuthProvider } from "@react-oauth/google";
import "./index.css";
ReactDOM.createRoot(document.getElementById("root")).render(
  <GoogleOAuthProvider clientId="400532799045-aqoo74q76bms4o0erh379oou3np727b5.apps.googleusercontent.com">
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </GoogleOAuthProvider>
);

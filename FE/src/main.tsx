import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";
import { GoogleOAuthProvider } from "@react-oauth/google";

ReactDOM.createRoot(document.getElementById("root")!).render(
  // <React.StrictMode>
  //       <App />
  // </React.StrictMode>
  <GoogleOAuthProvider clientId="10684881988-q2tm6uqg3fk1n1in12h2pj79rglj223s.apps.googleusercontent.com">
    <App />
  </GoogleOAuthProvider>
);

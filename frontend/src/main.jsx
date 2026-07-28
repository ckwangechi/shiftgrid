import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import "./index.css";
import App from "./App.jsx";
import { LayoutProvider } from "./shared/contexts/LayoutContext";
import { UserProvider } from "./shared/contexts/UserContext";
import { AuthProvider } from "./features/auth/context/AuthContext";

const queryClient = new QueryClient();

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <LayoutProvider>
        <UserProvider>
          <App />
        </UserProvider>
      </LayoutProvider>
    </QueryClientProvider>
  </StrictMode>
);
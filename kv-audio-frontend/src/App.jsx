import { BrowserRouter, Routes, Route } from "react-router-dom";
import HomePage from "./pages/home/homePage";
import Login from "./pages/login/login";
import { Toaster } from "react-hot-toast";
import AdminPage from "./pages/admin/adminPage";
import RegisterPage from "./pages/register/register";
import Testing from "./components/testing";
import { GoogleOAuthProvider } from "@react-oauth/google";
import VerifyEmail from "./pages/verifyEmail/verifyEmail";

function App() {
  return (
    <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
      <BrowserRouter>
        <Toaster position="top-right" reverseOrder={false} />
        <Routes>
          <Route path="/testing" element={<Testing />} />
          <Route path="/*" element={<HomePage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/verify-email" element={<VerifyEmail />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/admin/*" element={<AdminPage />} />
        </Routes>
      </BrowserRouter>
    </GoogleOAuthProvider>
  );
}

export default App;

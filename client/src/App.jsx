import { Route, Routes } from "react-router-dom"
import Login from "./pages/Login.jsx"
import Home from "./pages/Home.jsx"
import ResetPassword from "./pages/ResetPassword.jsx"
import EmailVerify from "./pages/EmailVerify.jsx"
import { Meteors } from "@/components/magicui/meteors"
import { ToastContainer } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";


function App() {
  return (
    <div className="relative min-h-screen flex items-center justify-center p-4 overflow-hidden bg-background">
      {/* Meteors background (shared across all pages) */}
      <div className="absolute inset-0 z-0">
        <Meteors
          number={40}      // fewer meteors
          angle={220}
          minDelay={0.3}  // slower
          maxDelay={1.2}
          minDuration={3}
          maxDuration={7}
        />
      </div>

      {/* Toast notifications (global) */}
      <ToastContainer />

      {/* Routed pages (always above meteors) */}
      <div className="relative z-10 w-full">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Login />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/email-verify" element={<EmailVerify />} />
        </Routes>
      </div>
    </div>
  )
}

export default App

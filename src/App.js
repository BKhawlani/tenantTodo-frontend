import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "./pages/Login";
import Register from "./pages/Register";

import DashboardPage from "./pages/DashboardPage";
import AddTaskPage from "./pages/AddTaskPage";
import Today from "./pages/Today";
import Upcoming from "./pages/Upcoming";
import Completed from "./pages/Completed";
import Overdue from "./pages/Overdue";

import PasswordReset from "./pages/resetPassword";
import ForgotPassword from "./pages/forgot_password";

import ProtectedRoute from "./routes/ProtectedRoute";

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import AdminRoute from "./routes/AdminRoute";
import AdminPage from "./pages/AdminPage";
import Profile from "./pages/Profile";
import Statistics from "./pages/Statistics";
function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>

          {/* Public Routes */}
          <Route path="/" element={<Login />} />
          <Route path="/signup" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<PasswordReset />} />

          {/* Protected Routes */}
          <Route element={<ProtectedRoute />}>
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/today" element={<Today />} />
            <Route path="/upcoming" element={<Upcoming />} />
            <Route path="/completed" element={<Completed />} />
            <Route path="/overdue" element={<Overdue />} />
            <Route path="/add-task" element={<AddTaskPage />} />
          </Route>
          <Route element={<AdminRoute />}>
  <Route path="/admin" element={<AdminPage />} />

</Route>
<Route element={<ProtectedRoute />}>
  <Route path="/profile" element={<Profile />} />
</Route>

<Route element={<ProtectedRoute />}>
  <Route path="/statistics" element={<Statistics />} />
</Route>

        </Routes>
      </BrowserRouter>

      <ToastContainer position="top-right" theme="dark" />
    </>
  );
}

export default App;

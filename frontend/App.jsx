import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Users from "./pages/Users";
import Payments from "./pages/Payments";
import CustomerDashboard from "./pages/CustomerDashboard";
import { Navigate } from "react-router-dom";

function App() {
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("userRole");

  const requireAuth = (element) => (token ? element : <Navigate to="/" replace />);
  const requireAdmin = (element) =>
    token && role === "admin" ? element : <Navigate to="/" replace />;
  const requireCustomer = (element) =>
    token && role !== "admin" ? element : <Navigate to="/" replace />;

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/dashboard" element={requireAdmin(<Dashboard />)} />
        <Route path="/dashboard/users" element={requireAdmin(<Users />)} />
        <Route path="/dashboard/payments" element={requireAdmin(<Payments />)} />
        <Route path="/userDashboard" element={requireCustomer(<CustomerDashboard />)} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

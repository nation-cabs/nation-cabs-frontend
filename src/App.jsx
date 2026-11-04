import Home from "./pages/Home.jsx";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import UserDashboard from "./pages/UserDashboard.jsx";
import Login from "./pages/Login.jsx";
import Signup from "./pages/Signup.jsx";
import ForgotPassword from "./pages/ForgotPassword.jsx";
import ResetPassword from "./pages/ResetPassword.jsx";

import RoleProtectedRoute from "./components/RoleProtectedRoute.jsx";
import Unauthorized from "./pages/Unauthorized.jsx";
import Logout from "./pages/Logout.jsx";
import VerifyEmail from "./pages/VerifyEmail.jsx"

import DriverApplication from "./pages/DriverApplication.jsx";
import HRDashboard from "./pages/HRDashboard.jsx";
import DriverApplicationReview from "./pages/DriverApplicationReview.jsx";
import AdminDashboard from "./pages/AdminDashboard";

function App() {
  return(
  
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/verify-email" element={<VerifyEmail />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/forgot-password" element={<ForgotPassword />}/>
        <Route path="/reset-password/:token" element={<ResetPassword />}/>
        <Route path="/logout" element={<Logout />} />
       
       
        <Route path="/unauthorized" element={<Unauthorized />} />

         <Route path="/user-dashboard" element={<RoleProtectedRoute allowedRoles={['customer']}> <UserDashboard /></RoleProtectedRoute> }/>
         <Route path="/driver-application" element={<DriverApplication />}/>
         <Route path="/hr-dashboard"  element={<RoleProtectedRoute allowedRoles={["hr"]}><HRDashboard /></RoleProtectedRoute> }/>
         <Route path="/hr-dashboard/applications/:id" element={<RoleProtectedRoute allowedRoles={["hr"]}> <DriverApplicationReview /> </RoleProtectedRoute>}/>
         <Route path="/admin-dashboard" element={<RoleProtectedRoute allowedRoles={["admin"]}> <AdminDashboard /> </RoleProtectedRoute>}/>
    

      </Routes>
  );
}

export default App;

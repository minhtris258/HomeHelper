import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./index.css";

// --- PAGES ---
import Home from "./page/Home";
import Login from "./page/Login";
import Register from "./page/Register";
import NotFound from "./page/404";
import JobDetail from "./page/JobDetail";
import SearchResults from "./page/SearchResults";
import Pricing from "./page/Pricing"; // Trang mua gói cho Chủ nhà

// Admin Pages
import HomeownerManagement from "./page/admin/HomeownerManagement";
import JobManagement from "./page/admin/JobManagement";
import AdminPackageList from "./page/admin/AdminPackageList";   // Quản lý gói
import AdminPackageCreate from "./page/admin/AdminPackageCreate"; // Tạo gói mới

// Employer Pages (Chủ nhà)
import PostJob from "./page/employer/PostJob";
import MyJobs from "./page/employer/MyJobs";
import EditJob from "./page/employer/EditJob";
import JobApplications from "./page/employer/JobApplications";

// Worker Pages (Người giúp việc)
import WorkerProfile from "./page/worker/WorkerProfile";
import AppliedJobs from "./page/worker/AppliedJobs";
import WorkerDashboard from "./page/worker/WorkerDashboard";

// --- LAYOUTS ---
import UserLayout from "./layouts/UserLayout";
import AdminLayout from "./layouts/AdminLayout";

const App = () => {
  return (
    <Router>
      <Routes>
        {/* NHÓM 1: NGƯỜI DÙNG CHUNG (Public) */}
        <Route path="/" element={<UserLayout />}>
          <Route index element={<Home />} />
          <Route path="login" element={<Login />} />
          <Route path="register" element={<Register />} />
          <Route path="jobs" element={<SearchResults />} /> 
          <Route path="job-detail" element={<JobDetail />} />
          <Route path="pricing" element={<Pricing />} /> {/* Chủ nhà vào đây xem gói */}
          <Route path="workers" element={<Home />} /> 
        </Route>

        {/* NHÓM 2: ADMIN (Quản trị hệ thống) */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<JobManagement />} />
          <Route path="pending" element={<HomeownerManagement />} />
          <Route path="jobs" element={<JobManagement />} />
          
          {/* Quản lý gói dịch vụ cho Admin */}
          <Route path="packages" element={<AdminPackageList />} />
          <Route path="packages/create" element={<AdminPackageCreate />} />
        </Route>

        {/* NHÓM 3: CHỦ NHÀ (Employer) */}
        <Route path="/employer" element={<UserLayout />}>
          <Route index element={<MyJobs />} />
          <Route path="my-jobs" element={<MyJobs />} />
          <Route path="post-job" element={<PostJob />} />
          <Route path="edit-job/:id" element={<EditJob />} />
          <Route path="applications/:jobId" element={<JobApplications />} />
        </Route>

        {/* NHÓM 4: NGƯỜI GIÚP VIỆC (Worker) */}
        <Route path="/worker" element={<UserLayout />}>
          <Route index element={<WorkerDashboard />} />
          <Route path="profile" element={<WorkerProfile />} />
          <Route path="my-applications" element={<AppliedJobs />} />
        </Route>

        {/* TRANG LỖI */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
};

export default App;
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/axios";
import JobForm from "../../components/employer/JobForm";

const PostJob = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: "", description: "", jobType: "Full-time", 
    serviceType: "Giúp việc gia đình", salary: "", location: ""
  });

  const handlePost = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post("/Job", formData);
      alert("Đăng tin thành công!");
      navigate("/employer/my-jobs");
    } catch (error) { alert("Lỗi đăng tin!"); }
    finally { setLoading(false); }
  };

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4">
      <JobForm formData={formData} setFormData={setFormData} onSubmit={handlePost} loading={loading} />
    </div>
  );
};

export default PostJob;
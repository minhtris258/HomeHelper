import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../../api/axios";
import JobForm from "../../components/employer/JobForm";

const EditJob = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState(null);

  useEffect(() => {
    const fetchJobData = async () => {
      try {
        const response = await api.get(`/Job/${id}`);
        setFormData(response.data);
      } catch (error) { alert("Không tìm thấy bài đăng!"); }
    };
    fetchJobData();
  }, [id]);

  const handleUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.put(`/Job/${id}`, formData);
      alert("Cập nhật thành công!");
      navigate("/employer/my-jobs");
    } catch (error) { alert("Lỗi cập nhật!"); }
    finally { setLoading(false); }
  };

  if (!formData) return <div className="p-20 text-center">Đang tải dữ liệu bài đăng...</div>;

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4">
      <JobForm 
        formData={formData} 
        setFormData={setFormData} 
        onSubmit={handleUpdate} 
        loading={loading} 
        isEdit={true} 
      />
    </div>
  );
};

export default EditJob;
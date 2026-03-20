import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Eye, Edit, Trash2, Users, Calendar } from "lucide-react";
import api from "../../api/axios";

const MyJobs = () => {
  const [myJobs, setMyJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchMyJobs = async () => {
    try {
      // Backend cần API lấy job theo OwnerId (UserId từ Token)
      const response = await api.get("/Job/my-jobs");
      setMyJobs(response.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyJobs();
  }, []);

  const handleDelete = async (id, title) => {
    if (window.confirm(`Bạn muốn xóa tin: ${title}?`)) {
      try {
        await api.delete(`/Job/${id}`);
        setMyJobs(myJobs.filter((j) => j.id !== id));
      } catch (error) {
        alert("Không thể xóa bài đăng.");
      }
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-10 font-sans">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-900">
            Quản lý tin tuyển dụng
          </h1>
          <p className="text-slate-500 font-medium">
            Bạn có {myJobs.length} bài đăng đang hoạt động
          </p>
        </div>
        <Link
          to="/employer/post-job"
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-8 py-4 rounded-2xl shadow-lg shadow-blue-100 transition-all"
        >
          + Đăng tin mới
        </Link>
      </div>

      {loading ? (
        <div className="text-center py-20 animate-pulse text-slate-400">
          Đang tải danh sách...
        </div>
      ) : (
        <div className="grid gap-6">
          {myJobs.map((job) => (
            <div
              key={job.id}
              className="bg-white border border-slate-100 p-6 rounded-[24px] shadow-sm hover:shadow-md transition-all flex flex-col md:flex-row justify-between items-center gap-6"
            >
              <div className="flex-1">
                <h3 className="text-xl font-bold text-slate-800 mb-2">
                  {job.title}
                </h3>
                <div className="flex flex-wrap gap-4 text-sm text-slate-500 font-medium">
                  <span className="flex items-center gap-1">
                    <Calendar size={14} />{" "}
                    {new Date(job.createdAt).toLocaleDateString("vi-VN")}
                  </span>
                  <span className="flex items-center gap-1 text-blue-600 bg-blue-50 px-2 py-0.5 rounded-lg">
                    {job.serviceType}
                  </span>
                  <span className="flex items-center gap-1 text-green-600 bg-green-50 px-2 py-0.5 rounded-lg font-bold">
                    {job.salary.toLocaleString()} đ
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Link
                  to={`/jobs?id=${job.id}`}
                  className="..."
                  title="Xem trên web"
                >
                  <Eye size={20} />
                </Link>
                <Link
                  to={`/employer/applications/${job.id}`}
                  className="p-3 bg-blue-50 text-blue-600 rounded-xl"
                >
                  <Users size={20} /> Xem ứng viên
                </Link>
                {/* Thêm Link bao quanh nút Edit */}
                <Link
                  to={`/employer/edit-job/${job.id}`}
                  className="p-3 bg-slate-50 text-slate-600 rounded-xl hover:bg-yellow-50 hover:text-yellow-600 transition"
                >
                  <Edit size={20} />
                </Link>

                <button
                  onClick={() => handleDelete(job.id, job.title)}
                  className="..."
                >
                  <Trash2 size={20} />
                </button>
              </div>
            </div>
          ))}
          {myJobs.length === 0 && (
            <div className="text-center py-20 bg-slate-50 rounded-[32px] border-2 border-dashed border-slate-200 text-slate-400 font-medium">
              Bạn chưa có bài đăng nào. Hãy bắt đầu đăng tin tuyển dụng ngay!
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default MyJobs;

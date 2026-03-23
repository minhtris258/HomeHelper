import React, { useEffect, useState } from "react";
import { ShieldAlert, Trash2, Megaphone, Lock, ChevronDown, ChevronUp } from "lucide-react";
import api from "../../api/axios";

const AdminReportManagement = () => {
  const [reportGroups, setReportGroups] = useState([]);
  const [expandedId, setExpandedId] = useState(null);

  const fetchReports = async () => {
    try {
      const res = await api.get("/admin/reports-summary");
      setReportGroups(res.data);
    } catch (err) {
      console.error("Lỗi tải dữ liệu tố cáo");
    }
  };

  useEffect(() => { fetchReports(); }, []);

  // Hành động 1: Nhắc nhở (Cảnh cáo)
  const handleWarn = async (jobId) => {
    if (window.confirm("Gửi cảnh báo nhắc nhở cho bài đăng này?")) {
      await api.put(`/api/Report/warn-job/${jobId}`);
      alert("Đã gửi nhắc nhở!");
      fetchReports();
    }
  };

  // Hành động 2: Xóa bài & Khóa tài khoản (Xử lý vi phạm nặng)
  const handleBlockAction = async (jobId, userId) => {
    if (window.confirm("CẢNH BÁO: Bạn có chắc chắn muốn XÓA BÀI và KHÓA tài khoản này không?")) {
      try {
        await api.delete(`/api/admin/jobs/${jobId}`); // Xóa tin
        await api.put(`/api/admin/users/${userId}/lock`); // Khóa tài khoản
        alert("Đã xóa bài đăng và khóa tài khoản thành công!");
        fetchReports();
      } catch (err) {
        alert("Lỗi khi xử lý vi phạm.");
      }
    }
  };

  return (
    <div className="p-8 text-left">
      <div className="flex items-center gap-3 mb-8">
        <ShieldAlert className="text-red-500" size={32} />
        <h1 className="text-2xl font-black text-slate-800 uppercase">Quản lý tố cáo vi phạm</h1>
      </div>

      <div className="space-y-4">
        {reportGroups.map((group) => (
          <div key={group.jobId} className="bg-white rounded-[32px] border border-slate-100 shadow-sm overflow-hidden">
            <div className="p-6 flex items-center justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <span className="bg-red-500 text-white px-3 py-1 rounded-full text-[10px] font-black animate-pulse">
                    {group.reportCount} TỐ CÁO
                  </span>
                  <span className="text-slate-400 font-bold text-xs">ID Bài: #{group.jobId}</span>
                </div>
                <h3 className="text-lg font-black text-slate-800">{group.jobTitle}</h3>
                <p className="text-xs text-slate-500 font-bold italic mt-1 text-blue-600">ID Chủ nhà: #{group.ownerId}</p>
              </div>

              <div className="flex items-center gap-2">
                <button 
                  onClick={() => handleWarn(group.jobId)}
                  className="p-3 bg-yellow-50 text-yellow-600 rounded-2xl hover:bg-yellow-100 transition-all shadow-sm"
                  title="Gửi nhắc nhở"
                >
                  <Megaphone size={20} />
                </button>
                <button 
                  onClick={() => handleBlockAction(group.jobId, group.ownerId)}
                  className="p-3 bg-red-50 text-red-600 rounded-2xl hover:bg-red-100 transition-all shadow-sm"
                  title="Xóa bài & Khóa tài khoản"
                >
                  <Lock size={20} />
                </button>
                <button 
                  onClick={() => setExpandedId(expandedId === group.jobId ? null : group.jobId)}
                  className="p-3 bg-slate-100 text-slate-500 rounded-2xl hover:bg-slate-200"
                >
                  {expandedId === group.jobId ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                </button>
              </div>
            </div>

            {/* Chi tiết các nội dung tố cáo */}
            {expandedId === group.jobId && (
              <div className="px-6 pb-6 pt-2 bg-slate-50 border-t border-slate-100 animate-in slide-in-from-top duration-300">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Nội dung tố cáo chi tiết:</p>
                <div className="space-y-3">
                  {group.details.map((detail, index) => (
                    <div key={index} className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
                      <p className="text-sm font-black text-red-600 mb-1">[{detail.reason}]</p>
                      <p className="text-sm text-slate-600 font-medium leading-relaxed">{detail.description}</p>
                      <p className="text-[10px] text-slate-400 mt-2 italic font-bold">
                        Ngày gửi: {new Date(detail.createdAt).toLocaleString()}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}

        {reportGroups.length === 0 && (
          <div className="py-20 text-center bg-white rounded-[40px] border-2 border-dashed border-slate-100">
            <p className="text-slate-400 font-black italic uppercase">Hiện tại hệ thống không có tố cáo nào.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminReportManagement;
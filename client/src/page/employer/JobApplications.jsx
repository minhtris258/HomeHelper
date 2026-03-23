import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import {
  User,
  CheckCircle,
  XCircle,
  Phone,
  Mail,
  ChevronLeft,
  Calendar,
  ExternalLink,
  Lock, // Icon khóa mới
  Crown, // Icon vương miện cho gói dịch vụ
} from "lucide-react";
import api from "../../api/axios";

const JobApplications = () => {
  const { jobId } = useParams();
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [jobTitle, setJobTitle] = useState("");

  const fetchApplications = async () => {
    try {
      // Backend trả về danh sách ứng viên kèm theo cờ isLocked dựa trên gói dịch vụ
      const res = await api.get(`/Application/job/${jobId}`);
      setApplications(res.data);
      if (res.data.length > 0) setJobTitle(res.data[0].jobTitle);
    } catch (err) {
      console.error("Lỗi tải danh sách ứng viên:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApplications();
  }, [jobId]);

  const handleStatusUpdate = async (appId, newStatus) => {
    const statusText = newStatus === "Accepted" ? "Chấp nhận" : "Từ chối";
    if (!window.confirm(`Bạn có chắc muốn ${statusText} ứng viên này?`)) return;

    try {
      // API cập nhật trạng thái đơn ứng tuyển
      await api.put(`/Application/status/${appId}`, newStatus, {
        headers: { "Content-Type": "application/json" },
      });
      alert("Cập nhật trạng thái thành công!");
      fetchApplications();
    } catch (err) {
      alert("Lỗi khi cập nhật trạng thái.");
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6 font-sans">
      <div className="mb-8 flex items-center justify-between">
        <Link
          to="/employer/my-jobs"
          className="flex items-center gap-2 text-slate-500 hover:text-blue-600 transition-colors font-bold text-sm"
        >
          <ChevronLeft size={20} /> Quay lại danh sách tin đăng
        </Link>
      </div>

      <div className="bg-white rounded-[40px] shadow-sm border border-slate-100 p-8 md:p-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-slate-800 tracking-tighter">
              Danh sách ứng viên
            </h1>
            <p className="text-blue-600 font-bold mt-1 bg-blue-50 px-3 py-1 rounded-lg inline-block text-sm">
              Công việc: {jobTitle || `Mã tin #${jobId}`}
            </p>
          </div>

          {/* Thông báo cho chủ nhà chưa mua gói */}
          {applications.some((a) => a.isLocked) && (
            <Link
              to="/packages"
              className="flex items-center gap-2 bg-amber-50 text-amber-700 px-4 py-2 rounded-2xl border border-amber-100 hover:bg-amber-100 transition-all"
            >
              <Crown size={18} className="text-amber-500" />
              <span className="text-xs font-bold uppercase">
                Nâng cấp để xem liên hệ
              </span>
            </Link>
          )}
        </div>

        {loading ? (
          <div className="text-center py-20 animate-pulse font-bold text-slate-400">
            Đang kiểm tra hồ sơ ứng viên...
          </div>
        ) : applications.length > 0 ? (
          <div className="grid gap-6">
            {applications.map((app) => (
              <div
                key={app.id}
                className="group bg-white border-2 border-slate-50 hover:border-blue-200 rounded-[32px] p-6 md:p-8 transition-all flex flex-col lg:flex-row justify-between items-center gap-8 shadow-sm"
              >
                <div className="flex items-start gap-6 flex-1 w-full">
                  <div className="w-20 h-20 bg-blue-600 rounded-[24px] flex items-center justify-center text-white font-bold text-2xl shadow-lg shadow-blue-100 flex-shrink-0">
                    {app.workerName?.charAt(0) || "W"}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-xl font-bold text-slate-800 truncate">
                        {app.workerName}
                      </h3>
                      {/* Thêm nút Xem hồ sơ ngay cạnh tên hoặc ở phần thông tin */}
                      <Link
                        to={`/employer/worker-profile/${app.workerId}`}
                        className="flex items-center gap-1.5 bg-blue-50 text-blue-600 px-3 py-1 rounded-lg text-xs font-bold hover:bg-blue-100 transition-all"
                      >
                        <User size={14} /> XEM HỒ SƠ CHI TIẾT
                      </Link>
                    </div>

                    {/* HIỂN THỊ CÓ ĐIỀU KIỆN DỰA TRÊN GÓI DỊCH VỤ */}
                    <div className="space-y-2">
                      {app.isLocked ? (
                        <div className="inline-flex flex-col gap-2 p-4 bg-slate-50 border border-dashed border-slate-200 rounded-2xl w-full max-w-sm">
                          <div className="flex items-center gap-2 text-slate-400 text-xs font-bold uppercase tracking-widest">
                            <Lock size={14} className="text-amber-500" /> Thông
                            tin đã khóa
                          </div>
                          <p className="text-[11px] text-slate-500 font-medium">
                            Bạn cần mua gói dịch vụ để xem Số điện thoại và
                            Email của ứng viên này.
                          </p>
                          <Link
                            to="/pricing"
                            className="text-blue-600 text-xs font-bold underline hover:text-blue-700"
                          >
                            Nâng cấp tài khoản ngay
                          </Link>
                        </div>
                      ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-2 text-sm">
                          <p className="flex items-center gap-2 font-bold text-slate-600 group-hover:text-blue-600 transition-colors">
                            <Mail size={16} className="text-blue-400" />{" "}
                            {app.email}
                          </p>
                          <p className="flex items-center gap-2 font-bold text-slate-600 group-hover:text-blue-600 transition-colors">
                            <Phone size={16} className="text-blue-400" />{" "}
                            {app.phoneNumber}
                          </p>
                        </div>
                      )}
                      <p className="flex items-center gap-2 text-xs font-bold text-slate-400">
                        <Calendar size={14} /> Ngày nộp:{" "}
                        {new Date(app.applyDate).toLocaleDateString("vi-VN")}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3 w-full lg:w-auto border-t lg:border-t-0 pt-4 lg:pt-0">
                  {app.status === "Pending" ? (
                    <>
                      <button
                        onClick={() => handleStatusUpdate(app.id, "Accepted")}
                        className="flex-1 lg:flex-none bg-green-600 hover:bg-green-700 text-white font-bold px-8 py-4 rounded-2xl transition-all shadow-xl shadow-green-100 active:scale-95"
                      >
                        DUYỆT
                      </button>
                      <button
                        onClick={() => handleStatusUpdate(app.id, "Rejected")}
                        className="flex-1 lg:flex-none bg-slate-100 text-slate-500 hover:bg-red-50 hover:text-red-600 font-bold px-8 py-4 rounded-2xl transition-all active:scale-95"
                      >
                        TỪ CHỐI
                      </button>
                    </>
                  ) : (
                    <div
                      className={`px-8 py-4 rounded-2xl font-bold text-sm flex items-center justify-center gap-2 min-w-[160px] ${
                        app.status === "Accepted"
                          ? "bg-green-50 text-green-700 border border-green-100"
                          : "bg-red-50 text-red-700 border border-red-100"
                      }`}
                    >
                      {app.status === "Accepted" ? (
                        <CheckCircle size={18} />
                      ) : (
                        <XCircle size={18} />
                      )}
                      {app.status === "Accepted"
                        ? "ĐÃ CHẤP NHẬN"
                        : "ĐÃ TỪ CHỐI"}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-24 border-4 border-dashed border-slate-50 rounded-[40px]">
            <User size={64} className="mx-auto text-slate-100 mb-6" />
            <h3 className="text-xl font-bold text-slate-300">
              Chưa có ứng viên ứng tuyển
            </h3>
            <p className="text-slate-400 text-sm font-medium mt-2">
              Đừng lo, bài đăng của bạn sẽ sớm nhận được phản hồi!
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default JobApplications;

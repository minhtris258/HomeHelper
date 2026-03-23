import React, { useEffect, useState } from "react";
import { UserCheck, Mail, Calendar, Search, RefreshCw, AlertCircle } from "lucide-react";
import api from "../../api/axios";

const PendingManagement = () => {
  const [pendingUsers, setPendingUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // 1. Hàm lấy danh sách chờ duyệt
  const fetchPending = async () => {
    setLoading(true);
    try {
      const response = await api.get("/User/pending");
      setPendingUsers(response.data);
      setError(null);
    } catch (err) {
      setError("Không thể tải danh sách tài khoản chờ duyệt.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // 2. Hàm phê duyệt tài khoản
  const handleApprove = async (userId, fullName) => {
    if (!window.confirm(`Bạn có chắc chắn muốn duyệt tài khoản của ${fullName}?`)) return;

    try {
      await api.put(`/User/approve/${userId}`);
      alert(`Đã phê duyệt thành công tài khoản: ${fullName}`);
      // Cập nhật lại danh sách sau khi duyệt
      fetchPending();
    } catch (err) {
      alert(err.response?.data?.message || "Có lỗi xảy ra khi phê duyệt.");
    }
  };

  useEffect(() => {
    fetchPending();
  }, []);

  return (
    <div className="p-6 max-w-7xl mx-auto min-h-screen bg-slate-50">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
            <UserCheck className="text-blue-600" />
            Duyệt tài khoản Chủ nhà
          </h1>
          <p className="text-slate-500 text-sm mt-1">
            Danh sách những người đăng ký vai trò Homeowner đang chờ Admin xác nhận.
          </p>
        </div>
        <button 
          onClick={fetchPending}
          className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm font-medium hover:bg-slate-50 transition"
        >
          <RefreshCw size={16} className={loading ? "animate-spin" : ""} />
          Làm mới
        </button>
      </div>

      {/* Main Content */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-20">
          <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          <p className="mt-4 text-slate-500 font-medium">Đang tải dữ liệu...</p>
        </div>
      ) : error ? (
        <div className="bg-red-50 border border-red-200 p-4 rounded-xl flex items-center gap-3 text-red-700">
          <AlertCircle size={20} />
          <p>{error}</p>
        </div>
      ) : pendingUsers.length === 0 ? (
        <div className="bg-white border border-dashed border-slate-300 rounded-2xl py-20 text-center">
          <div className="bg-slate-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
            <UserCheck className="text-slate-400" size={32} />
          </div>
          <h3 className="text-lg font-bold text-slate-700">Tuyệt vời!</h3>
          <p className="text-slate-500">Hiện tại không có tài khoản nào đang chờ duyệt.</p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
          <table className="w-full text-left">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">Họ và Tên</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">Liên hệ</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">Ngày đăng ký</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase text-center">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {pendingUsers.map((user) => (
                <tr key={user.id} className="hover:bg-blue-50/50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center font-bold">
                        {user.fullName?.charAt(0)}
                      </div>
                      <div>
                        <p className=" text-slate-800">{user.fullName}</p>
                        <p className="text-xs text-slate-500">ID: #{user.id}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 text-sm text-slate-600">
                        <Mail size={14} className="text-slate-400" />
                        {user.email}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2 text-sm text-slate-600">
                      <Calendar size={14} className="text-slate-400" />
                      {new Date(user.createdAt).toLocaleDateString("vi-VN")}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <button
                      onClick={() => handleApprove(user.id, user.fullName)}
                      className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-xl text-sm font-bold shadow-md shadow-blue-100 transition-all active:scale-95"
                    >
                      Duyệt
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="bg-slate-50 px-6 py-4 border-t border-slate-200 text-xs text-slate-500">
            Tổng cộng: {pendingUsers.length} tài khoản đang chờ xử lý
          </div>
        </div>
      )}
    </div>
  );
};

export default PendingManagement;
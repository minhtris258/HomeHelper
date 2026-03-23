import React, { useEffect, useState } from "react";
import { Users, Star, Lock, Unlock, Loader2, ShieldCheck, Clock, XCircle } from "lucide-react";
import api from "../../api/axios";

const HomeownerManagement = () => {
  const [owners, setOwners] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchOwners = async () => {
    setLoading(true);
    try {
      // Gọi API lấy danh sách Homeowner
      const res = await api.get("/admin/users-by-role?role=Homeowner");
      setOwners(res.data);
    } catch (err) {
      console.error("Lỗi tải dữ liệu:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchOwners(); }, []);

  const handleToggleLock = async (userId) => {
    try {
      await api.put(`/admin/users/${userId}/lock`);
      fetchOwners(); // Reload dữ liệu sau khi khóa/mở khóa
    } catch (err) { 
      alert("Lỗi khi thay đổi trạng thái tài khoản!"); 
    }
  };

  return (
    <div className="p-8 text-left">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-2xl font-bold flex items-center gap-2 uppercase tracking-tight">
          <Users className="text-indigo-600" size={28} /> Quản lý Chủ nhà ({owners.length})
        </h2>
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <Loader2 className="animate-spin text-indigo-600" size={40}/>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {owners.map(u => (
            <div key={u.id} className="bg-white p-6 rounded-[32px]  shadow-sm relative overflow-hidden">
              {/* Badge Premium */}
              {u.isPremium && (
                <div className="absolute top-0 right-0 bg-amber-400 text-white px-3 py-1 rounded-bl-xl text-[10px] font-bold flex items-center gap-1 shadow-sm">
                  <Star size={10} fill="white"/> PREMIUM
                </div>
              )}
              
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center font-bold text-lg border border-indigo-100">
                  {u.fullName?.charAt(0).toUpperCase() || "U"}
                </div>
                <div>
                  <h3 className="font-bold text-slate-800 flex items-center gap-1.5">
                    {u.fullName} 
                    {u.isApproved ? (
                       <ShieldCheck size={16} className="text-blue-500" title="Đã duyệt" />
                    ) : (
                       <XCircle size={16} className="text-slate-300" title="Chưa duyệt" />
                    )}
                  </h3>
                  <p className="text-[11px] text-slate-400 font-bold">{u.email}</p>
                </div>
              </div>

              {/* Thông tin bổ sung: Ngày tạo & Phê duyệt */}
              <div className="grid grid-cols-2 gap-2 mb-4 bg-slate-50 p-3 rounded-2xl border border-slate-100">
                <div className="flex flex-col">
                  <span className="text-[9px] font-bold text-slate-400 uppercase flex items-center gap-1">
                    <Clock size={10}/> Tham gia
                  </span>
                  <span className="text-[11px] font-bold text-slate-600">
                    {new Date(u.createdAt).toLocaleDateString('vi-VN')}
                  </span>
                </div>
                <div className="flex flex-col border-l border-slate-200 pl-3">
                  <span className="text-[9px] font-bold text-slate-400 uppercase">Hồ sơ</span>
                  <span className={`text-[11px] font-bold ${u.isApproved ? 'text-blue-600' : 'text-amber-500'}`}>
                    {u.isApproved ? "Đã xác thực" : "Chờ duyệt"}
                  </span>
                </div>
              </div>

              <div className="flex justify-between items-center border-t border-slate-50 pt-4 mt-2">
                <div className="flex flex-col">
                  <span className="text-[9px] font-bold text-slate-400 uppercase tracking-tighter">Trạng thái</span>
                  <span className={`text-[10px] font-bold uppercase ${u.isLocked ? 'text-red-500' : 'text-green-500'}`}>
                    {u.isLocked ? "Tài khoản bị khóa" : "Đang hoạt động"}
                  </span>
                </div>
                <button 
                  onClick={() => handleToggleLock(u.id)} 
                  className={`p-2 rounded-xl transition-all shadow-sm ${u.isLocked ? 'bg-green-50 hover:bg-green-100' : 'bg-red-50 hover:bg-red-100'}`}
                >
                  {u.isLocked ? (
                    <Unlock size={20} className="text-green-600" title="Mở khóa" />
                  ) : (
                    <Lock size={20} className="text-red-500" title="Khóa tài khoản" />
                  )}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {!loading && owners.length === 0 && (
        <div className="text-center py-20 bg-white rounded-[40px] border-2 border-dashed border-slate-100">
          <p className="text-slate-400 font-bold italic uppercase">Không tìm thấy dữ liệu chủ nhà.</p>
        </div>
      )}
    </div>
  );
};

export default HomeownerManagement;
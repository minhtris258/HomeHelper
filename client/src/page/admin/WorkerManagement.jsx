import React, { useEffect, useState } from "react";
import { Briefcase, Lock, Unlock, CheckCircle, XCircle, Search, Loader2 } from "lucide-react";
import api from "../../api/axios";

const WorkerManagement = () => {
  const [workers, setWorkers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  const fetchWorkers = async () => {
    setLoading(true);
    try {
      // Đảm bảo URL này khớp với AdminController
      const res = await api.get("/admin/users-by-role?role=Worker");
      setWorkers(res.data);
    } catch (err) {
      console.error("Lỗi: ", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchWorkers(); }, []);

  const handleToggleLock = async (userId) => {
    try {
      await api.put(`/admin/users/${userId}/lock`);
      fetchWorkers();
    } catch (err) {
      alert("Lỗi khi khóa/mở khóa");
    }
  };

  // Lọc dữ liệu tại Frontend để tìm kiếm nhanh
  const filteredWorkers = workers.filter(w => 
    w.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    w.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-8 text-left">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-2xl font-bold flex items-center gap-2">
          <Briefcase className="text-blue-600" /> QUẢN LÝ NGƯỜI GIÚP VIỆC ({workers.length})
        </h2>
        <div className="relative w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input 
            className="w-full pl-10 pr-4 py-2 bg-white border rounded-xl outline-none"
            placeholder="Tìm tên hoặc email..."
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>
      
      <div className="bg-white rounded-[32px]  shadow-sm overflow-hidden">
        <table className="w-full">
          <thead className="bg-slate-50 ">
            <tr>
              <th className="p-5 text-xs font-bold uppercase text-slate-400">Thông tin nhân viên</th>
              <th className="p-5 text-xs font-bold uppercase text-slate-400 text-center">Hồ sơ</th>
              <th className="p-5 text-xs font-bold uppercase text-slate-400 text-center">Trạng thái</th>
              <th className="p-5 text-xs font-bold uppercase text-slate-400 text-right">Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan="4" className="p-20 text-center"><Loader2 className="animate-spin mx-auto text-blue-600"/></td></tr>
            ) : filteredWorkers.map(u => (
              <tr key={u.id} className=" last:border-0 hover:bg-slate-50/50 transition-all">
                <td className="p-5">
                  <p className="font-bold text-slate-600">{u.fullName || "Chưa cập nhật"}</p>
                  <p className="text-xs text-slate-400">{u.email}</p>
                </td>
                <td className="p-5 text-center">
                  {u.isApproved ? 
                    <span className="inline-flex items-center gap-1 text-green-600 font-bold text-[10px] uppercase bg-green-50 px-2 py-1 rounded-md"><CheckCircle size={12}/> Đã duyệt</span> : 
                    <span className="inline-flex items-center gap-1 text-amber-500 font-bold text-[10px] uppercase bg-amber-50 px-2 py-1 rounded-md"><XCircle size={12}/> Chờ duyệt</span>
                  }
                </td>
                <td className="p-5 text-center">
                  <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase ${u.isLocked ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-600'}`}>
                    {u.isLocked ? "Bị khóa" : "Sẵn sàng"}
                  </span>
                </td>
                <td className="p-5 text-right">
                  <button onClick={() => handleToggleLock(u.id)} className="p-2 rounded-xl hover:bg-slate-100 transition-all">
                    {u.isLocked ? <Unlock size={18} className="text-green-600"/> : <Lock size={18} className="text-red-600"/>}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {!loading && filteredWorkers.length === 0 && (
          <div className="p-20 text-center text-slate-400 font-bold italic">Không tìm thấy nhân viên nào.</div>
        )}
      </div>
    </div>
  );
};

export default WorkerManagement;
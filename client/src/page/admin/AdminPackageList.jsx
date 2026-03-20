import React, { useEffect, useState } from "react";
import { Edit, Trash2, Plus, Package } from "lucide-react";
import { Link } from "react-router-dom";
import api from "../../api/axios";

const AdminPackageList = () => {
  const [packages, setPackages] = useState([]);

  useEffect(() => {
    fetchPackages();
  }, []);

  const fetchPackages = () => api.get("/Package").then(res => setPackages(res.data));

  const handleDelete = async (id) => {
    if (window.confirm("Bạn có chắc muốn xóa gói này?")) {
      await api.delete(`/Package/${id}`);
      fetchPackages();
    }
  };

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-2xl font-black flex items-center gap-2"><Package/> Quản lý gói dịch vụ</h2>
        <Link to="/admin/packages/create" className="bg-blue-600 text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2">
          <Plus size={20}/> Tạo gói mới
        </Link>
      </div>

      <div className="bg-white rounded-3xl border shadow-sm overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-slate-50 border-b">
            <tr>
              <th className="px-6 py-4 font-bold text-slate-700">Tên gói</th>
              <th className="px-6 py-4 font-bold text-slate-700">Giá</th>
              <th className="px-6 py-4 font-bold text-slate-700">Thời hạn</th>
              <th className="px-6 py-4 font-bold text-slate-700 text-right">Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {packages.map(pkg => (
              <tr key={pkg.id} className="border-b hover:bg-slate-50 transition">
                <td className="px-6 py-4 font-bold">{pkg.packageName}</td>
                <td className="px-6 py-4 text-blue-600 font-bold">{pkg.price.toLocaleString()}đ</td>
                <td className="px-6 py-4">{pkg.durationDays} ngày</td>
                <td className="px-6 py-4 flex justify-end gap-2">
                   <button onClick={() => handleDelete(pkg.id)} className="p-2 text-red-500 hover:bg-red-50 rounded-lg"><Trash2 size={18}/></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminPackageList;
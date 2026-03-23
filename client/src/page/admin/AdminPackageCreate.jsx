import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/axios";

const AdminPackageCreate = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ packageName: "", price: 0, durationDays: 30, description: "" });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post("/Package", formData);
      alert("Tạo gói thành công!");
      navigate("/admin/packages");
    } catch (err) { alert("Lỗi khi tạo gói."); }
  };

  return (
    <div className="max-w-2xl p-8 mx-auto">
      <div className="bg-white p-8 rounded-[32px]  shadow-sm">
        <h2 className="text-2xl font-bold mb-6">Thêm gói dịch vụ mới</h2>
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-bold mb-2">Tên gói</label>
            <input required className="w-full p-4 bg-slate-50 border rounded-2xl outline-none" 
              onChange={e => setFormData({...formData, packageName: e.target.value})} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-bold mb-2">Giá (VNĐ)</label>
              <input type="number" required className="w-full p-4 bg-slate-50 border rounded-2xl outline-none" 
                onChange={e => setFormData({...formData, price: e.target.value})} />
            </div>
            <div>
              <label className="block text-sm font-bold mb-2">Thời hạn (Ngày)</label>
              <input type="number" required className="w-full p-4 bg-slate-50 border rounded-2xl outline-none" 
                onChange={e => setFormData({...formData, durationDays: e.target.value})} />
            </div>
          </div>
          <div>
            <label className="block text-sm font-bold mb-2 ">Mô tả gói</label>
            <textarea className="w-full p-4 bg-slate-50 border rounded-2xl outline-none" rows="4"
              onChange={e => setFormData({...formData, description: e.target.value})} />
          </div>
          <button className="w-full bg-blue-600 text-white font-medium py-4 rounded-2xl">XÁC NHẬN TẠO</button>
        </form>
      </div>
    </div>
  );
};

export default AdminPackageCreate;
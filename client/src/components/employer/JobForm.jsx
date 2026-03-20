import React from "react";
import { PlusCircle, Save, MapPin, DollarSign, Briefcase, Info } from "lucide-react";

const JobForm = ({ formData, setFormData, onSubmit, loading, isEdit = false }) => {
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  return (
    <div className="max-w-3xl mx-auto bg-white rounded-[32px] shadow-sm border border-slate-100 p-8 md:p-10">
      <div className="flex items-center gap-3 mb-8">
        <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-blue-200">
          {isEdit ? <Save size={28} /> : <PlusCircle size={28} />}
        </div>
        <h1 className="text-3xl font-black text-slate-800">
          {isEdit ? "Chỉnh sửa tin đăng" : "Đăng tin tuyển dụng"}
        </h1>
      </div>

      <form onSubmit={onSubmit} className="space-y-6">
        {/* Tiêu đề */}
        <div>
          <label className="block text-sm font-bold text-slate-700 mb-2 text-left">Tiêu đề tin đăng</label>
          <input
            required
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="Ví dụ: Cần tìm người giúp việc trông trẻ tại Quận 1"
            className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none transition-all font-medium"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left">
          {/* Hình thức */}
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2 flex items-center gap-2">
              <Briefcase size={16}/> Hình thức
            </label>
            <select 
              name="jobType" 
              value={formData.jobType} 
              onChange={handleChange}
              className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none appearance-none font-medium cursor-pointer"
            >
              <option value="Full-time">Full-time</option>
              <option value="Part-time">Part-time</option>
              <option value="Hourly">Theo giờ</option>
            </select>
          </div>

          {/* Dịch vụ */}
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">Dịch vụ</label>
            <select 
              name="serviceType" 
              value={formData.serviceType} 
              onChange={handleChange}
              className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none appearance-none font-medium cursor-pointer"
            >
              <option value="Giúp việc gia đình">Giúp việc gia đình</option>
              <option value="Trông trẻ">Trông trẻ</option>
              <option value="Chăm sóc người già">Chăm sóc người già</option>
              <option value="Nấu ăn">Nấu ăn</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left">
          {/* Lương */}
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2 flex items-center gap-2">
              <DollarSign size={16}/> Mức lương (VNĐ)
            </label>
            <input
              required
              type="number"
              name="salary"
              value={formData.salary}
              onChange={handleChange}
              placeholder="Ví dụ: 8000000"
              className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none font-medium"
            />
          </div>

          {/* Địa điểm */}
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2 flex items-center gap-2">
              <MapPin size={16}/> Khu vực / Địa chỉ
            </label>
            <input
              required
              name="location"
              value={formData.location}
              onChange={handleChange}
              placeholder="Ví dụ: Quận Liên Chiểu, Đà Nẵng"
              className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none font-medium"
            />
          </div>
        </div>

        {/* Mô tả */}
        <div className="text-left">
          <label className="block text-sm font-bold text-slate-700 mb-2 flex items-center gap-2">
            <Info size={16}/> Mô tả chi tiết
          </label>
          <textarea
            required
            name="description"
            rows="5"
            value={formData.description}
            onChange={handleChange}
            placeholder="Mô tả công việc..."
            className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none transition-all font-medium"
          ></textarea>
        </div>

        <button
          disabled={loading}
          className={`w-full text-white font-black py-5 rounded-[20px] shadow-xl transition-all active:scale-[0.98] ${
            isEdit ? "bg-blue-600 hover:bg-blue-700 shadow-blue-100" : "bg-[#3a1a7e] hover:bg-[#2d1463] shadow-purple-100"
          }`}
        >
          {loading ? "ĐANG XỬ LÝ..." : isEdit ? "CẬP NHẬT BÀI ĐĂNG" : "XÁC NHẬN ĐĂNG TIN"}
        </button>
      </form>
    </div>
  );
};

export default JobForm;
import React, { useState, useEffect } from "react";
import { 
  PlusCircle, Save, MapPin, DollarSign, Briefcase, 
  Info, Clock, Users, Calendar, Award 
} from "lucide-react";
import addressData from "../../data/vietnam-locales.json";

const JobForm = ({ formData, setFormData, onSubmit, loading, isEdit = false }) => {
  // Các bang lưu trữ lựa chọn địa chỉ
  const [selectedCity, setSelectedCity] = useState("");
  const [selectedDistrict, setSelectedDistrict] = useState("");
  const [selectedWard, setSelectedWard] = useState("");
  const [houseNumber, setHouseNumber] = useState("");

  // Logic tự động gộp chuỗi địa chỉ mỗi khi có thay đổi ở các ô nhập địa chỉ
  useEffect(() => {
    const fullAddress = [houseNumber, selectedWard, selectedDistrict, selectedCity]
      .filter(item => item !== "" && item !== undefined)
      .join(", ");
    setFormData(prev => ({ ...prev, location: fullAddress }));
  }, [selectedCity, selectedDistrict, selectedWard, houseNumber, setFormData]);

  // Hàm xử lý thay đổi cho các input thông thường
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  return (
    <div className="max-w-4xl mx-auto bg-white rounded-[40px] shadow-sm border border-slate-100 p-8 md:p-12">
      <div className="flex items-center gap-4 mb-10 text-left">
        <div className="w-14 h-14 bg-blue-600 rounded-[20px] flex items-center justify-center text-white shadow-xl shadow-blue-100">
          {isEdit ? <Save size={32} /> : <PlusCircle size={32} />}
        </div>
        <div>
          <h1 className="text-3xl font-black text-slate-800 tracking-tight">
            {isEdit ? "Chỉnh sửa tin đăng" : "Đăng tin tuyển dụng"}
          </h1>
          <p className="text-slate-400 font-medium">Cung cấp đầy đủ thông tin để tìm người giúp việc nhanh nhất</p>
        </div>
      </div>

      <form onSubmit={onSubmit} className="space-y-8">
        {/* Tiêu đề tin đăng */}
        <div>
          <label className="block text-sm font-black text-slate-700 mb-2 uppercase tracking-wider text-left">Tiêu đề tin đăng</label>
          <input
            required
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="Ví dụ: Cần tìm người giúp việc trông trẻ tại Quận Ba Đình"
            className="w-full px-6 py-4 bg-slate-50 border-2 border-transparent focus:border-blue-500 focus:bg-white rounded-2xl outline-none transition-all font-bold text-slate-700"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-left">
          {/* Hình thức làm việc */}
          <div>
            <label className="block text-sm font-black text-slate-700 mb-2 flex items-center gap-2 uppercase tracking-wider">
              <Briefcase size={16}/> Hình thức
            </label>
            <select 
              name="jobType" 
              value={formData.jobType} 
              onChange={handleChange}
              className="w-full px-6 py-4 bg-slate-50 border-2 border-transparent focus:border-blue-500 rounded-2xl outline-none font-bold text-slate-600 cursor-pointer appearance-none"
            >
              <option value="Full-time">Toàn thời gian (Full-time)</option>
              <option value="Part-time">Bán thời gian (Part-time)</option>
              <option value="Hourly">Làm việc theo giờ</option>
            </select>
          </div>

          {/* Loại dịch vụ */}
          <div>
            <label className="block text-sm font-black text-slate-700 mb-2 uppercase tracking-wider">Loại dịch vụ cần tìm</label>
            <input 
              list="service-options"
              name="serviceType" 
              value={formData.serviceType} 
              onChange={handleChange}
              placeholder="Gõ hoặc chọn: Giúp việc nhà, Trông trẻ..."
              className="w-full px-6 py-4 bg-slate-50 border-2 border-transparent focus:border-blue-500 rounded-2xl outline-none font-bold text-slate-600"
            />
            <datalist id="service-options">
              <option value="Giúp việc gia đình" />
              <option value="Trông trẻ tại nhà" />
              <option value="Chăm sóc người già" />
              <option value="Nấu ăn / Đi chợ" />
              <option value="Dọn dẹp văn phòng" />
            </datalist>
          </div>
        </div>

        {/* PHẦN CHỌN ĐỊA CHỈ TỪ JSON */}
        <div className="bg-slate-50 p-6 md:p-8 rounded-[32px] border border-slate-100 space-y-6 text-left">
          <label className="block text-sm font-black text-slate-700 mb-2 flex items-center gap-2 uppercase tracking-wider">
            <MapPin size={16} className="text-blue-600"/> Khu vực làm việc
          </label>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* 1. Chọn Tỉnh / Thành phố */}
            <div className="relative">
              <input 
                list="city-list"
                placeholder="Gõ tìm Tỉnh/Thành..."
                className="w-full px-4 py-4 bg-white border border-slate-200 rounded-xl outline-none font-bold focus:ring-2 focus:ring-blue-400"
                value={selectedCity}
                onChange={(e) => {
                  setSelectedCity(e.target.value);
                  setSelectedDistrict(""); 
                  setSelectedWard("");
                }}
              />
              <datalist id="city-list">
                {addressData.map(city => (
                  <option key={city.Code} value={city.FullName} />
                ))}
              </datalist>
            </div>

            {/* 2. Chọn Quận / Huyện (Wards cấp 1) */}
            <select 
              disabled={!selectedCity}
              className="px-4 py-4 bg-white border border-slate-200 rounded-xl outline-none font-bold disabled:opacity-50 cursor-pointer appearance-none"
              value={selectedDistrict}
              onChange={(e) => {
                setSelectedDistrict(e.target.value);
                setSelectedWard("");
              }}
            >
              <option value="">Chọn Quận/Huyện</option>
              {addressData
                .find(c => c.FullName === selectedCity)
                ?.Wards?.map(d => (
                  <option key={d.Code} value={d.Name}>{d.Name}</option>
                ))}
            </select>

           
          </div>

          <input
            placeholder="Số nhà, tên đường (Ví dụ: 123 Nguyễn Lương Bằng)"
            className="w-full px-6 py-4 bg-white border border-slate-200 rounded-xl outline-none font-bold"
            value={houseNumber}
            onChange={(e) => setHouseNumber(e.target.value)}
          />
          <p className="text-[11px] text-blue-600 font-bold italic pt-2 tracking-tight">
            Địa chỉ hiển thị trên tin đăng: {formData.location}
          </p>
        </div>

        {/* Thông tin yêu cầu chi tiết */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-left">
           <div>
            <label className="block text-sm font-black text-slate-700 mb-2 flex items-center gap-2 uppercase tracking-wider">
              <Clock size={16}/> Giờ làm việc
            </label>
            <input 
              name="workingTime" 
              value={formData.workingTime} 
              onChange={handleChange} 
              placeholder="Ví dụ: 08:00 - 17:00"
              className="w-full px-6 py-4 bg-slate-50 border-2 border-transparent focus:border-blue-500 rounded-2xl outline-none font-bold" 
            />
          </div>
          <div>
            <label className="block text-sm font-black text-slate-700 mb-2 flex items-center gap-2 uppercase tracking-wider">
              <Users size={16}/> Giới tính
            </label>
            <select 
              name="genderReq" 
              value={formData.genderReq} 
              onChange={handleChange}
              className="w-full px-6 py-4 bg-slate-50 border-2 border-transparent focus:border-blue-500 rounded-2xl outline-none font-bold appearance-none cursor-pointer"
            >
              <option value="Không yêu cầu">Không yêu cầu</option>
              <option value="Nam">Chỉ tuyển Nam</option>
              <option value="Nữ">Chỉ tuyển Nữ</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-black text-slate-700 mb-2 flex items-center gap-2 uppercase tracking-wider">
              <Calendar size={16}/> Độ tuổi
            </label>
            <input 
              name="ageReq" 
              value={formData.ageReq} 
              onChange={handleChange} 
              placeholder="Ví dụ: 20 - 45 tuổi"
              className="w-full px-6 py-4 bg-slate-50 border-2 border-transparent focus:border-blue-500 rounded-2xl outline-none font-bold" 
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-left">
          {/* Mức lương */}
          <div>
            <label className="block text-sm font-black text-slate-700 mb-2 flex items-center gap-2 uppercase tracking-wider">
              <DollarSign size={16}/> Mức lương dự kiến (VNĐ)
            </label>
            <input
              required
              type="number"
              name="salary"
              value={formData.salary}
              onChange={handleChange}
              placeholder="Ví dụ: 8000000"
              className="w-full px-6 py-4 bg-slate-50 border-2 border-transparent focus:border-blue-500 rounded-2xl outline-none font-black text-blue-600 text-lg"
            />
          </div>
          {/* Kỹ năng cần thiết */}
          <div>
            <label className="block text-sm font-black text-slate-700 mb-2 flex items-center gap-2 uppercase tracking-wider">
              <Award size={16}/> Kỹ năng cần thiết
            </label>
            <input 
              name="requiredSkills" 
              value={formData.requiredSkills} 
              onChange={handleChange} 
              placeholder="Ví dụ: Nấu ăn ngon, Biết chăm em bé..."
              className="w-full px-6 py-4 bg-slate-50 border-2 border-transparent focus:border-blue-500 rounded-2xl outline-none font-bold" 
            />
          </div>
        </div>

        {/* Mô tả công việc */}
        <div className="text-left">
          <label className="block text-sm font-black text-slate-700 mb-2 flex items-center gap-2 uppercase tracking-wider">
            <Info size={16}/> Mô tả chi tiết công việc
          </label>
          <textarea
            required
            name="description"
            rows="6"
            value={formData.description}
            onChange={handleChange}
            placeholder="Hãy mô tả chi tiết các đầu việc cần làm để người lao động dễ dàng ứng tuyển..."
            className="w-full px-6 py-4 bg-slate-50 border-2 border-transparent focus:border-blue-500 rounded-2xl outline-none transition-all font-bold text-slate-600 italic"
          ></textarea>
        </div>

        {/* Nút gửi form */}
        <button
          disabled={loading}
          className={`w-full text-white font-black py-6 rounded-[24px] shadow-2xl transition-all active:scale-[0.98] text-lg uppercase tracking-widest ${
            isEdit ? "bg-blue-600 hover:bg-blue-700 shadow-blue-100" : "bg-[#3a1a7e] hover:bg-[#2d1463] shadow-purple-200"
          } disabled:bg-slate-300 disabled:shadow-none`}
        >
          {loading ? "ĐANG XỬ LÝ DỮ LIỆU..." : isEdit ? "CẬP NHẬT BÀI ĐĂNG" : "XÁC NHẬN ĐĂNG TIN"}
        </button>
      </form>
    </div>
  );
};

export default JobForm;
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search, MapPin, Briefcase } from "lucide-react";

const HomeSearchBar = () => {
  const navigate = useNavigate();
  const [keyword, setKeyword] = useState("");
  const [location, setLocation] = useState("");

  const handleSearch = (e) => {
    e.preventDefault();
    // Chuyển hướng sang trang /jobs kèm theo query parameters
    navigate(`/jobs?keyword=${encodeURIComponent(keyword)}&location=${encodeURIComponent(location)}`);
  };

  return (
    <div className="w-full max-w-4xl mx-auto -mt-12 relative z-10 px-4">
      <form 
        onSubmit={handleSearch}
        className="bg-white p-2 md:p-4 rounded-2xl shadow-2xl border border-slate-100 flex flex-col md:flex-row gap-2"
      >
        {/* Nhập từ khóa */}
        <div className="flex-[2] relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
          <input
            type="text"
            placeholder="Tên công việc, vị trí tuyển dụng..."
            className="w-full pl-12 pr-4 py-3 rounded-xl bg-slate-50 focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none transition-all"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
          />
        </div>

        {/* Chọn địa điểm */}
        <div className="flex-1 relative">
          <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
          <select
            className="w-full pl-12 pr-4 py-3 rounded-xl bg-slate-50 focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none appearance-none cursor-pointer"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
          >
            <option value="">Tất cả địa điểm</option>
            <option value="Thừa Thiên Huế">Thừa Thiên Huế</option>
            <option value="Đà Nẵng">Đà Nẵng</option>
            <option value="Hà Nội">Hà Nội</option>
            <option value="TP.HCM">TP.HCM</option>
          </select>
        </div>

        {/* Nút Tìm kiếm */}
        <button
          type="submit"
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-8 py-3 rounded-xl transition-all shadow-lg shadow-blue-200 active:scale-95"
        >
          Tìm kiếm
        </button>
      </form>
      
      {/* Gợi ý nhanh (Optional) */}
      <div className="mt-4 flex flex-wrap gap-2 justify-center">
        <span className="text-sm text-slate-500">Gợi ý:</span>
        {["Giúp việc theo giờ", "Trông trẻ", "Nấu ăn"].map((tag) => (
          <button
            key={tag}
            type="button"
            onClick={() => navigate(`/jobs?keyword=${tag}`)}
            className="text-sm text-blue-600 hover:underline font-medium"
          >
            {tag}
          </button>
        ))}
      </div>
    </div>
  );
};

export default HomeSearchBar;
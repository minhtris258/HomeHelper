import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search, MapPin } from "lucide-react";
import addressData from "../data/vietnam-locales.json"; // File JSON mới của bạn

const HomeSearchBar = () => {
  const navigate = useNavigate();
  const [keyword, setKeyword] = useState("");
  const [location, setLocation] = useState("");

  const handleSearch = (e) => {
    e.preventDefault();
    // Điều hướng sang trang /jobs với FullName của Tỉnh/Thành
    navigate(
      `/jobs?keyword=${encodeURIComponent(keyword)}&location=${encodeURIComponent(location)}`,
    );
  };

  return (
    <div className="w-full max-w-4xl mx-auto -mt-12 relative z-10 px-4">
      <form
        onSubmit={handleSearch}
        className="bg-white p-2 md:p-4 rounded-[24px] shadow-2xl border border-slate-100 flex flex-col md:flex-row gap-3"
      >
        {/* Nhập từ khóa */}
        <div className="flex-[2] relative">
          <Search
            className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400"
            size={20}
          />
          <input
            type="text"
            placeholder="Tìm giúp việc, trông trẻ, nấu ăn..."
            className="w-full pl-14 pr-4 py-4 rounded-2xl bg-slate-50 focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none transition-all font-medium text-slate-700"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
          />
        </div>

        {/* Chọn địa điểm từ JSON mới */}
        <div className="flex-1 relative">
          <MapPin
            className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400"
            size={20}
          />
          <select
            className="w-full pl-14 pr-10 py-4 rounded-2xl bg-slate-50 focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none appearance-none cursor-pointer font-medium text-slate-600 shadow-sm"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
          >
            <option value="">Tất cả địa điểm</option>
            {addressData.map((province) => (
              // Sử dụng province.FullName (Thành phố Hà Nội) để đồng bộ với Database
              <option key={province.Code} value={province.FullName}>
                {province.FullName}
              </option>
            ))}
          </select>
          {/* Custom Arrow */}
          <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="m6 9 6 6 6-6" />
            </svg>
          </div>
        </div>

        <button
          type="submit"
          className="bg-[#3a1a7e] hover:bg-[#2d1463] text-white font-bold px-10 py-4 rounded-2xl transition-all shadow-xl shadow-purple-100 active:scale-95 uppercase tracking-wider"
        >
          Tìm kiếm
        </button>
      </form>
    </div>
  );
};

export default HomeSearchBar;

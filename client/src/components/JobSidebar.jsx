import React, { useState, useEffect } from "react";
import { DollarSign, Briefcase, Sparkles, Filter } from "lucide-react";

const JobSidebar = ({ onFilterChange, totalResults, currentFilters }) => {
  // Khởi tạo state từ props truyền vào để đồng bộ với URL
  const [filters, setFilters] = useState({
    minSalary: currentFilters?.minSalary || "",
    jobType: currentFilters?.jobType || "",
    serviceType: currentFilters?.serviceType || ""
  });

  // Cập nhật state khi props currentFilters thay đổi (ví dụ khi nhấn Xóa lọc)
  useEffect(() => {
    setFilters({
      minSalary: currentFilters?.minSalary || "",
      jobType: currentFilters?.jobType || "",
      serviceType: currentFilters?.serviceType || ""
    });
  }, [currentFilters]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    const newFilters = { ...filters, [name]: value };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const clearFilters = () => {
    const reset = { minSalary: "", jobType: "", serviceType: "" };
    setFilters(reset);
    onFilterChange(reset);
  };

  return (
    <div className="w-full lg:w-80 space-y-6">
      <div className="bg-white rounded-[32px] border border-slate-100 p-6 shadow-sm sticky top-24">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-2 text-slate-800 text-left">
            <Filter size={20} className="text-blue-600" />
            <h2 className="font-black text-lg uppercase tracking-tight">Lọc kết quả</h2>
          </div>
          <button 
            onClick={clearFilters}
            className="text-[10px] font-black text-blue-600 hover:text-red-500 uppercase tracking-widest transition-colors"
          >
            Xóa lọc
          </button>
        </div>

        <div className="space-y-8 text-left">
          {/* Lọc theo Mức lương */}
          <div className="space-y-3">
            <label className="flex items-center gap-2 text-xs font-black text-slate-400 uppercase tracking-widest">
              <DollarSign size={14} /> Lương tối thiểu
            </label>
            <select
              name="minSalary"
              value={filters.minSalary}
              onChange={handleInputChange}
              className="w-full p-4 bg-slate-50 border-2 border-transparent focus:border-blue-500 rounded-2xl outline-none font-bold text-slate-600 appearance-none cursor-pointer transition-all"
            >
              <option value="">Tất cả mức lương</option>
              <option value="5000000">Từ 5.000.000đ</option>
              <option value="8000000">Từ 8.000.000đ</option>
              <option value="12000000">Từ 12.000.000đ</option>
            </select>
          </div>

          {/* Lọc theo Loại công việc */}
          <div className="space-y-3">
            <label className="flex items-center gap-2 text-xs font-black text-slate-400 uppercase tracking-widest">
              <Briefcase size={14} /> Loại công việc
            </label>
            <div className="grid gap-2">
              {["Full-time", "Part-time", "Hourly"].map((type) => (
                <button
                  key={type}
                  type="button"
                  onClick={() => handleInputChange({ target: { name: "jobType", value: filters.jobType === type ? "" : type }})}
                  className={`text-left px-4 py-3 rounded-xl font-bold text-sm transition-all border-2 ${
                    filters.jobType === type 
                    ? "bg-blue-600 border-blue-600 text-white shadow-lg" 
                    : "bg-white border-slate-100 text-slate-500 hover:border-blue-200"
                  }`}
                >
                  {type === "Hourly" ? "Làm theo giờ" : type}
                </button>
              ))}
            </div>
          </div>

          {/* Lọc theo Dịch vụ */}
          <div className="space-y-3">
            <label className="flex items-center gap-2 text-xs font-black text-slate-400 uppercase tracking-widest">
              <Sparkles size={14} /> Dịch vụ cụ thể
            </label>
            <input
              list="sidebar-service-list"
              name="serviceType"
              placeholder="Ví dụ: Nấu ăn..."
              value={filters.serviceType}
              onChange={handleInputChange}
              className="w-full p-4 bg-slate-50 border-2 border-transparent focus:border-blue-500 rounded-2xl outline-none font-bold text-slate-600 transition-all"
            />
            <datalist id="sidebar-service-list">
              <option value="Giúp việc gia đình" />
              <option value="Trông trẻ" />
              <option value="Chăm sóc người già" />
            </datalist>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-slate-50 text-left">
          <p className="text-[11px] text-slate-400 font-bold italic">
            Tìm thấy <span className="text-blue-600">{totalResults}</span> công việc phù hợp
          </p>
        </div>
      </div>
    </div>
  );
};

export default JobSidebar;
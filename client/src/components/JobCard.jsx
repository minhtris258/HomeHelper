import React from "react";
import { MapPin, DollarSign, Briefcase } from "lucide-react";

const JobCard = ({ job, onClick }) => {
  // Hàm bổ trợ để lấy tên thành phố từ địa chỉ đầy đủ
  const getCityOnly = (fullAddress) => {
    if (!fullAddress) return "Chưa xác định";
    const parts = fullAddress.split(",");
    return parts[parts.length - 1].trim();
  };

  return (
    <div
      className="bg-white border border-slate-100 p-5 rounded-2xl shadow-sm hover:shadow-md hover:border-blue-200 transition-all cursor-pointer group relative text-left"
      onClick={() => onClick(job)}
    >
      <div className="flex gap-4">
        <div className="w-16 h-16 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600 font-bold text-xl border border-blue-100 flex-shrink-0">
          {job.title.charAt(0)}
        </div>

        <div className="flex-1">
          <h3 className="font-bold text-slate-800  group-hover:text-blue-600 transition-colors mb-1">
            {job.title}
          </h3>

          <div className="flex flex-wrap gap-2 mb-3">
            <span className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded font-bold uppercase">
              ID: {job.id}
            </span>
            <span className="text-[10px] bg-blue-100 text-blue-700 px-2 py-0.5 rounded font-bold uppercase">
              {job.jobType === "Hourly" ? "Làm theo giờ" : job.jobType}
            </span>
          </div>

          <div className="flex flex-wrap gap-y-2 gap-x-4 text-sm">
            <div className="flex items-center gap-1.5 text-blue-600 font-bold bg-blue-50 px-2.5 py-1 rounded-lg">
              <DollarSign size={16} />
              {job.salary.toLocaleString("vi-VN")} đ
            </div>
            <div className="flex items-center gap-1.5 text-slate-500 font-medium">
              <MapPin size={16} />
              {getCityOnly(job.location)}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobCard;

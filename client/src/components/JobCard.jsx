import React from "react";
import { MapPin, DollarSign, Clock, Heart } from "lucide-react";

const JobCard = ({ job, onClick }) => {
  return (
    <div 
      className="bg-white border border-slate-100 p-5 rounded-2xl shadow-sm hover:shadow-md hover:border-blue-200 transition-all cursor-pointer group relative"
      onClick={() => onClick(job)}
    >
      <div className="flex gap-4">
        {/* Logo giả lập (có thể thay bằng job.logoUrl nếu có) */}
        <div className="w-16 h-16 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600 font-bold text-xl border border-blue-100 flex-shrink-0">
          {job.title.charAt(0)}
        </div>

        <div className="flex-1">
          <div className="flex justify-between items-start">
            <h3 className="font-bold text-slate-800 text-lg group-hover:text-blue-600 transition-colors">
              {job.title}
            </h3>
            <button className="text-slate-400 hover:text-red-500 transition-colors" onClick={(e) => e.stopPropagation()}>
              <Heart size={20} />
            </button>
          </div>
          
          <p className="text-slate-500 text-sm font-medium mb-3">ID đăng bài: #{job.id}</p>
          
          <div className="flex flex-wrap gap-y-2 gap-x-4 text-sm">
            <div className="flex items-center gap-1.5 text-blue-600 font-bold bg-blue-50 px-2.5 py-1 rounded-lg">
              <DollarSign size={16} />
              {job.salary.toLocaleString('vi-VN')} đ
            </div>
            <div className="flex items-center gap-1.5 text-slate-500">
              <MapPin size={16} />
              {job.location}
            </div>
          </div>
        </div>
      </div>

      <div className="mt-4 pt-4 border-t border-slate-50 flex justify-between items-center text-xs text-slate-400">
        <div className="flex items-center gap-1">
          <Clock size={14} />
          Còn 15 ngày
        </div>
        <span className="italic">Đăng bởi {job.serviceType}</span>
      </div>
    </div>
  );
};

export default JobCard;
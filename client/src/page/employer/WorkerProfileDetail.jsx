import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ChevronLeft, Star, Briefcase, MapPin, Award, Quote } from "lucide-react";
import api from "../../api/axios";

const WorkerProfileDetail = () => {
  const { userId } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        // Gọi API GetProfile(userId) từ ProfileController.cs
        const res = await api.get(`/Profile/${userId}`);
        setData(res.data);
      } catch (err) {
        console.error("Lỗi tải hồ sơ:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [userId]);

  if (loading) return <div className="p-20 text-center font-black text-slate-400">Đang tải hồ sơ ứng viên...</div>;
  if (!data) return <div className="p-20 text-center font-black text-red-500">Không tìm thấy hồ sơ ứng viên này.</div>;

  return (
    <div className="max-w-4xl mx-auto p-6 font-sans text-left">
      <button onClick={() => navigate(-1)} className="mb-6 flex items-center gap-2 text-slate-500 font-bold hover:text-blue-600">
        <ChevronLeft size={20} /> Quay lại
      </button>

      <div className="bg-white rounded-[40px] shadow-sm border border-slate-100 p-8 md:p-12">
        <div className="flex flex-col md:flex-row gap-8 items-center md:items-start mb-10">
          <div className="w-32 h-32 bg-blue-600 rounded-[32px] flex items-center justify-center text-white text-4xl font-black shadow-xl">
            {data.userInfo.fullName?.charAt(0)}
          </div>
          <div>
            <h1 className="text-3xl font-black text-slate-800 mb-2">{data.userInfo.fullName}</h1>
            <div className="flex flex-wrap gap-3">
              <span className="flex items-center gap-1.5 bg-slate-50 text-slate-500 px-3 py-1 rounded-full text-xs font-bold">
                <MapPin size={14}/> {data.profile.address || "Chưa cập nhật địa chỉ"}
              </span>
              <span className="flex items-center gap-1.5 bg-blue-50 text-blue-600 px-3 py-1 rounded-full text-xs font-bold">
                <Star size={14}/> {data.profile.age} tuổi
              </span>
            </div>
            
            {/* Hiển thị SĐT/Email có điều kiện (Logic đã có ở Backend) */}
            <div className="mt-4 space-y-1">
               <p className="text-sm font-bold text-slate-600 italic">Liên hệ: {data.userInfo.phoneNumber}</p>
            </div>
          </div>
        </div>

        <div className="grid gap-8">
          {/* PHẦN KỸ NĂNG */}
          <div className="bg-slate-50 rounded-[32px] p-6 border border-slate-100">
            <h3 className="flex items-center gap-2 font-black text-slate-800 uppercase text-xs tracking-widest mb-4">
              <Award size={18} className="text-blue-600"/> Kỹ năng chuyên môn
            </h3>
            <div className="flex flex-wrap gap-2">
              {data.profile.skills?.split(',').map((skill, index) => (
                <span key={index} className="bg-white border border-slate-200 px-4 py-2 rounded-xl text-sm font-bold text-slate-600 shadow-sm">
                  {skill.trim()}
                </span>
              ))}
            </div>
          </div>

          {/* PHẦN KINH NGHIỆM */}
          <div>
            <h3 className="flex items-center gap-2 font-black text-slate-800 uppercase text-xs tracking-widest mb-4 pl-2">
              <Briefcase size={18} className="text-blue-600"/> Kinh nghiệm làm việc
            </h3>
            <div className="p-6 border-2 border-dashed border-slate-100 rounded-[32px] font-bold text-slate-600 leading-relaxed">
              {data.profile.experience || "Ứng viên chưa cập nhật kinh nghiệm."}
            </div>
          </div>

          {/* PHẦN GIỚI THIỆU */}
          <div>
            <h3 className="flex items-center gap-2 font-black text-slate-800 uppercase text-xs tracking-widest mb-4 pl-2">
              <Quote size={18} className="text-blue-600"/> Giới thiệu bản thân
            </h3>
            <p className="p-6 bg-blue-50/50 rounded-[32px] text-slate-600 italic font-medium leading-relaxed">
              "{data.profile.bio || "Không có lời giới thiệu."}"
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WorkerProfileDetail;
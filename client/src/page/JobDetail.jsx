import React, { useEffect, useState } from "react";
import { useSearchParams, Link, useNavigate } from "react-router-dom";
import { 
  DollarSign, MapPin, Briefcase, GraduationCap, 
  Send, Heart, Clock, ChevronLeft, Sparkles, Loader2, CheckCircle, Phone
} from "lucide-react";
import api from "../api/axios";

const JobDetail = () => {
  const [searchParams] = useSearchParams();
  const jobId = searchParams.get("id"); 
  const navigate = useNavigate(); 
  
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [companyHotline, setCompanyHotline] = useState("");

  useEffect(() => {
    const fetchJobDetail = async () => {
      if (!jobId) return;
      setLoading(true);
      try {
        const response = await api.get(`/Job/${jobId}`);
        setJob(response.data);
      } catch (error) {
        console.error("Lỗi khi tải chi tiết:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchJobDetail();
  }, [jobId]);

  const handleApply = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("Vui lòng đăng nhập!");
      navigate("/login");
      return;
    }

    setSubmitting(true);
    try {
      const res = await api.post("/Application", { jobId: parseInt(jobId) });
      // Đảm bảo Backend trả về field hotline
      setCompanyHotline(res.data.hotline || "1900 1234");
      setShowSuccessModal(true); 
    } catch (error) {
      alert(error.response?.data?.message || "Lỗi ứng tuyển");
    } finally {
      setSubmitting(false);
    }
  };

  if (!jobId) return <div className="py-20 text-center font-bold">Vui lòng chọn một công việc để xem.</div>;
  if (loading) return <div className="py-20 text-center animate-pulse text-slate-400 font-medium italic">Đang tải chi tiết công việc...</div>;
  if (!job) return <div className="py-20 text-center text-red-500 font-extrabold uppercase tracking-widest">Công việc không tồn tại!</div>;

  return (
    <div className="bg-slate-50 min-h-screen pb-20 font-sans">
      {/* --- SUCCESS MODAL: PHẢI NẰM TRONG RETURN --- */}
      {showSuccessModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
          <div className="bg-white rounded-[40px] p-8 max-w-sm w-full text-center shadow-2xl animate-in zoom-in duration-300">
            <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle size={48} />
            </div>
            <h3 className="text-2xl font-black text-slate-800 mb-2">Ứng tuyển thành công!</h3>
            <p className="text-slate-500 text-sm mb-8 font-medium">
              Hệ thống đã ghi nhận hồ sơ của bạn. Để được hỗ trợ kết nối nhanh nhất, vui lòng liên hệ:
            </p>
            
            <div className="bg-blue-50 border-2 border-blue-100 rounded-3xl p-6 mb-8 group">
              <p className="text-[10px] font-black text-blue-400 uppercase tracking-[3px] mb-1">Hotline hỗ trợ</p>
              <a href={`tel:${companyHotline}`} className="text-3xl font-black text-blue-700 flex items-center justify-center gap-3">
                <Phone className="fill-blue-700" size={24} />
                {companyHotline}
              </a>
            </div>

            <button 
              onClick={() => setShowSuccessModal(false)}
              className="w-full bg-slate-900 text-white font-black py-4 rounded-2xl hover:bg-black transition-all"
            >
              ĐÃ HIỂU
            </button>
          </div>
        </div>
      )}

      {/* --- GIAO DIỆN CHÍNH --- */}
      <div className="max-w-5xl mx-auto px-4 py-6">
        <Link to="/jobs" className="flex items-center gap-1 text-slate-500 hover:text-blue-600 transition text-sm font-bold">
          <ChevronLeft size={18} /> Quay về danh sách việc làm
        </Link>
      </div>

      <div className="max-w-5xl mx-auto px-4">
        <div className="bg-white rounded-[32px] shadow-sm border border-slate-100 p-8 md:p-10 mb-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 bg-blue-600 text-white px-6 py-2 rounded-bl-3xl font-black text-xs uppercase tracking-tighter">
            Đang tuyển dụng
          </div>

          <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-8 leading-tight pr-20">
            {job.title}
          </h1>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-10">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600 border border-blue-100 shadow-sm">
                <DollarSign size={28} />
              </div>
              <div>
                <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest">Mức lương</p>
                <p className="font-black text-blue-600 text-lg leading-none mt-1">{job.salary?.toLocaleString()} đ</p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600 border border-blue-100 shadow-sm">
                <MapPin size={28} />
              </div>
              <div>
                <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest">Khu vực</p>
                <p className="font-black text-slate-700 text-sm leading-tight mt-1">{job.location}</p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600 border border-blue-100 shadow-sm">
                <Briefcase size={28} />
              </div>
              <div>
                <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest">Hình thức</p>
                <p className="font-black text-slate-700 text-sm mt-1">{job.jobType}</p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600 border border-blue-100 shadow-sm">
                <GraduationCap size={28} />
              </div>
              <div>
                <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest">Dịch vụ</p>
                <p className="font-black text-slate-700 text-sm truncate mt-1">{job.serviceType}</p>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4">
            <button 
              onClick={handleApply}
              disabled={submitting}
              className={`flex-[2] text-white font-black py-5 rounded-[20px] flex items-center justify-center gap-3 shadow-xl transition-all active:scale-[0.97]
                ${submitting ? "bg-slate-400 cursor-not-allowed" : "bg-[#3a1a7e] hover:bg-[#2d1463] shadow-purple-200"}`}
            >
              {submitting ? (
                <Loader2 size={22} className="animate-spin" />
              ) : (
                <>
                  <Send size={22} />
                  ỨNG TUYỂN NGAY
                </>
              )}
            </button>

            <button className="flex-1 px-8 py-5 bg-slate-100 hover:bg-white text-slate-700 hover:text-red-500 font-bold rounded-[20px] flex items-center justify-center gap-2 transition-all border-2 border-transparent hover:border-red-100 group">
              <Heart size={22} className="group-hover:fill-red-500 transition-all" />
              Lưu việc làm
            </button>
          </div>
        </div>

        <div className="bg-white rounded-[32px] shadow-sm border border-slate-100 p-8 md:p-10">
          <h2 className="text-2xl font-black text-slate-800 mb-8 border-l-[6px] border-blue-600 pl-5 leading-none">
            Mô tả chi tiết
          </h2>
          <div className="text-slate-600 leading-relaxed whitespace-pre-line text-base space-y-4 font-medium italic">
            {job.description || "Nhà tuyển dụng chưa cung cấp mô tả chi tiết."}
          </div>

          <div className="mt-12 p-8 bg-gradient-to-br from-blue-50 to-white rounded-[24px] border border-blue-100 shadow-inner">
            <h4 className="font-black text-blue-900 mb-4 flex items-center gap-2 text-lg uppercase tracking-tighter">
              <Sparkles size={20} className="text-blue-600" />
              Cam kết từ hệ thống HomeHelper
            </h4>
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-3 text-slate-700 font-bold text-sm">
              <li className="flex items-start gap-2">• Tin tuyển dụng đã được xác thực uy tín.</li>
              <li className="flex items-start gap-2">• Không thu bất kỳ phí trung gian nào.</li>
              <li className="flex items-start gap-2">• Đảm bảo quyền lợi và bảo mật thông tin.</li>
              <li className="flex items-start gap-2">• Hỗ trợ giải quyết tranh chấp nhanh chóng.</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobDetail;
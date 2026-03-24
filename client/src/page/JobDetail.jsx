// --- src/page/JobDetail.jsx ---
import React, { useEffect, useState } from "react";
import { useSearchParams, Link, useNavigate } from "react-router-dom";
import {
  DollarSign,
  MapPin,
  Briefcase,
  GraduationCap,
  Send,
  Heart,
  Clock,
  ChevronLeft,
  Sparkles,
  Loader2,
  CheckCircle,
  Phone,
  AlertTriangle,
  Users,
  Calendar,
} from "lucide-react";
import api from "../api/axios";
import Modal from "../components/Modal";
// 1. Import Toastify
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const JobDetail = () => {
  const [searchParams] = useSearchParams();
  const jobId = searchParams.get("id");
  const navigate = useNavigate();

  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [companyHotline, setCompanyHotline] = useState("");
  const [showReportModal, setShowReportModal] = useState(false);
  const [reportData, setReportData] = useState({
    reason: "Lừa đảo",
    description: "",
  });
  const [reporting, setReporting] = useState(false);
  const [isApplied, setIsApplied] = useState(false);

  useEffect(() => {
    const fetchJobDetail = async () => {
      if (!jobId) return;
      setLoading(true);
      try {
        const response = await api.get(`/Job/${jobId}`);

        // SỬA TẠI ĐÂY: Lấy object trực tiếp hoặc từ $values nếu bị bọc
        const jobData = response.data?.$values
          ? response.data.$values[0]
          : response.data;

        setJob(jobData);
      } catch (error) {
        console.error("Lỗi tải chi tiết:", error);
        toast.error("Không thể tải thông tin công việc.");
      } finally {
        setLoading(false);
      }
    };
    fetchJobDetail();
  }, [jobId]);

  // Logic Ứng tuyển
  const handleApply = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      toast.warn("Vui lòng đăng nhập để ứng tuyển!", { position: "top-right" });
      setTimeout(() => navigate("/login"), 1500);
      return;
    }

    setSubmitting(true);
    try {
      const res = await api.post("/Application", { jobId: parseInt(jobId) });
      setCompanyHotline(res.data.hotline || "1900 1234");
      setShowSuccessModal(true);
      setIsApplied(true);
      // Thông báo Toast song song với Modal thành công
      toast.success("Gửi đơn ứng tuyển thành công!");
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Lỗi hệ thống khi ứng tuyển.",
      );
    } finally {
      setSubmitting(false);
    }
  };

  const getCityOnly = (fullAddress) => {
    if (!fullAddress) return "";
    const parts = fullAddress.split(",");
    return parts[parts.length - 1].trim();
  };

  // Logic Tố cáo
  const handleOpenReport = () => {
    const token = localStorage.getItem("token");
    if (!token) {
      toast.warn("Vui lòng đăng nhập để thực hiện tố cáo!");
      setTimeout(() => navigate("/login"), 1500);
      return;
    }
    setShowReportModal(true);
  };

  const handleSendReport = async (e) => {
    e.preventDefault();
    if (!reportData.description) {
      toast.warning("Vui lòng nhập chi tiết nội dung tố cáo.");
      return;
    }

    setReporting(true);
    try {
      await api.post("/Report", {
        targetJobId: parseInt(jobId),
        reason: reportData.reason,
        description: reportData.description,
      });
      toast.success("Gửi tố cáo thành công! Ban quản trị sẽ sớm xem xét.");
      setShowReportModal(false);
      setReportData({ reason: "Lừa đảo", description: "" });
    } catch (error) {
      toast.error("Gửi tố cáo thất bại. Vui lòng thử lại sau.");
    } finally {
      setReporting(false);
    }
  };

  if (!jobId)
    return (
      <div className="py-20 text-center font-bold">
        Vui lòng chọn một công việc.
      </div>
    );
  if (loading)
    return (
      <div className="py-20 text-center animate-pulse text-slate-400 font-medium italic">
        Đang tải chi tiết...
      </div>
    );
  if (!job)
    return (
      <div className="py-20 text-center text-red-500 font-extrabold uppercase tracking-widest">
        Công việc không tồn tại!
      </div>
    );

  return (
    <div className="bg-slate-50 min-h-screen pb-20 font-sans text-left">
      {/* 2. Thêm ToastContainer để hiện thông báo ở góc phải */}
      <ToastContainer position="top-right" autoClose={3000} />

      {/* SUCCESS MODAL */}
      {showSuccessModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
          <div className="bg-white rounded-[40px] p-8 max-w-sm w-full text-center shadow-2xl animate-in zoom-in duration-300">
            <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle size={48} />
            </div>
            <h3 className="text-2xl font-bold text-slate-800 mb-2">
              Ứng tuyển thành công!
            </h3>
            <p className="text-slate-500 text-sm mb-8 font-medium">
              Hệ thống đã ghi nhận hồ sơ của bạn. Liên hệ Hotline hỗ trợ:
            </p>
            <div className="bg-blue-50 border-2 border-blue-100 rounded-3xl p-6 mb-8 group">
              <p className="text-[10px] font-bold text-blue-400 uppercase tracking-[3px] mb-1">
                Hotline hỗ trợ
              </p>
              <a
                href={`tel:${companyHotline}`}
                className="text-3xl font-bold text-blue-700 flex items-center justify-center gap-3"
              >
                <Phone className="fill-blue-700" size={24} /> {companyHotline}
              </a>
            </div>
            <button
              onClick={() => setShowSuccessModal(false)}
              className="w-full bg-slate-900 text-white font-bold py-4 rounded-2xl hover:bg-black transition-all"
            >
              ĐÃ HIỂU
            </button>
          </div>
        </div>
      )}

      {/* REPORT MODAL */}
      {showReportModal && (
        <Modal
          isOpen={showReportModal}
          onClose={() => setShowReportModal(false)}
          title="Tố cáo tin đăng vi phạm"
        >
          <form onSubmit={handleSendReport} className="space-y-6">
            <div className="bg-red-50 border-l-4 border-red-500 p-4 text-red-800 rounded-xl flex items-start gap-3">
              <AlertTriangle className="text-red-600 flex-shrink-0" size={24} />
              <div className="text-sm">
                <p className="font-bold">Lưu ý quan trọng:</p>
                <p className="font-medium text-red-700">
                  Tố cáo sai sự thật có thể dẫn đến việc tài khoản bị khóa.
                </p>
              </div>
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">
                Lý do tố cáo
              </label>
              <select
                value={reportData.reason}
                onChange={(e) =>
                  setReportData({ ...reportData, reason: e.target.value })
                }
                className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:ring-2 focus:ring-blue-500 transition font-medium"
              >
                <option value="Lừa đảo">Lừa đảo / Yêu cầu đặt cọc tiền</option>
                <option value="Sai sự thật">
                  Thông tin không đúng thực tế
                </option>
                <option value="Thái độ xấu">
                  Chủ nhà có hành vi không chuẩn mực
                </option>
                <option value="Khác">Lý do khác...</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">
                Mô tả chi tiết
              </label>
              <textarea
                value={reportData.description}
                onChange={(e) =>
                  setReportData({ ...reportData, description: e.target.value })
                }
                rows="5"
                placeholder="Cung cấp bằng chứng hoặc chi tiết vi phạm..."
                required
                className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:ring-2 focus:ring-blue-500 transition font-medium text-sm"
              />
            </div>
            <div className="flex gap-3">
              <button
                type="submit"
                disabled={reporting}
                className={`flex-1 text-white font-bold py-4 rounded-2xl flex items-center justify-center gap-2 ${reporting ? "bg-slate-400" : "bg-red-500 hover:bg-red-600"}`}
              >
                {reporting ? (
                  <Loader2 size={18} className="animate-spin" />
                ) : (
                  "GỬI TỐ CÁO"
                )}
              </button>
              <button
                type="button"
                onClick={() => setShowReportModal(false)}
                className="px-6 py-4 bg-slate-100 text-slate-600 font-bold rounded-2xl"
              >
                Hủy
              </button>
            </div>
          </form>
        </Modal>
      )}

      {/* Main Content */}
      <div className="max-w-5xl mx-auto px-4 py-6">
        <Link
          to="/jobs"
          className="flex items-center gap-1 text-slate-500 hover:text-blue-600 transition text-sm font-bold"
        >
          <ChevronLeft size={18} /> Quay về danh sách việc làm
        </Link>
      </div>

      <div className="max-w-5xl mx-auto px-4">
        {/* Card thông tin chính */}
        <div className="bg-white rounded-[32px] shadow-sm border border-slate-100 p-8 md:p-10 mb-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 bg-blue-600 text-white px-6 py-2 rounded-bl-3xl font-bold text-xs uppercase tracking-tighter">
            Đang tuyển dụng
          </div>
          <h1 className="text-xl md:text-3xl font-extrabold text-slate-900 mb-8 pr-20">
            {job.title}
          </h1>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-10 text-left">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600 border border-blue-100">
                <DollarSign size={28} />
              </div>
              <div>
                <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest">
                  Mức lương
                </p>
                <p className="font-bold text-blue-600 text-lg">
                  {job.salary?.toLocaleString()} đ
                </p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600 border border-blue-100">
                <MapPin size={28} />
              </div>
              <div>
                <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest">
                  Khu vực
                </p>
                <p className="font-bold text-slate-700 text-sm">
                  {isApplied ? job.location : getCityOnly(job.location)}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600 border border-blue-100">
                <Briefcase size={28} />
              </div>
              <div>
                <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest">
                  Hình thức
                </p>
                <p className="font-bold text-slate-700 text-sm">
                  {job.jobType === "Hourly" ? "Làm theo giờ" : job.jobType}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600 border border-blue-100">
                <GraduationCap size={28} />
              </div>
              <div>
                <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest">
                  Dịch vụ
                </p>
                <p className="font-bold text-slate-700 text-sm truncate">
                  {job.serviceType}
                </p>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4">
            <button
              onClick={handleApply}
              disabled={submitting}
              className={`flex-[3] text-white font-bold py-5 rounded-[20px] flex items-center justify-center gap-3 shadow-xl transition-all ${submitting ? "bg-slate-400" : "bg-[#3a1a7e] hover:bg-[#2d1463]"}`}
            >
              {submitting ? (
                <Loader2 size={22} className="animate-spin" />
              ) : (
                <>
                  <Send size={22} /> ỨNG TUYỂN NGAY
                </>
              )}
            </button>
            <button className="flex-1 px-8 py-5 bg-slate-100 hover:bg-white text-slate-700 hover:text-red-500 font-bold rounded-[20px] flex items-center justify-center gap-2 border-2 border-transparent hover:border-red-100 transition-all group">
              <Heart
                size={22}
                className="group-hover:fill-red-500 transition-all"
              />{" "}
              Lưu
            </button>
            <button
              onClick={handleOpenReport}
              className="px-6 py-5 bg-red-50 text-red-600 hover:bg-red-100 font-bold rounded-[20px] flex items-center justify-center gap-2 transition-all border border-red-100"
            >
              <AlertTriangle size={22} /> Tố cáo
            </button>
          </div>
        </div>

        {/* Detailed Info */}
        <div className="bg-white rounded-[32px] shadow-sm border border-slate-100 p-8 md:p-10 text-left">
          <h2 className="text-2xl font-bold text-slate-800 mb-8 border-l-[6px] border-blue-600 pl-5 leading-none">
            Mô tả chi tiết
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8 bg-slate-50 p-6 rounded-2xl border border-slate-100">
            <div className="flex items-center gap-3">
              <Clock className="text-blue-600" size={24} />
              <div>
                <p className="text-xs text-slate-400 font-bold uppercase">
                  Thời gian
                </p>
                <p className="font-bold text-slate-700 text-sm">
                  {job.workingTime || "Thỏa thuận"}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Users className="text-blue-600" size={24} />
              <div>
                <p className="text-xs text-slate-400 font-bold uppercase">
                  Giới tính
                </p>
                <p className="font-bold text-slate-700 text-sm">
                  {job.genderReq || "Không yêu cầu"}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Calendar className="text-blue-600" size={24} />
              <div>
                <p className="text-xs text-slate-400 font-bold uppercase">
                  Độ tuổi
                </p>
                <p className="font-bold text-slate-700 text-sm">
                  {job.ageReq || "Không yêu cầu"}
                </p>
              </div>
            </div>
          </div>
          <div className="text-slate-600 leading-relaxed whitespace-pre-line text-base font-medium">
            {job.description || "Nhà tuyển dụng chưa cung cấp mô tả chi tiết."}
          </div>
          <div className="mt-12 p-8 bg-gradient-to-br from-blue-50 to-white rounded-[24px] border border-blue-100 shadow-inner">
            <h4 className="font-bold text-blue-900 mb-4 flex items-center gap-2 text-lg uppercase tracking-tighter">
              <Sparkles size={20} className="text-blue-600" /> Cam kết từ
              HomeHelper
            </h4>
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-3 text-slate-700 font-bold text-sm">
              <li>• Tin tuyển dụng đã được xác thực uy tín.</li>
              <li>• Đảm bảo quyền lợi và bảo mật thông tin.</li>
              <li>• Không thu bất kỳ phí trung gian nào.</li>
              <li>• Hỗ trợ giải quyết tranh chấp nhanh chóng.</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobDetail;

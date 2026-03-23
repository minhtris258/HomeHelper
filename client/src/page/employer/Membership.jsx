import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/axios"; // File axios.js của bạn
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  Crown,
  Calendar,
  AlertTriangle,
  CheckCircle2,
  Package,
  ArrowRight,
  ShieldCheck,
} from "lucide-react";

const Membership = () => {
  const [userStatus, setUserStatus] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // 1. Lấy thông tin trạng thái hội viên khi load trang
  useEffect(() => {
    fetchUserStatus();
  }, []);

  const fetchUserStatus = async () => {
    try {
      const userId = localStorage.getItem("userId");
      const res = await api.get(`/Profile/${userId}`);
      const data = res.data.UserInfo;

      setUserStatus({
        isPremium: data.isPremium,
        premiumExpiry: data.premiumExpiry,
        fullName: data.fullName,
      });

      // Cập nhật lại localStorage để các Component khác (như Header) nhận diện đúng
      localStorage.setItem("isPremium", data.isPremium.toString());
      if (data.premiumExpiry) {
        localStorage.setItem("premiumExpiry", data.premiumExpiry);
      }
    } catch (err) {
      toast.error("Lỗi đồng bộ dữ liệu gói.");
    } finally {
      setLoading(false);
    }
  };

  // 2. Xử lý Hủy gói (Gọi tới UserController.cs -> CancelPremium)
  const handleCancelPackage = async () => {
    if (
      !window.confirm(
        "Bạn có chắc chắn muốn hủy gói Premium? Các đặc quyền như xem số điện thoại sẽ bị mất ngay lập tức.",
      )
    ) {
      return;
    }

    try {
      // Khớp với Route [HttpPut("cancel-premium")] trong UserController.cs
      await api.put("/User/cancel-premium");

      toast.success("Đã hủy gói thành công.");

      // Cập nhật lại localStorage để Header đồng bộ ngay lập tức
      localStorage.setItem("isPremium", "false");
      localStorage.removeItem("premiumExpiry");

      // Load lại dữ liệu giao diện
      fetchUserStatus();

      // Thông báo cho hệ thống biết để cập nhật Header (tùy chọn)
      window.dispatchEvent(new Event("storage"));
    } catch (err) {
      console.error("Lỗi hủy gói:", err);
      toast.error(err.response?.data?.message || "Hủy gói thất bại.");
    }
  };

  if (loading)
    return (
      <div className="flex justify-center items-center h-screen text-slate-500 font-bold uppercase tracking-widest animate-pulse">
        Đang kiểm tra quyền hạn...
      </div>
    );

  return (
    <div className="max-w-5xl mx-auto px-4 py-12 font-sans">
      <ToastContainer position="top-right" autoClose={3000} />

      <div className="flex items-center justify-between mb-10">
        <div>
          <h1 className="text-4xl font-bold text-slate-900 uppercase tracking-tighter">
            Trình quản lý <span className="text-blue-600">Hội viên</span>
          </h1>
          <p className="text-slate-500 font-medium mt-1">
            Quản lý các đặc quyền và trạng thái thanh toán của bạn.
          </p>
        </div>
      </div>

      {userStatus?.isPremium ? (
        <div className="grid md:grid-cols-3 gap-8">
          {/* Card Gói Hiện Tại */}
          <div className="md:col-span-2 bg-[#3a1a7e] rounded-[2.5rem] p-10 text-white shadow-2xl relative overflow-hidden flex flex-col justify-between min-h-[400px]">
            {/* Trang trí */}
            <div className="absolute top-[-50px] right-[-50px] w-64 h-64 bg-blue-500/20 rounded-full blur-[80px]"></div>
            <div className="absolute bottom-[-20px] left-[10%] w-32 h-32 bg-purple-500/30 rounded-full blur-[50px]"></div>

            <div className="relative z-10">
              <div className="flex items-center gap-5 mb-8">
                <div className="w-16 h-16 bg-gradient-to-br from-yellow-300 to-orange-500 rounded-2xl flex items-center justify-center shadow-2xl transform -rotate-3">
                  <Crown
                    size={35}
                    className="text-[#3a1a7e]"
                    strokeWidth={2.5}
                  />
                </div>
                <div>
                  <p className="text-blue-300 text-xs font-bold uppercase tracking-[0.2em]">
                    Current Plan
                  </p>
                  <h2 className="text-3xl font-bold italic uppercase tracking-tighter">
                    Premium Membership
                  </h2>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-white/10 backdrop-blur-md p-5 rounded-3xl border border-white/10 flex items-center gap-4">
                  <div className="p-3 bg-white/10 rounded-xl">
                    <Calendar className="text-blue-300" size={24} />
                  </div>
                  <div>
                    <p className="text-[10px] text-blue-200 font-bold uppercase">
                      Ngày hết hạn
                    </p>
                    <p className="text-lg font-bold">
                      {new Date(userStatus.premiumExpiry).toLocaleDateString(
                        "vi-VN",
                        {
                          day: "2-digit",
                          month: "2-digit",
                          year: "numeric",
                        },
                      )}
                    </p>
                  </div>
                </div>
                <div className="bg-white/10 backdrop-blur-md p-5 rounded-3xl border border-white/10 flex items-center gap-4">
                  <div className="p-3 bg-white/10 rounded-xl">
                    <ShieldCheck className="text-green-400" size={24} />
                  </div>
                  <div>
                    <p className="text-[10px] text-blue-200 font-bold uppercase">
                      Trạng thái
                    </p>
                    <p className="text-lg font-bold uppercase text-green-400 italic">
                      Đang hoạt động
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="relative z-10 mt-10 flex gap-4">
              <button
                onClick={() => navigate("/packages")}
                className="px-8 py-4 bg-white text-[#3a1a7e] font-bold rounded-2xl hover:scale-105 transition-all duration-300 uppercase text-xs flex items-center gap-2"
              >
                Gia hạn thêm <ArrowRight size={16} />
              </button>
            </div>
          </div>

          {/* Card Đặc quyền & Huỷ */}
          <div className="bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-xl flex flex-col justify-between border-b-8 border-b-slate-200">
            <div>
              <h3 className="font-bold text-slate-800 uppercase tracking-widest text-sm mb-6 pb-2 border-b-2 border-slate-50">
                Đặc quyền Premium
              </h3>
              <ul className="space-y-4">
                {[
                  "Mở khóa SĐT/Email ứng viên",
                  "Đăng tin không giới hạn",
                  "Huy hiệu Premium nổi bật",
                  "Gợi ý ứng viên phù hợp nhất",
                  "Hỗ trợ ưu tiên 24/7",
                ].map((item, index) => (
                  <li
                    key={index}
                    className="flex items-center gap-3 text-sm text-slate-600 font-bold"
                  >
                    <CheckCircle2
                      size={18}
                      className="text-blue-500 shrink-0"
                      strokeWidth={3}
                    />
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            <div className="mt-10">
              <div className="flex items-start gap-3 text-amber-600 mb-6 bg-amber-50 p-4 rounded-2xl border border-amber-100">
                <AlertTriangle size={20} className="shrink-0 mt-0.5" />
                <p className="text-[10px] font-bold leading-tight uppercase italic">
                  Lưu ý: Nếu hủy gói, bạn sẽ mất quyền liên hệ trực tiếp với
                  người lao động ngay lập tức.
                </p>
              </div>
              <button
                onClick={handleCancelPackage}
                className="w-full py-4 text-red-500 font-bold text-xs uppercase tracking-[0.2em] border-2 border-red-50 rounded-2xl hover:bg-red-50 hover:border-red-100 transition-all duration-300 shadow-sm"
              >
                Hủy gói dịch vụ
              </button>
            </div>
          </div>
        </div>
      ) : (
        /* UI khi chưa mua gói */
        <div className="bg-slate-50 rounded-[3rem] p-16 text-center border-4 border-dashed border-slate-200 flex flex-col items-center">
          <div className="w-24 h-24 bg-white rounded-3xl flex items-center justify-center mb-8 shadow-xl transform rotate-6 border border-slate-100">
            <Package size={45} className="text-slate-300" strokeWidth={1.5} />
          </div>
          <h2 className="text-3xl font-bold text-slate-800 mb-4 uppercase tracking-tighter italic">
            Nâng cấp trải nghiệm của bạn
          </h2>
          <p className="text-slate-500 mb-10 max-w-lg font-bold leading-relaxed">
            Bạn đang sử dụng tài khoản miễn phí. Hãy đăng ký Premium để kết nối
            trực tiếp với{" "}
            <span className="text-blue-600">hàng nghìn người lao động</span>{" "}
            ngay hôm nay!
          </p>
          <button
            onClick={() => navigate("/packages")}
            className="group px-10 py-5 bg-blue-600 text-white font-bold rounded-[2rem] hover:bg-blue-700 transition-all duration-300 shadow-2xl shadow-blue-200 uppercase tracking-widest flex items-center gap-3"
          >
            Xem các gói ưu đãi{" "}
            <ArrowRight
              size={20}
              className="group-hover:translate-x-2 transition-transform"
            />
          </button>
        </div>
      )}

      {/* Footer Support */}
      <p className="text-center text-slate-400 text-[10px] font-bold uppercase tracking-widest mt-12">
        Mọi thắc mắc về thanh toán? Liên hệ{" "}
        <span className="text-blue-500 hover:underline cursor-pointer">
          support@homehelper.com
        </span>
      </p>
    </div>
  );
};

export default Membership;

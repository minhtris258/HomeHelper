import React, { useEffect, useState } from "react";
import { Check, Crown, Zap, ShieldCheck, Loader2 } from "lucide-react";
import api from "../api/axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Pricing = () => {
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/Package").then((res) => {
      setPackages(res.data);
      setLoading(false);
    });
  }, []);

  const handleBuy = async (pkgId) => {
    const userRole = localStorage.getItem("role");

    if (userRole !== "Homeowner") {
      // Đổi vị trí sang top-right để hiện góc bên phải
      toast.error("Chỉ chủ nhà mới có thể nâng cấp gói Premium!", {
        position: "top-right", 
        autoClose: 3000,
      });
      return;
    }

    try {
      const response = await api.post(`/Package/buy/${pkgId}`);
      
      localStorage.setItem('isPremium', 'true');
      localStorage.setItem('premiumExpiry', response.data.premiumExpiry);

      toast.success(`Nâng cấp thành công! ${response.data.message}`, {
        position: "top-right", // Hiện góc bên phải
        autoClose: 2000,
      });
      
      setTimeout(() => {
        window.location.href = "/employer/my-jobs";
      }, 2000);

    } catch (err) {
      const errorMsg = err.response?.data?.message || "Thông tin đăng nhập không chính xác!";
      toast.error(errorMsg, {
        position: "top-right", // Hiện góc bên phải
      });
    }
  };

  if (loading) return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
      <Loader2 className="animate-spin text-blue-600" size={40} />
      <p className="font-black text-slate-400 uppercase tracking-widest text-sm text-center">Đang tải các gói ưu đãi...</p>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto py-24 px-4 font-sans text-left">
      {/* Cấu hình ToastContainer để mặc định hiện bên phải */}
      <ToastContainer position="top-right" hideProgressBar={false} newestOnTop={false} closeOnClick rtl={false} pauseOnFocusLoss draggable pauseOnHover />
      
      <div className="text-center mb-20">
        <h1 className="text-4xl md:text-5xl font-black text-slate-900 mb-6 tracking-tight uppercase">
          Nâng cấp đặc quyền <span className="text-blue-600">Premium</span>
        </h1>
        <p className="text-slate-500 max-w-2xl mx-auto font-bold text-lg leading-relaxed italic">
          Dành riêng cho chủ nhà: Mở khóa thông tin liên hệ và đưa bài đăng lên vị trí ưu tiên.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-10 items-stretch">
        {packages.map((pkg, index) => (
          <div 
            key={pkg.id} 
            className={`relative bg-white border-2 rounded-[48px] p-10 transition-all duration-300 hover:shadow-2xl flex flex-col ${
              index === 1 
              ? "border-blue-600 scale-105 shadow-xl shadow-blue-50 z-10" 
              : "border-slate-100 hover:border-blue-200"
            }`}
          >
            {index === 1 && (
              <div className="absolute -top-6 left-1/2 -translate-x-1/2 bg-blue-600 text-white px-8 py-2.5 rounded-full text-[10px] font-black uppercase tracking-[0.2em] shadow-lg shadow-blue-200">
                Lựa chọn tốt nhất
              </div>
            )}
            
            <div className="mb-12 border-b border-slate-50 pb-8 text-center">
              <div className="flex justify-center mb-4 text-blue-600">
                {index === 0 ? <Zap size={32}/> : index === 1 ? <Crown size={32}/> : <ShieldCheck size={32}/>}
              </div>
              <h3 className="text-2xl font-black text-slate-800 mb-4 uppercase tracking-tight">
                {pkg.packageName}
              </h3>
              <div className="flex items-baseline justify-center gap-1">
                <span className="text-4xl font-black text-slate-900 tracking-tighter">
                  {pkg.price.toLocaleString('vi-VN')}đ
                </span>
                <span className="text-slate-400 font-bold text-sm">/{pkg.durationDays} ngày</span>
              </div>
            </div>

            <ul className="space-y-6 mb-12 flex-1">
              <li className="flex items-start gap-4 text-sm font-bold text-slate-600 leading-tight">
                <div className="bg-green-100 p-1 rounded-full shrink-0">
                  <Check size={14} className="text-green-600" />
                </div>
                Mở khóa Số điện thoại & Email ứng viên
              </li>
              <li className="flex items-start gap-4 text-sm font-bold text-slate-600 leading-tight">
                <div className="bg-green-100 p-1 rounded-full shrink-0">
                  <Check size={14} className="text-green-600" />
                </div>
                Ưu tiên hiển thị bài đăng trên cùng
              </li>
              <li className="flex items-start gap-4 text-sm font-bold text-slate-600 leading-tight">
                <div className="bg-green-100 p-1 rounded-full shrink-0">
                  <Check size={14} className="text-green-600" />
                </div>
                Hỗ trợ chuyên viên tư vấn riêng
              </li>
              <li className="flex items-start gap-4 text-sm font-bold text-slate-600 leading-tight">
                <div className="bg-green-100 p-1 rounded-full shrink-0">
                  <Check size={14} className="text-green-600" />
                </div>
                Xác thực tài khoản uy tín
              </li>
            </ul>

            <button 
              onClick={() => handleBuy(pkg.id)}
              className={`w-full py-5 rounded-[24px] font-black text-sm uppercase tracking-widest transition-all active:scale-95 shadow-xl ${
                index === 1 
                ? "bg-blue-600 text-white hover:bg-blue-700 shadow-blue-200" 
                : "bg-slate-900 text-white hover:bg-black shadow-slate-200"
              }`}
            >
              Nâng cấp ngay
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Pricing;
import React, { useEffect, useState } from "react";
import { Check, Crown, Zap, ShieldCheck } from "lucide-react";
import api from "../api/axios";

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
    try {
      await api.post(`/Package/buy/${pkgId}`);
      alert("Nâng cấp gói thành công! Bạn hiện là thành viên Premium.");
      window.location.href = "/employer/my-jobs";
    } catch (err) {
      alert("Lỗi thanh toán hoặc phiên đăng nhập hết hạn.");
    }
  };

  if (loading) return <div className="p-20 text-center font-bold">Đang tải các gói ưu đãi...</div>;

  return (
    <div className="max-w-7xl mx-auto py-20 px-4 font-sans">
      <div className="text-center mb-16">
        <h1 className="text-4xl font-black text-slate-900 mb-4">Nâng cấp đặc quyền của bạn</h1>
        <p className="text-slate-500 max-w-2xl mx-auto font-medium">
          Mở khóa thông tin liên hệ của người giúp việc và giúp bài đăng của bạn tiếp cận nhanh hơn gấp 5 lần.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {packages.map((pkg, index) => (
          <div key={pkg.id} className={`relative bg-white border-2 rounded-[40px] p-8 transition-all hover:shadow-2xl flex flex-col ${index === 1 ? "border-blue-600 scale-105 shadow-xl" : "border-slate-100"}`}>
            {index === 1 && (
              <span className="absolute -top-5 left-1/2 -translate-x-1/2 bg-blue-600 text-white px-6 py-2 rounded-full text-xs font-black uppercase tracking-widest">Phổ biến nhất</span>
            )}
            
            <div className="mb-8">
              <h3 className="text-xl font-black text-slate-800 mb-2">{pkg.packageName}</h3>
              <div className="flex items-baseline gap-1">
                <span className="text-4xl font-black text-slate-900">{pkg.price.toLocaleString()}đ</span>
                <span className="text-slate-400">/{pkg.durationDays} ngày</span>
              </div>
            </div>

            <ul className="space-y-4 mb-10 flex-1">
              <li className="flex items-center gap-3 text-sm font-bold text-slate-600">
                <Check size={18} className="text-green-500" /> Xem SĐT & Email ứng viên
              </li>
              <li className="flex items-center gap-3 text-sm font-bold text-slate-600">
                <Check size={18} className="text-green-500" /> Ưu tiên hiển thị tin tuyển dụng
              </li>
              <li className="flex items-center gap-3 text-sm font-bold text-slate-600">
                <Check size={18} className="text-green-500" /> Hỗ trợ khách hàng 24/7
              </li>
            </ul>

            <button 
              onClick={() => handleBuy(pkg.id)}
              className={`w-full py-4 rounded-2xl font-black transition-all shadow-lg ${index === 1 ? "bg-blue-600 text-white hover:bg-blue-700 shadow-blue-100" : "bg-slate-900 text-white hover:bg-black shadow-slate-200"}`}
            >
              NÂNG CẤP NGAY
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Pricing;
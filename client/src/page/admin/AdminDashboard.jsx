import React, { useState, useEffect } from "react";
import { Users, ShoppingBag, AlertTriangle, TrendingUp, Package, Activity } from "lucide-react";
import api from "../../api/axios";

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalCustomers: 0,
    totalSales: 0,
    pendingReports: 0,
    topPackageName: "",
    topPackageCount: 0
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await api.get("/Admin/stats");
        setStats(res.data);
      } catch (err) {
        console.error("Lỗi tải thống kê");
      }
    };
    fetchStats();
  }, []);

  const statCards = [
    { title: "Khách mua gói", value: stats.totalCustomers, icon: <Users />, color: "bg-blue-500", detail: "Người dùng duy nhất" },
    { title: "Lượt giao dịch", value: stats.totalSales, icon: <ShoppingBag />, color: "bg-green-500", detail: "Tổng lượt mua" },
    { title: "Báo cáo vi phạm", value: stats.pendingReports, icon: <AlertTriangle />, color: "bg-red-500", detail: "Cần xử lý ngay" },
    { title: "Gói bán chạy nhất", value: stats.topPackageName, icon: <Package />, color: "bg-purple-500", detail: `${stats.topPackageCount} lượt mua` },
  ];

  return (
    <div className="p-8 bg-slate-50 min-h-screen text-left">
      <div className="flex items-center gap-3 mb-10">
        <Activity className="text-blue-600" size={32} />
        <h1 className="text-3xl font-bold text-slate-800 uppercase">Hoạt động hệ thống</h1>
      </div>

      {/* Grid thông số nhanh */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        {statCards.map((card, index) => (
          <div key={index} className="bg-white p-6 rounded-[32px] shadow-sm border border-slate-100 flex flex-col items-start">
            <div className={`${card.color} text-white p-3 rounded-2xl mb-4 shadow-lg`}>
              {card.icon}
            </div>
            <p className="text-slate-400 text-xs font-bold uppercase tracking-widest">{card.title}</p>
            <h2 className="text-3xl font-bold text-slate-800 my-1">{card.value}</h2>
            <p className="text-[10px] font-bold text-slate-500 italic">{card.detail}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Biểu đồ giả lập hoặc Danh sách mua gần đây */}
        <div className="lg:col-span-2 bg-white rounded-[40px] p-8 shadow-sm border border-slate-100">
          <h3 className="font-bold text-slate-800 mb-6 flex items-center gap-2">
            <TrendingUp size={20} className="text-blue-600" /> Xu hướng mua gói
          </h3>
          <div className="h-64 bg-slate-50 rounded-3xl flex items-center justify-center border-2 border-dashed border-slate-200">
            <p className="text-slate-400 font-bold italic">Biểu đồ đang được cập nhật...</p>
          </div>
        </div>

        {/* Thông báo hệ thống */}
        <div className="bg-white rounded-[40px] p-8 shadow-sm border border-slate-100">
          <h3 className="font-bold text-slate-800 mb-6">Thông báo nhanh</h3>
          <div className="space-y-4">
            <div className="p-4 bg-red-50 rounded-2xl border border-red-100">
              <p className="text-xs font-bold text-red-600 uppercase mb-1">Cảnh báo</p>
              <p className="text-sm font-bold text-slate-700">Có {stats.pendingReports} bài đăng bị báo cáo lừa đảo.</p>
            </div>
            <div className="p-4 bg-blue-50 rounded-2xl border border-blue-100">
              <p className="text-xs font-bold text-blue-600 uppercase mb-1">Gói dịch vụ</p>
              <p className="text-sm font-bold text-slate-700">Gói "{stats.topPackageName}" đang đạt doanh thu cao kỷ lục.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
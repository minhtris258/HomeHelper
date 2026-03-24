import React, { useState, useEffect, useRef } from "react";
import {
  Users,
  ShieldCheck,
  AlertTriangle,
  Activity,
  UserCircle,
  PieChart as PieIcon,
} from "lucide-react";
import api from "../../api/axios";
import * as signalR from "@microsoft/signalr";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from "recharts";

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    premiumUsers: 0,
    normalUsers: 0,
    pendingReports: 0,
    avgAgeHomeowner: 0,
    avgAgeWorker: 0,
    premiumPercentage: 0,
  });

  // Dùng Ref để kiểm tra trạng thái kết nối, tránh tạo nhiều kết nối lỗi
  const connectionRef = useRef(null);

  const fetchStats = async () => {
    try {
      // Đảm bảo đường dẫn khớp với Route ["api/admin"] ở Backend
      const res = await api.get("/admin/stats");
      setStats(res.data);
    } catch (err) {
      console.error("Lỗi tải thống kê:", err);
    }
  };

  useEffect(() => {
    fetchStats();

    // Khởi tạo kết nối SignalR
    const newConnection = new signalR.HubConnectionBuilder()
      .withUrl(import.meta.env.VITE_NOTIFICATION_HUB_URL) // Sử dụng biến môi trường cho URL Hub
      .withAutomaticReconnect()
      .build();

    connectionRef.current = newConnection;

    const startConnection = async () => {
      try {
        await newConnection.start();
        console.log("SignalR Connected!");

        newConnection.on("UpdateAdminStats", () => {
          console.log("Nhận tín hiệu cập nhật Realtime...");
          fetchStats();
        });
      } catch (err) {
        // Chỉ log lỗi nếu không phải lỗi do chủ động ngắt kết nối
        if (err.name !== "AbortError") {
          console.error("SignalR Connection Error: ", err);
        }
      }
    };

    startConnection();

    // Cleanup function: Chỉ đóng kết nối khi Component thực sự bị hủy
    return () => {
      if (connectionRef.current) {
        connectionRef.current.stop();
      }
    };
  }, []);

  // Dữ liệu cho biểu đồ tròn (Lấy từ stats sau khi fetch thành công)
  const chartData = [
    { name: "Tài khoản VIP", value: stats.premiumUsers || 0 },
    { name: "Tài khoản Thường", value: stats.normalUsers || 0 },
  ];

  const COLORS = ["#3b82f6", "#e2e8f0"];

  const statCards = [
    {
      title: "Tổng người dùng",
      value: stats.totalUsers,
      icon: <Users />,
      color: "bg-indigo-500",
      detail: "Toàn hệ thống",
    },
    {
      title: "Tài khoản Premium",
      value: stats.premiumUsers,
      icon: <ShieldCheck />,
      color: "bg-blue-600",
      detail: `${stats.premiumPercentage}% người dùng`,
    },
    {
      title: "Tuổi TB Chủ nhà",
      value: stats.avgAgeHomeowner || 0,
      icon: <UserCircle />,
      color: "bg-purple-500",
      detail: "Tuổi trung bình",
    },
    {
      title: "Tuổi TB Người làm",
      value: stats.avgAgeWorker || 0,
      icon: <UserCircle />,
      color: "bg-emerald-500",
      detail: "Tuổi trung bình",
    },
  ];

  return (
    <div className="p-8 bg-slate-50 min-h-screen text-left font-sans">
      <div className="flex items-center justify-between mb-10">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-white rounded-2xl shadow-sm">
            <Activity className="text-blue-600" size={32} />
          </div>
          <h1 className="text-3xl font-bold text-slate-800 uppercase tracking-tighter">
            Bảng điều khiển Admin
          </h1>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 bg-green-100 text-green-700 rounded-full text-xs font-bold animate-pulse">
          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
          HỆ THỐNG REALTIME ĐANG CHẠY
        </div>
      </div>

      {/* Grid thông số nhanh */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        {statCards.map((card, index) => (
          <div
            key={index}
            className="bg-white p-6 rounded-[32px] shadow-sm border border-slate-100 transition-transform hover:scale-105"
          >
            <div
              className={`${card.color} text-white p-3 w-fit rounded-2xl mb-4 shadow-lg`}
            >
              {card.icon}
            </div>
            <p className="text-slate-400 text-[10px] font-bold uppercase tracking-[2px]">
              {card.title}
            </p>
            <h2 className="text-4xl font-bold text-slate-800 my-1">
              {card.value}
            </h2>
            <p className="text-[10px] font-bold text-slate-500 italic">
              {card.detail}
            </p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* BIỂU ĐỒ TRÒN % PREMIUM */}
        <div className="lg:col-span-2 bg-white rounded-[40px] p-8 shadow-sm border border-slate-100 flex flex-col items-center">
          <h3 className="font-bold text-slate-800 mb-6 self-start flex items-center gap-2 uppercase tracking-tight">
            <PieIcon size={20} className="text-blue-600" /> Tỷ lệ hội viên
            Premium
          </h3>
          <div className="w-full h-80">
            {/* Quan trọng: Chỉ render biểu đồ khi có dữ liệu */}
            {stats.totalUsers > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={chartData}
                    cx="50%"
                    cy="50%"
                    innerRadius={80}
                    outerRadius={120}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {chartData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend verticalAlign="bottom" height={36} />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center italic text-slate-400">
                Đang tính toán dữ liệu...
              </div>
            )}
          </div>
        </div>

        {/* THÔNG BÁO CẢNH BÁO NHANH */}
        <div className="bg-white rounded-[40px] p-8 shadow-sm border border-slate-100">
          <h3 className="font-bold text-slate-800 mb-6 uppercase tracking-tight">
            Cảnh báo vi phạm
          </h3>
          <div className="space-y-4">
            <div className="p-6 bg-red-50 rounded-[24px] border border-red-100 relative overflow-hidden">
              <div className="absolute top-0 right-0 p-2 bg-red-500 text-white rounded-bl-xl font-bold text-[10px] uppercase">
                Urgent
              </div>
              <AlertTriangle className="text-red-600 mb-3" size={24} />
              <p className="text-sm font-bold text-slate-800 uppercase tracking-tight">
                Báo cáo tồn đọng
              </p>
              <h4 className="text-3xl font-bold text-red-600 my-1">
                {stats.pendingReports}
              </h4>
              <p className="text-xs font-bold text-slate-500 leading-tight">
                Có các bài đăng bị tố cáo vi phạm cần Admin phê duyệt ngay.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;

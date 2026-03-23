import React from "react";
import { Link } from "react-router-dom";
import { Briefcase, Send, CheckCircle, UserCircle } from "lucide-react";

const WorkerDashboard = () => {
  const stats = [
    {
      label: "Việc đã nộp",
      value: "12",
      icon: Send,
      color: "text-blue-600",
      bg: "bg-blue-50",
    },
    {
      label: "Việc được nhận",
      value: "3",
      icon: CheckCircle,
      color: "text-green-600",
      bg: "bg-green-50",
    },
    {
      label: "Việc mới hôm nay",
      value: "45",
      icon: Briefcase,
      color: "text-purple-600",
      bg: "bg-purple-50",
    },
  ];

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="mb-10">
        <h1 className="text-3xl font-bold text-slate-900">
          Chào mừng bạn trở lại!
        </h1>
        <p className="text-slate-500 font-medium">
          Bắt đầu ngày mới bằng việc tìm một công việc phù hợp nhé.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        {stats.map((s, i) => (
          <div
            key={i}
            className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex items-center gap-4"
          >
            <div
              className={`w-14 h-14 ${s.bg} ${s.color} rounded-2xl flex items-center justify-center`}
            >
              <s.icon size={28} />
            </div>
            <div>
              <p className="text-slate-400 text-sm font-bold uppercase tracking-wider">
                {s.label}
              </p>
              <p className="text-2xl font-bold text-slate-800">{s.value}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Quick Actions */}
        <div className="bg-[#3a1a7e] p-8 rounded-[32px] text-white shadow-xl flex flex-col justify-between">
          <div>
            <h3 className="text-2xl font-bold mb-2">
              Hồ sơ của bạn đã sẵn sàng?
            </h3>
            <p className="text-purple-200 text-sm mb-6">
              Cập nhật hồ sơ đầy đủ để tăng 80% cơ hội được Chủ nhà chủ động mời
              làm việc.
            </p>
          </div>
          <Link
            to="/worker/profile"
            className="bg-white text-purple-900 font-bold py-4 rounded-2xl text-center hover:bg-purple-50 transition-all flex items-center justify-center gap-2"
          >
            <UserCircle size={20} /> CẬP NHẬT NGAY
          </Link>
        </div>

        {/* Recently Applied Preview */}
        <div className="bg-white p-8 rounded-[32px] border shadow-sm">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-bold text-slate-800">
              Ứng tuyển gần đây
            </h3>
            <Link
              to="/worker/my-applications"
              className="text-blue-600 text-sm font-bold"
            >
              Xem tất cả
            </Link>
          </div>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl">
              <span className="font-bold text-slate-700">
                Dọn dẹp nhà Quận 3
              </span>
              <span className="text-[10px] bg-yellow-100 text-yellow-700 px-2 py-1 rounded-full font-bold">
                PENDING
              </span>
            </div>
            <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl">
              <span className="font-bold text-slate-700">
                Trông trẻ cuối tuần
              </span>
              <span className="text-[10px] bg-green-100 text-green-700 px-2 py-1 rounded-full font-bold">
                ACCEPTED
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WorkerDashboard;

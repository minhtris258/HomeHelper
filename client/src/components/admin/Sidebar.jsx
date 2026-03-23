import React from "react";
import { NavLink, Link, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  UserCheck,
  ClipboardList,
  Users,
  Briefcase,
  ShieldAlert,
  Settings,
  UserCircle,
  Home,
  LogOut,
  Menu,
  Wrench,
  Package, // Icon mới cho quản lý gói
  CreditCard,
} from "lucide-react";

const Sidebar = ({ isOpen, toggleSidebar }) => {
  const navigate = useNavigate();

  // Danh sách Menu chia theo nhóm để Admin dễ quản lý
  const navGroups = [
    {
      label: "Tổng quan",
      items: [{ name: "Bảng điều khiển", icon: LayoutDashboard, to: "/admin" }],
    },
    {
      label: "Quản lý cốt lõi",
      items: [
        { name: "Duyệt Chủ nhà", icon: UserCheck, to: "pending", badge: true },
        { name: "Quản lý Bài đăng", icon: ClipboardList, to: "jobs" },
        { name: "Người giúp việc", icon: Briefcase, to: "workers" },
        { name: "Khách hàng", icon: Users, to: "homeowners" },
      ],
    },
    {
      label: "Hệ thống & Gói cước",
      items: [
        { name: "Gói dịch vụ", icon: Package, to: "packages" }, // MỚI: Khớp với Route quản lý gói
        { name: "Lịch sử thanh toán", icon: CreditCard, to: "payments" },
        { name: "Dịch vụ hệ thống", icon: Wrench, to: "services" },
        { name: "Báo cáo vi phạm", icon: ShieldAlert, to: "reports" },
      ],
    },
    {
      label: "Tài khoản",
      items: [
        { name: "Hồ sơ Admin", icon: UserCircle, to: "profile" },
        { name: "Cài đặt", icon: Settings, to: "settings" },
      ],
    },
  ];

  const handleLogout = () => {
    if (
      window.confirm("Bạn có chắc chắn muốn đăng xuất khỏi hệ thống quản trị?")
    ) {
      localStorage.clear();
      navigate("/login");
      window.location.reload();
    }
  };

  const linkClasses =
    "flex items-center px-4 py-2.5 rounded-xl transition-all duration-200 text-blue-100 hover:bg-white/10 hover:text-white group text-sm mb-1";
  const activeClasses =
    "bg-white text-blue-700 font-bold shadow-lg shadow-blue-900/20";

  return (
    <aside
      className={`fixed inset-y-0 left-0 transform ${
        isOpen ? "translate-x-0" : "-translate-x-full"
      } lg:relative lg:translate-x-0 transition-transform duration-300 ease-in-out 
      w-72 bg-[#1e40af] text-white flex flex-col z-50 shadow-2xl lg:shadow-none lg:flex-shrink-0 font-sans`}
    >
      {/* --- LOGO & HEADER --- */}
      <div className="flex items-center justify-between h-20 px-6 border-b border-blue-500/30">
        <div className="flex items-center gap-3">
          <Link
            to="/"
            className="flex items-center justify-center w-10 h-10 rounded-xl bg-blue-800 hover:bg-blue-900 transition-all border border-blue-400/30 group"
          >
            <Home
              size={18}
              className="group-hover:scale-110 transition-transform"
            />
          </Link>

          <div className="flex flex-col select-none">
            <span className="text-xl font-bold tracking-tighter leading-none">
              Home<span className="text-blue-300">Helper</span>
            </span>
            <span className="text-[10px] uppercase tracking-[2px] font-bold text-blue-200 mt-1">
              Admin Portal
            </span>
          </div>
        </div>

        <button className="lg:hidden p-2" onClick={toggleSidebar}>
          <Menu size={24} />
        </button>
      </div>

      {/* --- NAVIGATION LINKS --- */}
      <nav className="flex-1 p-4 overflow-y-auto custom-scrollbar">
        {navGroups.map((group, idx) => (
          <div key={idx} className="mb-6">
            <h3 className="px-4 text-[10px] font-bold uppercase tracking-widest text-blue-300/60 mb-2">
              {group.label}
            </h3>
            {group.items.map((item) => (
              <NavLink
                key={item.name}
                to={item.to}
                className={({ isActive }) =>
                  `${linkClasses} ${isActive ? activeClasses : ""}`
                }
                onClick={() => {
                  if (window.innerWidth < 1024) toggleSidebar();
                }}
                end={item.to === "/admin"}
              >
                <item.icon className="h-4 w-4 mr-3" />
                <span className="flex-1">{item.name}</span>

                {item.badge && (
                  <span className="bg-red-500 text-white text-[9px] px-2 py-0.5 rounded-full font-bold animate-pulse">
                    NEW
                  </span>
                )}
              </NavLink>
            ))}
          </div>
        ))}
      </nav>

      {/* --- FOOTER / LOGOUT --- */}
      <div className="p-4 border-t border-blue-500/30 bg-blue-900/20">
        <button
          onClick={handleLogout}
          className="flex items-center w-full px-4 py-3 text-sm font-bold text-white bg-red-500/10 hover:bg-red-600 rounded-xl transition-all group border border-red-500/20"
        >
          <LogOut className="h-5 w-5 mr-3 group-hover:-translate-x-1 transition-transform" />
          <span>Đăng xuất</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;

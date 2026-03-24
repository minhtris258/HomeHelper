import { useState, useEffect } from "react";
import * as signalR from "@microsoft/signalr";
import { Link, useNavigate, NavLink } from "react-router-dom";
// 1. Import Toastify và file axios config của bạn
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import api from "../api/axios";

import {
  User,
  LogOut,
  Bell,
  LayoutDashboard,
  ClipboardList,
  UserCircle,
  Briefcase,
  Settings,
  PlusCircle,
  Home,
  Package,
  Search,
} from "lucide-react";

const Header = () => {
  const [user, setUser] = useState(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);

  // --- QUẢN LÝ THÔNG TIN USER ---
  useEffect(() => {
    const token = localStorage.getItem("token");
    const fullName = localStorage.getItem("fullName");
    const role = localStorage.getItem("role");
    const isPremium = localStorage.getItem("isPremium") === "true";
    const premiumExpiry = localStorage.getItem("premiumExpiry");

    if (token) {
      let daysLeft = 0;
      if (isPremium && premiumExpiry) {
        const expiryDate = new Date(premiumExpiry);
        const today = new Date();
        const diffTime = expiryDate - today;
        daysLeft = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      }

      setUser({
        fullName,
        role,
        isPremium: isPremium && daysLeft > 0,
        daysLeft: daysLeft > 0 ? daysLeft : 0,
      });
    }
  }, []);

  // --- KẾT NỐI SIGNALR & LẤY THÔNG BÁO ---
  useEffect(() => {
  const userId = localStorage.getItem("userId");
  if (!userId) return;

  const fetchNotifications = async () => {
    try {
      const res = await api.get("/Notification");
      
      // KIỂM TRA VÀ ÉP KIỂU DỮ LIỆU AN TOÀN
      // Nếu res.data là mảng thì dùng luôn, nếu không thì dùng mảng rỗng
      const dataArray = Array.isArray(res.data) 
        ? res.data 
        : (res.data?.$values || []); // Hỗ trợ cả định dạng $values của .NET

      setNotifications(dataArray);
      setUnreadCount(dataArray.filter((n) => !n.isRead).length);
    } catch (err) {
      console.error("Lỗi lấy thông báo:", err);
      // Nếu lỗi, set về mảng rỗng để giao diện không bị crash
      setNotifications([]);
      setUnreadCount(0);
    }
  };

  fetchNotifications();

    // Thiết lập kết nối Realtime
   const connection = new signalR.HubConnectionBuilder()
      .withUrl(`${import.meta.env.VITE_API_URL}/notificationHub`, {
        accessTokenFactory: () => localStorage.getItem("token"),
      })
      .withAutomaticReconnect()
      .build();

    connectionRef.current = connection;

    connection
      .start()
      .then(() => {
        console.log("SignalR: Connected to Hub");
        connection.invoke("JoinUserGroup", userId);

        connection.on("ReceiveNotification", (data) => {
          setNotifications((prev) => [data, ...prev]);
          setUnreadCount((prev) => prev + 1);
          
          toast.info(
            <div className="cursor-pointer">
              <p className="font-bold text-sm">{data.title}</p>
              <p className="text-xs">{data.content}</p>
            </div>,
            {
              onClick: () => data.redirectUrl && navigate(data.redirectUrl),
            }
          );
        });
      })
      .catch((err) => console.error("SignalR Connection Error: ", err));

    // CLEANUP: Ngắt kết nối khi chuyển trang hoặc logout
    return () => {
      if (connection) {
        connection.stop();
        console.log("SignalR: Connection Stopped");
      }
    };
  }, [navigate]);

  // --- XỬ LÝ ĐÁNH DẤU TẤT CẢ ĐÃ ĐỌC ---
  const handleMarkAllRead = async () => {
    try {
      await api.put("/Notification/read-all");
      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
      setUnreadCount(0);
      toast.success("Đã đọc tất cả thông báo");
    } catch (err) {
      console.error("Lỗi mark read:", err);
    }
  };

  const handleLogout = () => {
    if (window.confirm("Bạn có chắc chắn muốn đăng xuất?")) {
      // Dừng kết nối trước khi xóa dữ liệu
      if (connectionRef.current) connectionRef.current.stop();
      localStorage.clear();
      setUser(null);
      navigate("/");
      window.location.reload();
    }
  };

  const navLinkClass = ({ isActive }) =>
    `flex items-center gap-2 px-3 py-2 rounded-lg transition-all font-bold text-sm ${
      isActive ? "bg-white/20 text-blue-300" : "text-white hover:bg-white/10"
    }`;

  const renderRoleActions = () => {
    switch (user?.role) {
      case "Admin":
        return (
          <>
            <Link
              to="/admin"
              className="flex items-center px-4 py-2.5 text-sm text-gray-700 hover:bg-blue-50 transition"
            >
              <LayoutDashboard size={16} className="mr-3 text-blue-600" /> Trang
              quản trị
            </Link>
            <Link
              to="/admin/jobs"
              className="flex items-center px-4 py-2.5 text-sm text-gray-700 hover:bg-blue-50 transition"
            >
              <ClipboardList size={16} className="mr-3 text-blue-600" /> Quản lý
              bài đăng
            </Link>
          </>
        );
      case "Homeowner":
        return (
          <>
            <Link
              to="/employer/profile"
              className="flex items-center px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-100 transition"
            >
              <Settings size={16} className="mr-3 text-gray-400" /> Cài đặt hồ
              sơ
            </Link>
            <Link
              to="/employer/my-jobs"
              className="flex items-center px-4 py-2.5 text-sm text-gray-700 hover:bg-purple-50 transition"
            >
              <Briefcase size={16} className="mr-3 text-purple-600" /> Tin đã
              đăng
            </Link>
            <Link
              to="/employer/post-job"
              className="flex items-center px-4 py-2.5 text-sm text-gray-700 hover:bg-purple-50 transition"
            >
              <PlusCircle size={16} className="mr-3 text-purple-600" /> Đăng tin
              mới
            </Link>
          </>
        );
      case "Worker":
        return (
          <>
            <Link
              to="/worker/my-applications"
              className="flex items-center px-4 py-2.5 text-sm text-gray-700 hover:bg-green-50 transition"
            >
              <ClipboardList size={16} className="mr-3 text-green-600" /> Việc
              đã ứng tuyển
            </Link>
            <Link
              to="/worker/profile"
              className="flex items-center px-4 py-2.5 text-sm text-gray-700 hover:bg-green-50 transition"
            >
              <UserCircle size={16} className="mr-3 text-green-600" /> Hồ sơ
              năng lực
            </Link>
          </>
        );
      default:
        return null;
    }
  };

  return (
    <header className="w-full shadow-md sticky top-0 z-50 font-sans">
      {/* Container hiển thị các Toast thông báo */}
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
      />

      <div className="bg-[#3a1a7e] text-white border-b border-white/10">
        <div className="max-w-[1440px] mx-auto px-4 py-3 flex justify-between items-center container">
          <div className="flex items-center gap-10">
            <Link to="/" className="flex flex-col leading-tight group shrink-0">
              <span className="text-3xl font-extrabold tracking-tighter text-white uppercase italic">
                Home<span className="text-blue-400">Helper</span>
              </span>
            </Link>
            <nav className="hidden md:flex items-center gap-1">
              <NavLink to="/" className={navLinkClass}>
                <Home size={18} /> Trang chủ
              </NavLink>
              <NavLink to="/jobs" className={navLinkClass}>
                <Search size={18} /> Tìm việc làm
              </NavLink>
              <NavLink to="/packages" className={navLinkClass}>
                <Package size={18} /> Gói dịch vụ
              </NavLink>
            </nav>
          </div>

          <div className="flex items-center gap-6">
            {user ? (
              <div className="flex items-center gap-4">
                <div className="relative group">
                  <button className="relative p-2 hover:bg-white/10 rounded-full transition group">
                    <Bell size={22} />
                    {unreadCount > 0 && (
                      <span className="absolute top-1 right-1 w-4 h-4 bg-red-500 text-[10px] flex items-center justify-center rounded-full border-2 border-[#3a1a7e] font-bold animate-pulse">
                        {unreadCount}
                      </span>
                    )}
                  </button>

                  <div className="absolute right-0 -mt-1 w-80 bg-white rounded-2xl shadow-2xl border border-slate-100 py-3 hidden group-hover:block z-[100] text-slate-800 animate-in fade-in slide-in-from-top-2">
                    <div className="px-4 py-2 border-b border-slate-50 flex justify-between items-center">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                        Thông báo mới
                      </span>
                      {unreadCount > 0 && (
                        <button
                          onClick={handleMarkAllRead}
                          className="text-[10px] text-blue-600 font-bold hover:underline"
                        >
                          Đánh dấu tất cả đã đọc
                        </button>
                      )}
                    </div>

                    <div className="max-h-80 overflow-y-auto">
                      {notifications.length > 0 ? (
                        notifications.map((n, i) => (
                          <Link
                            key={i}
                            to={n.redirectUrl || "#"}
                            className={`block px-4 py-3 hover:bg-slate-50 border-b border-slate-50 last:border-0 ${!n.isRead ? "bg-blue-50/50" : ""}`}
                          >
                            <div className="flex justify-between items-start">
                              <p
                                className={`text-sm leading-tight ${!n.isRead ? "font-bold" : "font-medium"}`}
                              >
                                {n.title}
                              </p>
                              {!n.isRead && (
                                <span className="w-2 h-2 bg-blue-500 rounded-full mt-1 shadow-sm"></span>
                              )}
                            </div>
                            <p className="text-xs text-slate-500 mt-1 line-clamp-2">
                              {n.content}
                            </p>
                            <p className="text-[9px] text-slate-400 mt-2 italic font-medium">
                              {new Date(
                                n.createdAt || Date.now(),
                              ).toLocaleString()}
                            </p>
                          </Link>
                        ))
                      ) : (
                        <p className="py-8 text-center text-xs text-slate-400 font-medium italic">
                          Không có thông báo nào
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                <div
                  className="relative group"
                  onMouseEnter={() => setIsDropdownOpen(true)}
                  onMouseLeave={() => setIsDropdownOpen(false)}
                >
                  <div className="flex items-center gap-3 pl-4 border-l border-white/20 cursor-pointer py-1">
                    <div className="w-10 h-10 bg-gradient-to-tr from-blue-600 to-blue-400 rounded-full flex items-center justify-center border-2 border-white/30 shadow-lg">
                      <span className="font-bold text-white text-lg">
                        {user.fullName?.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <div className="hidden sm:block text-left">
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-bold leading-none uppercase tracking-tight">
                          {user.fullName}
                        </p>
                        {user.isPremium && (
                          <span className="bg-gradient-to-r from-yellow-400 to-orange-500 text-[9px] text-white px-2 py-0.5 rounded-full font-bold uppercase">
                            Premium
                          </span>
                        )}
                      </div>
                      <p className="text-[10px] text-blue-300 uppercase mt-1 tracking-widest font-bold">
                        {user.role === "Admin"
                          ? "Quản trị viên"
                          : user.role === "Homeowner"
                            ? "Chủ nhà"
                            : "Người lao động"}
                      </p>
                    </div>
                  </div>

                  {isDropdownOpen && (
                    <div className="absolute right-0 mt-0 w-60 bg-white rounded-2xl shadow-2xl py-3 border border-gray-100 animate-in fade-in slide-in-from-top-2 duration-200 text-gray-800">
                      <div className="px-4 py-2 mb-1 border-b border-gray-50 flex items-center justify-between">
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                          Tài khoản {user.role}
                        </p>
                        {user.isPremium && (
                          <span className="text-[10px] text-amber-600 font-bold italic">
                            Còn {user.daysLeft} ngày
                          </span>
                        )}
                      </div>
                      {renderRoleActions()}
                      <div className="border-t border-gray-100 my-2"></div>
                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition font-bold  tracking-tighter"
                      >
                        <LogOut size={16} className="mr-3" /> Đăng xuất
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <div className="flex flex-col items-end text-right">
                  <span className="text-xs text-gray-300 font-medium">
                    Chào mừng bạn
                  </span>
                  <Link
                    to="/login"
                    className="font-medium text-sm hover:text-blue-300 transition uppercase tracking-tighter"
                  >
                    Đăng ký / Đăng nhập
                  </Link>
                </div>
                <div className="border-l border-white/20 h-8 mx-1"></div>
                <Link
                  to="/register"
                  className="bg-white/10 hover:bg-white/20 px-4 py-2 rounded-lg text-sm font-bold transition shadow-sm border border-white/5"
                >
                  Dành cho chủ nhà
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;

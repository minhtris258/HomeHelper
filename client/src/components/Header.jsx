import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { 
  User, 
  LogOut, 
  Bell, 
  LayoutDashboard, 
  ClipboardList, 
  UserCircle, 
  Briefcase,
  Settings,
  PlusCircle
} from "lucide-react";

const Header = () => {
  const [user, setUser] = useState(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    const fullName = localStorage.getItem("fullName");
    const role = localStorage.getItem("role");

    if (token) {
      setUser({ fullName, role });
    }
  }, []);

  const handleLogout = () => {
    if (window.confirm("Bạn có chắc chắn muốn đăng xuất?")) {
      localStorage.clear();
      setUser(null);
      navigate("/");
      window.location.reload();
    }
  };

  // Hàm hiển thị các chức năng dựa trên Vai trò (Role)
  const renderRoleActions = () => {
    switch (user?.role) {
      case "Admin":
        return (
          <>
            <Link to="/admin" className="flex items-center px-4 py-2.5 text-sm text-gray-700 hover:bg-blue-50 transition">
              <LayoutDashboard size={16} className="mr-3 text-blue-600" /> Trang quản trị
            </Link>
            <Link to="/admin/jobs" className="flex items-center px-4 py-2.5 text-sm text-gray-700 hover:bg-blue-50 transition">
              <ClipboardList size={16} className="mr-3 text-blue-600" /> Quản lý bài đăng
            </Link>
          </>
        );
      case "Homeowner":
        return (
          <>
            <Link to="/employer/my-jobs" className="flex items-center px-4 py-2.5 text-sm text-gray-700 hover:bg-purple-50 transition">
              <Briefcase size={16} className="mr-3 text-purple-600" /> Tin đã đăng
            </Link>
            <Link to="/employer/post-job" className="flex items-center px-4 py-2.5 text-sm text-gray-700 hover:bg-purple-50 transition">
              <PlusCircle size={16} className="mr-3 text-purple-600" /> Đăng tin mới
            </Link>
          </>
        );
      case "Worker":
        return (
          <>
            <Link to="/worker/my-applications" className="flex items-center px-4 py-2.5 text-sm text-gray-700 hover:bg-green-50 transition">
              <ClipboardList size={16} className="mr-3 text-green-600" /> Việc đã ứng tuyển
            </Link>
            <Link to="/worker/profile" className="flex items-center px-4 py-2.5 text-sm text-gray-700 hover:bg-green-50 transition">
              <UserCircle size={16} className="mr-3 text-green-600" /> Hồ sơ năng lực
            </Link>
          </>
        );
      default:
        return null;
    }
  };

  return (
    <header className="w-full shadow-md sticky top-0 z-50 font-sans">
      <div className="bg-[#3a1a7e] text-white">
        <div className="max-w-[1440px] mx-auto px-4 py-3 flex justify-between items-center">
          
          {/* Left: Logo */}
          <div className="flex items-center gap-8">
            <Link to="/" className="flex flex-col leading-tight group">
              <span className="text-3xl font-extrabold tracking-tighter text-white">
                Home<span className="text-blue-400">Helper</span>
              </span>
            </Link>
          </div>

          {/* Right Section */}
          <div className="flex items-center gap-6">
            {user ? (
              <div className="flex items-center gap-4">
                {/* Thông báo */}
                <button className="relative p-2 hover:bg-white/10 rounded-full transition group">
                  <Bell size={20} />
                  <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-[#3a1a7e]"></span>
                </button>

                {/* Profile Dropdown Area (Hover để mở) */}
                <div 
                  className="relative group"
                  onMouseEnter={() => setIsDropdownOpen(true)}
                  onMouseLeave={() => setIsDropdownOpen(false)}
                >
                  <div className="flex items-center gap-3 pl-4 border-l border-white/20 cursor-pointer py-1">
                    <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center border-2 border-white/30 shadow-inner overflow-hidden">
                       <span className="font-bold text-white text-lg">
                         {user.fullName?.charAt(0).toUpperCase()}
                       </span>
                    </div>
                    
                    <div className="hidden sm:block text-left">
                      <p className="text-sm font-bold leading-none">{user.fullName}</p>
                      <p className="text-[10px] text-blue-300 uppercase mt-1 tracking-wider font-medium">
                        {user.role === "Admin" ? "Quản trị viên" : user.role === "Homeowner" ? "Chủ nhà" : "Người giúp việc"}
                      </p>
                    </div>
                  </div>

                  {/* Dropdown Menu thực tế */}
                  {isDropdownOpen && (
                    <div className="absolute right-0 mt-0 w-56 bg-white rounded-2xl shadow-2xl py-2 border border-gray-100 animate-in fade-in slide-in-from-top-2 duration-200 text-gray-800">
                      <div className="px-4 py-2 border-b border-gray-50 mb-1">
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Tài khoản</p>
                      </div>

                      <Link to="/profile" className="flex items-center px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-100 transition">
                        <Settings size={16} className="mr-3 text-gray-400" /> Cài đặt hồ sơ
                      </Link>

                      <div className="border-t border-gray-50 my-1"></div>

                      <div className="px-4 py-1">
                         <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Chức năng {user.role}</p>
                      </div>
                      
                      {/* Chức năng theo Role */}
                      {renderRoleActions()}

                      <div className="border-t border-gray-100 my-1"></div>
                      
                      <button 
                        onClick={handleLogout}
                        className="w-full flex items-center px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition font-bold"
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
                  <span className="text-xs text-gray-300">Chào mừng bạn</span>
                  <Link 
                    to="/login" 
                    className="font-semibold text-sm hover:text-blue-300 transition"
                  >
                    Đăng ký / Đăng nhập
                  </Link>
                </div>
                <div className="border-l border-white/20 h-8 mx-1"></div>
                <Link 
                  to="/register" 
                  className="bg-white/10 hover:bg-white/20 px-4 py-2 rounded-lg text-sm font-bold transition"
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
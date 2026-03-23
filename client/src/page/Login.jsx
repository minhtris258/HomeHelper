import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff, LogIn } from 'lucide-react';
import api from '../api/axios';
// 1. Thêm Toastify
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({ identifier: '', password: '' });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await api.post('/User/login', formData);
      const { token, role, fullName, userId, isPremium, premiumExpiry } = response.data;
      
      // Lưu thông tin vào localStorage
      localStorage.setItem('token', token);
      localStorage.setItem('role', role);
      localStorage.setItem('fullName', fullName);
      localStorage.setItem('userId', userId);
      
      // Ép kiểu về String để Header.jsx nhận diện đúng logic (getItem === "true")
      localStorage.setItem('isPremium', String(isPremium));

      if (premiumExpiry) {
        localStorage.setItem('premiumExpiry', premiumExpiry);
      } else {
        localStorage.removeItem('premiumExpiry');
      }

      // 2. Thay alert bằng toast.success
      toast.success(`Chào mừng ${fullName} quay trở lại!`, {
        position: "top-right",
        autoClose: 1500,
      });

      // Chờ một chút để user kịp nhìn thấy Toast rồi mới chuyển trang
      setTimeout(() => {
        navigate('/');
        window.location.reload(); 
      }, 1500);

    } catch (err) {
      // 3. Thay alert bằng toast.error
      const errorMsg = err.response?.data?.message || "Email hoặc mật khẩu không đúng!";
      toast.error(errorMsg, {
        position: "top-right",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 font-sans">
      {/* 4. Thêm ToastContainer để hiển thị thông báo */}
      <ToastContainer />
      
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 border border-slate-100">
       
        <div className="text-center mb-10">
          <Link to="/" className="text-3xl font-extrabold tracking-tighter inline-block mb-2 uppercase italic">
            Home<span className="text-blue-600">Helper</span>
          </Link>
          <p className="text-slate-500 text-sm italic font-medium">Chào mừng bạn quay trở lại!</p>
        </div>

        <form className="space-y-5 p-2" onSubmit={handleSubmit}>
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2 uppercase tracking-tight">Tên đăng nhập hoặc Email</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
              <input 
                type="text" 
                required
                value={formData.identifier}
                onChange={(e) => setFormData({...formData, identifier: e.target.value})}
                placeholder="admin hoặc example@gmail.com"
                className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all font-medium"
              />
            </div>
          </div>

          <div>
            <div className="flex justify-between mb-2">
              <label className="text-sm font-bold text-slate-700 uppercase tracking-tight">Mật khẩu</label>
              <Link to="#" className="text-xs text-blue-600 font-bold hover:underline">Quên mật khẩu?</Link>
            </div>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
              <input 
                type={showPassword ? "text" : "password"} 
                required
                value={formData.password}
                onChange={(e) => setFormData({...formData, password: e.target.value})}
                placeholder="••••••••"
                className="w-full pl-11 pr-12 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all font-medium"
              />
              <button 
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          <button 
            disabled={loading}
            className="w-full bg-[#3a1a7e] hover:bg-[#2d1463] text-white font-bold py-4 rounded-xl flex items-center justify-center gap-2 transition-all disabled:opacity-50 uppercase tracking-widest shadow-lg shadow-blue-100"
          >
            <LogIn size={20} />
            {loading ? "Đang xác thực..." : "Đăng nhập ngay"}
          </button>
        </form>

        <p className="text-center mt-8 text-sm text-slate-500 font-medium">
          Chưa có tài khoản? <Link to="/register" className="text-blue-600 font-bold hover:underline uppercase tracking-tighter">Đăng ký ngay</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User, Mail, Lock, UserPlus, ShieldCheck, Briefcase, Home, Phone } from 'lucide-react';
import api from '../api/axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Register = () => {
  const [role, setRole] = useState('Worker');
  const [formData, setFormData] = useState({
    username: '', 
    email: '', 
    phoneNumber: '', // Thêm trường số điện thoại mới
    password: '', 
    fullName: '', 
    role: 'Worker'
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const dataToSend = { ...formData, role: role };
      const response = await api.post('/User/register', dataToSend);
      
      // Giả sử API Register trả về thông tin đăng nhập luôn (Token, Role,...)
      // Nếu API chỉ trả về message, bạn nên yêu cầu Backend sửa lại để trả về data như Login
      const { token, role: userRole, fullName, userId, isPremium } = response.data;

      if (token) {
        // LƯU THÔNG TIN VÀO LOCALSTORAGE ĐỂ ĐĂNG NHẬP LUÔN
        localStorage.setItem('token', token);
        localStorage.setItem('role', userRole);
        localStorage.setItem('fullName', fullName);
        localStorage.setItem('userId', userId);
        localStorage.setItem('isPremium', String(isPremium || false));

        toast.success(`Đăng ký thành công! Chào mừng ${fullName} gia nhập HomeHelper.`, {
          position: "top-right",
          autoClose: 2000,
        });

        // Chuyển thẳng về trang chủ sau 2 giây
        setTimeout(() => {
          navigate('/');
          window.location.reload(); // Reload để Header cập nhật trạng thái user
        }, 2000);
      } else {
        // Trường hợp Backend chưa trả về Token, bắt buộc phải sang Login
        toast.info("Đăng ký thành công! Vui lòng đăng nhập lại.");
        setTimeout(() => navigate('/login'), 2000);
      }

    } catch (err) {
      const errorMsg = err.response?.data?.message || "Đăng ký thất bại, vui lòng thử lại!";
      toast.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 font-sans">
      <ToastContainer />
      
      <div className="max-w-md w-full bg-white rounded-[2rem] shadow-2xl p-8 border border-slate-100 overflow-hidden relative">
        <div className={`absolute top-0 right-0 w-32 h-32 opacity-10 rounded-bl-full transition-colors duration-500 ${role === 'Homeowner' ? 'bg-purple-600' : 'bg-green-600'}`}></div>

        <div className="text-center mb-8 relative z-10">
          <Link to="/" className="text-3xl font-extrabold tracking-tighter inline-block mb-2 uppercase italic">
            Home<span className="text-blue-600">Helper</span>
          </Link>
          <p className="text-slate-500 text-sm font-bold uppercase tracking-widest">Gia nhập cộng đồng ngay</p>
        </div>

        <div className="flex bg-slate-100 p-1.5 rounded-2xl mb-8 relative z-10">
          <button
            type="button"
            onClick={() => setRole('Worker')}
            className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-bold transition-all duration-300 ${
              role === 'Worker' ? 'bg-white text-green-600 shadow-md' : 'text-slate-500'
            }`}
          >
            <Briefcase size={18} /> NGƯỜI GIÚP VIỆC
          </button>
          <button
            type="button"
            onClick={() => setRole('Homeowner')}
            className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-bold transition-all duration-300 ${
              role === 'Homeowner' ? 'bg-white text-purple-600 shadow-md' : 'text-slate-500'
            }`}
          >
            <Home size={18} /> CHỦ NHÀ
          </button>
        </div>

        <form className="space-y-4 relative z-10 p-2" onSubmit={handleRegister}>
          <div className="relative">
            <User className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
              type="text" placeholder="Tên đăng nhập (Username)" required
              className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 font-medium"
              onChange={(e) => setFormData({...formData, username: e.target.value})}
            />
          </div>

          <div className="relative">
            <ShieldCheck className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
              type="text" placeholder="Họ và tên đầy đủ" required
              className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 font-medium"
              onChange={(e) => setFormData({...formData, fullName: e.target.value})}
            />
          </div>

          <div className="relative">
            <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
              type="text" placeholder="Số điện thoại liên hệ" required
              className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 font-medium"
              onChange={(e) => setFormData({...formData, phoneNumber: e.target.value})}
            />
          </div>

          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
              type="email" placeholder="Địa chỉ Email" required
              className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 font-medium"
              onChange={(e) => setFormData({...formData, email: e.target.value})}
            />
          </div>

          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
              type="password" placeholder="Mật khẩu bảo mật" required
              className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 font-medium"
              onChange={(e) => setFormData({...formData, password: e.target.value})}
            />
          </div>

          <button 
            disabled={loading}
            className={`w-full text-white font-bold py-4 rounded-2xl flex items-center justify-center gap-2 transition-all duration-300 shadow-lg uppercase tracking-widest text-xs mt-4 ${
              role === 'Worker' ? 'bg-green-600 hover:bg-green-700' : 'bg-purple-600 hover:bg-purple-700'
            } disabled:opacity-50`}
          >
            <UserPlus size={18} />
            {loading ? "ĐANG XỬ LÝ..." : "TẠO TÀI KHOẢN & ĐĂNG NHẬP"}
          </button>
        </form>

        <p className="text-center mt-6 text-sm text-slate-500 font-medium">
          Đã có tài khoản? <Link to="/login" className="text-blue-600 font-bold hover:underline uppercase">Đăng nhập</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
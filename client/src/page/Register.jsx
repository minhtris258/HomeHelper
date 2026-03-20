import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User, Mail, Lock, UserPlus, ShieldCheck } from 'lucide-react';
import api from '../api/axios';

const Register = () => {
  const [formData, setFormData] = useState({
    username: '', email: '', password: '', fullName: '', role: 'Worker'
  });
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      await api.post('/User/register', formData);
      alert("Đăng ký thành công! Vui lòng đăng nhập.");
      navigate('/login');
    } catch (err) {
      alert(err.response?.data?.message || "Đăng ký thất bại, vui lòng thử lại!");
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 border border-slate-100">
        <div className="text-center mb-8">
          <Link to="/" className="text-3xl font-extrabold tracking-tighter inline-block mb-2">
            Home<span className="text-blue-600">Helper</span>
          </Link>
          <h2 className="text-xl font-bold text-slate-800">Tạo tài khoản mới</h2>
        </div>

        <form className="space-y-4" onSubmit={handleRegister}>
          <div className="grid grid-cols-2 gap-3">
             <input 
                type="text" placeholder="Username" required
                className="w-full p-3 bg-slate-50 border rounded-xl outline-none"
                onChange={(e) => setFormData({...formData, username: e.target.value})}
              />
              <select 
                className="p-3 bg-slate-50 border rounded-xl outline-none text-sm font-semibold"
                onChange={(e) => setFormData({...formData, role: e.target.value})}
              >
                <option value="Worker">Người giúp việc</option>
                <option value="Homeowner">Chủ nhà</option>
              </select>
          </div>

          <input 
            type="text" placeholder="Họ và tên" required
            className="w-full p-3 bg-slate-50 border rounded-xl outline-none"
            onChange={(e) => setFormData({...formData, fullName: e.target.value})}
          />

          <input 
            type="email" placeholder="Email" required
            className="w-full p-3 bg-slate-50 border rounded-xl outline-none"
            onChange={(e) => setFormData({...formData, email: e.target.value})}
          />

          <input 
            type="password" placeholder="Mật khẩu" required
            className="w-full p-3 bg-slate-50 border rounded-xl outline-none"
            onChange={(e) => setFormData({...formData, password: e.target.value})}
          />

          <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3.5 rounded-xl flex items-center justify-center gap-2">
            <UserPlus size={20} />
            Đăng ký tài khoản
          </button>
        </form>
      </div>
    </div>
  );
};

export default Register;
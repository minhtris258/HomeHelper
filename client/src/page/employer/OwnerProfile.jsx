import React, { useState, useEffect } from "react";
import { 
  User, Mail, Phone, MapPin, Calendar, 
  Edit3, Lock, Save, Camera, ShieldCheck, Loader2 
} from "lucide-react";
import api from "../../api/axios"; // Đảm bảo đường dẫn này đúng

const OwnerProfile = () => {
  const userId = localStorage.getItem("userId"); // Lấy ID từ local khi đăng nhập
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("info"); // info | edit | password

  // State cho thông tin người dùng
  const [profileData, setProfileData] = useState(null);
  const [editForm, setEditForm] = useState({
    fullName: "",
    phoneNumber: "",
    address: "",
    age: "",
    bio: ""
  });

  // State cho đổi mật khẩu
  const [passwordForm, setPasswordForm] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: ""
  });

  // 1. Lấy dữ liệu Profile từ Backend
  const fetchProfile = async () => {
    setLoading(true);
    try {
      const res = await api.get(`/Profile/${userId}`);
      const data = res.data;
      setProfileData(data);
      // Gán dữ liệu vào form sửa
      setEditForm({
        fullName: data.userInfo.fullName || "",
        phoneNumber: data.userInfo.phoneNumber || "",
        address: data.profile.address || "",
        age: data.profile.age || "",
        bio: data.profile.bio || ""
      });
    } catch (err) {
      console.error("Lỗi khi tải hồ sơ:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { if (userId) fetchProfile(); }, [userId]);

  // 2. Xử lý cập nhật thông tin
  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    try {
      await api.put(`/Profile/${userId}`, {
        address: editForm.address,
        age: parseInt(editForm.age),
        bio: editForm.bio,
        skills: "", // Chủ nhà thường không cần skills
        experience: ""
      });
      alert("Cập nhật thông tin thành công!");
      fetchProfile();
      setActiveTab("info");
    } catch (err) {
      alert("Lỗi khi cập nhật hồ sơ.");
    }
  };

  // 3. Xử lý đổi mật khẩu
  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      alert("Mật khẩu mới không khớp!");
      return;
    }
    try {
      // Giả sử UserController có endpoint change-password
      await api.put(`/User/change-password`, {
        oldPassword: passwordForm.oldPassword,
        newPassword: passwordForm.newPassword
      });
      alert("Đổi mật khẩu thành công!");
      setPasswordForm({ oldPassword: "", newPassword: "", confirmPassword: "" });
      setActiveTab("info");
    } catch (err) {
      alert(err.response?.data?.message || "Mật khẩu cũ không chính xác.");
    }
  };

  if (loading) return <div className="flex justify-center py-20"><Loader2 className="animate-spin text-blue-600" size={40} /></div>;

  return (
    <div className="max-w-4xl mx-auto p-6 md:p-12 text-left">
      {/* Header Profile */}
      <div className="bg-white rounded-[40px] shadow-sm border border-slate-100 p-8 mb-8 flex flex-col md:flex-row items-center gap-8">
        <div className="relative group">
          <div className="w-32 h-32 bg-slate-100 rounded-[32px] flex items-center justify-center text-slate-400 border-4 border-white shadow-xl overflow-hidden">
            {profileData?.profile?.avatar ? (
               <img src={profileData.profile.avatar} alt="Avatar" className="w-full h-full object-cover" />
            ) : <User size={48} />}
          </div>
          <button className="absolute bottom-2 right-2 p-2 bg-blue-600 text-white rounded-xl shadow-lg hover:scale-110 transition-all">
            <Camera size={16} />
          </button>
        </div>

        <div className="flex-1 text-center md:text-left">
          <div className="flex items-center justify-center md:justify-start gap-2 mb-1">
            <h1 className="text-3xl font-black text-slate-800 tracking-tight">{profileData?.userInfo?.fullName}</h1>
            {profileData?.userInfo?.isPremium && <ShieldCheck className="text-blue-500" size={24} />}
          </div>
          <p className="text-slate-400 font-bold uppercase text-xs tracking-widest mb-4">Chủ nhà (Homeowner)</p>
          
          <div className="flex flex-wrap justify-center md:justify-start gap-3">
            <button 
              onClick={() => setActiveTab("info")}
              className={`px-6 py-2 rounded-xl font-black text-xs uppercase transition-all ${activeTab === 'info' ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-500'}`}
            >Thông tin</button>
            <button 
              onClick={() => setActiveTab("edit")}
              className={`px-6 py-2 rounded-xl font-black text-xs uppercase transition-all ${activeTab === 'edit' ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-500'}`}
            >Sửa hồ sơ</button>
            <button 
              onClick={() => setActiveTab("password")}
              className={`px-6 py-2 rounded-xl font-black text-xs uppercase transition-all ${activeTab === 'password' ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-500'}`}
            >Bảo mật</button>
          </div>
        </div>
      </div>

      {/* Tab Content */}
      <div className="bg-white rounded-[40px] shadow-sm border border-slate-100 p-8 md:p-12">
        
        {/* VIEW INFO */}
        {activeTab === "info" && (
          <div className="space-y-8 animate-in fade-in duration-500">
             <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-3xl">
                  <div className="p-3 bg-white rounded-2xl shadow-sm text-blue-600"><Mail size={20}/></div>
                  <div>
                    <p className="text-[10px] font-black text-slate-400 uppercase">Email liên hệ</p>
                    <p className="font-bold text-slate-700">{profileData?.userInfo?.email}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-3xl">
                  <div className="p-3 bg-white rounded-2xl shadow-sm text-green-600"><Phone size={20}/></div>
                  <div>
                    <p className="text-[10px] font-black text-slate-400 uppercase">Số điện thoại</p>
                    <p className="font-bold text-slate-700">{profileData?.userInfo?.phoneNumber || "Chưa cập nhật"}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-3xl">
                  <div className="p-3 bg-white rounded-2xl shadow-sm text-red-600"><MapPin size={20}/></div>
                  <div>
                    <p className="text-[10px] font-black text-slate-400 uppercase">Địa chỉ</p>
                    <p className="font-bold text-slate-700">{profileData?.profile?.address || "Chưa cập nhật"}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-3xl">
                  <div className="p-3 bg-white rounded-2xl shadow-sm text-purple-600"><Calendar size={20}/></div>
                  <div>
                    <p className="text-[10px] font-black text-slate-400 uppercase">Tuổi</p>
                    <p className="font-bold text-slate-700">{profileData?.profile?.age || "N/A"}</p>
                  </div>
                </div>
             </div>
             <div>
                <h4 className="font-black text-slate-800 mb-2 uppercase text-xs tracking-widest pl-2">Giới thiệu bản thân</h4>
                <div className="p-6 bg-slate-50 rounded-[32px] text-slate-600 italic font-medium">
                  {profileData?.profile?.bio || "Bạn chưa có lời giới thiệu nào..."}
                </div>
             </div>
          </div>
        )}

        {/* EDIT PROFILE */}
        {activeTab === "edit" && (
          <form onSubmit={handleUpdateProfile} className="space-y-6 animate-in slide-in-from-bottom-4 duration-500">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-black text-slate-400 uppercase mb-2 ml-2">Số điện thoại</label>
                <input 
                  className="w-full px-6 py-4 bg-slate-50 border-2 border-transparent focus:border-blue-500 rounded-2xl outline-none font-bold"
                  value={editForm.phoneNumber}
                  onChange={(e) => setEditForm({...editForm, phoneNumber: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-xs font-black text-slate-400 uppercase mb-2 ml-2">Tuổi</label>
                <input 
                  type="number"
                  className="w-full px-6 py-4 bg-slate-50 border-2 border-transparent focus:border-blue-500 rounded-2xl outline-none font-bold"
                  value={editForm.age}
                  onChange={(e) => setEditForm({...editForm, age: e.target.value})}
                />
              </div>
            </div>
            <div>
              <label className="block text-xs font-black text-slate-400 uppercase mb-2 ml-2">Địa chỉ hiện tại</label>
              <input 
                className="w-full px-6 py-4 bg-slate-50 border-2 border-transparent focus:border-blue-500 rounded-2xl outline-none font-bold"
                value={editForm.address}
                onChange={(e) => setEditForm({...editForm, address: e.target.value})}
              />
            </div>
            <div>
              <label className="block text-xs font-black text-slate-400 uppercase mb-2 ml-2">Tiểu sử / Giới thiệu</label>
              <textarea 
                rows="4"
                className="w-full px-6 py-4 bg-slate-50 border-2 border-transparent focus:border-blue-500 rounded-2xl outline-none font-bold"
                value={editForm.bio}
                onChange={(e) => setEditForm({...editForm, bio: e.target.value})}
              />
            </div>
            <button className="w-full bg-blue-600 text-white font-black py-5 rounded-2xl shadow-xl shadow-blue-100 flex items-center justify-center gap-2 uppercase tracking-widest">
              <Save size={20}/> Lưu thay đổi
            </button>
          </form>
        )}

        {/* CHANGE PASSWORD */}
        {activeTab === "password" && (
          <form onSubmit={handleChangePassword} className="space-y-6 max-w-md mx-auto animate-in zoom-in-95 duration-500">
             <div>
                <label className="block text-xs font-black text-slate-400 uppercase mb-2 ml-2">Mật khẩu hiện tại</label>
                <input 
                  type="password" required
                  className="w-full px-6 py-4 bg-slate-50 border-2 border-transparent focus:border-blue-500 rounded-2xl outline-none font-bold"
                  value={passwordForm.oldPassword}
                  onChange={(e) => setPasswordForm({...passwordForm, oldPassword: e.target.value})}
                />
             </div>
             <div>
                <label className="block text-xs font-black text-slate-400 uppercase mb-2 ml-2">Mật khẩu mới</label>
                <input 
                  type="password" required
                  className="w-full px-6 py-4 bg-slate-50 border-2 border-transparent focus:border-blue-500 rounded-2xl outline-none font-bold"
                  value={passwordForm.newPassword}
                  onChange={(e) => setPasswordForm({...passwordForm, newPassword: e.target.value})}
                />
             </div>
             <div>
                <label className="block text-xs font-black text-slate-400 uppercase mb-2 ml-2">Xác nhận mật khẩu</label>
                <input 
                  type="password" required
                  className="w-full px-6 py-4 bg-slate-50 border-2 border-transparent focus:border-blue-500 rounded-2xl outline-none font-bold"
                  value={passwordForm.confirmPassword}
                  onChange={(e) => setPasswordForm({...passwordForm, confirmPassword: e.target.value})}
                />
             </div>
             <button className="w-full bg-[#3a1a7e] text-white font-black py-5 rounded-2xl shadow-xl shadow-purple-100 flex items-center justify-center gap-2 uppercase tracking-widest">
              <Lock size={20}/> Cập nhật mật khẩu
            </button>
          </form>
        )}

      </div>
    </div>
  );
};

export default OwnerProfile;
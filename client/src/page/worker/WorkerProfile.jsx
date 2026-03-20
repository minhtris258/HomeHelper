import React, { useState, useEffect } from "react";
import { User, MapPin, Briefcase, Award, AlignLeft, Save } from "lucide-react";
import api from "../../api/axios";

const WorkerProfile = () => {
  const [loading, setLoading] = useState(false);
  const [profile, setProfile] = useState({
    age: 18,
    gender: "Nam",
    address: "",
    skills: "",
    experience: "",
    bio: ""
  });

 useEffect(() => {
  const fetchProfile = async () => {
    try {
      // Lấy userId đã lưu khi đăng nhập
      const userId = localStorage.getItem("userId"); 
      if (!userId) return;

      // Gọi đúng endpoint [HttpGet("{userId}")]
      const res = await api.get(`/Profile/${userId}`); 
      if (res.data.profile) {
        setProfile(res.data.profile);
      }
    } catch (err) {
      console.log("Chưa có hồ sơ, hệ thống sẽ tạo mới khi bạn nhấn Lưu.");
    }
  };
  fetchProfile();
}, []);

  const handleSave = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post("/Profile/update", profile);
      alert("Cập nhật hồ sơ tìm việc thành công!");
    } catch (err) { alert("Lỗi cập nhật"); }
    finally { setLoading(false); }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white rounded-[32px] shadow-sm border p-8">
        <div className="flex items-center gap-4 mb-8">
          <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center text-white shadow-lg">
            <User size={32} />
          </div>
          <h1 className="text-3xl font-black text-slate-800">Hồ sơ tìm việc</h1>
        </div>

        <form onSubmit={handleSave} className="space-y-6">
          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Độ tuổi</label>
              <input type="number" className="w-full px-5 py-3 bg-slate-50 border rounded-2xl outline-none" 
                value={profile.age} onChange={(e) => setProfile({...profile, age: e.target.value})} />
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Giới tính</label>
              <select className="w-full px-5 py-3 bg-slate-50 border rounded-2xl outline-none"
                value={profile.gender} onChange={(e) => setProfile({...profile, gender: e.target.value})}>
                <option value="Nam">Nam</option>
                <option value="Nữ">Nữ</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2 flex items-center gap-2"><MapPin size={16}/> Địa chỉ</label>
            <input className="w-full px-5 py-3 bg-slate-50 border rounded-2xl outline-none" 
              value={profile.address} onChange={(e) => setProfile({...profile, address: e.target.value})} />
          </div>

          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2 flex items-center gap-2"><Award size={16}/> Kỹ năng (Dọn dẹp, Nấu ăn...)</label>
            <input className="w-full px-5 py-3 bg-slate-50 border rounded-2xl outline-none" 
              value={profile.skills} onChange={(e) => setProfile({...profile, skills: e.target.value})} />
          </div>

          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2 flex items-center gap-2"><Briefcase size={16}/> Kinh nghiệm làm việc</label>
            <textarea className="w-full px-5 py-3 bg-slate-50 border rounded-2xl outline-none" rows="3"
              value={profile.experience} onChange={(e) => setProfile({...profile, experience: e.target.value})} />
          </div>

          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2 flex items-center gap-2"><AlignLeft size={16}/> Giới thiệu bản thân</label>
            <textarea className="w-full px-5 py-3 bg-slate-50 border rounded-2xl outline-none" rows="4"
              value={profile.bio} onChange={(e) => setProfile({...profile, bio: e.target.value})} />
          </div>

          <button disabled={loading} className="w-full bg-blue-600 hover:bg-blue-700 text-white font-black py-4 rounded-2xl shadow-lg transition-all flex items-center justify-center gap-2">
            <Save size={20} /> {loading ? "ĐANG LƯU..." : "CẬP NHẬT HỒ SƠ"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default WorkerProfile;
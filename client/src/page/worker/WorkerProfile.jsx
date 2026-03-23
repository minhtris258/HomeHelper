import React, { useState, useEffect } from "react";
import {
  User,
  MapPin,
  Briefcase,
  Award,
  AlignLeft,
  Save,
  Phone,
  UserCircle,
} from "lucide-react";
import api from "../../api/axios";

const WorkerProfile = () => {
  const [loading, setLoading] = useState(false);
  const [profile, setProfile] = useState({
    // Thông tin từ bảng User (Thông tin cứng)
    fullName: "",
    phoneNumber: "",
    // Thông tin từ bảng Profile (Hồ sơ chi tiết)
    userId: localStorage.getItem("userId"),
    age: 18,
    gender: "Nam",
    address: "",
    skills: "",
    experience: "",
    bio: "",
  });

  useEffect(() => {
    const fetchFullProfile = async () => {
      try {
        const userId = localStorage.getItem("userId");
        if (!userId) return;

        // Gọi API lấy Profile (đã bao gồm UserInfo từ ProfileController.cs)
        const res = await api.get(`/Profile/${userId}`);

        if (res.data) {
          setProfile({
            ...res.data.profile,
            fullName: res.data.userInfo.fullName || "",
            phoneNumber: res.data.userInfo.phoneNumber || "",
            userId: userId, // Đảm bảo luôn có userId
          });
        }
      } catch (err) {
        console.log("Lỗi lấy dữ liệu hoặc chưa có hồ sơ.");
      }
    };
    fetchFullProfile();
  }, []);

  const handleSave = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const userId = localStorage.getItem("userId");

      // 1. Cập nhật thông tin cứng (Bảng User)
      await api.put(`/User/update-contact/${userId}`, {
        fullName: profile.fullName,
        phoneNumber: profile.phoneNumber,
      });

      // 2. Cập nhật hồ sơ chi tiết (Bảng Profile)
      // Gửi toàn bộ object profile (Backend sẽ lọc các trường tương ứng)
      await api.post("/Profile/update", profile);

      alert("Cập nhật toàn bộ thông tin thành công!");
    } catch (err) {
      console.error(err);
      alert(
        "Lỗi cập nhật: " + (err.response?.data?.message || "Không thể lưu"),
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto p-6">
      <div className="bg-white ">
        <div className="flex items-center gap-4 mb-8">
          <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center text-white shadow-lg">
            <User size={32} />
          </div>
          <h1 className="text-3xl font-bold text-slate-800">Hồ sơ cá nhân</h1>
        </div>

        <form onSubmit={handleSave} className="space-y-6">
          {/* PHẦN 1: THÔNG TIN CỨNG (USER TABLE) */}
          <div className="bg-blue-50/50 p-6 rounded-3xl border border-blue-100 space-y-4">
            <h2 className="font-bold text-blue-700 flex items-center gap-2">
              <UserCircle size={18} /> Thông tin cơ bản
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2 border-l-4 border-blue-600 pl-3 flex items-center gap-2">
                  Họ và tên
                </label>
                <input
                  required
                  className="w-full px-5 py-3 bg-white border rounded-2xl outline-none focus:ring-2 focus:ring-blue-500"
                  value={profile.fullName}
                  onChange={(e) =>
                    setProfile({ ...profile, fullName: e.target.value })
                  }
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2 border-l-4 border-blue-600 pl-3 flex items-center gap-2">
                  Số điện thoại
                </label>
                <input
                  required
                  className="w-full px-5 py-3 bg-white border rounded-2xl outline-none focus:ring-2 focus:ring-blue-500"
                  value={profile.phoneNumber}
                  onChange={(e) =>
                    setProfile({ ...profile, phoneNumber: e.target.value })
                  }
                />
              </div>
            </div>
          </div>

          {/* PHẦN 2: HỒ SƠ CHI TIẾT (PROFILE TABLE) */}
          <div className="grid grid-cols-2 gap-6 ">
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2 border-l-4 border-blue-600 pl-3 flex items-center gap-2">
                Độ tuổi
              </label>
              <input
                type="number"
                className="w-full px-5 py-3 bg-slate-50 border rounded-2xl outline-none"
                value={profile.age}
                onChange={(e) =>
                  setProfile({ ...profile, age: e.target.value })
                }
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2 border-l-4 border-blue-600 pl-3 flex items-center gap-2">
                Giới tính
              </label>
              <select
                className="w-full px-5 py-3 bg-slate-50 border rounded-2xl outline-none cursor-pointer"
                value={profile.gender}
                onChange={(e) =>
                  setProfile({ ...profile, gender: e.target.value })
                }
              >
                <option value="Nam">Nam</option>
                <option value="Nữ">Nữ</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2 border-l-4 border-blue-600 pl-3 flex items-center gap-2">
              <MapPin size={16} /> Địa chỉ cư trú
            </label>
            <input
              className="w-full px-5 py-3 bg-slate-50 border rounded-2xl outline-none"
              value={profile.address}
              onChange={(e) =>
                setProfile({ ...profile, address: e.target.value })
              }
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2 flex items-center gap-2">
              <Award size={16} /> Kỹ năng chuyên môn
            </label>
            <input
              placeholder="Ví dụ: Nấu ăn, Dọn dẹp văn phòng..."
              className="w-full px-5 py-3 bg-slate-50 border rounded-2xl outline-none"
              value={profile.skills}
              onChange={(e) =>
                setProfile({ ...profile, skills: e.target.value })
              }
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2 flex items-center gap-2">
              <Briefcase size={16} /> Kinh nghiệm (số năm hoặc chi tiết)
            </label>
            <textarea
              placeholder="Mô tả kinh nghiệm làm việc của bạn..."
              className="w-full px-5 py-3 bg-slate-50 border rounded-2xl outline-none"
              rows="3"
              value={profile.experience}
              onChange={(e) =>
                setProfile({ ...profile, experience: e.target.value })
              }
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2 flex items-center gap-2">
              <AlignLeft size={16} /> Giới thiệu bản thân
            </label>
            <textarea
              className="w-full px-5 py-3 bg-slate-50 border rounded-2xl outline-none"
              rows="4"
              value={profile.bio}
              onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
            />
          </div>

          <button
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-2xl shadow-lg transition-all flex items-center justify-center gap-2 disabled:bg-slate-400"
          >
            <Save size={20} />{" "}
            {loading ? "ĐANG LƯU DỮ LIỆU..." : "LƯU TẤT CẢ THÔNG TIN"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default WorkerProfile;

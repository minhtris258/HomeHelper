// src/page/admin/JobManagement.jsx
import React, { useEffect, useState } from "react";
import { 
  ClipboardList, Search, Trash2, MapPin, DollarSign, 
  Briefcase, Filter, AlertCircle, Eye, User, CalendarDays 
} from "lucide-react";
import api from "../../api/axios";
// 1. Import Modal component
import Modal from "../../components/Modal"; 

const JobManagement = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterService, setFilterService] = useState("");

  // 2. State quản lý Modal và bài đăng đang chọn
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedJob, setSelectedJob] = useState(null);

  // Lấy danh sách bài đăng (giữ nguyên logic cũ)
  const fetchJobs = async () => {
    setLoading(true);
    try {
      const response = await api.get("/Job", {
        params: {
          location: searchTerm,
          serviceType: filterService
        }
      });
      setJobs(response.data);
    } catch (err) {
      console.error("Lỗi khi tải danh sách tin đăng:", err);
    } finally {
      setLoading(false);
    }
  };

  // Xử lý xóa bài đăng (giữ nguyên logic cũ)
  const handleDeleteJob = async (id, title) => {
    if (!window.confirm(`Bạn có chắc chắn muốn xóa bài đăng: "${title}" không?`)) return;

    try {
      await api.delete(`/Job/${id}`);
      alert("Đã xóa bài đăng thành công!");
      fetchJobs();
    } catch (err) {
      alert(err.response?.data?.message || "Lỗi khi xóa bài đăng.");
    }
  };

  // 3. Hàm xử lý khi bấm vào mắt để xem chi tiết
  const handleOpenDetail = (job) => {
    setSelectedJob(job); // Lưu bài đăng được chọn vào state
    setIsModalOpen(true); // Mở Modal
  };

  // 4. Hàm đóng Modal
  const handleCloseModal = () => {
    setIsModalOpen(false); // Đóng Modal
    setSelectedJob(null); // Xóa dữ liệu bài đăng đang chọn
  };

  useEffect(() => {
    fetchJobs();
  }, [filterService]);

  return (
    <div className="p-6 max-w-7xl mx-auto min-h-screen bg-slate-50 relative">
      {/* Header & Bộ lọc (giữ nguyên) */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
            <ClipboardList className="text-blue-600" />
            Quản lý bài đăng tuyển dụng
          </h1>
          <p className="text-slate-500 text-sm mt-1">Admin có quyền kiểm soát và xóa các tin đăng vi phạm.</p>
        </div>

        <div className="flex flex-wrap gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
              type="text"
              placeholder="Tìm theo địa điểm..."
              className="pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 outline-none w-64"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && fetchJobs()}
            />
          </div>

          <select 
            className="px-4 py-2 bg-white border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-500"
            value={filterService}
            onChange={(e) => setFilterService(e.target.value)}
          >
            <option value="">Tất cả dịch vụ</option>
            <option value="Giúp việc theo giờ">Giúp việc theo giờ</option>
            <option value="Trông trẻ">Trông trẻ</option>
            <option value="Chăm sóc người già">Chăm sóc người già</option>
            <option value="Nấu ăn">Nấu ăn</option>
          </select>
        </div>
      </div>

      {/* Danh sách bài đăng */}
      {loading ? (
        <div className="flex justify-center py-20">
          <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : jobs.length === 0 ? (
        <div className="bg-white rounded-2xl p-20 text-center border border-dashed border-slate-300">
          <AlertCircle className="mx-auto text-slate-300 mb-4" size={48} />
          <p className="text-slate-500 font-medium">Không tìm thấy bài đăng nào phù hợp.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {jobs.map((job) => (
            <div key={job.id} className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-all flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              {/* Nội dung tin đăng (giữ nguyên) */}
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="bg-blue-100 text-blue-600 text-[10px] font-bold px-2 py-0.5 rounded uppercase">
                    {job.serviceType}
                  </span>
                  <span className="text-slate-400 text-xs">•</span>
                  <span className="text-slate-500 text-xs italic">Đăng bởi ID #{job.ownerId}</span>
                </div>
                <h3 className="font-bold text-slate-800 text-lg mb-2">{job.title}</h3>
                
                <div className="flex flex-wrap gap-4 text-sm text-slate-600">
                  <div className="flex items-center gap-1.5">
                    <MapPin size={16} className="text-slate-400" />
                    {job.location}
                  </div>
                  <div className="flex items-center gap-1.5 font-bold text-green-600">
                    <DollarSign size={16} />
                    {job.salary.toLocaleString('vi-VN')} đ
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Briefcase size={16} className="text-slate-400" />
                    {job.jobType}
                  </div>
                </div>
              </div>

              {/* Thao tác */}
              <div className="flex items-center gap-3 w-full md:w-auto pt-4 md:pt-0 border-t md:border-none">
                <button 
                  title="Xem chi tiết"
                  // 5. Gắn hàm handleOpenDetail khi bấm vào mắt
                  onClick={() => handleOpenDetail(job)}
                  className="flex-1 md:flex-none p-2.5 text-slate-600 hover:bg-slate-100 rounded-xl transition"
                >
                  <Eye size={20} />
                </button>
                <button 
                  onClick={() => handleDeleteJob(job.id, job.title)}
                  className="flex-1 md:flex-none p-2.5 text-red-500 hover:bg-red-50 rounded-xl transition"
                  title="Xóa bài đăng"
                >
                  <Trash2 size={20} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* 6. Tích hợp Modal Chi tiết Bài đăng */}
      <Modal 
        isOpen={isModalOpen} 
        onClose={handleCloseModal} 
        title="Chi tiết bài đăng tuyển dụng"
      >
        {selectedJob && (
          <div className="space-y-6 max-w-2xl">
            {/* Tiêu đề & Loại dịch vụ */}
            <div>
              <span className="bg-blue-100 text-blue-700 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                {selectedJob.serviceType}
              </span>
              <h2 className="text-2xl font-extrabold text-slate-900 mt-3">{selectedJob.title}</h2>
            </div>

            {/* Thông tin cơ bản (Grid) */}
            <div className="grid grid-cols-2 gap-5 bg-slate-50 p-5 rounded-2xl border border-slate-100">
              <div className="flex items-center gap-3">
                <div className="bg-white p-2.5 rounded-xl shadow-sm border"><DollarSign className="text-green-600" /></div>
                <div>
                  <p className="text-xs text-slate-500">Mức lương</p>
                  <p className="font-bold text-green-700 text-lg">{selectedJob.salary.toLocaleString('vi-VN')} đ</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="bg-white p-2.5 rounded-xl shadow-sm border"><Briefcase className="text-blue-600" /></div>
                <div>
                  <p className="text-xs text-slate-500">Hình thức</p>
                  <p className="font-bold text-slate-800">{selectedJob.jobType}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 col-span-2">
                <div className="bg-white p-2.5 rounded-xl shadow-sm border"><MapPin className="text-red-500" /></div>
                <div>
                  <p className="text-xs text-slate-500">Địa điểm làm việc</p>
                  <p className="font-bold text-slate-800">{selectedJob.location}</p>
                </div>
              </div>
            </div>

            {/* Mô tả công việc */}
            <div>
              <h4 className="font-bold text-slate-800 mb-2 border-l-4 border-blue-500 pl-3">Mô tả công việc</h4>
              <div className="text-sm text-slate-600 leading-relaxed bg-white p-4 rounded-xl border border-slate-100 whitespace-pre-line">
                {selectedJob.description}
              </div>
            </div>

            {/* Yêu cầu & Thông tin khác */}
            <div className="grid grid-cols-2 gap-4 text-sm bg-slate-50 p-4 rounded-xl border border-slate-100">
              <div className="text-slate-600">Yêu cầu giới tính: <span className="font-semibold text-slate-800">{selectedJob.genderReq || "Không yêu cầu"}</span></div>
              <div className="text-slate-600">Yêu cầu tuổi: <span className="font-semibold text-slate-800">{selectedJob.ageReq ? `${selectedJob.ageReq} tuổi trở lên` : "Không yêu cầu"}</span></div>
            </div>

            {/* Footer thông tin người đăng */}
            <div className="flex items-center justify-between text-xs text-slate-400 pt-4 border-t border-slate-100">
              <div className="flex items-center gap-1.5">
                <User size={14} /> Đăng bởi Chủ nhà ID #{selectedJob.ownerId}
              </div>
              <div className="flex items-center gap-1.5">
                <CalendarDays size={14} /> Ngày đăng: {new Date(selectedJob.createdAt).toLocaleDateString('vi-VN')}
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default JobManagement;
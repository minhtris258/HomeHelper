// src/page/admin/JobManagement.jsx
import React, { useEffect, useState } from "react";
import { 
  ClipboardList, Search, Trash2, MapPin, DollarSign, 
  Briefcase, Filter, AlertCircle, Eye, User, CalendarDays,
  Clock, Award, Users, Calendar
} from "lucide-react";
import api from "../../api/axios";
import Modal from "../../components/Modal"; 

const JobManagement = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterService, setFilterService] = useState("");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedJob, setSelectedJob] = useState(null);

  const fetchJobs = async () => {
    setLoading(true);
    try {
      const response = await api.get("Job", {
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

  const handleOpenDetail = (job) => {
    setSelectedJob(job);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedJob(null);
  };

  useEffect(() => {
    fetchJobs();
  }, [filterService]);

  return (
    <div className="p-6 max-w-7xl mx-auto min-h-screen bg-slate-50 relative text-left">
      {/* Header & Search (Giữ nguyên phong cách cũ) */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2 uppercase tracking-tight">
            <ClipboardList className="text-blue-600" size={28} />
            Quản lý bài đăng tuyển dụng
          </h1>
          <p className="text-slate-500 text-sm font-medium mt-1 italic">Kiểm soát nội dung và xử lý các tin đăng vi phạm quy định hệ thống.</p>
        </div>

        <div className="flex flex-wrap gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
              type="text"
              placeholder="Tìm kiếm địa điểm..."
              className="pl-10 pr-4 py-3 bg-white border border-slate-200 rounded-2xl text-sm focus:ring-2 focus:ring-blue-500 outline-none w-64 font-bold shadow-sm"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && fetchJobs()}
            />
          </div>

          <select 
            className="px-4 py-3 bg-white border border-slate-200 rounded-2xl text-sm outline-none focus:ring-2 focus:ring-blue-500 font-bold shadow-sm cursor-pointer"
            value={filterService}
            onChange={(e) => setFilterService(e.target.value)}
          >
            <option value="">Tất cả dịch vụ</option>
            <option value="Giúp việc gia đình">Giúp việc gia đình</option>
            <option value="Trông trẻ tại nhà">Trông trẻ tại nhà</option>
            <option value="Chăm sóc người già">Chăm sóc người già</option>
            <option value="Nấu ăn / Đi chợ">Nấu ăn / Đi chợ</option>
          </select>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : jobs.length === 0 ? (
        <div className="bg-white rounded-[40px] p-24 text-center border-2 border-dashed border-slate-200 shadow-sm">
          <AlertCircle className="mx-auto text-slate-200 mb-4" size={64} />
          <p className="text-slate-400 font-black uppercase tracking-widest text-lg">Không có bài đăng nào!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-5">
  {jobs.map((job) => (
    <div key={job.id} className="bg-white p-6 rounded-[32px] shadow-sm border border-slate-100 hover:shadow-xl hover:border-blue-200 transition-all flex flex-col md:flex-row justify-between items-start md:items-center gap-6 text-left">
      <div className="flex-1 w-full">
        {/* Dòng 1: Badge dịch vụ và ID */}
        <div className="flex items-center gap-3 mb-2">
          <span className="bg-blue-600 text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-widest shadow-lg shadow-blue-100">
            {job.serviceType}
          </span>
          <span className="text-slate-300 font-bold">|</span>
          <span className="text-slate-400 text-xs font-bold uppercase italic">ID Chủ nhà: #{job.ownerId}</span>
        </div>

        {/* Dòng 2: Tiêu đề bài đăng */}
        <h3 className="font-bold text-slate-800 text-xl mb-3 group-hover:text-blue-600 transition-colors">
          {job.title}
        </h3>
        
        {/* Dòng 3: Thông tin Lương và Loại hình (Nằm trên) */}
        <div className="flex flex-wrap gap-y-3 gap-x-6 text-sm mb-3">
          <div className="flex items-center gap-2 text-blue-600 font-bold bg-blue-50 px-3 py-1.5 rounded-xl">
            <DollarSign size={18} />
            {job.salary.toLocaleString('vi-VN')} đ
          </div>
          <div className="flex items-center gap-2 text-slate-500 font-bold border border-slate-100 px-3 py-1.5 rounded-xl">
            <Briefcase size={18} className="text-slate-400" />
            {job.jobType}
          </div>
        </div>

        {/* Dòng 4: Vị trí (Đưa xuống dưới cùng và chiếm trọn chiều ngang) */}
        <div className="flex items-center gap-2 text-slate-500  border border-slate-100 px-3 py-1.5 rounded-xl">
          <MapPin size={18} className="text-red-500 mt-0.5 shrink-0" />
          <span className="leading-relaxed">{job.location}</span>
        </div>
      </div>

      {/* Cụm nút thao tác */}
      <div className="flex items-center gap-3 w-full md:w-auto pt-4 md:pt-0 border-t md:border-none">
        <button 
          onClick={() => handleOpenDetail(job)}
          className="flex-1 md:flex-none p-3.5 text-blue-600 bg-blue-50 hover:bg-blue-600 hover:text-white rounded-2xl transition-all shadow-sm"
          title="Xem chi tiết"
        >
          <Eye size={18} />
        </button>
        <button 
          onClick={() => handleDeleteJob(job.id, job.title)}
          className="flex-1 md:flex-none p-3.5 text-red-600 bg-red-50 hover:bg-red-600 hover:text-white rounded-2xl transition-all shadow-sm"
          title="Xóa bài đăng"
        >
          <Trash2 size={18} />
        </button>
      </div>
    </div>
  ))}
</div>
      )}

      {/* MODAL CHI TIẾT ĐÃ CẬP NHẬT CÁC TRƯỜNG MỚI */}
      <Modal 
        isOpen={isModalOpen} 
        onClose={handleCloseModal} 
        title="Thông tin chi tiết tin đăng"
      >
        {selectedJob && (
          <div className="space-y-8 max-w-2xl text-left">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="bg-blue-100 text-blue-700 text-[10px] font-bold px-4 py-1 rounded-full uppercase tracking-widest">
                  {selectedJob.serviceType}
                </span>
                <span className="text-slate-300">•</span>
                <span className="text-slate-400 text-xs font-bold uppercase tracking-tighter">Tin tuyển dụng #{selectedJob.id}</span>
              </div>
              <h2 className="text-3xl font-bold text-slate-900 leading-tight">{selectedJob.title}</h2>
            </div>

            {/* Thông số chính */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-slate-50 p-5 rounded-[24px] border border-slate-100 flex items-center gap-4">
                <div className="bg-white p-3 rounded-2xl shadow-sm"><DollarSign className="text-green-600" size={24} /></div>
                <div>
                  <p className="text-[10px] text-slate-400 font-bold uppercase">Lương dự kiến</p>
                  <p className="font-bold text-green-700 text-xl">{selectedJob.salary.toLocaleString('vi-VN')} đ</p>
                </div>
              </div>
              <div className="bg-slate-50 p-5 rounded-[24px] border border-slate-100 flex items-center gap-4">
                <div className="bg-white p-3 rounded-2xl shadow-sm"><Clock className="text-blue-600" size={24} /></div>
                <div>
                  <p className="text-[10px] text-slate-400 font-bold uppercase">Giờ làm việc</p>
                  <p className="font-bold text-slate-800 text-lg">{selectedJob.workingTime || "Thỏa thuận"}</p>
                </div>
              </div>
            </div>

            {/* Thông tin yêu cầu tuyển dụng */}
            <div className="bg-white rounded-[32px] border border-slate-100 p-6 space-y-6 shadow-sm">
              <h4 className="font-bold text-slate-800 uppercase tracking-widest text-xs flex items-center gap-2 border-b pb-4">
                <Users size={16} className="text-blue-600"/> Yêu cầu ứng viên
              </h4>
              <div className="grid grid-cols-2 gap-6">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-slate-50 rounded-lg"><Users size={18} className="text-slate-400"/></div>
                  <div>
                    <p className="text-[10px] text-slate-400 font-bold uppercase">Giới tính</p>
                    <p className="font-bold text-slate-700">{selectedJob.genderReq || "Không yêu cầu"}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-slate-50 rounded-lg"><Calendar size={18} className="text-slate-400"/></div>
                  <div>
                    <p className="text-[10px] text-slate-400 font-bold uppercase">Độ tuổi</p>
                    <p className="font-bold text-slate-700">{selectedJob.ageReq || "Không yêu cầu"}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 col-span-2">
                  <div className="p-2 bg-slate-50 rounded-lg"><Award size={18} className="text-slate-400"/></div>
                  <div>
                    <p className="text-[10px] text-slate-400 font-bold uppercase">Kỹ năng cần thiết</p>
                    <p className="font-bold text-slate-700">{selectedJob.requiredSkills || "Không yêu cầu kỹ năng đặc biệt"}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Mô tả chi tiết */}
            <div>
              <h4 className="font-bold text-slate-800 mb-3 uppercase tracking-widest text-xs pl-1">Mô tả công việc</h4>
              <div className="text-sm text-slate-600 leading-relaxed bg-slate-50 p-6 rounded-[24px] border border-slate-100 whitespace-pre-line italic font-medium">
                "{selectedJob.description}"
              </div>
            </div>

            {/* Footer thông tin đăng bài */}
            <div className="flex items-center justify-between p-4 bg-blue-50/50 rounded-2xl border border-blue-100">
              <div className="flex items-center gap-2 text-xs font-bold text-blue-700">
                <User size={14} /> Chủ nhà ID: #{selectedJob.ownerId}
              </div>
              <div className="flex items-center gap-2 text-xs font-bold text-slate-400">
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
import React, { useEffect, useState, useCallback } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { Loader2, Search } from "lucide-react";
import api from "../api/axios";
import JobCard from "../components/JobCard";
import HomeSearchBar from "../components/HomeSearchBar";
import JobSidebar from "../components/JobSidebar";

const SearchResults = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  // Lấy các giá trị từ URL
  const keyword = searchParams.get("keyword") || "";
  const location = searchParams.get("location") || "";
  const minSalary = searchParams.get("minSalary") || "";
  const jobType = searchParams.get("jobType") || "";
  const serviceType = searchParams.get("serviceType") || "";

  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  // Hàm fetch dữ liệu dựa trên TẤT CẢ params có trong URL
  const fetchResults = useCallback(async () => {
    setLoading(true);
    try {
      const response = await api.get("/Job", {
        params: { keyword, location, minSalary, jobType, serviceType },
      });
      setJobs(response.data);
    } catch (err) {
      console.error("Lỗi tải dữ liệu:", err);
    } finally {
      setLoading(false);
    }
  }, [keyword, location, minSalary, jobType, serviceType]);

  useEffect(() => {
    fetchResults();
  }, [fetchResults]);

  // Khi Sidebar thay đổi, ta cập nhật URL nhưng giữ lại keyword và location ban đầu
  const handleFilterChange = (sidebarFilters) => {
    const params = new URLSearchParams();

    // Luôn giữ lại keyword và location từ tìm kiếm ban đầu
    if (keyword) params.set("keyword", keyword);
    if (location) params.set("location", location);

    // Thêm các filter mới từ Sidebar
    Object.keys(sidebarFilters).forEach((key) => {
      if (sidebarFilters[key]) {
        params.set(key, sidebarFilters[key]);
      }
    });

    navigate(`/jobs?${params.toString()}`);
  };

  return (
    <div className="min-h-screen bg-slate-50 pb-20 font-sans">
      <div className="pt-12 pb-24 text-center">
        <h1 className="text-white text-3xl font-bold uppercase tracking-tight">
          Kết quả tìm kiếm
        </h1>
        {location && (
          <p className="text-purple-200 mt-2 font-bold flex items-center justify-center gap-2">
            Khu vực:{" "}
            <span className="bg-white/20 px-3 py-1 rounded-lg text-white">
              {location}
            </span>
          </p>
        )}
      </div>

      <div className="relative -mt-12">
        <HomeSearchBar />
      </div>

      <div className="max-w-7xl mx-auto px-4 mt-16 text-left container py-10">
        <div className="flex flex-col lg:flex-row gap-8">
          <JobSidebar
            totalResults={jobs.length}
            onFilterChange={handleFilterChange}
            currentFilters={{ minSalary, jobType, serviceType }}
          />

          <div className="flex-1">
            {loading ? (
              <div className="flex flex-col items-center justify-center py-20 bg-white rounded-[32px] border border-dashed">
                <Loader2
                  className="animate-spin text-blue-600 mb-4"
                  size={40}
                />
                <p className="text-slate-400 font-bold italic">
                  Đang lọc danh sách...
                </p>
              </div>
            ) : jobs.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {jobs.map((job) => (
                  <JobCard
                    key={job.id}
                    job={job}
                    onClick={(j) => navigate(`/job-detail?id=${j.id}`)}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-24 bg-white rounded-[40px] border-2 border-dashed border-slate-100">
                <Search className="mx-auto text-slate-200 mb-6" size={80} />
                <h3 className="text-xl font-bold text-slate-800">
                  Không có kết quả phù hợp
                </h3>
                <p className="text-slate-400 font-medium">
                  Bạn có thể thử xóa bớt bộ lọc để thấy nhiều kết quả hơn.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchResults;

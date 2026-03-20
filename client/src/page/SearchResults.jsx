import React, { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { Loader2, Search } from "lucide-react";
import api from "../api/axios";
import JobCard from "../components/JobCard";
import HomeSearchBar from "../components/HomeSearchBar";

const SearchResults = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const keyword = searchParams.get("keyword") || "";
  const location = searchParams.get("location") || "";

  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchResults = async () => {
      setLoading(true);
      try {
        // Gọi API với đúng params keyword và location
        const response = await api.get("/Job", {
          params: { keyword, location }
        });
        setJobs(response.data);
      } catch (err) {
        console.error("Lỗi API:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchResults();
  }, [keyword, location]);

  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      {/* Banner Header */}
      <div className="bg-[#3a1a7e] pt-10 pb-20">
        <h1 className="text-white text-center text-3xl font-bold">Kết quả tìm kiếm</h1>
      </div>

      {/* Thanh tìm kiếm */}
      <div className="relative -mt-12">
        <HomeSearchBar />
      </div>

      <div className="max-w-5xl mx-auto px-4 mt-12">
        {loading ? (
          <div className="flex justify-center py-20"><Loader2 className="animate-spin" size={40} /></div>
        ) : jobs.length > 0 ? (
          <div className="grid grid-cols-1 gap-4">
            {/* ĐÂY LÀ ĐOẠN QUAN TRỌNG ĐỂ HIỆN KẾT QUẢ */}
            {jobs.map((job) => (
              <JobCard 
                key={job.id} 
                job={job} 
                onClick={(j) => navigate(`/job-detail?id=${j.id}`)} 
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-white rounded-3xl border">
            <Search className="mx-auto text-slate-300 mb-4" size={48} />
            <p className="text-slate-500">Không tìm thấy công việc nào khớp với "{keyword}"</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchResults;
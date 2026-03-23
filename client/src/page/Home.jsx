import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom"; // Thêm useNavigate ở đây
import { ChevronRight, Sparkles } from "lucide-react";
import api from "../api/axios";
import Hero from "../components/Hero";
import HomeSearchBar from "../components/HomeSearchBar";
import JobCard from "../components/JobCard";

const Home = () => {
  const [featuredJobs, setFeaturedJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // KHAI BÁO navigate TẠI ĐÂY
  const navigate = useNavigate(); 

  useEffect(() => {
    const fetchFeaturedJobs = async () => {
      try {
        const response = await api.get("/Job");
        setFeaturedJobs(response.data.slice(0, 10));
      } catch (error) {
        console.error("Lỗi khi tải job đề xuất:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchFeaturedJobs();
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <main className="flex-grow">
        <Hero />
        <HomeSearchBar />

        <section className="max-w-7xl mx-auto px-4 py-16 container">
          <div className="flex justify-between items-end mb-8">
            <div>
              <h2 className="text-3xl font-extrabold text-slate-900 flex items-center gap-2">
                <Sparkles className="text-yellow-500" />
                Việc làm nổi bật
              </h2>
              <p className="text-slate-500 mt-2 font-medium">Những cơ hội việc làm tốt nhất dành cho bạn hôm nay.</p>
            </div>
            <Link to="/jobs" className="group flex items-center gap-1 text-blue-600 font-bold hover:text-blue-700 transition">
              Xem tất cả {featuredJobs.length > 0 && `(${featuredJobs.length}+)`}
              <ChevronRight size={20} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="h-40 bg-white rounded-2xl animate-pulse border border-slate-100"></div>
              ))}
            </div>
          ) : featuredJobs.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredJobs.map((job) => (
                <JobCard
                  key={job.id}
                  job={job}
                  // BÂY GIỜ navigate ĐÃ HOẠT ĐỘNG
                  onClick={(j) => navigate(`/job-detail?id=${j.id}`)} 
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-slate-200">
              <p className="text-slate-400">Hiện chưa có công việc nào được đăng tải.</p>
            </div>
          )}

          <div className="mt-12 text-center">
            <Link to="/jobs" className="inline-block bg-white text-slate-800 font-bold px-10 py-4 rounded-2xl border-2 border-slate-100 hover:border-blue-600 hover:text-blue-600 transition-all shadow-sm">
              Khám phá thêm hàng ngàn việc làm khác
            </Link>
          </div>
        </section>
      </main>
    </div>
  );
};

export default Home;
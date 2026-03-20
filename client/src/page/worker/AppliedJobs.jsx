import React, { useEffect, useState } from "react";
import { Clock, CheckCircle2, XCircle, MapPin } from "lucide-react";
import api from "../../api/axios";

const AppliedJobs = () => {
  const [apps, setApps] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchApps = async () => {
      try {
        const res = await api.get("/Application/my-applications");
        setApps(res.data);
      } catch (err) { console.error(err); }
      finally { setLoading(false); }
    };
    fetchApps();
  }, []);

  const getStatusStyle = (status) => {
    if (status === "Accepted") return "bg-green-100 text-green-700 border-green-200";
    if (status === "Rejected") return "bg-red-100 text-red-700 border-red-200";
    return "bg-yellow-100 text-yellow-700 border-yellow-200";
  };

  return (
    <div className="max-w-5xl mx-auto p-6">
      <h1 className="text-2xl font-black text-slate-800 mb-8">Việc làm đã ứng tuyển</h1>
      
      {loading ? ( <div className="text-center py-20 animate-pulse text-slate-400">Đang tải...</div> ) : (
        <div className="grid gap-4">
          {apps.map((app) => (
            <div key={app.id} className="bg-white p-6 rounded-2xl border flex flex-col md:flex-row justify-between items-center gap-4 hover:shadow-md transition-all">
              <div className="flex-1">
                <h3 className="text-lg font-bold text-slate-800">{app.jobTitle}</h3>
                <div className="flex items-center gap-4 mt-2 text-sm text-slate-500">
                  <span className="flex items-center gap-1"><MapPin size={14}/> {app.location}</span>
                  <span className="flex items-center gap-1"><Clock size={14}/> {new Date(app.applyDate).toLocaleDateString("vi-VN")}</span>
                </div>
              </div>

              <div className={`px-4 py-2 rounded-full border text-xs font-black uppercase flex items-center gap-2 ${getStatusStyle(app.status)}`}>
                {app.status === "Accepted" && <CheckCircle2 size={16}/>}
                {app.status === "Rejected" && <XCircle size={16}/>}
                {app.status === "Pending" && <Clock size={16}/>}
                {app.status}
              </div>
            </div>
          ))}
          {apps.length === 0 && <div className="text-center py-20 text-slate-400 border-2 border-dashed rounded-3xl">Bạn chưa ứng tuyển công việc nào.</div>}
        </div>
      )}
    </div>
  );
};

export default AppliedJobs;
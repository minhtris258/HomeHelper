import React from "react";

const Hero = () => (
  <section className="bg-blue-50 py-20 px-4 text-center">
    <div className="max-w-3xl mx-auto">
      <h2 className="text-4xl md:text-5xl font-extrabold text-slate-800 mb-6">
        Tìm Người Giúp Việc Tận Tâm, Nhanh Chóng
      </h2>
      <p className="text-lg text-slate-600 mb-8">
        Kết nối chủ nhà với hàng ngàn người giúp việc uy tín đã được xác thực bởi HomeHelper. 
        Gọn gàng, sạch sẽ, an tâm cho mái ấm của bạn.
      </p>
      <div className="flex flex-wrap justify-center gap-4">
        <button className="px-8 py-3 bg-blue-600 text-white font-semibold rounded-full shadow-lg hover:bg-blue-700 transition">
          Bắt đầu ngay
        </button>
        <button className="px-8 py-3 bg-white text-slate-800 font-semibold rounded-full shadow-md border hover:bg-slate-50 transition">
          Xem bảng giá
        </button>
      </div>
    </div>
  </section>
);

export default Hero;
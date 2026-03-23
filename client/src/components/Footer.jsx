import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Facebook, 
  Youtube, 
  Instagram, 
  MapPin, 
  Phone, 
  Mail, 
  ChevronRight, 
  ShieldCheck,
  CreditCard
} from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-[#0f172a] text-slate-400 pt-16 px-4 mt-auto">
      <div className="max-w-[1440px] mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 mb-12 container">
          
          {/* Cột 1: Thương hiệu & Social */}
          <div className="lg:col-span-2">
            <Link to="/" className="inline-block mb-6">
              <span className="text-3xl font-extrabold tracking-tighter text-white">
                Home<span className="text-blue-500">Helper</span>
              </span>
            </Link>
            <p className="text-sm leading-7 mb-8 max-w-sm">
              Nền tảng giúp việc nhà hàng đầu Việt Nam. Chúng tôi mang đến sự an tâm và tiện nghi cho mọi gia đình thông qua đội ngũ cộng tác viên chuyên nghiệp.
            </p>
            <div className="flex gap-4">
              <a href="#" className="p-2.5 rounded-lg bg-slate-800 hover:bg-blue-600 hover:text-white transition-all transform hover:-translate-y-1">
                <Facebook size={20} />
              </a>
              <a href="#" className="p-2.5 rounded-lg bg-slate-800 hover:bg-red-600 hover:text-white transition-all transform hover:-translate-y-1">
                <Youtube size={20} />
              </a>
              <a href="#" className="p-2.5 rounded-lg bg-slate-800 hover:bg-gradient-to-tr from-yellow-500 via-red-500 to-purple-500 hover:text-white transition-all transform hover:-translate-y-1">
                <Instagram size={20} />
              </a>
            </div>
          </div>

          {/* Cột 2: Về chúng tôi */}
          <div>
            <h4 className="text-white font-bold mb-7 text-sm uppercase tracking-widest">Khám phá</h4>
            <ul className="space-y-4 text-sm">
              {['Về HomeHelper', 'Tuyển dụng', 'Blog kinh nghiệm', 'Hợp tác đối tác'].map((item) => (
                <li key={item}>
                  <Link to="#" className="flex items-center gap-2 hover:text-blue-400 transition-colors group">
                    <ChevronRight size={14} className="opacity-0 group-hover:opacity-100 -ml-4 group-hover:ml-0 transition-all" />
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Cột 3: Hỗ trợ */}
          <div>
            <h4 className="text-white font-bold mb-7 text-sm uppercase tracking-widest">Hỗ trợ</h4>
            <ul className="space-y-4 text-sm">
              {['Trung tâm trợ giúp', 'Chính sách bảo mật', 'Điều khoản dịch vụ', 'Quy trình xử lý sự cố'].map((item) => (
                <li key={item}>
                  <Link to="#" className="flex items-center gap-2 hover:text-blue-400 transition-colors group">
                    <ChevronRight size={14} className="opacity-0 group-hover:opacity-100 -ml-4 group-hover:ml-0 transition-all" />
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Cột 4: Liên hệ */}
          <div>
            <h4 className="text-white font-bold mb-7 text-sm uppercase tracking-widest">Liên hệ</h4>
            <div className="space-y-5 text-sm">
              <div className="flex items-start gap-3">
                <MapPin size={20} className="text-blue-500 shrink-0" />
                <span>Toà nhà Innovation, CVPM Quang Trung, Quận 12, TP. Hồ Chí Minh</span>
              </div>
              <div className="flex items-center gap-3">
                <Phone size={20} className="text-blue-500 shrink-0" />
                <span>1900 1234 (8:00 - 20:00)</span>
              </div>
              <div className="flex items-center gap-3">
                <Mail size={20} className="text-blue-500 shrink-0" />
                <span>contact@homehelper.vn</span>
              </div>
              <div className="flex items-center gap-3 text-green-500 font-medium pt-2">
                <ShieldCheck size={20} />
                <span>Dịch vụ đã bảo hiểm</span>
              </div>
            </div>
          </div>
        </div>

        <div className="h-px bg-slate-800 w-full mb-8"></div>

        {/* Bottom Bar */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-6 container">
          <p className="text-xs text-slate-500">
            © 2026 HomeHelper. Phát triển bởi đội ngũ đam mê công nghệ.
          </p>
          
          <div className="flex items-center gap-6 opacity-70">
            <div className="flex items-center gap-2 text-xs">
              <CreditCard size={16} />
              <span>Thanh toán an toàn:</span>
            </div>
            {/* Các icon giả lập thanh toán */}
            <div className="flex gap-4 font-black italic text-slate-500">
              <span className="hover:text-blue-400 cursor-default transition">VISA</span>
              <span className="hover:text-orange-400 cursor-default transition">MASTER</span>
              <span className="hover:text-pink-500 cursor-default transition">MOMO</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
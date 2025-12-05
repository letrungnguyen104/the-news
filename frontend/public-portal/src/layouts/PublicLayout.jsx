import { Outlet, Link } from 'react-router-dom';
import { Search, Menu, X, Facebook, Twitter, Youtube } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Button, Input, Drawer } from 'antd';
import axiosClient from '../api/axiosClient';
import NotificationPopup from '../components/NotificationPopup';
import { useNavigate } from 'react-router-dom';

const PublicLayout = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [categories, setCategories] = useState([]);

  const navigate = useNavigate();

  const handleSearch = (e) => {
    if (e.key === 'Enter') {
      const value = e.target.value.trim();
      if (value) {
        navigate(`/search?q=${value}`);
        setIsMobileMenuOpen(false);
      }
    }
  };

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await axiosClient.get('/categories');
        setCategories(res);
      } catch (error) {
        console.error("Lỗi tải menu", error);
      }
    };
    fetchCategories();
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 font-sans">
      <NotificationPopup />
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">

          <Link to="/" className="flex items-center gap-2">
            <div className="bg-blue-600 text-white p-1.5 rounded font-bold text-xl tracking-tighter">TN</div>
            <span className="text-xl font-bold text-gray-900 tracking-tight">TheNews</span>
          </Link>

          <nav className="hidden md:flex items-center gap-8">
            <Link to="/" className="...">Trang chủ</Link>
            {categories.map(cat => (
              <Link
                key={cat.id}
                to={`/category/${cat.slug}`}
                className="text-gray-600 hover:text-blue-600 font-medium transition-colors"
              >
                {cat.name}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            <div className="hidden md:block relative">
              <Input
                placeholder="Tìm kiếm tin tức..."
                prefix={<Search size={16} className="text-gray-400" />}
                onKeyDown={handleSearch}
                className="rounded-full bg-gray-100 border-none w-64"
              />
            </div>

            <Button
              className="md:hidden"
              type="text"
              icon={<Menu />}
              onClick={() => setIsMobileMenuOpen(true)}
            />
          </div>
        </div>
      </header>

      <Drawer title="Menu" placement="right" onClose={() => setIsMobileMenuOpen(false)} open={isMobileMenuOpen}>
        <div className="flex flex-col gap-4">
          <Link to="/" onClick={() => setIsMobileMenuOpen(false)}>Trang chủ</Link>
          <Link to="/category/the-gioi" onClick={() => setIsMobileMenuOpen(false)}>Thế giới</Link>
          <Link to="/category/cong-nghe" onClick={() => setIsMobileMenuOpen(false)}>Công nghệ</Link>
        </div>
      </Drawer>

      <main className="flex-1 container mx-auto px-4 py-8">
        <Outlet />
      </main>

      <footer className="bg-gray-900 text-gray-400 py-12">
        <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2">
            <h2 className="text-white text-xl font-bold mb-4">The News</h2>
            <p className="text-sm leading-relaxed">
              Trang tin tức tổng hợp nhanh nhất, chính xác nhất. Cập nhật liên tục 24/7 các sự kiện nóng hổi trong nước và quốc tế.
            </p>
          </div>
          <div>
            <h3 className="text-white font-semibold mb-4">Chuyên mục</h3>
            <ul className="space-y-2 text-sm">
              <li><Link to="/" className="hover:text-white">Thế giới</Link></li>
              <li><Link to="/" className="hover:text-white">Công nghệ</Link></li>
              <li><Link to="/" className="hover:text-white">Kinh doanh</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="text-white font-semibold mb-4">Kết nối</h3>
            <div className="flex gap-4">
              <Facebook className="hover:text-blue-500 cursor-pointer" />
              <Twitter className="hover:text-blue-400 cursor-pointer" />
              <Youtube className="hover:text-red-600 cursor-pointer" />
            </div>
          </div>
        </div>
        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-xs">
          © 2025 The News. All rights reserved.
        </div>
      </footer>
    </div>
  );
};

export default PublicLayout;
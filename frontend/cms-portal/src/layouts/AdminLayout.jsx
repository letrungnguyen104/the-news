import { useState } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { LayoutDashboard, FileText, Users, LogOut, PenTool, Tag } from 'lucide-react';

const AdminLayout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [user] = useState({ name: 'Admin', role: 'Super Admin' });

  const handleLogout = () => {
    localStorage.removeItem('accessToken');
    navigate('/login');
  };

  const menuItems = [
    { path: '/admin/dashboard', label: 'Tổng quan', icon: <LayoutDashboard size={20} /> },
    { path: '/admin/categories', label: 'Danh mục', icon: <Tag size={20} /> },
    { path: '/admin/articles', label: 'Quản lý bài viết', icon: <FileText size={20} /> },
    { path: '/admin/articles/create', label: 'Viết bài mới', icon: <PenTool size={20} /> },
    { path: '/admin/users', label: 'Người dùng', icon: <Users size={20} /> },
  ];

  return (
    <div className="flex h-screen bg-gray-100 font-sans">
      <aside className="w-64 bg-white border-r border-gray-200 flex flex-col">
        <div className="h-16 flex items-center justify-center border-b border-gray-200">
          <h1 className="text-2xl font-bold text-blue-600">The News<span className="text-gray-400 text-xs ml-1">CMS</span></h1>
        </div>

        <nav className="flex-1 overflow-y-auto py-4">
          <ul className="space-y-1 px-3">
            {menuItems.map((item) => (
              <li key={item.path}>
                <Link
                  to={item.path}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 ${location.pathname === item.path
                    ? 'bg-blue-50 text-blue-600 font-medium'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                    }`}
                >
                  {item.icon}
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="p-4 border-t border-gray-200">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg w-full transition-colors"
          >
            <LogOut size={20} />
            Đăng xuất
          </button>
        </div>
      </aside>

      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-8 shadow-sm">
          <h2 className="text-xl font-semibold text-gray-800">
            {menuItems.find(i => i.path === location.pathname)?.label || 'Dashboard'}
          </h2>
          <div className="flex items-center gap-3">
            <div className="text-right hidden sm:block">
              <p className="text-sm font-medium text-gray-900">{user.name}</p>
              <p className="text-xs text-gray-500">{user.role}</p>
            </div>
            <div className="h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold">
              {user.name.charAt(0)}
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
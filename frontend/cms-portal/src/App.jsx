import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import AdminLayout from './layouts/AdminLayout';
import DashboardHome from './pages/DashboardHome';
import ArticleList from './pages/ArticleList';
import CreateArticle from './pages/CreateArticle';
import { ConfigProvider } from 'antd';
import CategoryList from './pages/CategoryList';
import UserList from './pages/UserList';

const PrivateRoute = ({ children }) => {
  const token = localStorage.getItem('accessToken');
  return token ? children : <Navigate to="/login" />;
};

function App() {
  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: '#2563eb',
          borderRadius: 8,
        },
      }}
    >
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />

          <Route path="/admin" element={
            <PrivateRoute>
              <AdminLayout />
            </PrivateRoute>
          }>
            <Route index element={<Navigate to="dashboard" />} />

            <Route path="dashboard" element={<DashboardHome />} />
            <Route path="articles" element={<ArticleList />} />
            <Route path="articles/create" element={<CreateArticle />} />
            <Route path="users" element={<UserList />} />
            <Route path="categories" element={<CategoryList />} />
            <Route path="articles/edit/:id" element={<CreateArticle />} />
          </Route>

          <Route path="*" element={<Navigate to="/login" />} />
        </Routes>
      </BrowserRouter>
    </ConfigProvider>
  );
}

export default App;
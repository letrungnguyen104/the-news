import { useState } from 'react';
import axiosClient from '../api/axiosClient';
import { useNavigate } from 'react-router-dom';
import { Form, Input, Button, Card, message, Typography } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;

const Login = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const onFinish = async (values) => {
    setLoading(true);
    try {
      const response = await axiosClient.post('/auth/login', {
        username: values.username,
        password: values.password,
      });
      localStorage.setItem('accessToken', response.accessToken);
      message.success('Đăng nhập thành công! Chào mừng quay lại.');
      navigate('/admin/dashboard');
    } catch (err) {
      message.error('Đăng nhập thất bại! Vui lòng kiểm tra tài khoản/mật khẩu.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-blue-500 to-indigo-600 p-4">
      <Card className="w-full max-w-md shadow-2xl rounded-2xl border-none">
        <div className="text-center mb-8">
          <Title level={2} style={{ color: '#1890ff', marginBottom: 0 }}>The News CMS</Title>
          <Text type="secondary">Hệ thống quản trị nội dung</Text>
        </div>

        <Form
          name="login_form"
          initialValues={{ remember: true }}
          onFinish={onFinish}
          layout="vertical"
          size="large"
        >
          <Form.Item
            name="username"
            rules={[{ required: true, message: 'Vui lòng nhập tên đăng nhập!' }]}
          >
            <Input
              prefix={<UserOutlined className="text-gray-400" />}
              placeholder="Tên đăng nhập"
              className="rounded-lg"
            />
          </Form.Item>

          <Form.Item
            name="password"
            rules={[{ required: true, message: 'Vui lòng nhập mật khẩu!' }]}
          >
            <Input.Password
              prefix={<LockOutlined className="text-gray-400" />}
              placeholder="Mật khẩu"
              className="rounded-lg"
            />
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              className="w-full h-10 rounded-lg bg-blue-600 hover:bg-blue-700 border-none font-semibold text-base"
              loading={loading}
            >
              Đăng nhập
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default Login;
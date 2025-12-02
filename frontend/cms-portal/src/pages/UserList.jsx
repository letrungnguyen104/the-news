import { useEffect, useState } from 'react';
import axiosClient from '../api/axiosClient';
import { Table, Button, Space, Modal, Form, Input, Select, message, Tooltip, Tag, Popconfirm } from 'antd';
import { EditOutlined, DeleteOutlined, PlusOutlined, SearchOutlined, UserAddOutlined } from '@ant-design/icons';

const { Option } = Select;

const UserList = () => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [form] = Form.useForm();

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await axiosClient.get('/admin/users');
      setUsers(res);
      setFilteredUsers(res);
    } catch (error) {
      message.error('Không thể tải danh sách người dùng');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleSearch = (e) => {
    const value = e.target.value.toLowerCase();
    const filtered = users.filter(user =>
      user.username.toLowerCase().includes(value) ||
      user.email.toLowerCase().includes(value)
    );
    setFilteredUsers(filtered);
  };

  const showCreateModal = () => {
    setEditingUser(null);
    form.resetFields();
    setIsModalVisible(true);
  };

  const showEditModal = (user) => {
    setEditingUser(user);
    form.setFieldsValue({
      username: user.username,
      email: user.email,
      role: user.role
    });
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    form.resetFields();
  };

  const onFinish = async (values) => {
    try {
      if (editingUser) {
        await axiosClient.put(`/admin/users/${editingUser.id}`, {
          email: values.email,
          role: values.role
        });
        message.success('Cập nhật thành công');
      } else {
        await axiosClient.post('/admin/users', values);
        message.success('Tạo người dùng thành công');
      }
      setIsModalVisible(false);
      fetchUsers();
    } catch (error) {
      console.error(error);
      message.error(error.response?.data?.message || 'Có lỗi xảy ra!');
    }
  };

  const handleDelete = async (id) => {
    try {
      await axiosClient.delete(`/admin/users/${id}`);
      message.success('Đã xóa người dùng');
      const newList = users.filter(u => u.id !== id);
      setUsers(newList);
      setFilteredUsers(newList);
    } catch (error) {
      message.error('Xóa thất bại');
    }
  };

  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      width: 60,
    },
    {
      title: 'Username',
      dataIndex: 'username',
      key: 'username',
      render: (text) => <span className="font-semibold text-gray-700">{text}</span>,
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: 'Vai trò',
      dataIndex: 'role',
      key: 'role',
      render: (role) => {
        let color = 'geekblue';
        if (role === 'ADMIN') color = 'volcano';
        if (role === 'EDITOR') color = 'green';
        return <Tag color={color}>{role}</Tag>;
      },
    },
    {
      title: 'Hành động',
      key: 'action',
      render: (_, record) => (
        <Space size="middle">
          <Tooltip title="Sửa thông tin">
            <Button
              type="text"
              icon={<EditOutlined />}
              className="text-blue-600 hover:bg-blue-50"
              onClick={() => showEditModal(record)}
            />
          </Tooltip>
          <Popconfirm
            title="Xóa người dùng?"
            description="Hành động này không thể hoàn tác."
            onConfirm={() => handleDelete(record.id)}
            okText="Xóa"
            cancelText="Hủy"
            okButtonProps={{ danger: true }}
          >
            <Tooltip title="Xóa">
              <Button type="text" danger icon={<DeleteOutlined />} />
            </Tooltip>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-gray-800">Quản lý Người dùng</h2>
        <div className="flex gap-4">
          <Input
            placeholder="Tìm theo tên hoặc email..."
            prefix={<SearchOutlined className="text-gray-400" />}
            onChange={handleSearch}
            className="w-64"
          />
          <Button
            type="primary"
            icon={<UserAddOutlined />}
            onClick={showCreateModal}
            className="bg-blue-600 hover:bg-blue-700"
          >
            Thêm User
          </Button>
        </div>
      </div>

      <Table
        columns={columns}
        dataSource={filteredUsers}
        rowKey="id"
        loading={loading}
        pagination={{ pageSize: 8 }}
      />

      <Modal
        title={editingUser ? "Cập nhật người dùng" : "Thêm người dùng mới"}
        open={isModalVisible}
        onCancel={handleCancel}
        footer={null}
      >
        <Form form={form} layout="vertical" onFinish={onFinish}>

          <Form.Item
            name="username"
            label="Tên đăng nhập"
            rules={[{ required: true, message: 'Vui lòng nhập username!' }]}
          >
            <Input disabled={!!editingUser} placeholder="Ví dụ: nguyenvan" />
          </Form.Item>

          <Form.Item
            name="email"
            label="Email"
            rules={[
              { required: true, message: 'Vui lòng nhập email!' },
              { type: 'email', message: 'Email không hợp lệ!' }
            ]}
          >
            <Input placeholder="user@example.com" />
          </Form.Item>

          {!editingUser && (
            <Form.Item
              name="password"
              label="Mật khẩu"
              rules={[{ required: true, message: 'Vui lòng nhập mật khẩu!' }]}
            >
              <Input.Password placeholder="Nhập mật khẩu..." />
            </Form.Item>
          )}

          <Form.Item
            name="role"
            label="Vai trò"
            initialValue="USER"
            rules={[{ required: true, message: 'Vui lòng chọn vai trò!' }]}
          >
            <Select>
              <Option value="USER">USER (Người đọc)</Option>
              <Option value="EDITOR">EDITOR (Biên tập viên)</Option>
              <Option value="ADMIN">ADMIN (Quản trị)</Option>
            </Select>
          </Form.Item>

          <div className="flex justify-end gap-2 mt-6">
            <Button onClick={handleCancel}>Hủy</Button>
            <Button type="primary" htmlType="submit" className="bg-blue-600">
              {editingUser ? "Lưu thay đổi" : "Tạo người dùng"}
            </Button>
          </div>
        </Form>
      </Modal>
    </div>
  );
};

export default UserList;
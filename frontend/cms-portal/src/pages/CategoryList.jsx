import { useEffect, useState } from 'react';
import axiosClient from '../api/axiosClient';
import { Table, Button, Space, Modal, Form, Input, message, Tooltip, Popconfirm } from 'antd';
import { EditOutlined, DeleteOutlined, PlusOutlined } from '@ant-design/icons';

const CategoryList = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [form] = Form.useForm();

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const res = await axiosClient.get('/admin/categories');
      setCategories(res);
    } catch (error) {
      message.error('Lỗi tải danh mục');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const showCreateModal = () => {
    setEditingCategory(null);
    form.resetFields();
    setIsModalVisible(true);
  };

  const showEditModal = (category) => {
    setEditingCategory(category);
    form.setFieldsValue(category);
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    form.resetFields();
  };
  const onFinish = async (values) => {
    try {
      if (editingCategory) {
        await axiosClient.put(`/admin/categories/${editingCategory.id}`, values);
        message.success('Cập nhật danh mục thành công');
      } else {
        await axiosClient.post('/admin/categories', values);
        message.success('Tạo danh mục thành công');
      }
      setIsModalVisible(false);
      fetchCategories();
    } catch (error) {
      message.error('Có lỗi xảy ra!');
    }
  };

  const handleDelete = async (id) => {
    try {
      await axiosClient.delete(`/admin/categories/${id}`);
      message.success('Đã xóa danh mục');
      setCategories(categories.filter(c => c.id !== id));
    } catch (error) {
      message.error('Xóa thất bại (Có thể danh mục này đang chứa bài viết)');
    }
  };

  const columns = [
    { title: 'ID', dataIndex: 'id', key: 'id', width: 80 },
    { title: 'Tên danh mục', dataIndex: 'name', key: 'name', render: text => <span className="font-medium">{text}</span> },
    { title: 'Slug (URL)', dataIndex: 'slug', key: 'slug', render: text => <span className="text-gray-500">{text}</span> },
    {
      title: 'Hành động',
      key: 'action',
      width: 150,
      render: (_, record) => (
        <Space>
          <Tooltip title="Sửa">
            <Button type="text" icon={<EditOutlined className="text-blue-500" />} onClick={() => showEditModal(record)} />
          </Tooltip>
          <Popconfirm title="Bạn chắc chắn muốn xóa?" onConfirm={() => handleDelete(record.id)} okText="Xóa" cancelText="Hủy">
            <Tooltip title="Xóa">
              <Button type="text" icon={<DeleteOutlined className="text-red-500" />} />
            </Tooltip>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-gray-800">Quản lý Danh mục</h2>
        <Button type="primary" icon={<PlusOutlined />} onClick={showCreateModal}>
          Thêm danh mục
        </Button>
      </div>

      <Table
        columns={columns}
        dataSource={categories}
        rowKey="id"
        loading={loading}
        pagination={{ pageSize: 5 }}
      />

      <Modal
        title={editingCategory ? "Chỉnh sửa danh mục" : "Thêm danh mục mới"}
        open={isModalVisible}
        onCancel={handleCancel}
        footer={null}
      >
        <Form form={form} layout="vertical" onFinish={onFinish}>
          <Form.Item
            name="name"
            label="Tên danh mục"
            rules={[{ required: true, message: 'Vui lòng nhập tên danh mục!' }]}
          >
            <Input placeholder="Ví dụ: Công nghệ, Thể thao..." />
          </Form.Item>

          <div className="flex justify-end gap-2 mt-4">
            <Button onClick={handleCancel}>Hủy</Button>
            <Button type="primary" htmlType="submit">
              {editingCategory ? "Cập nhật" : "Tạo mới"}
            </Button>
          </div>
        </Form>
      </Modal>
    </div>
  );
};

export default CategoryList;
import { useEffect, useState } from 'react';
import axiosClient from '../api/axiosClient';
import { Table, Button, Space, Tag, Modal, message, Tooltip, Image, Input, Descriptions, Divider } from 'antd';
import { EditOutlined, DeleteOutlined, ExclamationCircleOutlined, PlusOutlined, SearchOutlined, EyeOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { format } from 'date-fns';

const { confirm } = Modal;

const ArticleList = () => {
  const [articles, setArticles] = useState([]);
  const [filteredArticles, setFilteredArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const [isViewModalVisible, setIsViewModalVisible] = useState(false);
  const [viewArticle, setViewArticle] = useState(null);

  useEffect(() => {
    const fetchArticles = async () => {
      setLoading(true);
      try {
        const res = await axiosClient.get('/admin/articles');
        setArticles(res);
        setFilteredArticles(res);
      } catch (error) {
        message.error('Không thể tải danh sách bài viết');
      } finally {
        setLoading(false);
      }
    };
    fetchArticles();
  }, []);

  const handleSearch = (e) => {
    const value = e.target.value.toLowerCase();
    const filtered = articles.filter(article =>
      article.title.toLowerCase().includes(value) ||
      article.authorName.toLowerCase().includes(value)
    );
    setFilteredArticles(filtered);
  };

  const handleDelete = (id) => {
    confirm({
      title: 'Bạn có chắc chắn muốn xóa bài viết này?',
      icon: <ExclamationCircleOutlined />,
      content: 'Hành động này không thể hoàn tác.',
      okText: 'Xóa',
      okType: 'danger',
      cancelText: 'Hủy',
      onOk: async () => {
        try {
          await axiosClient.delete(`/admin/articles/${id}`);
          message.success('Đã xóa bài viết thành công');
          const newList = articles.filter(a => a.id !== id);
          setArticles(newList);
          setFilteredArticles(newList);
        } catch (error) {
          message.error('Xóa thất bại');
        }
      },
    });
  };

  // --- Hàm xử lý khi bấm nút Xem ---
  const handleView = (article) => {
    setViewArticle(article);
    setIsViewModalVisible(true);
  };

  const columns = [
    {
      title: 'Thumbnail',
      dataIndex: 'thumbnail',
      key: 'thumbnail',
      width: 100,
      render: (src) => (
        <Image
          width={80}
          height={50}
          src={src || "https://via.placeholder.com/150"}
          className="rounded object-cover border"
          fallback="https://via.placeholder.com/150?text=No+Image"
          preview={false}
        />
      ),
    },
    {
      title: 'Tiêu đề',
      dataIndex: 'title',
      key: 'title',
      render: (text) => <span className="font-medium text-gray-800 line-clamp-1" title={text}>{text}</span>,
    },
    {
      title: 'Danh mục',
      dataIndex: 'categoryName',
      key: 'categoryName',
      render: (text) => <Tag color="cyan">{text || 'Chưa phân loại'}</Tag>,
    },
    {
      title: 'Tác giả',
      dataIndex: 'authorName',
      key: 'authorName',
      render: (text) => <Tag color="blue">{text}</Tag>,
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      width: 100,
      render: (status) => {
        const color = status === 'PUBLISHED' ? 'success' : 'default';
        return <Tag color={color}>{status}</Tag>;
      },
    },
    {
      title: 'Ngày tạo',
      dataIndex: 'createdAt',
      key: 'createdAt',
      width: 120,
      render: (date) => <span className="text-gray-500">{date ? format(new Date(date), 'dd/MM/yyyy') : 'N/A'}</span>,
    },
    {
      title: 'Hành động',
      key: 'action',
      width: 150,
      render: (_, record) => (
        <Space size="small">
          <Tooltip title="Xem chi tiết">
            <Button
              type="text"
              icon={<EyeOutlined />}
              className="text-gray-500 hover:text-blue-600 hover:bg-blue-50"
              onClick={() => handleView(record)}
            />
          </Tooltip>
          <Tooltip title="Chỉnh sửa">
            <Button
              type="text"
              icon={<EditOutlined />}
              className="text-blue-600 hover:bg-blue-50"
              onClick={() => navigate(`/admin/articles/edit/${record.id}`)}
            />
          </Tooltip>
          <Tooltip title="Xóa">
            <Button
              type="text"
              danger
              icon={<DeleteOutlined />}
              onClick={() => handleDelete(record.id)}
            />
          </Tooltip>
        </Space>
      ),
    },
  ];

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-gray-800">Quản lý bài viết</h2>

        <div className="flex gap-4">
          <Input
            placeholder="Tìm kiếm bài viết..."
            prefix={<SearchOutlined className="text-gray-400" />}
            onChange={handleSearch}
            className="w-64"
          />

          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => navigate('/admin/articles/create')}
            className="bg-blue-600 hover:bg-blue-700"
          >
            Viết bài mới
          </Button>
        </div>
      </div>

      <Table
        columns={columns}
        dataSource={filteredArticles}
        rowKey="id"
        loading={loading}
        pagination={{ pageSize: 5 }}
      />

      <Modal
        title="Chi tiết bài viết"
        open={isViewModalVisible}
        onCancel={() => setIsViewModalVisible(false)}
        footer={[
          <Button key="close" onClick={() => setIsViewModalVisible(false)}>
            Đóng
          </Button>,
          <Button
            key="edit"
            type="primary"
            onClick={() => {
              setIsViewModalVisible(false);
              navigate(`/admin/articles/edit/${viewArticle?.id}`);
            }}
          >
            Chỉnh sửa bài này
          </Button>
        ]}
        width={800}
        style={{ top: 20 }}
      >
        {viewArticle && (
          <div className="flex flex-col gap-4">
            <div className="w-full h-64 bg-gray-100 rounded-lg overflow-hidden border border-gray-200">
              <img
                src={viewArticle.thumbnail}
                alt="thumbnail"
                className="w-full h-full object-cover"
              />
            </div>

            <h1 className="text-2xl font-bold text-gray-800">{viewArticle.title}</h1>

            <Descriptions bordered column={2} size="small">
              <Descriptions.Item label="Danh mục">{viewArticle.categoryName}</Descriptions.Item>
              <Descriptions.Item label="Tác giả">{viewArticle.authorName}</Descriptions.Item>
              <Descriptions.Item label="Slug">{viewArticle.slug}</Descriptions.Item>
              <Descriptions.Item label="Ngày tạo">
                {viewArticle.createdAt && format(new Date(viewArticle.createdAt), 'HH:mm dd/MM/yyyy')}
              </Descriptions.Item>
              <Descriptions.Item label="Trạng thái">
                <Tag color={viewArticle.status === 'PUBLISHED' ? 'success' : 'default'}>
                  {viewArticle.status}
                </Tag>
              </Descriptions.Item>
            </Descriptions>

            <Divider orientation="left">Nội dung bài viết</Divider>
            <div
              className="prose max-w-none p-4 bg-gray-50 rounded-lg border border-gray-100"
              dangerouslySetInnerHTML={{ __html: viewArticle.content }}
            />
          </div>
        )}
      </Modal>
    </div>
  );
};

export default ArticleList;
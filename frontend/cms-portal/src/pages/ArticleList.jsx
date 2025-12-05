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
  const [viewLoading, setViewLoading] = useState(false);

  useEffect(() => {
    fetchArticles();
  }, []);

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
          fetchArticles();
        } catch (error) {
          message.error('Xóa thất bại');
        }
      },
    });
  };

  const handleView = async (id) => {
    setIsViewModalVisible(true);
    setViewLoading(true);
    try {
      const detail = await axiosClient.get(`/admin/articles/${id}`);
      setViewArticle(detail);
    } catch (error) {
      message.error("Không thể tải chi tiết bài viết");
      setIsViewModalVisible(false);
    } finally {
      setViewLoading(false);
    }
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
      render: (text) => <span className="font-medium text-gray-800 line-clamp-2" title={text}>{text}</span>,
    },
    {
      title: 'Danh mục',
      dataIndex: 'categoryName',
      key: 'categoryName',
      width: 150,
      render: (text) => <Tag color="cyan">{text || 'Chưa phân loại'}</Tag>,
    },
    {
      title: 'Tác giả',
      dataIndex: 'authorName',
      key: 'authorName',
      width: 120,
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
      title: 'Lượt xem',
      dataIndex: 'views',
      key: 'views',
      render: (views) => <Tag color="purple">{views || 0}</Tag>,
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
              onClick={() => handleView(record.id)}
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
        pagination={{ pageSize: 8 }}
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
        width={900}
        style={{ top: 20 }}
        loading={viewLoading}
      >
        {viewArticle && (
          <div className="flex flex-col gap-6 font-sans text-gray-800">
            <div className="relative w-full h-80 rounded-xl overflow-hidden shadow-sm bg-gray-100">
              <img src={viewArticle.thumbnail || "https://via.placeholder.com/800x400?text=No+Image"} alt="Cover" className="w-full h-full object-cover" />
              <div className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-black/80 to-transparent p-6 pt-20 text-white">
                <Tag color="cyan" className="mb-2">{viewArticle.categoryName}</Tag>
                <h1 className="text-3xl font-bold leading-tight">{viewArticle.title}</h1>
              </div>
            </div>

            <div className="flex items-center gap-4 text-sm text-gray-500 border-b pb-4">
              <span>Tác giả: <span className="font-semibold text-blue-600">{viewArticle.authorName}</span></span>
              <span>•</span>
              <span>{viewArticle.createdAt && format(new Date(viewArticle.createdAt), 'HH:mm dd/MM/yyyy')}</span>
              <span>•</span>
              <Tag color={viewArticle.status === 'PUBLISHED' ? 'success' : 'default'}>{viewArticle.status}</Tag>
            </div>

            {viewArticle.shortDescription && (
              <div className="text-lg font-semibold text-gray-700 italic border-l-4 border-blue-500 pl-4 bg-gray-50 p-4 rounded-r">
                {viewArticle.shortDescription}
              </div>
            )}

            <div className="prose max-w-none text-gray-800 leading-relaxed whitespace-pre-wrap text-base">
              {viewArticle.content}
            </div>

            <Divider>Nội dung chi tiết ({viewArticle.pages?.length || 0} trang)</Divider>

            <div className="space-y-12">
              {viewArticle.pages && viewArticle.pages.length > 0 ? (
                viewArticle.pages.map((page, index) => (
                  <div key={page.id || index} className="bg-white">
                    <div className="flex flex-col md:flex-row gap-6">
                      {page.imageUrl && (
                        <div className="md:w-1/2">
                          <img
                            src={page.imageUrl}
                            alt={`Page ${page.pageNumber}`}
                            className="w-full rounded-lg shadow-sm object-cover"
                          />
                          <p className="text-center text-xs text-gray-400 mt-2 italic">Hình minh họa trang {page.pageNumber}</p>
                        </div>
                      )}
                      <div className={`prose text-gray-800 leading-relaxed ${page.imageUrl ? 'md:w-1/2' : 'w-full'}`}>
                        <h3 className="text-xl font-bold text-gray-400 mb-2 flex items-center gap-2">
                          <span className="bg-gray-200 text-gray-600 px-2 py-1 rounded text-sm">#{page.pageNumber}</span>
                        </h3>
                        <div className="whitespace-pre-wrap text-base">{page.content}</div>
                      </div>
                    </div>
                    {index < viewArticle.pages.length - 1 && <Divider dashed />}
                  </div>
                ))
              ) : (
                <p className="text-center text-gray-400 italic">Bài viết này chưa có nội dung chi tiết (Pages).</p>
              )}
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default ArticleList;
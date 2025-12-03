import { useState, useEffect } from 'react';
import axiosClient from '../api/axiosClient';
import ImageUploader from '../components/ImageUploader';
import { Form, Input, Button, Card, message, Select, Skeleton, Space, Divider, Modal, Tag, Descriptions } from 'antd';
import { SendOutlined, LoadingOutlined, SaveOutlined, PlusOutlined, DeleteOutlined, EyeOutlined } from '@ant-design/icons';
import { useNavigate, useParams } from 'react-router-dom';
import { format } from 'date-fns';

const { TextArea } = Input;
const { Option } = Select;

const CreateArticle = () => {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditMode = !!id;

  const [loading, setLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(false);
  const [categories, setCategories] = useState([]);

  const [isPreviewVisible, setIsPreviewVisible] = useState(false);
  const [previewData, setPreviewData] = useState(null);

  useEffect(() => {
    const initData = async () => {
      setPageLoading(true);
      try {
        const catRes = await axiosClient.get('/admin/categories');

        let cats = [];
        if (Array.isArray(catRes)) {
          cats = catRes;
        } else if (catRes && Array.isArray(catRes.data)) {
          cats = catRes.data;
        }
        setCategories(cats);

        if (isEditMode) {
          const article = await axiosClient.get(`/admin/articles/${id}`);
          form.setFieldsValue({
            title: article.title,
            shortDescription: article.shortDescription,
            content: article.content,
            thumbnail: article.thumbnail,
            categoryId: article.categoryId,
            pages: article.pages || []
          });
        }
      } catch (error) {
        console.error(error);
        message.error("Lỗi tải dữ liệu");
        setCategories([]);
      } finally {
        setPageLoading(false);
      }
    };
    initData();
  }, [id, isEditMode, form]);

  const onFinish = async (values) => {
    if (!values.thumbnail) {
      message.error("Vui lòng upload ảnh bìa!");
      return;
    }

    setLoading(true);

    const payload = {
      ...values,
      pages: values.pages?.map((p, index) => ({
        ...p,
        pageNumber: index + 1
      })) || []
    };

    try {
      if (isEditMode) {
        await axiosClient.put(`/admin/articles/${id}`, payload);
        message.success('Cập nhật bài viết thành công!');
        navigate('/admin/articles');
      } else {
        await axiosClient.post('/admin/articles', payload);
        message.success('Đăng bài thành công!');
        form.resetFields();
      }
    } catch (error) {
      console.error(error);
      message.error('Lỗi server, vui lòng thử lại.');
    } finally {
      setLoading(false);
    }
  };

  const handlePreview = () => {
    const values = form.getFieldsValue();

    if (!values.title) {
      message.warning("Vui lòng nhập ít nhất tiêu đề để xem trước");
      return;
    }

    const categoryName = categories.find(c => c.id === values.categoryId)?.name || "Chưa chọn";

    setPreviewData({
      ...values,
      categoryName,
      createdAt: new Date().toISOString(),
      authorName: "Admin (Bạn)",
      status: "DRAFT (PREVIEW)"
    });
    setIsPreviewVisible(true);
  };

  if (pageLoading) return <Skeleton active className="p-8" />;

  return (
    <div className="max-w-5xl mx-auto pb-10">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold text-gray-800">
          {isEditMode ? "Chỉnh sửa bài viết" : "Viết bài mới"}
        </h1>
        <Space>
          <Button icon={<EyeOutlined />} onClick={handlePreview} size="large">
            Xem trước
          </Button>
          <Button onClick={() => navigate('/admin/articles')} size="large">
            Hủy
          </Button>
        </Space>
      </div>

      <Form form={form} layout="vertical" onFinish={onFinish} size="large" initialValues={{ pages: [] }}>
        <Card title="Thông tin chung" className="shadow-sm rounded-xl mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2">
              <Form.Item
                label="Tiêu đề bài viết"
                name="title"
                rules={[{ required: true, message: 'Vui lòng nhập tiêu đề!' }]}
              >
                <Input placeholder="Nhập tiêu đề hấp dẫn..." className="font-semibold text-lg" />
              </Form.Item>

              <Form.Item
                label="Mô tả ngắn (Sapo)"
                name="shortDescription"
                rules={[{ required: true, message: 'Vui lòng nhập mô tả ngắn!' }]}
              >
                <TextArea rows={3} placeholder="Tóm tắt nội dung để hiển thị bên ngoài..." showCount maxLength={300} />
              </Form.Item>

              <Form.Item
                label="Lời dẫn nhập (Intro)"
                name="content"
                rules={[{ required: true, message: 'Vui lòng nhập lời dẫn!' }]}
              >
                <TextArea rows={6} placeholder="Đoạn mở đầu bài viết..." />
              </Form.Item>
            </div>

            <div className="md:col-span-1 space-y-4">
              <Form.Item
                label="Danh mục"
                name="categoryId"
                rules={[{ required: true, message: 'Vui lòng chọn danh mục!' }]}
              >
                <Select placeholder="Chọn chủ đề">
                  {Array.isArray(categories) && categories.map(cat => (
                    <Option key={cat.id} value={cat.id}>{cat.name}</Option>
                  ))}
                </Select>
              </Form.Item>
              <div className="p-4 bg-gray-50 border border-dashed rounded-lg text-center">
                <Form.Item
                  label="Ảnh đại diện (Thumbnail)"
                  name="thumbnail"
                  rules={[{ required: true, message: 'Thiếu ảnh bìa!' }]}
                  className="mb-0"
                >
                  <ImageUploader />
                </Form.Item>
              </div>
            </div>
          </div>
        </Card>
        <Card title="Nội dung chi tiết (Các trang)" className="shadow-sm rounded-xl border-t-4 border-t-blue-500">
          <Form.List name="pages">
            {(fields, { add, remove }) => (
              <div className="space-y-6">
                {fields.map(({ key, name, ...restField }, index) => (
                  <Card
                    key={key}
                    size="small"
                    title={`Trang ${index + 1}`}
                    className="bg-gray-50 border-gray-200"
                    extra={
                      <Button type="text" danger icon={<DeleteOutlined />} onClick={() => remove(name)}>
                        Xóa trang này
                      </Button>
                    }
                  >
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <Form.Item
                        {...restField}
                        name={[name, 'content']}
                        label="Nội dung trang"
                        rules={[{ required: true, message: 'Nhập nội dung trang!' }]}
                      >
                        <TextArea rows={6} placeholder={`Nội dung của trang ${index + 1}...`} />
                      </Form.Item>
                      <div className="bg-white p-2 border rounded text-center">
                        <Form.Item
                          {...restField}
                          name={[name, 'imageUrl']}
                          label="Ảnh minh họa trang"
                          className="mb-0"
                        >
                          <ImageUploader />
                        </Form.Item>
                      </div>
                    </div>
                  </Card>
                ))}

                <Button type="dashed" onClick={() => add()} block icon={<PlusOutlined />} size="large">
                  Thêm trang nội dung mới
                </Button>
              </div>
            )}
          </Form.List>
        </Card>

        <div className="mt-8 flex justify-end gap-4 sticky bottom-0 bg-white p-4 border-t shadow-lg z-10">
          <Button size="large" onClick={() => navigate('/admin/articles')}>Hủy bỏ</Button>
          <Button
            type="primary"
            htmlType="submit"
            icon={loading ? <LoadingOutlined /> : <SaveOutlined />}
            loading={loading}
            size="large"
            className="bg-green-600 border-none px-8"
          >
            {isEditMode ? "Lưu thay đổi" : "Xuất bản ngay"}
          </Button>
        </div>
      </Form>

      <Modal
        title="Xem trước bài viết"
        open={isPreviewVisible}
        onCancel={() => setIsPreviewVisible(false)}
        footer={[
          <Button key="back" onClick={() => setIsPreviewVisible(false)}>Đóng</Button>,
          <Button key="submit" type="primary" onClick={form.submit} className="bg-green-600">
            Xuất bản luôn
          </Button>
        ]}
        width={900}
        style={{ top: 20 }}
      >
        {previewData && (
          <div className="flex flex-col gap-6 font-sans text-gray-800">
            <div className="relative w-full h-80 rounded-xl overflow-hidden shadow-sm bg-gray-100">
              <img src={previewData.thumbnail || "https://via.placeholder.com/800x400?text=No+Image"} alt="Cover" className="w-full h-full object-cover" />
              <div className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-black/80 to-transparent p-6 pt-20 text-white">
                <Tag color="cyan" className="mb-2">{previewData.categoryName}</Tag>
                <h1 className="text-3xl font-bold leading-tight">{previewData.title}</h1>
              </div>
            </div>

            <div className="flex items-center gap-4 text-sm text-gray-500 border-b pb-4">
              <span>Tác giả: <span className="font-semibold text-blue-600">{previewData.authorName}</span></span>
              <span>•</span>
              <span>{format(new Date(), 'dd/MM/yyyy')} (Preview)</span>
            </div>

            <div className="text-lg font-semibold text-gray-700 italic border-l-4 border-blue-500 pl-4 bg-gray-50 p-4 rounded-r">
              {previewData.shortDescription}
            </div>

            <div className="prose max-w-none text-gray-800 leading-relaxed whitespace-pre-wrap">
              {previewData.content}
            </div>

            <Divider>Nội dung chi tiết</Divider>

            <div className="space-y-12">
              {previewData.pages && previewData.pages.map((page, index) => (
                <div key={index} className="bg-white">
                  <div className="flex flex-col md:flex-row gap-6">
                    {page.imageUrl && (
                      <div className="md:w-1/2">
                        <img src={page.imageUrl} alt={`Page ${index + 1}`} className="w-full rounded-lg shadow-sm" />
                      </div>
                    )}
                    <div className={`prose text-gray-800 leading-relaxed ${page.imageUrl ? 'md:w-1/2' : 'w-full'}`}>
                      <h3 className="text-xl font-bold text-gray-400 mb-2">Trang {index + 1}</h3>
                      <div className="whitespace-pre-wrap">{page.content}</div>
                    </div>
                  </div>
                  {index < previewData.pages.length - 1 && <Divider dashed />}
                </div>
              ))}
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default CreateArticle;
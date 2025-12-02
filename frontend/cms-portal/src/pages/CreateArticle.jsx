import { useState, useEffect } from 'react';
import axiosClient from '../api/axiosClient';
import ImageUploader from '../components/ImageUploader';
import { Form, Input, Button, Card, message, Select, Skeleton } from 'antd';
import { SendOutlined, LoadingOutlined, SaveOutlined } from '@ant-design/icons';
import { useNavigate, useParams } from 'react-router-dom';

const { TextArea } = Input;
const { Option } = Select;

const CreateArticle = () => {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditMode = !!id;

  const [loading, setLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(false);
  const [thumbnailUrl, setThumbnailUrl] = useState('');
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const initData = async () => {
      setPageLoading(true);
      try {
        const catRes = await axiosClient.get('/admin/categories');
        setCategories(catRes);

        if (isEditMode) {
          const article = await axiosClient.get(`/admin/articles/${id}`);
          form.setFieldsValue({
            title: article.title,
            content: article.content,
            categoryId: article.categoryId,
          });
          setThumbnailUrl(article.thumbnail);
        }
      } catch (error) {
        message.error("Lỗi tải dữ liệu");
      } finally {
        setPageLoading(false);
      }
    };
    initData();
  }, [id, isEditMode, form]);

  const onFinish = async (values) => {
    if (!thumbnailUrl) {
      message.error('Vui lòng upload ảnh bìa!');
      return;
    }

    setLoading(true);
    const payload = {
      title: values.title,
      content: values.content,
      thumbnail: thumbnailUrl,
      categoryId: values.categoryId,
      authorId: 1,
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
        setThumbnailUrl('');
      }
    } catch (error) {
      message.error('Lỗi server, vui lòng thử lại.');
    } finally {
      setLoading(false);
    }
  };

  if (pageLoading) return <Skeleton active className="p-8" />;

  return (
    <div className="max-w-4xl mx-auto">
      <Card
        title={isEditMode ? "Chỉnh sửa bài viết" : "Viết bài mới"}
        className="shadow-sm rounded-xl"
        extra={isEditMode && <Button onClick={() => navigate('/admin/articles')}>Quay lại</Button>}
      >
        <Form form={form} layout="vertical" onFinish={onFinish} size="large">

          <Form.Item
            label="Tiêu đề bài viết"
            name="title"
            rules={[{ required: true, message: 'Vui lòng nhập tiêu đề!' }]}
          >
            <Input placeholder="Nhập tiêu đề hấp dẫn..." />
          </Form.Item>

          <Form.Item
            label="Danh mục"
            name="categoryId"
            rules={[{ required: true, message: 'Vui lòng chọn danh mục!' }]}
          >
            <Select placeholder="Chọn chủ đề bài viết">
              {categories.map(cat => (
                <Option key={cat.id} value={cat.id}>{cat.name}</Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            label="Nội dung (HTML/Text)"
            name="content"
            rules={[{ required: true, message: 'Vui lòng nhập nội dung!' }]}
          >
            <TextArea rows={10} placeholder="Nhập nội dung bài viết..." showCount />
          </Form.Item>

          <Form.Item label="Ảnh bìa (Thumbnail)" required>
            <div className="p-4 bg-gray-50 border border-dashed rounded-lg text-center">
              <ImageUploader
                initialImage={thumbnailUrl}
                onUploadSuccess={(url) => setThumbnailUrl(url)}
              />
            </div>
          </Form.Item>

          <Form.Item className="mt-8 text-right">
            <Button
              type="primary"
              htmlType="submit"
              icon={loading ? <LoadingOutlined /> : (isEditMode ? <SaveOutlined /> : <SendOutlined />)}
              loading={loading}
              className="bg-green-600 border-none px-8"
            >
              {isEditMode ? "Lưu thay đổi" : "Xuất bản ngay"}
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default CreateArticle;
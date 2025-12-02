import { useState } from 'react';
import { Upload, Button, message, Image } from 'antd';
import { UploadOutlined, DeleteOutlined } from '@ant-design/icons';

const ImageUploader = ({ onUploadSuccess, initialImage }) => {
  const [loading, setLoading] = useState(false);
  const [imageUrl, setImageUrl] = useState(initialImage || null);

  const CLOUD_NAME = "druw5dwjr";
  const UPLOAD_PRESET = "news_preset";

  const customRequest = async ({ file, onSuccess, onError }) => {
    setLoading(true);
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", UPLOAD_PRESET);

    try {
      const res = await fetch(
        `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
        { method: "POST", body: formData }
      );
      const data = await res.json();
      const url = data.secure_url;

      setImageUrl(url);
      onUploadSuccess(url);
      onSuccess("Ok");
      message.success("Upload ảnh thành công!");
    } catch (error) {
      console.error(error);
      onError({ error });
      message.error("Upload thất bại!");
    } finally {
      setLoading(false);
    }
  };

  const handleRemove = () => {
    setImageUrl(null);
    onUploadSuccess(null);
  };

  return (
    <div className="text-center">
      {imageUrl ? (
        <div className="relative group inline-block">
          <Image
            src={imageUrl}
            alt="Thumbnail"
            width={200}
            className="rounded-lg shadow-md"
          />
          <div className="absolute top-2 right-2">
            <Button
              type="primary"
              danger
              shape="circle"
              icon={<DeleteOutlined />}
              onClick={handleRemove}
            />
          </div>
        </div>
      ) : (
        <Upload
          customRequest={customRequest}
          showUploadList={false}
          accept="image/*"
        >
          <Button icon={<UploadOutlined />} loading={loading} size="large">
            Chọn ảnh bìa
          </Button>
        </Upload>
      )}
    </div>
  );
};

export default ImageUploader;
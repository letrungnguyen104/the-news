import { useState, useEffect } from 'react';
import { Upload, Button, message, Image } from 'antd';
import { UploadOutlined, DeleteOutlined } from '@ant-design/icons';
const ImageUploader = ({ value, onChange }) => {
  const [loading, setLoading] = useState(false);
  const [imageUrl, setImageUrl] = useState(value);
  useEffect(() => {
    setImageUrl(value);
  }, [value]);

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
      if (onChange) onChange(url);

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
    if (onChange) onChange(null);
  };

  return (
    <div className="text-center">
      {imageUrl ? (
        <div className="relative group inline-block">
          <Image
            src={imageUrl}
            alt="Thumbnail"
            height={150}
            className="rounded-lg shadow-md object-cover"
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
        <Upload customRequest={customRequest} showUploadList={false} fileList={[]} accept="image/*">
          <Button icon={<UploadOutlined />} loading={loading}>
            Tải ảnh lên
          </Button>
        </Upload>
      )}
    </div>
  );
};

export default ImageUploader;
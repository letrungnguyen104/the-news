import { Row, Col, Card, Statistic } from 'antd';
import { FileTextOutlined, UserOutlined, EyeOutlined, ArrowUpOutlined } from '@ant-design/icons';

const DashboardHome = () => {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Tổng quan hệ thống</h2>

      <Row gutter={[16, 16]}>
        <Col xs={24} sm={8}>
          <Card hoverable className="rounded-xl shadow-sm border-l-4 border-blue-500">
            <Statistic
              title="Tổng bài viết"
              value={12}
              prefix={<FileTextOutlined className="text-blue-500 mr-2" />}
              valueStyle={{ color: '#3f8600' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={8}>
          <Card hoverable className="rounded-xl shadow-sm border-l-4 border-green-500">
            <Statistic
              title="Người dùng"
              value={5}
              prefix={<UserOutlined className="text-green-500 mr-2" />}
              valueStyle={{ color: '#3f8600' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={8}>
          <Card hoverable className="rounded-xl shadow-sm border-l-4 border-purple-500">
            <Statistic
              title="Lượt xem"
              value={1200}
              prefix={<EyeOutlined className="text-purple-500 mr-2" />}
              suffix={<span className="text-xs text-gray-400 flex items-center ml-2"><ArrowUpOutlined className="text-green-500" /> +5%</span>}
            />
          </Card>
        </Col>
      </Row>

      <Card className="rounded-xl shadow-sm mt-6 text-center py-10 bg-gradient-to-r from-blue-50 to-indigo-50 border-none">
        <h3 className="text-xl font-semibold text-gray-700">Chào mừng trở lại, Admin!</h3>
        <p className="text-gray-500 mt-2">Hệ thống The News hoạt động ổn định. Hãy bắt đầu quản lý nội dung.</p>
      </Card>
    </div>
  );
};

export default DashboardHome;
import { useEffect, useState } from 'react';
import axiosClient from '../api/axiosClient';
import { Card, Tag, Skeleton } from 'antd';
import { Link } from 'react-router-dom';
import { Clock } from 'lucide-react';
import { format } from 'date-fns';

const HomePage = () => {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const res = await axiosClient.get('/articles');
        setArticles(res);
      } catch (error) {
        console.error("Error fetching home data", error);
      } finally {
        setLoading(false);
      }
    };
    fetchArticles();
  }, []);

  if (loading) return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {[1, 2, 3, 4, 5, 6].map(i => <Skeleton key={i} active avatar paragraph={{ rows: 4 }} />)}
    </div>
  );

  return (
    <div>
      {articles.length > 0 && (
        <section className="mb-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
            <Link to={`/article/${articles[0].slug}`} className="group">
              <div className="overflow-hidden rounded-2xl shadow-sm">
                <img
                  src={articles[0].thumbnail}
                  alt={articles[0].title}
                  className="w-full h-64 md:h-80 object-cover transition-transform duration-300 group-hover:scale-105"
                />
              </div>
              <div className="mt-4">
                <Tag color="red">Mới nhất</Tag>
                <Tag color="blue">{articles[0].categoryName}</Tag>
                <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mt-2 group-hover:text-blue-700 transition-colors">
                  {articles[0].title}
                </h2>
                <p className="text-gray-500 mt-2 line-clamp-2">{articles[0].shortDescription}</p>
              </div>
            </Link>

            <div className="space-y-6">
              {articles.slice(1, 4).map(article => (
                <Link key={article.id} to={`/article/${article.slug}`} className="flex gap-4 group">
                  <img
                    src={article.thumbnail}
                    className="w-32 h-24 object-cover rounded-lg flex-shrink-0"
                    alt="thumb"
                  />
                  <div>
                    <Tag className="mb-1">{article.categoryName}</Tag>
                    <h3 className="font-bold text-gray-800 group-hover:text-blue-600 line-clamp-2">
                      {article.title}
                    </h3>
                    <div className="flex items-center gap-1 text-xs text-gray-400 mt-2">
                      <Clock size={12} />
                      {format(new Date(article.createdAt), 'dd/MM/yyyy')}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      <h3 className="text-xl font-bold border-l-4 border-blue-600 pl-3 mb-6">Tin tức mới cập nhật</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {articles.slice(4).map((article) => (
          <Link key={article.id} to={`/article/${article.slug}`} className="group">
            <Card
              hoverable
              cover={
                <div className="overflow-hidden h-48">
                  <img
                    alt={article.title}
                    src={article.thumbnail}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                </div>
              }
              className="h-full border-gray-100 shadow-sm rounded-xl"
            >
              <div className="flex justify-between items-center mb-2">
                <Tag color="cyan" className="m-0 text-xs">{article.categoryName}</Tag>
                <span className="text-xs text-gray-400">{format(new Date(article.createdAt), 'dd/MM')}</span>
              </div>
              <Card.Meta
                title={<span className="text-base font-bold text-gray-800 group-hover:text-blue-600 line-clamp-2">{article.title}</span>}
                description={<span className="line-clamp-2 text-gray-500 text-xs">{article.shortDescription}</span>}
              />
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default HomePage;
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axiosClient from '../api/axiosClient';
import { Card, Tag, Skeleton, Empty } from 'antd';
import { Link } from 'react-router-dom';
import { format } from 'date-fns';

const CategoryPage = () => {
  const { slug } = useParams();
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchArticles = async () => {
      setLoading(true);
      try {
        const res = await axiosClient.get(`/articles/category/${slug}`);
        setArticles(res);
      } catch (error) {
        console.error("Error fetching category data", error);
      } finally {
        setLoading(false);
      }
    };
    fetchArticles();
  }, [slug]);

  if (loading) return <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">{[1, 2, 3].map(i => <Skeleton key={i} active />)}</div>;

  if (articles.length === 0) return <div className="mt-10"><Empty description="Chưa có bài viết nào trong mục này" /></div>;

  const categoryName = articles[0]?.categoryName || slug.toUpperCase();

  return (
    <div className="mt-4">
      <h1 className="text-3xl font-bold text-gray-800 mb-8 border-b pb-4 flex items-center gap-3">
        <span className="bg-blue-600 w-2 h-8 rounded-full block"></span>
        {categoryName}
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {articles.map((article) => (
          <Link key={article.id} to={`/article/${article.slug}`} className="group">
            <Card
              hoverable
              cover={
                <div className="overflow-hidden h-48 rounded-t-xl">
                  <img
                    alt={article.title}
                    src={article.thumbnail}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                </div>
              }
              className="h-full border-gray-100 shadow-sm rounded-xl hover:shadow-md transition-shadow"
            >
              <div className="flex justify-between items-center mb-2">
                <Tag color="cyan" className="m-0 text-xs">{article.categoryName}</Tag>
                <span className="text-xs text-gray-400">{format(new Date(article.createdAt), 'dd/MM')}</span>
              </div>
              <h3 className="text-base font-bold text-gray-800 group-hover:text-blue-600 line-clamp-2 mb-2 leading-snug">
                {article.title}
              </h3>
              <p className="text-xs text-gray-500 line-clamp-3">{article.shortDescription}</p>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default CategoryPage;
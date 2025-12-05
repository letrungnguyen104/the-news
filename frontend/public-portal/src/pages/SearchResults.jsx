import { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import axiosClient from '../api/axiosClient';
import { Card, Tag, Skeleton, Empty } from 'antd';
import { format } from 'date-fns';

const SearchResults = () => {
  const [searchParams] = useSearchParams();
  const keyword = searchParams.get('q');
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!keyword) return;

    const fetchSearch = async () => {
      setLoading(true);
      try {
        const res = await axiosClient.get(`/articles/search?q=${keyword}`);
        setArticles(res);
      } catch (error) {
        console.error("Search error", error);
      } finally {
        setLoading(false);
      }
    };
    fetchSearch();
  }, [keyword]);

  return (
    <div className="max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold mb-6 border-b pb-4">
        Kết quả tìm kiếm cho: <span className="text-blue-600">"{keyword}"</span>
      </h1>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1, 2, 3, 4].map(i => <Skeleton key={i} active />)}
        </div>
      ) : articles.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {articles.map(article => (
            <Link key={article.id} to={`/article/${article.slug}`} className="group">
              <Card hoverable cover={<img src={article.thumbnail} className="h-40 object-cover" />} className="h-full">
                <div className="mb-2"><Tag color="cyan">{article.categoryName}</Tag></div>
                <Card.Meta
                  title={<span className="text-base font-bold line-clamp-2">{article.title}</span>}
                  description={format(new Date(article.createdAt), 'dd/MM/yyyy')}
                />
              </Card>
            </Link>
          ))}
        </div>
      ) : (
        <Empty description="Không tìm thấy bài viết nào khớp với từ khóa." />
      )}
    </div>
  );
};

export default SearchResults;
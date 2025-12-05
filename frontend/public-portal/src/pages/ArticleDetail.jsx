import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import axiosClient from '../api/axiosClient';
import { Skeleton, Tag, Breadcrumb, Divider, Empty, Card } from 'antd';
import { Calendar, User, ArrowRight, Eye } from 'lucide-react';
import { format } from 'date-fns';

const ArticleDetail = () => {
  const { slug } = useParams();
  const [article, setArticle] = useState(null);
  const [relatedArticles, setRelatedArticles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const data = await axiosClient.get(`/articles/${slug}`);
        setArticle(data);
        if (data.categoryId) {
          try {
            const related = await axiosClient.get(`/articles/related/${data.categoryId}/${data.id}`);
            setRelatedArticles(related);
          } catch (err) {
            console.error("Lỗi tải bài liên quan", err);
          }
        }
      } catch (error) {
        console.error("Lỗi tải bài viết", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();

    window.scrollTo(0, 0);
  }, [slug]);

  if (loading) return <div className="max-w-4xl mx-auto mt-10"><Skeleton active paragraph={{ rows: 10 }} /></div>;

  if (!article) return <Empty description="Không tìm thấy bài viết" className="mt-20" />;

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-6">
        <Breadcrumb
          items={[
            { title: <Link to="/">Trang chủ</Link> },
            { title: <Link to={`/category/${article.categorySlug || '#'}`}>{article.categoryName}</Link> },
            { title: article.title },
          ]}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">

        <div className="lg:col-span-2">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 leading-tight">
            {article.title}
          </h1>

          <div className="flex items-center gap-4 text-sm text-gray-500 mb-6 border-b pb-4">
            <div className="flex items-center gap-1">
              <User size={16} />
              <span className="font-medium text-blue-600">{article.authorName}</span>
            </div>
            <div className="flex items-center gap-1">
              <Calendar size={16} />
              <span>{format(new Date(article.createdAt), 'dd/MM/yyyy, HH:mm')}</span>
            </div>
            <div className="flex items-center gap-1">
              <Eye size={16} />
              <span>{article.views || 0} lượt xem</span>
            </div>
          </div>

          <div className="text-lg md:text-xl font-semibold text-gray-700 mb-6 leading-relaxed italic border-l-4 border-blue-600 pl-4 bg-gray-50 p-4 rounded">
            {article.shortDescription}
          </div>

          <div
            className="prose prose-lg max-w-none text-gray-800 mb-8"
            dangerouslySetInnerHTML={{ __html: article.content }}
          />

          <div className="space-y-10">
            {article.pages && article.pages.map((page, index) => (
              <div key={index} className="bg-white">
                {page.imageUrl && (
                  <figure className="mb-6">
                    <img
                      src={page.imageUrl}
                      alt={`Minh họa trang ${index + 1}`}
                      className="w-full rounded-xl shadow-sm object-cover max-h-[500px]"
                    />
                    <figcaption className="text-center text-sm text-gray-500 mt-2 italic">
                      Ảnh minh họa: {article.title} (Phần {index + 1})
                    </figcaption>
                  </figure>
                )}

                <div className="prose prose-lg max-w-none text-gray-800 whitespace-pre-wrap leading-relaxed">
                  {page.content}
                </div>

                {index < article.pages.length - 1 && <Divider className="my-10" />}
              </div>
            ))}
          </div>

          <div className="mt-10 flex gap-2">
            <Tag color="blue">#TinTuc</Tag>
            <Tag color="blue">#{article.categoryName}</Tag>
          </div>
        </div>

        <div className="lg:col-span-1">
          <div className="sticky top-24">
            <h3 className="text-xl font-bold mb-4 border-l-4 border-red-600 pl-3">Cùng chuyên mục</h3>

            <div className="flex flex-col gap-4">
              {relatedArticles.length > 0 ? (
                relatedArticles.map(related => (
                  <Link key={related.id} to={`/article/${related.slug}`} className="group block">
                    <div className="flex gap-3 bg-white p-2 rounded-lg hover:shadow-md transition-shadow border border-transparent hover:border-gray-100">
                      <img
                        src={related.thumbnail}
                        alt={related.title}
                        className="w-24 h-20 object-cover rounded flex-shrink-0"
                      />
                      <div className="flex flex-col justify-between py-0.5 w-full">
                        <h4 className="text-sm font-bold text-gray-800 line-clamp-3 group-hover:text-blue-600 leading-snug">
                          {related.title}
                        </h4>
                        <div className="flex justify-between items-center mt-1">
                          <span className="text-xs text-gray-400">
                            {format(new Date(related.createdAt), 'dd/MM')}
                          </span>
                          <ArrowRight size={14} className="text-gray-300 group-hover:text-blue-500 transition-colors" />
                        </div>
                      </div>
                    </div>
                  </Link>
                ))
              ) : (
                <div className="text-center py-8 bg-gray-50 rounded-lg border border-dashed text-gray-400 text-sm">
                  Chưa có bài viết cùng chuyên mục.
                </div>
              )}
            </div>

            <div className="mt-8 bg-gradient-to-br from-gray-100 to-gray-200 h-64 rounded-xl flex flex-col items-center justify-center text-gray-400 border-2 border-dashed border-gray-300">
              <span className="font-bold text-xl tracking-widest">ADS SPACE</span>
              <span className="text-xs mt-1">300 x 250</span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default ArticleDetail;
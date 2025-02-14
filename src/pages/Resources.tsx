import { ExternalLink } from 'lucide-react';

export default function Resources() {
  const resources = [
    {
      title: 'MDN Web Docs',
      description: 'Mozilla 的網頁開發學習資源，提供完整的 HTML 教學和參考文件。',
      url: 'https://developer.mozilla.org/zh-TW/docs/Learn_web_development/Core/Structuring_content/Basic_HTML_syntax',
      image: 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?auto=format&fit=crop&q=80&w=2069',
    },
    {
      title: 'W3Schools',
      description: '互動式的 HTML 學習平台，適合初學者的教程網站。',
      url: 'https://w3schools.tech/zh-tw/tutorial/html/index',
      image: 'https://images.unsplash.com/photo-1593720213428-28a5b9e94613?auto=format&fit=crop&q=80&w=2070',
    },
    {
      title: 'RUNOOB.COM',
      description: '提供中文的程式設計教學，包含豐富的 HTML 範例和實作練習。',
      url: 'https://www.runoob.com/html/html-tutorial.html',
      image: 'https://images.unsplash.com/photo-1627398242454-45a1465c2479?auto=format&fit=crop&q=80&w=2074',
    },
  ];

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">外部學習資源</h1>
      <p className='text-sm text-gray-400 my-4'>盡情去探索吧! 你能學習到更多!</p>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {resources.map((resource) => (
          <a
            key={resource.url}
            href={resource.url}
            target="_blank"
            rel="noopener noreferrer"
            className="group block bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow overflow-hidden"
          >
            <div className="aspect-video w-full overflow-hidden">
              <img
                src={resource.image}
                alt={resource.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
            </div>
            <div className="p-4">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-lg font-semibold text-gray-900">
                  {resource.title}
                </h3>
                <ExternalLink className="h-5 w-5 text-gray-400 group-hover:text-indigo-500 transition-colors" />
              </div>
              <p className="text-gray-600">{resource.description}</p>
            </div>
          </a>
        ))}
      </div>
    </div>
  );
}
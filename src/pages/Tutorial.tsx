import { ExternalLink } from 'lucide-react';

export default function Resources() {
  const tutorials = [
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
      <h1 className="text-2xl font-bold text-gray-900 mb-6">HTML Notes使用教學</h1>
      <div className="p-6 flex justify-center">
        <div className="w-[80%] relative">
          {/* 使用 padding-bottom 創建 16:9 的比例容器 */}
          <div className="relative w-full" style={{ paddingBottom: '59.27%' }}>
          <iframe src="https://docs.google.com/presentation/d/e/2PACX-1vT_8CpMoE7BA1Yfc6-HvR1rcs7RskLpo9jPN_fwMI_EExmJcXZiWvQVyJNnhhQDUT8CGOLAYtXxmBB9/embed?start=false&loop=false&delayms=3000" frameborder="0" width="960" height="569" allowfullscreen="true" mozallowfullscreen="true" webkitallowfullscreen="true"></iframe>  
          </div>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {tutorials.map((tutorial) => (
          <a
            key={tutorial.url}
            href={tutorial.url}
            target="_blank"
            rel="noopener noreferrer"
            className="group block bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow overflow-hidden"
          >
            <div className="aspect-video w-full overflow-hidden">
              <img
                src={tutorial.image}
                alt={tutorial.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
            </div>
            <div className="p-4">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-lg font-semibold text-gray-900">
                  {tutorial.title}
                </h3>
                <ExternalLink className="h-5 w-5 text-gray-400 group-hover:text-indigo-500 transition-colors" />
              </div>
              <p className="text-gray-600">{tutorial.description}</p>
            </div>
          </a>
        ))}
      </div>
    </div>
  );
}
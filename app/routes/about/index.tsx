import { useLanguage } from '@/contexts/LanguageContext';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { Card, CardContent } from '@/components/ui/card';

const pets = [
  {
    name: 'Kiki',
    age: '12歲 / 12 years old',
    description: '溫柔的老狗狗，最愛曬太陽。Kiki 是我們家的大姐姐，雖然行動不如以前敏捷，但她的溫暖笑容總是能治癒我們的心。',
    englishDescription: 'Gentle old dog who loves sunbathing. Kiki is the big sister of our family. Though not as agile as before, her warm smile always heals our hearts.',
    image: '/placeholder.svg',
    personality: '溫和、愛撒嬌 / Gentle, loves cuddles',
    favoriteThings: '曬太陽、軟軟的床 / Sunbathing, soft beds',
  },
  {
    name: '西西 (Sisi)',
    age: '14歲 / 14 years old',
    description: '聰明的老貓咪，很會撒嬌。西西是我們家的智者，她總是知道什麼時候需要安慰，會在你難過的時候主動靠近。',
    englishDescription: 'Smart old cat who loves cuddles. Sisi is the wise one in our family. She always knows when comfort is needed and comes close when you\'re sad.',
    image: '/placeholder.svg',
    personality: '聰明、善解人意 / Smart, understanding',
    favoriteThings: '溫暖的膝蓋、午後陽光 / Warm laps, afternoon sunlight',
  },
  {
    name: '小小 (Xiaoxiao)',
    age: '10歲 / 10 years old',
    description: '活潑的小型犬，精神很好。小小雖然年紀不小了，但依然保持著年輕的心，每天都充滿活力。',
    englishDescription: 'Energetic small dog, still very spirited. Though not young anymore, Xiaoxiao maintains a youthful heart and is full of energy every day.',
    image: '/placeholder.svg',
    personality: '活潑、樂觀 / Energetic, optimistic',
    favoriteThings: '散步、玩具 / Walks, toys',
  },
  {
    name: '渺渺 (Miaomiao)',
    age: '13歲 / 13 years old',
    description: '安靜的老貓，喜歡溫暖的地方。渺渺是我們家最安靜的成員，她喜歡在溫暖的角落靜靜地觀察世界。',
    englishDescription: 'Quiet old cat who loves warm spots. Miaomiao is the quietest member of our family. She loves to quietly observe the world from warm corners.',
    image: '/placeholder.svg',
    personality: '安靜、觀察力強 / Quiet, observant',
    favoriteThings: '溫暖的角落、觀察 / Warm corners, observing',
  },
];

const About = () => {
  const { t } = useLanguage();

  return (
    <div className="min-h-screen bg-gradient-to-b from-orange-50 to-white">
      <Header />

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            {t('about.title')}
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            我們是一個被四隻高齡毛孩圍繞的家庭，深深了解照顧老年寵物的需求與挑戰。
            <br />
            <span className="text-lg">
              We are a family surrounded by four elderly pets, deeply understanding the needs and challenges of caring for senior animals.
            </span>
          </p>
        </div>

        {/* Our Story */}
        <section className="mb-16">
          <Card className="overflow-hidden">
            <CardContent className="p-8 md:p-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-6 text-center">
                {t('about.story')}
              </h2>
              <div className="prose prose-lg max-w-none text-gray-700 space-y-6">
                <p className="text-lg leading-relaxed">
                  <strong>中文：</strong>
                  kikichoice 的故事始於我們對四隻高齡寵物的深深愛護。當 Kiki、西西、小小、渺渺逐漸步入老年時，我們發現市面上專為高齡寵物設計的用品選擇有限，品質也參差不齊。
                </p>
                <p className="text-lg leading-relaxed">
                  於是我們決定親自尋找和精選那些真正適合老年寵物的優質產品。每一件商品都經過我們四隻毛孩的「實地測試」，只有獲得他們認可的產品才會推薦給其他寵物家長。
                </p>
                <p className="text-lg leading-relaxed">
                  我們相信，每一隻高齡寵物都值得擁有舒適、安全、充滿愛的晚年生活。這就是 kikichoice 存在的意義 — 為了那些陪伴我們多年的老朋友們。
                </p>

                <div className="border-t border-gray-200 pt-6 mt-8">
                  <p className="text-lg leading-relaxed">
                    <strong>English:</strong>
                    The story of kikichoice began with our deep love for our four elderly pets. As Kiki, Sisi, Xiaoxiao, and Miaomiao gradually entered their senior years, we found that products specifically designed for elderly pets were limited and varied greatly in quality.
                  </p>
                  <p className="text-lg leading-relaxed">
                    So we decided to personally search for and curate high-quality products that are truly suitable for senior pets. Every item has been "field-tested" by our four furry family members, and only products that receive their approval are recommended to other pet parents.
                  </p>
                  <p className="text-lg leading-relaxed">
                    We believe that every senior pet deserves a comfortable, safe, and love-filled later life. This is the meaning behind kikichoice's existence — for those old friends who have accompanied us for many years.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Meet Our Pets */}
        <section>
          <h2 className="text-3xl font-bold text-gray-900 mb-12 text-center">
            認識我們的毛孩家族 / Meet Our Furry Family
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {pets.map((pet, index) => (
              <Card key={index} className="overflow-hidden hover:shadow-lg transition-shadow">
                <div className="md:flex">
                  <div className="md:w-1/3">
                    <img
                      src={pet.image}
                      alt={pet.name}
                      className="w-full h-64 md:h-full object-cover"
                    />
                  </div>
                  <CardContent className="md:w-2/3 p-6">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="text-2xl font-bold text-gray-900">{pet.name}</h3>
                      <span className="text-sm font-medium text-orange-600 bg-orange-100 px-3 py-1 rounded-full">
                        {pet.age}
                      </span>
                    </div>

                    <div className="space-y-3 text-sm">
                      <div>
                        <strong className="text-gray-700">個性 / Personality:</strong>
                        <span className="text-gray-600 ml-2">{pet.personality}</span>
                      </div>
                      <div>
                        <strong className="text-gray-700">最愛 / Favorite Things:</strong>
                        <span className="text-gray-600 ml-2">{pet.favoriteThings}</span>
                      </div>
                    </div>

                    <div className="mt-4 space-y-3">
                      <p className="text-gray-700 leading-relaxed">
                        <strong>中文：</strong> {pet.description}
                      </p>
                      <p className="text-gray-700 leading-relaxed">
                        <strong>English:</strong> {pet.englishDescription}
                      </p>
                    </div>
                  </CardContent>
                </div>
              </Card>
            ))}
          </div>
        </section>

        {/* Contact Info */}
        <section className="mt-16 text-center">
          <Card className="bg-gradient-to-r from-orange-100 to-pink-100">
            <CardContent className="p-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                聯繫我們 / Contact Us
              </h3>
              <p className="text-gray-700 mb-6">
                有任何問題或建議，歡迎透過以下方式聯繫我們
                <br />
                For any questions or suggestions, feel free to contact us through the following ways
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <a
                  href="#"
                  className="flex items-center space-x-2 text-orange-600 hover:text-orange-700 transition-colors"
                >
                  <span>📧</span>
                  <span>hello@kikichoice.com</span>
                </a>
                <a
                  href="#"
                  className="flex items-center space-x-2 text-orange-600 hover:text-orange-700 transition-colors"
                >
                  <span>📸</span>
                  <span>@kikichoice_official</span>
                </a>
                <a
                  href="#"
                  className="flex items-center space-x-2 text-orange-600 hover:text-orange-700 transition-colors"
                >
                  <span>💬</span>
                  <span>LINE: @kikichoice</span>
                </a>
              </div>
            </CardContent>
          </Card>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default About;

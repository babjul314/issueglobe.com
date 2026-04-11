export interface Country {
  code: string;
  name: string;
  nameLocal: string;
  flag: string;
  locale: string;
  lang: string; // ISO 639-1 language code
  currency: string;
  region: string;
  color: string;
  description?: string; // SEO description
  descriptionLocal?: string; // SEO description in local language
  // UI 번역
  ui: {
    trending: string;
    trendingIn: string;
    searches: string;
    readMore: string;
    relatedSearches: string;
    moreTrending: string;
    home: string;
    regions: string;
    live: string;
    hero: string;
    heroSub: string;
    exploreOther: string;
    noTrends: string;
    source: string;
  };
}

// 광고 수익성 기준 상위 30개국 (광고 시장 규모, GDP, 인터넷 보급률 기반)
export const countries: Country[] = [
  {
    code: "US", name: "United States", nameLocal: "United States", flag: "\u{1F1FA}\u{1F1F8}", locale: "en-US", lang: "en", currency: "USD", region: "North America", color: "#3B82F6",
    ui: { trending: "Trending Now", trendingIn: "Trending in United States", searches: "searches", readMore: "Read full article", relatedSearches: "Related Searches", moreTrending: "More Trending", home: "Home", regions: "Regions", live: "Live", hero: "What America is Searching For", heroSub: "Real-time trending topics in the United States, updated daily.", exploreOther: "Explore Other Countries", noTrends: "No trends available yet. Check back soon!", source: "via" },
  },
  {
    code: "JP", name: "Japan", nameLocal: "\u65E5\u672C", flag: "\u{1F1EF}\u{1F1F5}", locale: "ja-JP", lang: "ja", currency: "JPY", region: "Asia", color: "#EF4444",
    ui: { trending: "\u30C8\u30EC\u30F3\u30C9", trendingIn: "\u65E5\u672C\u306E\u30C8\u30EC\u30F3\u30C9", searches: "\u691C\u7D22", readMore: "\u8A18\u4E8B\u3092\u8AAD\u3080", relatedSearches: "\u95A2\u9023\u691C\u7D22", moreTrending: "\u305D\u306E\u4ED6\u306E\u30C8\u30EC\u30F3\u30C9", home: "\u30DB\u30FC\u30E0", regions: "\u5730\u57DF", live: "\u30E9\u30A4\u30D6", hero: "\u65E5\u672C\u3067\u4ECA\u691C\u7D22\u3055\u308C\u3066\u3044\u308B\u3053\u3068", heroSub: "\u65E5\u672C\u306E\u30EA\u30A2\u30EB\u30BF\u30A4\u30E0\u30C8\u30EC\u30F3\u30C9\u3001\u6BCE\u65E5\u66F4\u65B0\u3002", exploreOther: "\u4ED6\u306E\u56FD\u3092\u63A2\u7D22", noTrends: "\u307E\u3060\u30C8\u30EC\u30F3\u30C9\u304C\u3042\u308A\u307E\u305B\u3093\u3002\u307E\u305F\u5F8C\u3067\u78BA\u8A8D\u3057\u3066\u304F\u3060\u3055\u3044\uFF01", source: "\u51FA\u5178" },
  },
  {
    code: "DE", name: "Germany", nameLocal: "Deutschland", flag: "\u{1F1E9}\u{1F1EA}", locale: "de-DE", lang: "de", currency: "EUR", region: "Europe", color: "#FBBF24",
    ui: { trending: "Aktuelle Trends", trendingIn: "Trends in Deutschland", searches: "Suchanfragen", readMore: "Vollst\u00e4ndigen Artikel lesen", relatedSearches: "Verwandte Suchanfragen", moreTrending: "Mehr Trends", home: "Startseite", regions: "Regionen", live: "Live", hero: "Wonach Deutschland sucht", heroSub: "Echtzeit-Trendthemen in Deutschland, t\u00e4glich aktualisiert.", exploreOther: "Andere L\u00e4nder entdecken", noTrends: "Noch keine Trends verf\u00fcgbar. Schauen Sie bald wieder vorbei!", source: "via" },
  },
  {
    code: "GB", name: "United Kingdom", nameLocal: "United Kingdom", flag: "\u{1F1EC}\u{1F1E7}", locale: "en-GB", lang: "en", currency: "GBP", region: "Europe", color: "#1E40AF",
    ui: { trending: "Trending Now", trendingIn: "Trending in the UK", searches: "searches", readMore: "Read full article", relatedSearches: "Related Searches", moreTrending: "More Trending", home: "Home", regions: "Regions", live: "Live", hero: "What the UK is Searching For", heroSub: "Real-time trending topics in the United Kingdom, updated daily.", exploreOther: "Explore Other Countries", noTrends: "No trends available yet. Check back soon!", source: "via" },
  },
  {
    code: "FR", name: "France", nameLocal: "France", flag: "\u{1F1EB}\u{1F1F7}", locale: "fr-FR", lang: "fr", currency: "EUR", region: "Europe", color: "#2563EB",
    ui: { trending: "Tendances", trendingIn: "Tendances en France", searches: "recherches", readMore: "Lire l'article complet", relatedSearches: "Recherches associ\u00e9es", moreTrending: "Plus de tendances", home: "Accueil", regions: "R\u00e9gions", live: "En direct", hero: "Ce que la France recherche", heroSub: "Sujets tendances en temps r\u00e9el en France, mis \u00e0 jour quotidiennement.", exploreOther: "Explorer d'autres pays", noTrends: "Pas encore de tendances disponibles. Revenez bient\u00f4t !", source: "via" },
  },
  {
    code: "IN", name: "India", nameLocal: "\u092D\u093E\u0930\u0924", flag: "\u{1F1EE}\u{1F1F3}", locale: "hi-IN", lang: "hi", currency: "INR", region: "Asia", color: "#F97316",
    ui: { trending: "\u091F\u094D\u0930\u0947\u0902\u0921\u093F\u0902\u0917", trendingIn: "\u092D\u093E\u0930\u0924 \u092E\u0947\u0902 \u091F\u094D\u0930\u0947\u0902\u0921\u093F\u0902\u0917", searches: "\u0916\u094B\u091C", readMore: "\u092A\u0942\u0930\u093E \u0932\u0947\u0916 \u092A\u0922\u093C\u0947\u0902", relatedSearches: "\u0938\u0902\u092C\u0902\u0927\u093F\u0924 \u0916\u094B\u091C", moreTrending: "\u0914\u0930 \u091F\u094D\u0930\u0947\u0902\u0921\u094D\u0938", home: "\u0939\u094B\u092E", regions: "\u0915\u094D\u0937\u0947\u0924\u094D\u0930", live: "\u0932\u093E\u0907\u0935", hero: "\u092D\u093E\u0930\u0924 \u0915\u094D\u092F\u093E \u0916\u094B\u091C \u0930\u0939\u093E \u0939\u0948", heroSub: "\u092D\u093E\u0930\u0924 \u092E\u0947\u0902 \u0930\u093F\u092F\u0932-\u091F\u093E\u0907\u092E \u091F\u094D\u0930\u0947\u0902\u0921\u094D\u0938, \u0930\u094B\u091C\u093C\u093E\u0928\u093E \u0905\u092A\u0921\u0947\u091F\u0964", exploreOther: "\u0905\u0928\u094D\u092F \u0926\u0947\u0936 \u0926\u0947\u0916\u0947\u0902", noTrends: "\u0905\u092D\u0940 \u0915\u094B\u0908 \u091F\u094D\u0930\u0947\u0902\u0921 \u0928\u0939\u0940\u0902\u0964 \u091C\u0932\u094D\u0926 \u0935\u093E\u092A\u0938 \u0906\u090F\u0902!", source: "\u0938\u094D\u0930\u094B\u0924" },
  },
  {
    code: "BR", name: "Brazil", nameLocal: "Brasil", flag: "\u{1F1E7}\u{1F1F7}", locale: "pt-BR", lang: "pt", currency: "BRL", region: "South America", color: "#22C55E",
    ui: { trending: "Em alta", trendingIn: "Em alta no Brasil", searches: "pesquisas", readMore: "Leia o artigo completo", relatedSearches: "Pesquisas relacionadas", moreTrending: "Mais tend\u00eancias", home: "In\u00edcio", regions: "Regi\u00f5es", live: "Ao vivo", hero: "O que o Brasil est\u00e1 buscando", heroSub: "T\u00f3picos em alta em tempo real no Brasil, atualizados diariamente.", exploreOther: "Explorar outros pa\u00edses", noTrends: "Nenhuma tend\u00eancia dispon\u00edvel ainda. Volte em breve!", source: "via" },
  },
  {
    code: "KR", name: "South Korea", nameLocal: "\uB300\uD55C\uBBFC\uAD6D", flag: "\u{1F1F0}\u{1F1F7}", locale: "ko-KR", lang: "ko", currency: "KRW", region: "Asia", color: "#1D4ED8",
    ui: { trending: "실시간 이슈", trendingIn: "대한민국 실시간 이슈 순위", searches: "검색", readMore: "기사 전문 보기", relatedSearches: "관련 검색어", moreTrending: "더 많은 이슈", home: "홈", regions: "지역", live: "실시간", hero: "지금 대한민국 실시간 이슈", heroSub: "오늘의 이슈·실시간 검색어를 매시간 업데이트합니다.", exploreOther: "다른 나라 탐색", noTrends: "아직 이슈가 없습니다. 나중에 다시 확인해주세요!", source: "출처" },
  },
  {
    code: "CA", name: "Canada", nameLocal: "Canada", flag: "\u{1F1E8}\u{1F1E6}", locale: "en-CA", lang: "en", currency: "CAD", region: "North America", color: "#DC2626",
    ui: { trending: "Trending Now", trendingIn: "Trending in Canada", searches: "searches", readMore: "Read full article", relatedSearches: "Related Searches", moreTrending: "More Trending", home: "Home", regions: "Regions", live: "Live", hero: "What Canada is Searching For", heroSub: "Real-time trending topics in Canada, updated daily.", exploreOther: "Explore Other Countries", noTrends: "No trends available yet. Check back soon!", source: "via" },
  },
  {
    code: "IT", name: "Italy", nameLocal: "Italia", flag: "\u{1F1EE}\u{1F1F9}", locale: "it-IT", lang: "it", currency: "EUR", region: "Europe", color: "#16A34A",
    ui: { trending: "Di tendenza", trendingIn: "Di tendenza in Italia", searches: "ricerche", readMore: "Leggi l'articolo completo", relatedSearches: "Ricerche correlate", moreTrending: "Altre tendenze", home: "Home", regions: "Regioni", live: "In diretta", hero: "Cosa cerca l'Italia", heroSub: "Argomenti di tendenza in tempo reale in Italia, aggiornati ogni giorno.", exploreOther: "Esplora altri paesi", noTrends: "Nessuna tendenza disponibile. Torna presto!", source: "via" },
  },
  {
    code: "ES", name: "Spain", nameLocal: "Espa\u00f1a", flag: "\u{1F1EA}\u{1F1F8}", locale: "es-ES", lang: "es", currency: "EUR", region: "Europe", color: "#DC2626",
    ui: { trending: "Tendencias", trendingIn: "Tendencias en Espa\u00f1a", searches: "b\u00fasquedas", readMore: "Leer art\u00edculo completo", relatedSearches: "B\u00fasquedas relacionadas", moreTrending: "M\u00e1s tendencias", home: "Inicio", regions: "Regiones", live: "En vivo", hero: "Qu\u00e9 busca Espa\u00f1a", heroSub: "Temas de tendencia en tiempo real en Espa\u00f1a, actualizados diariamente.", exploreOther: "Explorar otros pa\u00edses", noTrends: "\u00a1A\u00fan no hay tendencias disponibles. Vuelve pronto!", source: "v\u00eda" },
  },
  {
    code: "MX", name: "Mexico", nameLocal: "M\u00e9xico", flag: "\u{1F1F2}\u{1F1FD}", locale: "es-MX", lang: "es", currency: "MXN", region: "North America", color: "#16A34A",
    ui: { trending: "Tendencias", trendingIn: "Tendencias en M\u00e9xico", searches: "b\u00fasquedas", readMore: "Leer art\u00edculo completo", relatedSearches: "B\u00fasquedas relacionadas", moreTrending: "M\u00e1s tendencias", home: "Inicio", regions: "Regiones", live: "En vivo", hero: "Qu\u00e9 busca M\u00e9xico", heroSub: "Temas de tendencia en tiempo real en M\u00e9xico, actualizados diariamente.", exploreOther: "Explorar otros pa\u00edses", noTrends: "\u00a1A\u00fan no hay tendencias disponibles. Vuelve pronto!", source: "v\u00eda" },
  },
  {
    code: "AU", name: "Australia", nameLocal: "Australia", flag: "\u{1F1E6}\u{1F1FA}", locale: "en-AU", lang: "en", currency: "AUD", region: "Oceania", color: "#F59E0B",
    ui: { trending: "Trending Now", trendingIn: "Trending in Australia", searches: "searches", readMore: "Read full article", relatedSearches: "Related Searches", moreTrending: "More Trending", home: "Home", regions: "Regions", live: "Live", hero: "What Australia is Searching For", heroSub: "Real-time trending topics in Australia, updated daily.", exploreOther: "Explore Other Countries", noTrends: "No trends available yet. Check back soon!", source: "via" },
  },
  {
    code: "NL", name: "Netherlands", nameLocal: "Nederland", flag: "\u{1F1F3}\u{1F1F1}", locale: "nl-NL", lang: "nl", currency: "EUR", region: "Europe", color: "#F97316",
    ui: { trending: "Trending", trendingIn: "Trending in Nederland", searches: "zoekopdrachten", readMore: "Lees het volledige artikel", relatedSearches: "Gerelateerde zoekopdrachten", moreTrending: "Meer trends", home: "Home", regions: "Regio's", live: "Live", hero: "Waar Nederland naar zoekt", heroSub: "Realtime trending onderwerpen in Nederland, dagelijks bijgewerkt.", exploreOther: "Ontdek andere landen", noTrends: "Nog geen trends beschikbaar. Kom snel terug!", source: "via" },
  },
  {
    code: "CH", name: "Switzerland", nameLocal: "Schweiz", flag: "\u{1F1E8}\u{1F1ED}", locale: "de-CH", lang: "de", currency: "CHF", region: "Europe", color: "#EF4444",
    ui: { trending: "Aktuelle Trends", trendingIn: "Trends in der Schweiz", searches: "Suchanfragen", readMore: "Vollst\u00e4ndigen Artikel lesen", relatedSearches: "Verwandte Suchanfragen", moreTrending: "Mehr Trends", home: "Startseite", regions: "Regionen", live: "Live", hero: "Wonach die Schweiz sucht", heroSub: "Echtzeit-Trendthemen in der Schweiz, t\u00e4glich aktualisiert.", exploreOther: "Andere L\u00e4nder entdecken", noTrends: "Noch keine Trends verf\u00fcgbar. Schauen Sie bald wieder vorbei!", source: "via" },
  },
  {
    code: "SE", name: "Sweden", nameLocal: "Sverige", flag: "\u{1F1F8}\u{1F1EA}", locale: "sv-SE", lang: "sv", currency: "SEK", region: "Europe", color: "#2563EB",
    ui: { trending: "Trender", trendingIn: "Trender i Sverige", searches: "s\u00f6kningar", readMore: "L\u00e4s hela artikeln", relatedSearches: "Relaterade s\u00f6kningar", moreTrending: "Fler trender", home: "Hem", regions: "Regioner", live: "Live", hero: "Vad Sverige s\u00f6ker efter", heroSub: "Realtidstrender i Sverige, uppdateras dagligen.", exploreOther: "Utforska andra l\u00e4nder", noTrends: "Inga trender tillg\u00e4ngliga \u00e4nnu. Kom tillbaka snart!", source: "via" },
  },
  {
    code: "BE", name: "Belgium", nameLocal: "Belgi\u00eb", flag: "\u{1F1E7}\u{1F1EA}", locale: "nl-BE", lang: "nl", currency: "EUR", region: "Europe", color: "#FBBF24",
    ui: { trending: "Trending", trendingIn: "Trending in Belgi\u00eb", searches: "zoekopdrachten", readMore: "Lees het volledige artikel", relatedSearches: "Gerelateerde zoekopdrachten", moreTrending: "Meer trends", home: "Home", regions: "Regio's", live: "Live", hero: "Waar Belgi\u00eb naar zoekt", heroSub: "Realtime trending onderwerpen in Belgi\u00eb, dagelijks bijgewerkt.", exploreOther: "Ontdek andere landen", noTrends: "Nog geen trends beschikbaar. Kom snel terug!", source: "via" },
  },
  {
    code: "AT", name: "Austria", nameLocal: "\u00d6sterreich", flag: "\u{1F1E6}\u{1F1F9}", locale: "de-AT", lang: "de", currency: "EUR", region: "Europe", color: "#DC2626",
    ui: { trending: "Aktuelle Trends", trendingIn: "Trends in \u00d6sterreich", searches: "Suchanfragen", readMore: "Vollst\u00e4ndigen Artikel lesen", relatedSearches: "Verwandte Suchanfragen", moreTrending: "Mehr Trends", home: "Startseite", regions: "Regionen", live: "Live", hero: "Wonach \u00d6sterreich sucht", heroSub: "Echtzeit-Trendthemen in \u00d6sterreich, t\u00e4glich aktualisiert.", exploreOther: "Andere L\u00e4nder entdecken", noTrends: "Noch keine Trends verf\u00fcgbar. Schauen Sie bald wieder vorbei!", source: "via" },
  },
  {
    code: "NO", name: "Norway", nameLocal: "Norge", flag: "\u{1F1F3}\u{1F1F4}", locale: "nb-NO", lang: "no", currency: "NOK", region: "Europe", color: "#DC2626",
    ui: { trending: "Trender", trendingIn: "Trender i Norge", searches: "s\u00f8k", readMore: "Les hele artikkelen", relatedSearches: "Relaterte s\u00f8k", moreTrending: "Flere trender", home: "Hjem", regions: "Regioner", live: "Direkte", hero: "Hva Norge s\u00f8ker etter", heroSub: "Sanntids trender i Norge, oppdatert daglig.", exploreOther: "Utforsk andre land", noTrends: "Ingen trender tilgjengelig enn\u00e5. Kom tilbake snart!", source: "via" },
  },
  {
    code: "DK", name: "Denmark", nameLocal: "Danmark", flag: "\u{1F1E9}\u{1F1F0}", locale: "da-DK", lang: "da", currency: "DKK", region: "Europe", color: "#EF4444",
    ui: { trending: "Trending", trendingIn: "Trending i Danmark", searches: "s\u00f8gninger", readMore: "L\u00e6s hele artiklen", relatedSearches: "Relaterede s\u00f8gninger", moreTrending: "Flere trends", home: "Hjem", regions: "Regioner", live: "Live", hero: "Hvad Danmark s\u00f8ger efter", heroSub: "Realtidstrends i Danmark, opdateret dagligt.", exploreOther: "Udforsk andre lande", noTrends: "Ingen trends tilg\u00e6ngelige endnu. Kom snart tilbage!", source: "via" },
  },
  {
    code: "PL", name: "Poland", nameLocal: "Polska", flag: "\u{1F1F5}\u{1F1F1}", locale: "pl-PL", lang: "pl", currency: "PLN", region: "Europe", color: "#DC2626",
    ui: { trending: "Popularne", trendingIn: "Popularne w Polsce", searches: "wyszukiwa\u0144", readMore: "Przeczytaj ca\u0142y artyku\u0142", relatedSearches: "Powi\u0105zane wyszukiwania", moreTrending: "Wi\u0119cej trend\u00f3w", home: "Strona g\u0142\u00f3wna", regions: "Regiony", live: "Na \u017bywo", hero: "Czego szuka Polska", heroSub: "Trendy w czasie rzeczywistym w Polsce, aktualizowane codziennie.", exploreOther: "Odkryj inne kraje", noTrends: "Brak trend\u00f3w. Wr\u00f3\u0107 wkr\u00f3tce!", source: "\u017ar\u00f3d\u0142o" },
  },
  {
    code: "IE", name: "Ireland", nameLocal: "Ireland", flag: "\u{1F1EE}\u{1F1EA}", locale: "en-IE", lang: "en", currency: "EUR", region: "Europe", color: "#16A34A",
    ui: { trending: "Trending Now", trendingIn: "Trending in Ireland", searches: "searches", readMore: "Read full article", relatedSearches: "Related Searches", moreTrending: "More Trending", home: "Home", regions: "Regions", live: "Live", hero: "What Ireland is Searching For", heroSub: "Real-time trending topics in Ireland, updated daily.", exploreOther: "Explore Other Countries", noTrends: "No trends available yet. Check back soon!", source: "via" },
  },
  {
    code: "NZ", name: "New Zealand", nameLocal: "New Zealand", flag: "\u{1F1F3}\u{1F1FF}", locale: "en-NZ", lang: "en", currency: "NZD", region: "Oceania", color: "#1D4ED8",
    ui: { trending: "Trending Now", trendingIn: "Trending in New Zealand", searches: "searches", readMore: "Read full article", relatedSearches: "Related Searches", moreTrending: "More Trending", home: "Home", regions: "Regions", live: "Live", hero: "What New Zealand is Searching For", heroSub: "Real-time trending topics in New Zealand, updated daily.", exploreOther: "Explore Other Countries", noTrends: "No trends available yet. Check back soon!", source: "via" },
  },
  {
    code: "FI", name: "Finland", nameLocal: "Suomi", flag: "\u{1F1EB}\u{1F1EE}", locale: "fi-FI", lang: "fi", currency: "EUR", region: "Europe", color: "#2563EB",
    ui: { trending: "Trendit", trendingIn: "Trendit Suomessa", searches: "hakua", readMore: "Lue koko artikkeli", relatedSearches: "Aiheeseen liittyv\u00e4t haut", moreTrending: "Lis\u00e4\u00e4 trendej\u00e4", home: "Etusivu", regions: "Alueet", live: "Live", hero: "Mit\u00e4 Suomi hakee", heroSub: "Reaaliaikaiset trendit Suomessa, p\u00e4ivitet\u00e4\u00e4n p\u00e4ivitt\u00e4in.", exploreOther: "Tutustu muihin maihin", noTrends: "Ei viel\u00e4 trendej\u00e4. Tule pian takaisin!", source: "l\u00e4hde" },
  },
  {
    code: "SG", name: "Singapore", nameLocal: "Singapore", flag: "\u{1F1F8}\u{1F1EC}", locale: "en-SG", lang: "en", currency: "SGD", region: "Asia", color: "#DC2626",
    ui: { trending: "Trending Now", trendingIn: "Trending in Singapore", searches: "searches", readMore: "Read full article", relatedSearches: "Related Searches", moreTrending: "More Trending", home: "Home", regions: "Regions", live: "Live", hero: "What Singapore is Searching For", heroSub: "Real-time trending topics in Singapore, updated daily.", exploreOther: "Explore Other Countries", noTrends: "No trends available yet. Check back soon!", source: "via" },
  },
  {
    code: "SA", name: "Saudi Arabia", nameLocal: "\u0627\u0644\u0633\u0639\u0648\u062F\u064A\u0629", flag: "\u{1F1F8}\u{1F1E6}", locale: "ar-SA", lang: "ar", currency: "SAR", region: "Middle East", color: "#16A34A",
    ui: { trending: "\u0627\u0644\u0623\u0643\u062B\u0631 \u0628\u062D\u062B\u0627\u064B", trendingIn: "\u0627\u0644\u0623\u0643\u062B\u0631 \u0628\u062D\u062B\u0627\u064B \u0641\u064A \u0627\u0644\u0633\u0639\u0648\u062F\u064A\u0629", searches: "\u0628\u062D\u062B", readMore: "\u0627\u0642\u0631\u0623 \u0627\u0644\u0645\u0642\u0627\u0644 \u0643\u0627\u0645\u0644\u0627\u064B", relatedSearches: "\u0639\u0645\u0644\u064A\u0627\u062A \u0628\u062D\u062B \u0630\u0627\u062A \u0635\u0644\u0629", moreTrending: "\u0645\u0632\u064A\u062F \u0645\u0646 \u0627\u0644\u0627\u062A\u062C\u0627\u0647\u0627\u062A", home: "\u0627\u0644\u0631\u0626\u064A\u0633\u064A\u0629", regions: "\u0627\u0644\u0645\u0646\u0627\u0637\u0642", live: "\u0645\u0628\u0627\u0634\u0631", hero: "\u0645\u0627\u0630\u0627 \u062A\u0628\u062D\u062B \u0627\u0644\u0633\u0639\u0648\u062F\u064A\u0629", heroSub: "\u0627\u0644\u0645\u0648\u0627\u0636\u064A\u0639 \u0627\u0644\u0631\u0627\u0626\u062C\u0629 \u0641\u064A \u0627\u0644\u0633\u0639\u0648\u062F\u064A\u0629 \u0641\u064A \u0627\u0644\u0648\u0642\u062A \u0627\u0644\u0641\u0639\u0644\u064A.", exploreOther: "\u0627\u0633\u062A\u0643\u0634\u0641 \u062F\u0648\u0644\u0627\u064B \u0623\u062E\u0631\u0649", noTrends: "\u0644\u0627 \u062A\u0648\u062C\u062F \u0627\u062A\u062C\u0627\u0647\u0627\u062A \u0628\u0639\u062F. \u0639\u062F \u0642\u0631\u064A\u0628\u0627\u064B!", source: "\u0627\u0644\u0645\u0635\u062F\u0631" },
  },
  {
    code: "AE", name: "UAE", nameLocal: "\u0627\u0644\u0625\u0645\u0627\u0631\u0627\u062A", flag: "\u{1F1E6}\u{1F1EA}", locale: "ar-AE", lang: "ar", currency: "AED", region: "Middle East", color: "#16A34A",
    ui: { trending: "\u0627\u0644\u0623\u0643\u062B\u0631 \u0628\u062D\u062B\u0627\u064B", trendingIn: "\u0627\u0644\u0623\u0643\u062B\u0631 \u0628\u062D\u062B\u0627\u064B \u0641\u064A \u0627\u0644\u0625\u0645\u0627\u0631\u0627\u062A", searches: "\u0628\u062D\u062B", readMore: "\u0627\u0642\u0631\u0623 \u0627\u0644\u0645\u0642\u0627\u0644 \u0643\u0627\u0645\u0644\u0627\u064B", relatedSearches: "\u0639\u0645\u0644\u064A\u0627\u062A \u0628\u062D\u062B \u0630\u0627\u062A \u0635\u0644\u0629", moreTrending: "\u0645\u0632\u064A\u062F \u0645\u0646 \u0627\u0644\u0627\u062A\u062C\u0627\u0647\u0627\u062A", home: "\u0627\u0644\u0631\u0626\u064A\u0633\u064A\u0629", regions: "\u0627\u0644\u0645\u0646\u0627\u0637\u0642", live: "\u0645\u0628\u0627\u0634\u0631", hero: "\u0645\u0627\u0630\u0627 \u062A\u0628\u062D\u062B \u0627\u0644\u0625\u0645\u0627\u0631\u0627\u062A", heroSub: "\u0627\u0644\u0645\u0648\u0627\u0636\u064A\u0639 \u0627\u0644\u0631\u0627\u0626\u062C\u0629 \u0641\u064A \u0627\u0644\u0625\u0645\u0627\u0631\u0627\u062A \u0641\u064A \u0627\u0644\u0648\u0642\u062A \u0627\u0644\u0641\u0639\u0644\u064A.", exploreOther: "\u0627\u0633\u062A\u0643\u0634\u0641 \u062F\u0648\u0644\u0627\u064B \u0623\u062E\u0631\u0649", noTrends: "\u0644\u0627 \u062A\u0648\u062C\u062F \u0627\u062A\u062C\u0627\u0647\u0627\u062A \u0628\u0639\u062F. \u0639\u062F \u0642\u0631\u064A\u0628\u0627\u064B!", source: "\u0627\u0644\u0645\u0635\u062F\u0631" },
  },
];

export const getCountryByCode = (code: string): Country | undefined =>
  countries.find((c) => c.code === code.toUpperCase());

export const getCountriesByRegion = (): Record<string, Country[]> =>
  countries.reduce((acc, country) => {
    if (!acc[country.region]) acc[country.region] = [];
    acc[country.region].push(country);
    return acc;
  }, {} as Record<string, Country[]>);

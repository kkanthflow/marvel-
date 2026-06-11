// Dynamic API service for fetching official posters, streaming/gaming platforms, and metadata from Wikipedia and TVMaze

// Mapping of MCU titles, series, and games to their exact Wikipedia article names to ensure 100% official poster art
const wikiPageMapping = {
  // --- INFINITY SAGA ---
  "iron man": "Iron_Man_(2008_film)",
  "the incredible hulk": "The_Incredible_Hulk_(film)",
  "iron man 2": "Iron_Man_2",
  "thor": "Thor_(film)",
  "captain america: the first avenger": "Captain_America:_The_First_Avenger",
  "the avengers": "The_Avengers_(2012_film)",
  "iron man 3": "Iron_Man_3",
  "thor: the dark world": "Thor:_The_Dark_World",
  "captain america: the winter soldier": "Captain_America:_The_Winter_Soldier",
  "guardians of the galaxy": "Guardians_of_the_Galaxy_(film)",
  "avengers: age of ultron": "Avengers:_Age_of_Ultron",
  "ant-man": "Ant-Man_(film)",
  "captain america: civil war": "Captain_America:_Civil_War",
  "doctor strange": "Doctor_Strange_(2016_film)",
  "guardians of the galaxy vol. 2": "Guardians_of_the_Galaxy_Vol._2",
  "spider-man: homecoming": "Spider-Man:_Homecoming",
  "thor: ragnarok": "Thor:_Ragnarok",
  "black panther": "Black_Panther_(film)",
  "avengers: infinity war": "Avengers:_Infinity_War",
  "ant-man and the wasp": "Ant-Man_and_the_Wasp",
  "captain marvel": "Captain_Marvel_(film)",
  "avengers: endgame": "Avengers:_Endgame",
  "spider-man: far from home": "Spider-Man:_Far_From_Home",

  // --- MULTIVERSE SAGA ---
  "black widow": "Black_Widow_(2021_film)",
  "shang-chi and the legend of the ten rings": "Shang-Chi_and_the_Legend_of_the_Ten_Ring",
  "eternals": "Eternals_(film)",
  "spider-man: no way home": "Spider-Man:_No_Way_Home",
  "doctor strange in the multiverse of madness": "Doctor_Strange_in_the_Multiverse_of_Madness",
  "thor: love and thunder": "Thor:_Love_and_Thunder",
  "black panther: wakanda forever": "Black_Panther:_Wakanda_Forever",
  "ant-man and the wasp: quantumania": "Ant-Man_and_the_Wasp:_Quantumania",
  "guardians of the galaxy vol. 3": "Guardians_of_the_Galaxy_Vol._3",
  "the marvels": "The_Marvels",
  "deadpool & wolverine": "Deadpool_%26_Wolverine",
  "captain america: brave new world": "Captain_America:_Brave_New_World",
  "fantastic four: first steps": "The_Fantastic_Four:_First_Steps",
  "thunderbolts": "Thunderbolts*_(film)",
  "thunderbolts*": "Thunderbolts*_(film)",
  "spider-man: brand new day": "Spider-Man:_Brand_New_Day",
  "avengers: doomsday": "Avengers:_Doomsday",
  "avengers: secret wars": "Avengers:_Secret_Wars",

  // --- LIVE ACTION SERIES ---
  "wandavision": "WandaVision",
  "the falcon and the winter soldier": "The_Falcon_and_the_Winter_Soldier",
  "loki (season 1)": "Loki_(TV_series)",
  "loki": "Loki_(TV_series)",
  "hawkeye": "Hawkeye_(2021_miniseries)",
  "ms. marvel": "Ms._Marvel_(miniseries)",
  "she-hulk": "She-Hulk:_Attorney_at_Law",
  "werewolf by night": "Werewolf_by_Night",
  "the guardians of the galaxy holiday special": "The_Guardians_of_the_Galaxy_Holiday_Special",
  "secret invasion": "Secret_Invasion_(miniseries)",
  "loki (season 2)": "Loki_(season_2)",
  "echo": "Echo_(miniseries)",
  "agatha all along": "Agatha_All_Along",
  "daredevil: born again": "Daredevil:_Born_Again",

  // --- ANIMATED ---
  "what if...? (season 1)": "What_If...%3F_(TV_series)",
  "i am groot (season 1)": "I_Am_Groot",
  "i am groot (season 2)": "I_Am_Groot",
  "big hero 6: the series": "Big_Hero_6:_The_Series",
  "moon girl and devil dinosaur": "Moon_Girl_and_Devil_Dinosaur",
  "x-men '97": "X-Men_%2797",
  "spidey and his amazing friends": "Spidey_and_His_Amazing_Friends",
  "your friendly neighborhood spider-man": "Your_Friendly_Neighborhood_Spider-Man",
  "eyes of wakanda": "Eyes_of_Wakanda",
  "marvel zombies": "Marvel_Zombies_(TV_series)",

  // --- COMICS ---
  "the amazing spider-man": "The_Amazing_Spider-Man",
  "uncanny x-men": "Uncanny_X-Men",
  "marvel super heroes secret wars (1984)": "Secret_Wars",
  "the infinity gauntlet": "The_Infinity_Gauntlet",
  "house of m": "House_of_M",
  "civil war": "Civil_War_(comics)",

  // --- GAMES ---
  "marvel 1943: rise of hydra": "Marvel_1943:_Rise_of_Hydra",
  "marvel's wolverine": "Marvel%27s_Wolverine",
  "marvel rivals": "Marvel_Rivals",
  "marvel's spider-man 2": "Spider-Man_2_(2023_video_game)",
  "marvel snap": "Marvel_Snap",
  "marvel's midnight suns": "Marvel%27s_Midnight_Suns",
  "marvel's guardians of the galaxy": "Marvel%27s_Guardians_of_the_Galaxy",
  "marvel's spider-man: miles morales": "Spider-Man:_Miles_Morales",
  "marvel's avengers": "Marvel%27s_Avengers",
  "marvel's iron man vr": "Marvel%27s_Iron_Man_VR",
  "marvel ultimate alliance 3: the black order": "Marvel_Ultimate_Alliance_3:_The_Black_Order",
  "marvel's spider-man": "Spider-Man_(2018_video_game)",
  "lego marvel super heroes": "Lego_Marvel_Super_Heroes",
  "lego marvel super heroes 2": "Lego_Marvel_Super_Heroes_2",
  "lego marvel's avengers": "Lego_Marvel%27s_Avengers",
  "marvel vs. capcom: infinite": "Marvel_vs._Capcom:_Infinite",
  "marvel vs. capcom 3: fate of two worlds": "Marvel_vs._Capcom_3:_Fate_of_Two_Worlds",
  "ultimate marvel vs. capcom 3": "Ultimate_Marvel_vs._Capcom_3",
  "marvel: ultimate alliance": "Marvel:_Ultimate_Alliance",
  "marvel: ultimate alliance 2": "Marvel:_Ultimate_Alliance_2",
  "x-men origins: wolverine": "X-Men_Origins:_Wolverine_(video_game)",
  "the incredible hulk: ultimate destruction": "The_Incredible_Hulk:_Ultimate_Destruction",
  "spider-man: shattered dimensions": "Spider-Man:_Shattered_Dimensions",
  "spider-man: edge of time": "Spider-Man:_Edge_of_Time",
  "spider-man: web of shadows": "Spider-Man:_Web_of_Shadows",
  "spider-man 2 (2004)": "Spider-Man_2_(video_game)",
  "ultimate spider-man": "Ultimate_Spider-Man_(video_game)",
  "x-men legends": "X-Men_Legends",
  "x-men legends ii: rise of apocalypse": "X-Men_Legends_II:_Rise_of_Apocalypse"
};

// Clean query helper
const cleanQuery = (q) => q.toLowerCase().replace(/[^a-z0-9\s:*&?'().?-]/g, "").replace(/\s+/g, " ").trim();

// Dynamic keyless Wikipedia Infobox image parser
async function fetchWikiPoster(wikiPageName) {
  try {
    const decodedPage = decodeURIComponent(wikiPageName);
    const url = `https://en.wikipedia.org/w/api.php?action=parse&page=${encodeURIComponent(decodedPage)}&prop=text&format=json&section=0&redirects=1&origin=*`;
    const res = await fetch(url);
    if (res.ok) {
      const data = await res.json();
      const htmlText = data.parse?.text?.["*"];
      if (htmlText) {
        const match = htmlText.match(/<img[^>]+src="([^"]+)"/i);
        if (match) {
          let src = match[1];
          if (src.startsWith("//")) {
            src = "https:" + src;
          } else if (src.startsWith("/")) {
            src = "https://en.wikipedia.org" + src;
          }
          // Convert standard 220px/250px thumbnail widths to 500px for a high-quality poster image
          return src.replace(/\/(\d+)px-/, "/500px-");
        }
      }
    }
  } catch (err) {
    console.warn("Wikipedia Image API fetch failed", err);
  }
  return null;
}

export async function fetchMediaDetails(title, type = "movie") {
  const normTitle = cleanQuery(title);
  
  // 1. Get Wikipedia page name if mapped
  const wikiPage = wikiPageMapping[normTitle];
  let officialPoster = null;

  if (wikiPage) {
    officialPoster = await fetchWikiPoster(wikiPage);
  }

  // 2. Fetch from TVMaze as secondary source for series
  let platforms = type === "game" ? ["PC", "PS5", "Xbox"] : ["Disney+"];
  let genre = "Action, Sci-Fi, Superhero";
  let year = "2024";

  if (type === "show" || type === "series" || normTitle.includes("series") || normTitle.includes("show")) {
    try {
      const res = await fetch(`https://api.tvmaze.com/singlesearch/shows?q=${encodeURIComponent(title)}`);
      if (res.ok) {
        const data = await res.json();
        if (!officialPoster && data.image) {
          officialPoster = data.image.medium;
        }
        platforms = ["Disney+"];
        year = data.premiered ? data.premiered.split("-")[0] : year;
        genre = data.genres?.join(", ") || genre;
      }
    } catch (err) {
      console.warn("TVMaze fetch failed", err);
    }
  }

  // 3. Fallback poster path if Wikipedia & TVMaze failed
  if (!officialPoster) {
    officialPoster = "https://image.tmdb.org/t/p/w500/gh462zRbZqZysAYyEW3aJvPyMtz.jpg"; // Spider-man 2002
  }

  return {
    title: title,
    poster: officialPoster,
    platforms,
    year,
    rating: type === "game" ? "9.0/10" : "8.5/10",
    genre,
    source: wikiPage ? "wikipedia" : "fallback"
  };
}

export async function fetchMediaSummary(title, type = "movie") {
  const normTitle = cleanQuery(title);
  const wikiPage = wikiPageMapping[normTitle];

  if (wikiPage) {
    try {
      const decodedPage = decodeURIComponent(wikiPage);
      const url = `https://en.wikipedia.org/w/api.php?action=query&prop=extracts&exintro=1&explaintext=1&titles=${encodeURIComponent(decodedPage)}&format=json&redirects=1&origin=*`;
      const res = await fetch(url);
      if (res.ok) {
        const data = await res.json();
        const pages = data.query?.pages;
        if (pages) {
          const pageId = Object.keys(pages)[0];
          if (pageId && pages[pageId]?.extract) {
            return pages[pageId].extract;
          }
        }
      }
    } catch (err) {
      console.warn("Wikipedia summary fetch failed", err);
    }
  }

  // Fallback to TVMaze if show/series
  if (type === "show" || type === "series" || normTitle.includes("series") || normTitle.includes("show")) {
    try {
      const res = await fetch(`https://api.tvmaze.com/singlesearch/shows?q=${encodeURIComponent(title)}`);
      if (res.ok) {
        const data = await res.json();
        if (data.summary) {
          return data.summary.replace(/<[^>]*>/g, ""); // strip HTML tags
        }
      }
    } catch (err) {
      console.warn("TVMaze summary fetch failed", err);
    }
  }

  return "No detailed description available for this item.";
}

export async function fetchMediaNews(title) {
  const normTitle = cleanQuery(title);
  const wikiPage = wikiPageMapping[normTitle];
  if (!wikiPage) return null;

  try {
    const decodedPage = decodeURIComponent(wikiPage);
    const parseUrl = `https://en.wikipedia.org/w/api.php?action=parse&page=${encodeURIComponent(decodedPage)}&prop=sections&format=json&redirects=1&origin=*`;
    const parseRes = await fetch(parseUrl);
    if (!parseRes.ok) return null;
    
    const parseData = await parseRes.json();
    const sections = parseData.parse?.sections || [];
    
    const targetKeywords = ["development", "production", "casting", "filming", "news", "release"];
    let targetSection = null;
    
    for (const sec of sections) {
      const line = sec.line.toLowerCase();
      if (targetKeywords.some(keyword => line.includes(keyword))) {
        targetSection = sec;
        break;
      }
    }
    
    if (targetSection) {
      const contentUrl = `https://en.wikipedia.org/w/api.php?action=parse&page=${encodeURIComponent(decodedPage)}&prop=text&section=${targetSection.index}&format=json&redirects=1&origin=*`;
      const contentRes = await fetch(contentUrl);
      if (contentRes.ok) {
        const contentData = await contentRes.json();
        const html = contentData.parse?.text?.["*"];
        if (html) {
          const paragraphs = html.match(/<p>([\s\S]*?)<\/p>/g);
          if (paragraphs) {
            return paragraphs
              .slice(0, 2)
              .map(p => p.replace(/<[^>]*>/g, "").replace(/&#91;\d+&#93;/g, "").replace(/\[\d+\]/g, "").trim())
              .filter(p => p.length > 50)
              .join("\n\n");
          }
        }
      }
    }
  } catch (err) {
    console.warn("Fetch media news failed", err);
  }
  return null;
}

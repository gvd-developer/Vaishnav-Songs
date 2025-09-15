import * as SQLite from 'expo-sqlite';
import { Song, Category, Sloka, Tag, Favourite, PlaybackHistory, SongCategory, SongSloka, SongTag } from '@/types/database';

let db: SQLite.SQLiteDatabase;

export async function initDatabase() {
  db = await SQLite.openDatabaseAsync('vaishnav_songs.db');

  // Create tables
  await db.execAsync(`
    PRAGMA journal_mode = WAL;
    
    CREATE TABLE IF NOT EXISTS songs (
      id TEXT PRIMARY KEY,
      slug TEXT UNIQUE NOT NULL,
      title TEXT NOT NULL,
      composer TEXT NOT NULL,
      era TEXT,
      raga TEXT,
      tala TEXT,
      lyrics_dev TEXT NOT NULL,
      lyrics_iast TEXT NOT NULL,
      summary TEXT,
      audio_url TEXT,
      cover_url TEXT,
      isFeatured INTEGER DEFAULT 0,
      createdAt TEXT NOT NULL,
      updatedAt TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS categories (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      slug TEXT UNIQUE NOT NULL,
      description TEXT,
      icon TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS song_categories (
      songId TEXT NOT NULL,
      categoryId TEXT NOT NULL,
      PRIMARY KEY (songId, categoryId),
      FOREIGN KEY (songId) REFERENCES songs(id) ON DELETE CASCADE,
      FOREIGN KEY (categoryId) REFERENCES categories(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS slokas (
      id TEXT PRIMARY KEY,
      book TEXT NOT NULL,
      chapter INTEGER NOT NULL,
      verse INTEGER NOT NULL,
      source TEXT NOT NULL,
      text_dev TEXT NOT NULL,
      text_iast TEXT NOT NULL,
      translation_en TEXT NOT NULL,
      translation_hi TEXT,
      themeTags TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS song_slokas (
      songId TEXT NOT NULL,
      slokaId TEXT NOT NULL,
      relationNote TEXT,
      PRIMARY KEY (songId, slokaId),
      FOREIGN KEY (songId) REFERENCES songs(id) ON DELETE CASCADE,
      FOREIGN KEY (slokaId) REFERENCES slokas(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS tags (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      type TEXT NOT NULL CHECK (type IN ('festival', 'mood', 'time')),
      slug TEXT UNIQUE NOT NULL
    );

    CREATE TABLE IF NOT EXISTS song_tags (
      songId TEXT NOT NULL,
      tagId TEXT NOT NULL,
      PRIMARY KEY (songId, tagId),
      FOREIGN KEY (songId) REFERENCES songs(id) ON DELETE CASCADE,
      FOREIGN KEY (tagId) REFERENCES tags(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS favourites (
      userId TEXT NOT NULL,
      songId TEXT NOT NULL,
      createdAt TEXT NOT NULL,
      PRIMARY KEY (userId, songId),
      FOREIGN KEY (songId) REFERENCES songs(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS playback_history (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      songId TEXT NOT NULL,
      playedAt TEXT NOT NULL,
      positionSec REAL DEFAULT 0,
      FOREIGN KEY (songId) REFERENCES songs(id) ON DELETE CASCADE
    );

    -- Create indexes for better search performance
    CREATE INDEX IF NOT EXISTS idx_songs_title ON songs(title);
    CREATE INDEX IF NOT EXISTS idx_songs_composer ON songs(composer);
    CREATE INDEX IF NOT EXISTS idx_songs_featured ON songs(isFeatured);
    CREATE INDEX IF NOT EXISTS idx_slokas_book ON slokas(book);
    CREATE INDEX IF NOT EXISTS idx_slokas_chapter ON slokas(book, chapter);
    CREATE INDEX IF NOT EXISTS idx_slokas_source ON slokas(source);
    CREATE INDEX IF NOT EXISTS idx_favourites_user ON favourites(userId);
    CREATE INDEX IF NOT EXISTS idx_history_played ON playback_history(playedAt DESC);
  `);

  // Seed initial data
  await seedDatabase();
}

export async function seedDatabase() {
  // Check if already seeded
  const existingSongs = await db.getFirstAsync('SELECT COUNT(*) as count FROM songs');
  if ((existingSongs as any)?.count > 0) return;

  // Categories
  const categories = [
    { id: '1', name: 'Bhajan', slug: 'bhajan', description: 'Devotional songs expressing love and devotion', icon: 'heart' },
    { id: '2', name: 'Kirtan', slug: 'kirtan', description: 'Call and response devotional singing', icon: 'music' },
    { id: '3', name: 'Ārati', slug: 'arati', description: 'Songs sung during lamp offering ceremony', icon: 'candle' },
    { id: '4', name: 'Maṅgala', slug: 'mangala', description: 'Auspicious morning songs', icon: 'sunrise' },
    { id: '5', name: 'Nām-saṅkīrtan', slug: 'nam-sankirtana', description: 'Congregational chanting of holy names', icon: 'users' },
    { id: '6', name: 'Festival', slug: 'festival', description: 'Songs for special occasions and celebrations', icon: 'star' }
  ];

  for (const category of categories) {
    await db.runAsync(
      'INSERT OR REPLACE INTO categories (id, name, slug, description, icon) VALUES (?, ?, ?, ?, ?)',
      [category.id, category.name, category.slug, category.description, category.icon]
    );
  }

  // Tags
  const tags = [
    { id: '1', name: 'Janmāṣṭamī', type: 'festival', slug: 'janmashtami' },
    { id: '2', name: 'Rādhāṣṭamī', type: 'festival', slug: 'radhashtami' },
    { id: '3', name: 'Vātsalya', type: 'mood', slug: 'vatsalya' },
    { id: '4', name: 'Mādhurya', type: 'mood', slug: 'madhurya' },
    { id: '5', name: 'Maṅgala', type: 'time', slug: 'mangala' },
    { id: '6', name: 'Sandhyā', type: 'time', slug: 'sandhya' }
  ];

  for (const tag of tags) {
    await db.runAsync(
      'INSERT OR REPLACE INTO tags (id, name, type, slug) VALUES (?, ?, ?, ?)',
      [tag.id, tag.name, tag.type, tag.slug]
    );
  }

  // Slokas
  const slokas = [
    {
      id: '1',
      book: 'Bhagavad Gītā',
      chapter: 9,
      verse: 22,
      source: 'BG 9.22',
      text_dev: 'अनन्याश्चिन्तयन्तो मां ये जनाः पर्युपासते। तेषां नित्याभियुक्तानां योगक्षेमं वहाम्यहम्॥',
      text_iast: 'ananyāś cintayanto māṁ ye janāḥ paryupāsate | teṣāṁ nityābhiyuktānāṁ yoga-kṣemaṁ vahāmy aham ||',
      translation_en: 'But those who always worship Me with exclusive devotion, meditating on My transcendental form—to them I carry what they lack, and I preserve what they have.',
      translation_hi: 'जो अनन्य भक्त निरंतर मेरा चिंतन करते हुए मेरी उपासना करते हैं, उन नित्य युक्त पुरुषों का योग-क्षेम मैं वहन करता हूँ।',
      themeTags: '["devotion", "surrender", "protection"]'
    },
    {
      id: '2',
      book: 'Bhagavad Gītā',
      chapter: 7,
      verse: 7,
      source: 'BG 7.7',
      text_dev: 'मत्तः परतरं नान्यत्किञ्चिदस्ति धनञ्जय। मयि सर्वमिदं प्रोतं सूत्रे मणिगणा इव॥',
      text_iast: 'mattaḥ parataraṁ nānyat kiñcid asti dhanañjaya | mayi sarvam idaṁ protaṁ sūtre maṇi-gaṇā iva ||',
      translation_en: 'O conqueror of wealth, there is no truth superior to Me. Everything rests upon Me, as pearls are strung on a thread.',
      translation_hi: 'हे अर्जुन! मुझसे परे और कुछ भी नहीं है। यह समस्त जगत मुझमें सूत्र में मणियों की भाँति गूँथा हुआ है।',
      themeTags: '["supreme-truth", "cosmic-unity", "divine-presence"]'
    }
  ];

  for (const sloka of slokas) {
    await db.runAsync(
      'INSERT OR REPLACE INTO slokas (id, book, chapter, verse, source, text_dev, text_iast, translation_en, translation_hi, themeTags) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [sloka.id, sloka.book, sloka.chapter, sloka.verse, sloka.source, sloka.text_dev, sloka.text_iast, sloka.translation_en, sloka.translation_hi, sloka.themeTags]
    );
  }

  // Songs
  const songs = [
    {
      id: '1',
      slug: 'govinda-jaya-jaya',
      title: 'Govinda Jaya Jaya',
      composer: 'Jayadeva Goswami',
      era: '12th century',
      raga: 'Bhairava',
      tala: 'Ektaal',
      lyrics_dev: `# गोविंद जय जय

## श्लोक १
गोविंद जय जय गोपाल जय जय
राधा रमण हरि गोविंद जय जय

## श्लोक २  
यमुना तीरे कदम्ब के नीचे
बांसुरी बजाये श्याम सुंदर
गोविंद जय जय गोपाल जय जय`,
      lyrics_iast: `# Govinda Jaya Jaya

## Verse 1
govinda jaya jaya gopāla jaya jaya
rādhā ramaṇa hari govinda jaya jaya

## Verse 2
yamunā tīre kadamba ke nīce
bānsurī bajāye śyāma sundara
govinda jaya jaya gopāla jaya jaya`,
      summary: 'A joyful celebration of Lord Krishna as Govinda, the protector of cows and divine cowherd.',
      audio_url: 'https://www.soundjay.com/misc/sounds-of-speech/beep-07a.wav',
      cover_url: 'https://images.pexels.com/photos/3194521/pexels-photo-3194521.jpeg',
      isFeatured: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      id: '2',
      slug: 'radhe-krishna-bol',
      title: 'Radhe Krishna Bol',
      composer: 'Traditional',
      lyrics_dev: `# राधे कृष्ण बोल

## श्लोक १
राधे कृष्ण बोल मन मेरे
राधे कृष्ण बोल

## श्लोक २
वृंदावन में गूंजे यह नाम
श्याम सुंदर का प्यारा नाम
राधे कृष्ण बोल मन मेरे`,
      lyrics_iast: `# Rādhe Kṛṣṇa Bola

## Verse 1
rādhe kṛṣṇa bola mana mere
rādhe kṛṣṇa bola

## Verse 2
vṛndāvana meṁ gūñje yaha nāma
śyāma sundara kā pyārā nāma
rādhe kṛṣṇa bola mana mere`,
      summary: 'A simple yet profound call to chant the holy names of Radha and Krishna.',
      audio_url: 'https://www.soundjay.com/misc/sounds-of-speech/beep-28.wav',
      isFeatured: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      id: '3',
      slug: 'jai-radha-madhav',
      title: 'Jai Radha Madhav',
      composer: 'Traditional',
      raga: 'Yaman',
      lyrics_dev: `# जय राधा माधव

## श्लोक १
जय राधा माधव जय कुंज बिहारी
गोपी जन वल्लभ जय गिरधारी

## श्लोक २
यशोदा नंदन ब्रज जन रंजन
यमुना तीर वन चारी
जय राधा माधव जय कुंज बिहारी`,
      lyrics_iast: `# Jaya Rādhā Mādhava

## Verse 1
jaya rādhā mādhava jaya kuñja bihārī
gopī jana vallabha jaya giri-dhārī

## Verse 2
yaśodā nandana braja jana rañjana
yamunā tīra vana cārī
jaya rādhā mādhava jaya kuñja bihārī`,
      summary: 'Classic ārati glorifying Krishna in his various aspects and pastimes.',
      audio_url: 'https://www.soundjay.com/misc/sounds-of-speech/beep-10.wav',
      isFeatured: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
  ];

  for (const song of songs) {
    await db.runAsync(
      'INSERT OR REPLACE INTO songs (id, slug, title, composer, era, raga, tala, lyrics_dev, lyrics_iast, summary, audio_url, cover_url, isFeatured, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [song.id, song.slug, song.title, song.composer, song.era || null, song.raga || null, song.tala || null, 
       song.lyrics_dev, song.lyrics_iast, song.summary, song.audio_url || null, song.cover_url || null, 
       song.isFeatured ? 1 : 0, song.createdAt, song.updatedAt]
    );
  }

  // Song Categories
  const songCategories = [
    { songId: '1', categoryId: '1' }, // Govinda Jaya Jaya - Bhajan
    { songId: '1', categoryId: '2' }, // Govinda Jaya Jaya - Kirtan
    { songId: '2', categoryId: '5' }, // Radhe Krishna Bol - Nam-sankirtana
    { songId: '3', categoryId: '3' }  // Jai Radha Madhav - Arati
  ];

  for (const sc of songCategories) {
    await db.runAsync(
      'INSERT OR REPLACE INTO song_categories (songId, categoryId) VALUES (?, ?)',
      [sc.songId, sc.categoryId]
    );
  }

  // Song Tags
  const songTags = [
    { songId: '1', tagId: '3' }, // Govinda Jaya Jaya - Vatsalya
    { songId: '2', tagId: '4' }, // Radhe Krishna Bol - Madhurya
    { songId: '3', tagId: '5' }  // Jai Radha Madhav - Mangala
  ];

  for (const st of songTags) {
    await db.runAsync(
      'INSERT OR REPLACE INTO song_tags (songId, tagId) VALUES (?, ?)',
      [st.songId, st.tagId]
    );
  }

  // Song Slokas
  const songSlokas = [
    { songId: '1', slokaId: '1', relationNote: 'Expresses the devotional sentiment' },
    { songId: '2', slokaId: '2', relationNote: 'Reflects the supreme nature of Krishna' }
  ];

  for (const ss of songSlokas) {
    await db.runAsync(
      'INSERT OR REPLACE INTO song_slokas (songId, slokaId, relationNote) VALUES (?, ?, ?)',
      [ss.songId, ss.slokaId, ss.relationNote]
    );
  }
}

export { db };
-- =============================================================================
-- VELA — THE BIRTHDAY TWIN SOCIETY & GLOBAL MEMORY NETWORK
-- Initial Seed Data (October 27 Birthday Circle across all Life-Stage Categories)
-- Password for all seed members is: Password123!
-- ($2b$10$YWzCLiopsN/0OgXrb.DyVePefNTWNBOfaOXr0LMC9OaktuhrVsJU.)
-- =============================================================================

-- Clean up any existing data in proper dependency order
TRUNCATE TABLE event_artist_bookings, celebrity_artists, twin_invitations, event_attendees, events, post_comments, post_likes, posts, users CASCADE;

-- 1. Users Across All Life-Stage Categories (All born on October 27!)
INSERT INTO users (
    id, email, name, password_hash, role, date_of_birth,
    birth_month, birth_day, birth_year, age_category, is_parent_managed,
    parent_guardian_name, zodiac_sign, bio, location, occupation, avatar_url, membership_tier
) VALUES 
-- Founding Adult Member
(
    'usr_senzo_001',
    'senzo@zelvaxis.com',
    'Senzo Zulu',
    '$2b$10$YWzCLiopsN/0OgXrb.DyVePefNTWNBOfaOXr0LMC9OaktuhrVsJU.',
    'user',
    '1998-10-27',
    10, 27, 1998,
    'adult',
    FALSE,
    NULL,
    'Scorpio',
    'Architect of digital intelligence systems. Dedicated to gathering all my October 27 twins under one skyline.',
    'Sandton & Cape Town',
    'Tech Venture Partner',
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80',
    'Founding Member'
),
-- Adult Twin: Camilla
(
    'twin_01',
    'camilla.vance@mayfair.vip',
    'Camilla Vance',
    '$2b$10$YWzCLiopsN/0OgXrb.DyVePefNTWNBOfaOXr0LMC9OaktuhrVsJU.',
    'user',
    '1998-10-27',
    10, 27, 1998,
    'adult',
    FALSE,
    NULL,
    'Scorpio',
    'Contemporary art curator. Celebrating October 27 with private gallery walkthroughs and vintage champagne.',
    'Mayfair, London',
    'Curator & Art Advisor',
    'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=600&q=80',
    'Founding Member'
),
-- Adult Twin: Julian
(
    'twin_02',
    'julian.m@montgomeryaviation.com',
    'Julian Montgomery',
    '$2b$10$YWzCLiopsN/0OgXrb.DyVePefNTWNBOfaOXr0LMC9OaktuhrVsJU.',
    'user',
    '1998-10-27',
    10, 27, 1998,
    'adult',
    FALSE,
    NULL,
    'Scorpio',
    'Helicopter pilot and founder of aviation experiences. Looking for twins to co-host this year’s rooftop gala.',
    'Camps Bay, Cape Town',
    'Aerospace Founder',
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=600&q=80',
    'Black Diamond'
),
-- Adult Twin: Elena
(
    'twin_03',
    'elena.sound@tribeca.studio',
    'Elena Rostova',
    '$2b$10$YWzCLiopsN/0OgXrb.DyVePefNTWNBOfaOXr0LMC9OaktuhrVsJU.',
    'user',
    '1998-10-27',
    10, 27, 1998,
    'adult',
    FALSE,
    NULL,
    'Scorpio',
    'Classical cellist turned electronic sound designer. Sharing our birthday means double the musical resonance.',
    'Tribeca, New York',
    'Sound Designer & Musician',
    'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=600&q=80',
    'Verified Twin'
),
-- Newborn Category (Parent Managed): Baby Liam (Born Oct 27, 2025 - ~11 months old)
(
    'twin_newborn_01',
    'sophie.liam@velababy.org',
    'Liam Harrison (Baby)',
    '$2b$10$YWzCLiopsN/0OgXrb.DyVePefNTWNBOfaOXr0LMC9OaktuhrVsJU.',
    'user',
    '2025-10-27',
    10, 27, 2025,
    'newborn',
    TRUE,
    'Sophie Harrison (Mother)',
    'Scorpio',
    'Our little miracle Liam turning 1 this October 27! Documenting his sweetest milestones, giggles, and first steps.',
    'Kensington, London',
    'Newborn Explorer',
    'https://images.unsplash.com/photo-1555252333-9f8e92e65df9?auto=format&fit=crop&w=600&q=80',
    'Verified Twin'
),
-- Toddler Category (Parent Managed): Mia & Leo (Born Oct 27, 2023 - 3 years old)
(
    'twin_toddler_01',
    'toddler.mia@velafamily.org',
    'Mia Chen (Toddler)',
    '$2b$10$YWzCLiopsN/0OgXrb.DyVePefNTWNBOfaOXr0LMC9OaktuhrVsJU.',
    'user',
    '2023-10-27',
    10, 27, 2023,
    'toddler',
    TRUE,
    'Grace Chen (Mother)',
    'Scorpio',
    'Loves bubbles, drawing with crayons, and dancing to music! Excited to meet other October 27 toddler twins.',
    'Sydney, Australia',
    'Toddler Adventurer',
    'https://images.unsplash.com/photo-1596870230751-ebdfce98ec42?auto=format&fit=crop&w=600&q=80',
    'Verified Twin'
),
-- Kids Category: Noah Vance (Born Oct 27, 2016 - 10 years old)
(
    'twin_kid_01',
    'noah.astronomy@velakids.org',
    'Noah Vance (Kid)',
    '$2b$10$YWzCLiopsN/0OgXrb.DyVePefNTWNBOfaOXr0LMC9OaktuhrVsJU.',
    'user',
    '2016-10-27',
    10, 27, 2016,
    'kid',
    TRUE,
    'David Vance (Father)',
    'Scorpio',
    'Fascinated by constellations, rockets, and robotics. Dreaming of building a telescope for my 10th birthday!',
    'San Francisco, CA',
    'Junior Astronomer',
    'https://images.unsplash.com/photo-1485546246426-74dc88dec4d9?auto=format&fit=crop&w=600&q=80',
    'Verified Twin'
),
-- Teens Category: Chloe Dupont (Born Oct 27, 2009 - 17 years old)
(
    'twin_teen_01',
    'chloe.dupont@velayouth.org',
    'Chloe Dupont (Teen)',
    '$2b$10$YWzCLiopsN/0OgXrb.DyVePefNTWNBOfaOXr0LMC9OaktuhrVsJU.',
    'user',
    '2009-10-27',
    10, 27, 2009,
    'teen',
    FALSE,
    NULL,
    'Scorpio',
    'Film photography, indie cinema, and skateboarding. Celebrating October 27 with visual art and mixtape drops.',
    'Paris, France',
    'Student & Visual Artist',
    'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?auto=format&fit=crop&w=600&q=80',
    'Verified Twin'
);

-- 2. Social Memory Posts (Image & Video Memories across All Categories & Visible Worldwide)
INSERT INTO posts (
    id, author_id, content, media_type, media_url, thumbnail_url,
    video_duration_seconds, age_category, visibility,
    music_title, music_artist, music_url, music_album_cover,
    filter_applied, overlay_text, overlay_emoji,
    memory_date, likes_count, comments_count, created_at
) VALUES
-- Video Memory from Julian (Adult)
(
    'post_01',
    'twin_02',
    'Sunset helicopter flyover above the Twelve Apostles to celebrate our October 27 twin circle! Captured this memory in 4K aerial video for all twins across the globe.',
    'video',
    'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
    'https://images.unsplash.com/photo-1508614589041-895b88991e3e?auto=format&fit=crop&w=800&q=80',
    45,
    'adult',
    'public_world',
    'Celestial Horizon (Deep House VIP)',
    'Julian Montgomery & Soundworks',
    'https://assets.mixkit.co/music/preview/mixkit-tech-house-vibes-130.mp3',
    'https://images.unsplash.com/photo-1508614589041-895b88991e3e?auto=format&fit=crop&w=300&q=80',
    'golden',
    'FLYING INTO 28 🚁✨',
    '🚁',
    '2026-10-27',
    28,
    4,
    NOW() - INTERVAL '15 minutes'
),
-- Baby Liam's First Birthday Rehearsal Video (Newborn category)
(
    'post_02',
    'twin_newborn_01',
    'Liam trying out his first birthday crown! 👑 Born on October 27, our little boy is taking his first brave steps today. Sending love to all babies and parents celebrating this milestone!',
    'video',
    'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
    'https://images.unsplash.com/photo-1519689680058-324335c77eba?auto=format&fit=crop&w=800&q=80',
    30,
    'newborn',
    'public_world',
    'Sweet Lullaby Waltz in G',
    'Vela Little Stars Chamber',
    'https://assets.mixkit.co/music/preview/mixkit-gentle-lullaby-140.mp3',
    'https://images.unsplash.com/photo-1555252333-9f8e92e65df9?auto=format&fit=crop&w=300&q=80',
    'pastel',
    'LIAM IS 1 TODAY! 👑',
    '👑',
    '2026-10-25',
    42,
    8,
    NOW() - INTERVAL '45 minutes'
),
-- Toddler Memory (Toddlers category)
(
    'post_03',
    'twin_toddler_01',
    'Mia’s organic birthday berry smash picnic! The pure joy of turning 3 on October 27 surrounded by family and nature.',
    'image',
    'https://images.unsplash.com/photo-1513151233558-d860c5398176?auto=format&fit=crop&w=800&q=80',
    NULL,
    0,
    'toddler',
    'public_world',
    'Playful Sunshine Ukulele',
    'Toddler Grooves',
    'https://assets.mixkit.co/music/preview/mixkit-ukulele-trip-498.mp3',
    'https://images.unsplash.com/photo-1596870230751-ebdfce98ec42?auto=format&fit=crop&w=300&q=80',
    'pastel',
    'BERRY SMASH 🍓🧸',
    '🍓',
    '2026-10-26',
    35,
    3,
    NOW() - INTERVAL '2 hours'
),
-- Kid Space Memory (Kids category)
(
    'post_04',
    'twin_kid_01',
    'Built our own mini Saturn V rocket to launch on our October 27 birthday! Here is the launch countdown with all my twin friends.',
    'image',
    'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=800&q=80',
    NULL,
    0,
    'kid',
    'public_world',
    'Cosmic Synth Explorer',
    'Noah Vance (Kid)',
    'https://assets.mixkit.co/music/preview/mixkit-game-level-music-689.mp3',
    'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=300&q=80',
    'neon',
    'SATURN V LAUNCH 🚀',
    '🚀',
    '2026-10-27',
    19,
    2,
    NOW() - INTERVAL '3 hours'
),
-- Teen Memory (Teens category)
(
    'post_05',
    'twin_teen_01',
    '35mm film captures from our Seine riverbank birthday jam. October 27 autumn light hits differently in Paris 🍂✨',
    'image',
    'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=800&q=80',
    NULL,
    0,
    'teen',
    'public_world',
    'Parisian Rain & Lo-Fi Beats',
    'Chloe Dupont (Teen)',
    'https://assets.mixkit.co/music/preview/mixkit-chill-bro-494.mp3',
    'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?auto=format&fit=crop&w=300&q=80',
    'vintage',
    'OCT 27 ON 35MM 🍂',
    '🍂',
    '2026-10-27',
    51,
    6,
    NOW() - INTERVAL '4 hours'
),
-- Camilla Vance Luxury Gala (Adults & All Generations)
(
    'post_06',
    'twin_01',
    'To all October 27 twins across all generations: from newborns taking their first breath to lifelong dreamers—I just reserved the courtyard at Villa San Michele for our joint milestone evening.',
    'image',
    'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&w=800&q=80',
    NULL,
    0,
    'all',
    'public_world',
    'Scorpio Solstice Suite (Cello & Strings)',
    'Elena Rostova (Oct 27 Twin)',
    'https://assets.mixkit.co/music/preview/mixkit-classical-piano-elegance-228.mp3',
    'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=300&q=80',
    'celestial',
    'VILLA SAN MICHELE 🥂',
    '🥂',
    '2026-10-27',
    64,
    11,
    NOW() - INTERVAL '6 hours'
);

-- 3. Post Comments
INSERT INTO post_comments (id, post_id, author_id, content, created_at) VALUES
(
    'c_01',
    'post_01',
    'usr_senzo_001',
    'Incredible cinematography Julian. The aerial perspective on our birthday is unmatched.',
    NOW() - INTERVAL '10 minutes'
),
(
    'c_02',
    'post_01',
    'twin_01',
    'Breathtaking! Counting down until the evening gala.',
    NOW() - INTERVAL '5 minutes'
),
(
    'c_03',
    'post_02',
    'usr_senzo_001',
    'Happy 1st birthday little Liam! Welcome to the October 27 family.',
    NOW() - INTERVAL '30 minutes'
),
(
    'c_04',
    'post_02',
    'twin_03',
    'What a precious video! Sending love from New York.',
    NOW() - INTERVAL '20 minutes'
);

-- 4. Post Likes
INSERT INTO post_likes (post_id, user_id) VALUES
('post_01', 'usr_senzo_001'),
('post_01', 'twin_01'),
('post_01', 'twin_03'),
('post_02', 'usr_senzo_001'),
('post_02', 'twin_01'),
('post_02', 'twin_02'),
('post_02', 'twin_toddler_01'),
('post_03', 'usr_senzo_001'),
('post_04', 'twin_teen_01'),
('post_05', 'twin_03'),
('post_06', 'usr_senzo_001'),
('post_06', 'twin_02');

-- 5. Celebrity Artists Roster
INSERT INTO celebrity_artists (
    id, name, stage_title, genre, bio, avatar_url, cover_image_url,
    booking_tier, booking_fee_estimate, is_vela_partner, rating, sample_track_title, performance_duration, location
) VALUES
(
    'art_black_coffee',
    'Black Coffee',
    'Grammy-Winning DJ & Producer',
    'Deep & Afro House',
    'Pioneer of modern Afro-House and Grammy Award winner. Known for legendary sunrise and sunset headline sets at Hï Ibiza, Coachella, and private island galas.',
    'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&w=600&q=80',
    'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&w=800&q=80',
    'global_icon',
    '$85,000 (Pooled)',
    TRUE,
    5.0,
    'Drive (Vela Twin VIP Edit)',
    '90 min headline sunset set',
    'Durban & Ibiza'
),
(
    'art_john_legend',
    'John Legend',
    'EGOT Multi-Platinum Icon',
    'Soul & R&B',
    'Critically acclaimed 12-time Grammy winner and EGOT recipient. Delivers intimate grand piano acoustic performances and heartfelt celebration anthems.',
    'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=600&q=80',
    'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=800&q=80',
    'global_icon',
    '$120,000 (Pooled)',
    TRUE,
    4.9,
    'All of Me (Acoustic Birthday Suite)',
    '60 min live piano & vocal set',
    'Los Angeles & New York'
),
(
    'art_peggy_gou',
    'Peggy Gou',
    'International Electronic Headliner',
    'Melodic Techno & House',
    'Berlin-based electronic phenomenon and festival headliner known for electrifying dance floors with stylish club euphoria and vibrant production.',
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80',
    'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&w=800&q=80',
    'marquee_star',
    '$65,000 (Pooled)',
    TRUE,
    4.9,
    '(It Goes Like) Nanana - Twin Club VIP',
    '75 min high-energy set',
    'Berlin & Seoul'
),
(
    'art_london_strings',
    'The London Royal Chamber Strings',
    'Premier Symphonic Ensemble',
    'Cinematic & Classical',
    'An eight-piece elite string octet from the Royal Academy of Music, specializing in contemporary orchestral reimaginations of modern anthems and starlit serenades.',
    'https://images.unsplash.com/photo-1511192336575-5a79af67a629?auto=format&fit=crop&w=600&q=80',
    'https://images.unsplash.com/photo-1465847899084-d164df4dedc6?auto=format&fit=crop&w=800&q=80',
    'marquee_star',
    '$18,000 (Pooled)',
    TRUE,
    4.9,
    'Scorpio Celestial Symphony No. 1',
    '90 min orchestral performance',
    'London'
),
(
    'art_major_league',
    'Major League DJz',
    'Amapiano Balcony Pioneers',
    'Amapiano & Afrobeat',
    'Twin brother DJ duo responsible for bringing South African Amapiano culture to the global stage with infectious percussion, deep log drums, and unmatched charisma.',
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=600&q=80',
    'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=800&q=80',
    'marquee_star',
    '$45,000 (Pooled)',
    TRUE,
    4.8,
    'Balcony Mix: October 27 Edition',
    '90 min sunset balcony session',
    'Johannesburg & London'
),
(
    'art_acoustic_paris',
    'Chloe Dupont & Seine Collective',
    'Parisian Indie Chamber',
    'Indie & Lo-Fi Acoustic',
    'Acoustic French indie ensemble blending cello, vintage Fender Rhodes, and gentle French vocals for intimate garden and rooftop gatherings.',
    'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?auto=format&fit=crop&w=600&q=80',
    'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&w=800&q=80',
    'notable',
    '$8,000 (Pooled)',
    TRUE,
    4.9,
    'Autumn by the Seine (Unplugged)',
    '60 min acoustic set',
    'Paris'
);

-- 6. Events Across Categories with Artist Bookings & Vela Sponsorships
INSERT INTO events (
    id, title, host_id, celebration_date, event_time, venue, city,
    dress_code, age_category, description, cover_image, max_attendees,
    headline_artist_id, headline_artist_name, headline_artist_genre, headline_artist_avatar,
    headline_artist_set_time, is_vela_sponsored, sponsor_grant_details,
    artist_booking_status, artist_booking_fee, artist_crowdfunded_amount
) VALUES
(
    'evt_01',
    'The Annual Solstice & Twin Gala',
    'twin_01',
    'Saturday, October 27, 2026',
    '20:00 - 02:00',
    'The Glasshouse Penthouse',
    'Cape Town Waterfront',
    'Black Tie with Celestial Accents',
    'adult',
    'An exclusive evening strictly reserved for adult members born on October 27 and their chosen companions. Featuring bespoke cocktail pairing, private live string quartet, and skyline views.',
    'https://images.unsplash.com/photo-1519671482749-fd09be7ccebf?auto=format&fit=crop&w=800&q=80',
    50,
    'art_black_coffee',
    'Black Coffee',
    'Deep & Afro House',
    'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&w=600&q=80',
    '23:30 - 01:30 (Midnight Headline Set)',
    TRUE,
    'Complimentary guest celebrity headliner fully sponsored by the Vela Society Executive Concierge.',
    'vela_sponsored',
    '$85,000',
    85000
),
(
    'evt_02',
    'Vela Little Stars: Babies & Toddlers Birthday Picnic',
    'twin_newborn_01',
    'Sunday, October 28, 2026',
    '10:00 - 13:00',
    'Kensington Gardens Pavilion',
    'London',
    'Garden Pastel & Playful',
    'newborn',
    'A gentle sensory celebration for newborns, babies, toddlers and their loving parents born on October 27. Featuring baby sensory music, safe soft-play areas, and commemorative memory portraits.',
    'https://images.unsplash.com/photo-1502086223501-7ea6ecd79368?auto=format&fit=crop&w=800&q=80',
    35,
    NULL,
    NULL,
    NULL,
    NULL,
    NULL,
    FALSE,
    NULL,
    'none',
    NULL,
    0
),
(
    'evt_03',
    'Young Explorers Planetarium Night',
    'twin_kid_01',
    'Friday, October 26, 2026',
    '16:30 - 19:30',
    'Morrison Planetarium',
    'San Francisco',
    'Space Cadet Casual',
    'kid',
    'Interactive astronomy workshop, star constellation mapping, and birthday cake under the stars for our 4-12 year old birthday twins.',
    'https://images.unsplash.com/photo-1506703719100-a0f3a48c0f86?auto=format&fit=crop&w=800&q=80',
    40,
    'art_london_strings',
    'The London Royal Chamber Strings',
    'Cinematic & Classical',
    'https://images.unsplash.com/photo-1511192336575-5a79af67a629?auto=format&fit=crop&w=600&q=80',
    '18:00 - 19:00 (Starlight Symphony)',
    FALSE,
    'Funded collaboratively by the twin parents circle.',
    'confirmed',
    '$18,000',
    18000
),
(
    'evt_04',
    'Global Vela World Gathering (All Ages)',
    'usr_senzo_001',
    'Saturday, October 27, 2026',
    '15:00 - 23:00',
    'Vela Worldwide Live Stream & Decentralized Hubs',
    'Global / Worldwide',
    'Celebratory Gold & White',
    'all',
    'The premier universal gathering connecting every single soul born on October 27 across the globe. Live memory broadcasting, interactive twin chats, and worldwide birthday toast.',
    'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=800&q=80',
    1000,
    'art_john_legend',
    'John Legend',
    'Soul & R&B',
    'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=600&q=80',
    '21:00 Worldwide Birthday Anthem',
    TRUE,
    'Global Twin Anthem live grand piano performance sponsored by the Vela Global Patron Fund.',
    'vela_sponsored',
    '$120,000',
    120000
);

-- 7. Event Artist Bookings
INSERT INTO event_artist_bookings (id, event_id, artist_id, requested_by_user_id, is_vela_sponsored, sponsorship_status, booking_notes) VALUES
('eab_01', 'evt_01', 'art_black_coffee', 'twin_01', TRUE, 'confirmed', 'VIP guest headline set sponsored by Vela Concierge.'),
('eab_02', 'evt_04', 'art_john_legend', 'usr_senzo_001', TRUE, 'confirmed', 'Global live stream acoustic performance sponsored by Vela Patron Fund.'),
('eab_03', 'evt_03', 'art_london_strings', 'twin_kid_01', FALSE, 'confirmed', 'Private planetarium string octet funded by twin attendees.');

-- 8. Event Attendees
INSERT INTO event_attendees (event_id, user_id) VALUES
('evt_01', 'usr_senzo_001'),
('evt_01', 'twin_01'),
('evt_01', 'twin_02'),
('evt_02', 'twin_newborn_01'),
('evt_02', 'twin_toddler_01'),
('evt_03', 'twin_kid_01'),
('evt_04', 'usr_senzo_001'),
('evt_04', 'twin_01'),
('evt_04', 'twin_02'),
('evt_04', 'twin_03'),
('evt_04', 'twin_newborn_01'),
('evt_04', 'twin_toddler_01'),
('evt_04', 'twin_kid_01'),
('evt_04', 'twin_teen_01');

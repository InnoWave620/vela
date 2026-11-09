-- =============================================================================
-- VELA — THE BIRTHDAY TWIN SOCIETY & GLOBAL MEMORY NETWORK
-- PostgreSQL Production Schema
-- Supports Global Visibility, Video/Image Memories, and All Age Categories:
-- (Newborns, Toddlers, Kids, Teens, Adults, Everyone)
-- =============================================================================

-- 1. Enable UUID extension if available
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. Clean teardown for migration
DROP TABLE IF EXISTS event_artist_bookings CASCADE;
DROP TABLE IF EXISTS celebrity_artists CASCADE;
DROP TABLE IF EXISTS twin_invitations CASCADE;
DROP TABLE IF EXISTS event_attendees CASCADE;
DROP TABLE IF EXISTS events CASCADE;
DROP TABLE IF EXISTS post_comments CASCADE;
DROP TABLE IF EXISTS post_likes CASCADE;
DROP TABLE IF EXISTS posts CASCADE;
DROP TABLE IF EXISTS users CASCADE;

-- 2. Users Table (Core Entity with Birthday & Age Categories)
CREATE TABLE IF NOT EXISTS users (
    id VARCHAR(64) PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(32) DEFAULT 'user' NOT NULL,
    date_of_birth DATE NOT NULL,
    birth_month INT NOT NULL CHECK (birth_month BETWEEN 1 AND 12),
    birth_day INT NOT NULL CHECK (birth_day BETWEEN 1 AND 31),
    birth_year INT NOT NULL,
    age_category VARCHAR(32) DEFAULT 'adult' NOT NULL CHECK (age_category IN ('newborn', 'toddler', 'kid', 'teen', 'adult', 'all')),
    is_parent_managed BOOLEAN DEFAULT FALSE NOT NULL,
    parent_guardian_name VARCHAR(255),
    zodiac_sign VARCHAR(32),
    bio TEXT,
    location VARCHAR(255),
    occupation VARCHAR(255),
    avatar_url TEXT,
    membership_tier VARCHAR(64) DEFAULT 'Founding Member',
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- CRITICAL PERFORMANCE INDEXES:
-- Enables sub-millisecond O(log N) birthday twin matching across millions of records
CREATE INDEX IF NOT EXISTS idx_users_birthday ON users(birth_month, birth_day);
CREATE INDEX IF NOT EXISTS idx_users_age_category ON users(age_category);
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);

-- 3. Social Memories & Feed Posts Table
-- Supports image & video memories, global visibility, and age categories
CREATE TABLE IF NOT EXISTS posts (
    id VARCHAR(64) PRIMARY KEY,
    author_id VARCHAR(64) NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    media_type VARCHAR(16) DEFAULT 'image' NOT NULL CHECK (media_type IN ('image', 'video', 'none')),
    media_url TEXT,
    thumbnail_url TEXT,
    video_duration_seconds INT DEFAULT 0,
    age_category VARCHAR(32) DEFAULT 'all' NOT NULL CHECK (age_category IN ('all', 'newborn', 'toddler', 'kid', 'teen', 'adult')),
    visibility VARCHAR(32) DEFAULT 'public_world' NOT NULL CHECK (visibility IN ('public_world', 'twins_only')),
    music_title VARCHAR(255),
    music_artist VARCHAR(255),
    music_url TEXT,
    music_album_cover TEXT,
    filter_applied VARCHAR(64) DEFAULT 'normal',
    overlay_text TEXT,
    overlay_emoji VARCHAR(32),
    memory_date DATE,
    likes_count INT DEFAULT 0 NOT NULL,
    comments_count INT DEFAULT 0 NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_posts_author ON posts(author_id);
CREATE INDEX IF NOT EXISTS idx_posts_visibility ON posts(visibility);
CREATE INDEX IF NOT EXISTS idx_posts_category ON posts(age_category);
CREATE INDEX IF NOT EXISTS idx_posts_created ON posts(created_at DESC);

-- 4. Post Likes Table (Many-to-Many)
CREATE TABLE IF NOT EXISTS post_likes (
    post_id VARCHAR(64) NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
    user_id VARCHAR(64) NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    PRIMARY KEY (post_id, user_id)
);

-- 5. Post Comments Table
CREATE TABLE IF NOT EXISTS post_comments (
    id VARCHAR(64) PRIMARY KEY,
    post_id VARCHAR(64) NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
    author_id VARCHAR(64) NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_comments_post ON post_comments(post_id);

-- 6. Celebrity Artists & Performers Roster Table
CREATE TABLE IF NOT EXISTS celebrity_artists (
    id VARCHAR(64) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    stage_title VARCHAR(255),
    genre VARCHAR(100) NOT NULL,
    bio TEXT NOT NULL,
    avatar_url TEXT NOT NULL,
    cover_image_url TEXT,
    booking_tier VARCHAR(64) DEFAULT 'marquee_star' NOT NULL CHECK (booking_tier IN ('emerging', 'notable', 'marquee_star', 'global_icon')),
    booking_fee_estimate VARCHAR(64) NOT NULL,
    is_vela_partner BOOLEAN DEFAULT TRUE NOT NULL,
    rating NUMERIC(2,1) DEFAULT 4.9 NOT NULL,
    sample_track_title VARCHAR(255),
    performance_duration VARCHAR(64) DEFAULT '60 min headline set',
    location VARCHAR(255),
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- 7. Events & Joint Celebrations Table
CREATE TABLE IF NOT EXISTS events (
    id VARCHAR(64) PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    host_id VARCHAR(64) REFERENCES users(id) ON DELETE SET NULL,
    celebration_date VARCHAR(64) NOT NULL,
    event_time VARCHAR(64) NOT NULL,
    venue VARCHAR(255) NOT NULL,
    city VARCHAR(255) NOT NULL,
    dress_code VARCHAR(255),
    age_category VARCHAR(32) DEFAULT 'all' NOT NULL CHECK (age_category IN ('all', 'newborn', 'toddler', 'kid', 'teen', 'adult')),
    description TEXT,
    cover_image TEXT,
    max_attendees INT DEFAULT 50 NOT NULL,
    headline_artist_id VARCHAR(64) REFERENCES celebrity_artists(id) ON DELETE SET NULL,
    headline_artist_name VARCHAR(255),
    headline_artist_genre VARCHAR(100),
    headline_artist_avatar TEXT,
    headline_artist_set_time VARCHAR(100),
    is_vela_sponsored BOOLEAN DEFAULT FALSE NOT NULL,
    sponsor_grant_details TEXT,
    artist_booking_status VARCHAR(64) DEFAULT 'none' NOT NULL CHECK (artist_booking_status IN ('none', 'confirmed', 'pending_inquiry', 'vela_sponsored')),
    artist_booking_fee VARCHAR(64),
    artist_crowdfunded_amount INT DEFAULT 0 NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_events_category ON events(age_category);
CREATE INDEX IF NOT EXISTS idx_events_sponsored ON events(is_vela_sponsored);

-- 8. Event Artist Bookings & Sponsorships Table
CREATE TABLE IF NOT EXISTS event_artist_bookings (
    id VARCHAR(64) PRIMARY KEY,
    event_id VARCHAR(64) NOT NULL REFERENCES events(id) ON DELETE CASCADE,
    artist_id VARCHAR(64) NOT NULL REFERENCES celebrity_artists(id) ON DELETE CASCADE,
    requested_by_user_id VARCHAR(64) REFERENCES users(id) ON DELETE SET NULL,
    is_vela_sponsored BOOLEAN DEFAULT FALSE NOT NULL,
    sponsorship_status VARCHAR(64) DEFAULT 'confirmed' NOT NULL CHECK (sponsorship_status IN ('requested', 'approved', 'confirmed', 'rejected')),
    booking_notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- 9. Event RSVPs / Attendees Table (Many-to-Many)
CREATE TABLE IF NOT EXISTS event_attendees (
    event_id VARCHAR(64) NOT NULL REFERENCES events(id) ON DELETE CASCADE,
    user_id VARCHAR(64) NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    PRIMARY KEY (event_id, user_id)
);

-- 10. Birthday Twin Invitations Table
CREATE TABLE IF NOT EXISTS twin_invitations (
    id VARCHAR(64) PRIMARY KEY,
    sender_id VARCHAR(64) NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    receiver_id VARCHAR(64) NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    status VARCHAR(32) DEFAULT 'sent' NOT NULL CHECK (status IN ('sent', 'accepted', 'declined')),
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_invitations_receiver ON twin_invitations(receiver_id);
CREATE INDEX IF NOT EXISTS idx_invitations_sender ON twin_invitations(sender_id);

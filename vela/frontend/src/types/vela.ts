export type AgeCategory = 'all' | 'newborn' | 'toddler' | 'kid' | 'teen' | 'adult';

export type MediaType = 'image' | 'video' | 'none';

export type PostVisibility = 'public_world' | 'twins_only';

export type MediaFilterType =
  | 'normal'
  | 'celestial'
  | 'vintage'
  | 'golden'
  | 'monochrome'
  | 'pastel'
  | 'neon';

export interface MusicTrack {
  id: string;
  title: string;
  artist: string;
  genre: string;
  duration: string;
  audioUrl: string;
  albumCover: string;
}

export interface VelaUser {
  id: string;
  name: string;
  email: string;
  avatar: string;
  dateOfBirth: string; // ISO string: YYYY-MM-DD
  birthDay: number;
  birthMonth: number;
  birthYear: number;
  ageCategory: AgeCategory;
  isParentManaged?: boolean;
  parentGuardianName?: string;
  zodiacSign: string;
  bio: string;
  location: string;
  occupation: string;
  membershipTier: 'Founding Member' | 'Black Diamond' | 'Verified Twin' | 'Guest Explorer';
  twinsConnected: number;
  eventsAttended: number;
  photos: string[];
}

export interface BirthdayTwin {
  id: string;
  name: string;
  age: number;
  avatar: string;
  birthDate: string;
  location: string;
  distanceMiles: number;
  zodiacSign: string;
  bio: string;
  occupation: string;
  ageCategory: AgeCategory;
  isParentManaged?: boolean;
  parentGuardianName?: string;
  mutualInterests: string[];
  isInvited: boolean;
  matchScore: number;
}

export interface PostComment {
  id: string;
  authorName: string;
  authorAvatar: string;
  content: string;
  createdAt: string;
}

export interface FeedPost {
  id: string;
  authorId: string;
  authorName: string;
  authorAvatar: string;
  authorBirthdayBadge: string;
  authorCategory?: AgeCategory;
  isParentManaged?: boolean;
  parentGuardianName?: string;
  content: string;
  mediaType: MediaType;
  mediaUrl?: string;
  thumbnailUrl?: string;
  videoDurationSeconds?: number;
  ageCategory: AgeCategory;
  visibility: PostVisibility;
  musicTitle?: string;
  musicArtist?: string;
  musicUrl?: string;
  musicAlbumCover?: string;
  filterApplied?: MediaFilterType;
  overlayText?: string;
  overlayEmoji?: string;
  likesCount: number;
  commentsCount: number;
  isLiked: boolean;
  createdAt: string;
  comments: PostComment[];
}

export interface EventAttendee {
  id: string;
  name: string;
  avatar: string;
  exactMatch: boolean;
}

export type ArtistBookingTier = 'emerging' | 'notable' | 'marquee_star' | 'global_icon';
export type ArtistBookingStatus = 'none' | 'confirmed' | 'pending_inquiry' | 'vela_sponsored';

export interface CelebrityArtist {
  id: string;
  name: string;
  stageTitle?: string;
  genre: string;
  bio: string;
  avatar: string;
  coverImage?: string;
  bookingTier: ArtistBookingTier;
  bookingFeeEstimate: string;
  isVelaPartner: boolean;
  rating: number;
  sampleTrackTitle?: string;
  performanceDuration?: string;
  location?: string;
}

export interface HeadlineArtistInfo {
  id?: string;
  name: string;
  genre: string;
  avatar: string;
  setTime?: string;
  isVelaSponsored: boolean;
  sponsorGrantDetails?: string;
  bookingStatus: ArtistBookingStatus;
  bookingFee?: string;
  crowdfundedAmount?: number;
}

export interface VelaEvent {
  id: string;
  title: string;
  hostName: string;
  celebrationDate: string;
  time: string;
  venue: string;
  city: string;
  dressCode: string;
  ageCategory: AgeCategory;
  description: string;
  coverImage: string;
  attendees: EventAttendee[];
  maxAttendees: number;
  isJoined: boolean;
  headlineArtist?: HeadlineArtistInfo;
  isVelaSponsored?: boolean;
  sponsorGrantDetails?: string;
}

export interface BirthdayCountdown {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  formattedDate: string;
  isToday: boolean;
}

import React, { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react';
import {
  VelaUser,
  BirthdayTwin,
  FeedPost,
  VelaEvent,
  BirthdayCountdown,
  AgeCategory,
  PostVisibility,
  MediaType,
} from '../types/vela';
import { authService } from '../services/authService';
import { twinsService } from '../services/twinsService';
import { feedService } from '../services/feedService';
import { eventsService } from '../services/eventsService';
import { calculateBirthdayCountdown, getZodiacSign } from '../utils/dateUtils';
import { INITIAL_USER, GUEST_USER, MOCK_TWINS, MOCK_POSTS, MOCK_EVENTS } from '../services/mockData';

export type VelaTab = 'feed' | 'twins' | 'events' | 'profile';

export interface VelaContextType {
  user: VelaUser;
  twins: BirthdayTwin[];
  posts: FeedPost[];
  events: VelaEvent[];
  countdown: BirthdayCountdown;
  isAuthenticated: boolean;
  isGuest: boolean;
  isLoading: boolean;
  activeTab: VelaTab;
  feedCategory: AgeCategory;
  twinsCategory: AgeCategory;
  eventsCategory: AgeCategory;
  feedVisibility: PostVisibility;
  authModalVisible: boolean;
  authPromptReason: string;
  setActiveTab: (tab: VelaTab) => void;
  setFeedCategory: (category: AgeCategory) => void;
  setTwinsCategory: (category: AgeCategory) => void;
  setEventsCategory: (category: AgeCategory) => void;
  setFeedVisibility: (vis: PostVisibility) => void;
  openAuthModal: (reason?: string) => void;
  closeAuthModal: () => void;
  requireAuth: (actionReason: string, callback?: () => void) => boolean;
  login: (email: string, pass: string) => Promise<void>;
  register: (email: string, name: string, dob: string, pass?: string) => Promise<void>;
  updateBirthday: (dob: string) => void;
  updateAvatar: (avatarUrl: string) => void;
  updateProfile: (data: Partial<VelaUser>) => void;
  logout: () => void;
  inviteTwin: (twinId: string) => Promise<void>;
  createPost: (
    content: string,
    options?: {
      mediaType?: MediaType;
      mediaUrl?: string;
      thumbnailUrl?: string;
      videoDurationSeconds?: number;
      ageCategory?: AgeCategory;
      visibility?: PostVisibility;
      musicTitle?: string;
      musicArtist?: string;
      musicUrl?: string;
      musicAlbumCover?: string;
      filterApplied?: import('../types/vela').MediaFilterType;
      overlayText?: string;
      overlayEmoji?: string;
    }
  ) => Promise<void>;
  toggleLikePost: (postId: string) => Promise<void>;
  addComment: (postId: string, text: string) => Promise<void>;
  toggleJoinEvent: (eventId: string) => Promise<void>;
  updateEvent: (updatedEvent: VelaEvent) => void;
  bookEventArtist: (
    eventId: string,
    artistId: string,
    isVelaSponsored?: boolean,
    notes?: string
  ) => Promise<VelaEvent | null>;
}

const VelaContext = createContext<VelaContextType | undefined>(undefined);

export const VelaProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<VelaUser>(INITIAL_USER);
  const [twins, setTwins] = useState<BirthdayTwin[]>(MOCK_TWINS);
  const [posts, setPosts] = useState<FeedPost[]>(MOCK_POSTS);
  const [events, setEvents] = useState<VelaEvent[]>(MOCK_EVENTS);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(true);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<VelaTab>('feed');

  // Category & Visibility filter state
  const [feedCategory, setFeedCategory] = useState<AgeCategory>('all');
  const [twinsCategory, setTwinsCategory] = useState<AgeCategory>('all');
  const [eventsCategory, setEventsCategory] = useState<AgeCategory>('all');
  const [feedVisibility, setFeedVisibility] = useState<PostVisibility>('public_world');
  const [authModalVisible, setAuthModalVisible] = useState<boolean>(false);
  const [authPromptReason, setAuthPromptReason] = useState<string>(
    'to unlock full member privileges within the society'
  );

  const isGuest = !isAuthenticated;

  const openAuthModal = (reason?: string) => {
    if (reason) setAuthPromptReason(reason);
    setAuthModalVisible(true);
  };

  const closeAuthModal = () => {
    setAuthModalVisible(false);
  };

  const requireAuth = (actionReason: string, callback?: () => void): boolean => {
    if (isAuthenticated) {
      callback?.();
      return true;
    }
    openAuthModal(actionReason);
    return false;
  };

  const updateAvatar = (avatarUrl: string) => {
    setUser((prev) => ({
      ...prev,
      avatar: avatarUrl,
      photos: prev.photos.includes(avatarUrl) ? prev.photos : [avatarUrl, ...prev.photos],
    }));
  };

  const updateProfile = (data: Partial<VelaUser>) => {
    setUser((prev) => ({
      ...prev,
      ...data,
    }));
  };

  const [countdown, setCountdown] = useState<BirthdayCountdown>(() =>
    calculateBirthdayCountdown(INITIAL_USER.dateOfBirth)
  );

  // Live countdown ticker
  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown(calculateBirthdayCountdown(user.dateOfBirth));
    }, 1000);
    return () => clearInterval(timer);
  }, [user.dateOfBirth]);

  // Load feed when dob, feedCategory, or feedVisibility changes
  const loadFeedData = useCallback(async (dob: string, cat: AgeCategory, vis: PostVisibility) => {
    const data = await feedService.getFeedPosts(dob, cat, vis);
    setPosts(data);
  }, []);

  // Load twins when dob or twinsCategory changes
  const loadTwinsData = useCallback(async (dob: string, cat: AgeCategory) => {
    const data = await twinsService.getBirthdayTwins(dob, cat);
    setTwins(data);
  }, []);

  // Load events when dob or eventsCategory changes
  const loadEventsData = useCallback(async (dob: string, cat: AgeCategory) => {
    const data = await eventsService.getUpcomingEvents(dob, cat);
    setEvents(data);
  }, []);

  // Sync feed on changes
  useEffect(() => {
    loadFeedData(user.dateOfBirth, feedCategory, feedVisibility);
  }, [user.dateOfBirth, feedCategory, feedVisibility, loadFeedData]);

  // Sync twins on changes
  useEffect(() => {
    loadTwinsData(user.dateOfBirth, twinsCategory);
  }, [user.dateOfBirth, twinsCategory, loadTwinsData]);

  // Sync events on changes
  useEffect(() => {
    loadEventsData(user.dateOfBirth, eventsCategory);
  }, [user.dateOfBirth, eventsCategory, loadEventsData]);

  const login = async (email: string, pass: string) => {
    setIsLoading(true);
    try {
      const loggedUser = await authService.login(email, pass);
      setUser(loggedUser);
      setIsAuthenticated(true);
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (email: string, name: string, dob: string, pass?: string) => {
    setIsLoading(true);
    try {
      const newUser = await authService.register(email, name, dob, pass);
      setUser(newUser);
      setIsAuthenticated(true);
    } finally {
      setIsLoading(false);
    }
  };

  const updateBirthday = (dob: string) => {
    const parts = dob.split('-');
    const year = parseInt(parts[0], 10);
    const month = parseInt(parts[1], 10);
    const day = parseInt(parts[2], 10);
    const zodiac = getZodiacSign(day, month);

    setUser((prev) => ({
      ...prev,
      dateOfBirth: dob,
      birthYear: year,
      birthMonth: month,
      birthDay: day,
      zodiacSign: zodiac,
    }));
  };

  const logout = () => {
    setIsAuthenticated(false);
    setUser(GUEST_USER);
  };

  const inviteTwin = async (twinId: string) => {
    await twinsService.inviteTwin(twinId);
    setTwins((prev) =>
      prev.map((t) => (t.id === twinId ? { ...t, isInvited: true } : t))
    );
  };

  const createPost = async (
    content: string,
    options?: {
      mediaType?: MediaType;
      mediaUrl?: string;
      thumbnailUrl?: string;
      videoDurationSeconds?: number;
      ageCategory?: AgeCategory;
      visibility?: PostVisibility;
      musicTitle?: string;
      musicArtist?: string;
      musicUrl?: string;
      musicAlbumCover?: string;
      filterApplied?: import('../types/vela').MediaFilterType;
      overlayText?: string;
      overlayEmoji?: string;
    }
  ) => {
    const newPost = await feedService.createPost(
      {
        id: user.id,
        name: user.name,
        avatar: user.avatar,
        ageCategory: user.ageCategory,
        isParentManaged: user.isParentManaged,
        parentGuardianName: user.parentGuardianName,
      },
      content,
      options
    );
    setPosts((prev) => [newPost, ...prev]);
  };

  const toggleLikePost = async (postId: string) => {
    const updated = await feedService.toggleLike(postId);
    if (updated) {
      setPosts((prev) => prev.map((p) => (p.id === postId ? updated : p)));
    }
  };

  const addComment = async (postId: string, text: string) => {
    const updated = await feedService.addComment(
      postId,
      { name: user.name, avatar: user.avatar },
      text
    );
    if (updated) {
      setPosts((prev) => prev.map((p) => (p.id === postId ? updated : p)));
    }
  };

  const toggleJoinEvent = async (eventId: string) => {
    const updated = await eventsService.toggleJoinEvent(eventId, {
      id: user.id,
      name: user.name,
      avatar: user.avatar,
    });
    if (updated) {
      setEvents((prev) => prev.map((e) => (e.id === eventId ? updated : e)));
    }
  };

  const updateEvent = (updatedEvent: VelaEvent) => {
    setEvents((prev) => prev.map((e) => (e.id === updatedEvent.id ? updatedEvent : e)));
  };

  const bookEventArtist = async (
    eventId: string,
    artistId: string,
    isVelaSponsored: boolean = false,
    notes?: string
  ): Promise<VelaEvent | null> => {
    const updated = await eventsService.bookArtistForEvent(eventId, artistId, isVelaSponsored, notes);
    if (updated) {
      updateEvent(updated);
    }
    return updated;
  };

  const value = useMemo(
    () => ({
      user,
      twins,
      posts,
      events,
      countdown,
      isAuthenticated,
      isGuest,
      isLoading,
      activeTab,
      feedCategory,
      twinsCategory,
      eventsCategory,
      feedVisibility,
      authModalVisible,
      authPromptReason,
      setActiveTab,
      setFeedCategory,
      setTwinsCategory,
      setEventsCategory,
      setFeedVisibility,
      openAuthModal,
      closeAuthModal,
      requireAuth,
      login,
      register,
      updateBirthday,
      updateAvatar,
      updateProfile,
      logout,
      inviteTwin,
      createPost,
      toggleLikePost,
      addComment,
      toggleJoinEvent,
      updateEvent,
      bookEventArtist,
    }),
    [
      user,
      twins,
      posts,
      events,
      countdown,
      isAuthenticated,
      isGuest,
      isLoading,
      activeTab,
      feedCategory,
      twinsCategory,
      eventsCategory,
      feedVisibility,
      authModalVisible,
      authPromptReason,
    ]
  );

  return <VelaContext.Provider value={value}>{children}</VelaContext.Provider>;
};

export function useVela(): VelaContextType {
  const context = useContext(VelaContext);
  if (!context) {
    throw new Error('useVela must be used within a VelaProvider');
  }
  return context;
}

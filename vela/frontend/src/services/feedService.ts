import { apiClient } from './api/client';
import { FeedPost, AgeCategory, PostVisibility, MediaType } from '../types/vela';
import { MOCK_POSTS } from './mockData';

let postsCache: FeedPost[] = [...MOCK_POSTS];

export const feedService = {
  async getFeedPosts(
    dateOfBirth?: string,
    category: AgeCategory = 'all',
    visibility?: PostVisibility
  ): Promise<FeedPost[]> {
    try {
      const params = new URLSearchParams();
      if (dateOfBirth) params.append('dob', dateOfBirth);
      if (category && category !== 'all') params.append('category', category);
      if (visibility && visibility !== 'public_world') params.append('visibility', visibility);

      const qs = params.toString() ? `?${params.toString()}` : '';
      const data = await apiClient.get<FeedPost[]>(`/feed${qs}`);
      if (Array.isArray(data) && data.length > 0) {
        postsCache = data;
        return data;
      }
      return this.filterLocal(postsCache, category, visibility);
    } catch {
      return this.filterLocal(postsCache, category, visibility);
    }
  },

  filterLocal(posts: FeedPost[], category: AgeCategory, visibility?: PostVisibility): FeedPost[] {
    return posts.filter((post) => {
      const matchCat = category === 'all' || post.ageCategory === category || post.ageCategory === 'all';
      const matchVis = !visibility || post.visibility === visibility || post.visibility === 'public_world';
      return matchCat && matchVis;
    });
  },

  async createPost(
    user: { id: string; name: string; avatar: string; ageCategory?: AgeCategory; isParentManaged?: boolean; parentGuardianName?: string },
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
  ): Promise<FeedPost> {
    const mediaType = options?.mediaType || (options?.mediaUrl ? 'image' : 'none');
    const ageCategory = options?.ageCategory || user.ageCategory || 'all';
    const visibility = options?.visibility || 'public_world';

    const newPost: FeedPost = {
      id: `post_${Date.now()}`,
      authorId: user.id,
      authorName: user.name,
      authorAvatar: user.avatar,
      authorBirthdayBadge: 'Birthday Twin',
      authorCategory: user.ageCategory || 'adult',
      isParentManaged: user.isParentManaged,
      parentGuardianName: user.parentGuardianName,
      content,
      mediaType,
      mediaUrl: options?.mediaUrl,
      thumbnailUrl: options?.thumbnailUrl,
      videoDurationSeconds: options?.videoDurationSeconds,
      ageCategory,
      visibility,
      musicTitle: options?.musicTitle,
      musicArtist: options?.musicArtist,
      musicUrl: options?.musicUrl,
      musicAlbumCover: options?.musicAlbumCover,
      filterApplied: options?.filterApplied || 'normal',
      overlayText: options?.overlayText,
      overlayEmoji: options?.overlayEmoji,
      likesCount: 0,
      commentsCount: 0,
      isLiked: false,
      createdAt: 'Just now',
      comments: [],
    };

    try {
      const response = await apiClient.post<FeedPost>('/feed', newPost);
      if (response?.id) {
        postsCache = [response, ...postsCache];
        return response;
      }
    } catch {
      // Mock fallback
    }

    postsCache = [newPost, ...postsCache];
    return newPost;
  },

  async toggleLike(postId: string): Promise<FeedPost | null> {
    try {
      await apiClient.post(`/feed/${postId}/like`);
    } catch {
      // Mock fallback
    }

    postsCache = postsCache.map((post) => {
      if (post.id === postId) {
        const isLiked = !post.isLiked;
        return {
          ...post,
          isLiked,
          likesCount: isLiked ? post.likesCount + 1 : Math.max(0, post.likesCount - 1),
        };
      }
      return post;
    });

    return postsCache.find((p) => p.id === postId) || null;
  },

  async addComment(
    postId: string,
    author: { name: string; avatar: string },
    commentText: string
  ): Promise<FeedPost | null> {
    const newComment = {
      id: `c_${Date.now()}`,
      authorName: author.name,
      authorAvatar: author.avatar,
      content: commentText,
      createdAt: 'Just now',
    };

    try {
      await apiClient.post(`/feed/${postId}/comments`, newComment);
    } catch {
      // Mock fallback
    }

    postsCache = postsCache.map((post) => {
      if (post.id === postId) {
        return {
          ...post,
          commentsCount: post.commentsCount + 1,
          comments: [...(post.comments || []), newComment],
        };
      }
      return post;
    });

    return postsCache.find((p) => p.id === postId) || null;
  },
};

import { apiClient } from './api/client';
import { VelaEvent, AgeCategory, CelebrityArtist, HeadlineArtistInfo } from '../types/vela';
import { MOCK_EVENTS, MOCK_ARTISTS } from './mockData';

let eventsCache: VelaEvent[] = [...MOCK_EVENTS];
let artistsCache: CelebrityArtist[] = [...MOCK_ARTISTS];

export const eventsService = {
  async getUpcomingEvents(dateOfBirth: string, category: AgeCategory = 'all'): Promise<VelaEvent[]> {
    try {
      const params = new URLSearchParams();
      params.append('dob', dateOfBirth);
      if (category && category !== 'all') params.append('category', category);

      const data = await apiClient.get<VelaEvent[]>(`/events?${params.toString()}`);
      if (Array.isArray(data) && data.length > 0) {
        eventsCache = data;
        return data;
      }
      return this.filterLocal(eventsCache, category);
    } catch {
      return this.filterLocal(eventsCache, category);
    }
  },

  filterLocal(events: VelaEvent[], category: AgeCategory): VelaEvent[] {
    if (category === 'all') return events;
    return events.filter((e) => e.ageCategory === category || e.ageCategory === 'all');
  },

  async getArtists(genre?: string): Promise<CelebrityArtist[]> {
    try {
      const query = genre && genre !== 'All' ? `?genre=${encodeURIComponent(genre)}` : '';
      const data = await apiClient.get<CelebrityArtist[]>(`/artists${query}`);
      if (Array.isArray(data) && data.length > 0) {
        artistsCache = data;
        return data;
      }
    } catch {
      // fallback to mock
    }

    if (genre && genre !== 'All') {
      return artistsCache.filter((a) => a.genre.toLowerCase().includes(genre.toLowerCase()));
    }
    return artistsCache;
  },

  async bookArtistForEvent(
    eventId: string,
    artistId: string,
    isVelaSponsored: boolean = false,
    notes?: string
  ): Promise<VelaEvent | null> {
    try {
      await apiClient.post(`/events/${eventId}/book-artist`, {
        artistId,
        isVelaSponsored,
        notes,
      });
    } catch {
      // Mock fallback
    }

    const artist = artistsCache.find((a) => a.id === artistId) || MOCK_ARTISTS.find((a) => a.id === artistId);

    eventsCache = eventsCache.map((event) => {
      if (event.id === eventId) {
        const headlineArtist: HeadlineArtistInfo = {
          id: artist?.id || artistId,
          name: artist?.name || 'Guest Celebrity Headliner',
          genre: artist?.genre || 'Celebrity Performance',
          avatar:
            artist?.avatar ||
            'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&w=600&q=80',
          setTime: '20:30 Headline Performance',
          isVelaSponsored,
          sponsorGrantDetails: isVelaSponsored
            ? notes || 'Direct sponsorship grant provided by VELA Society Patron Foundation.'
            : undefined,
          bookingStatus: isVelaSponsored ? 'vela_sponsored' : 'confirmed',
          bookingFee: artist?.bookingFeeEstimate || '$50,000 (Pooled)',
          crowdfundedAmount: isVelaSponsored ? 50000 : 25000,
        };

        return {
          ...event,
          headlineArtist,
          isVelaSponsored,
          sponsorGrantDetails: headlineArtist.sponsorGrantDetails,
        };
      }
      return event;
    });

    return eventsCache.find((e) => e.id === eventId) || null;
  },

  async toggleJoinEvent(
    eventId: string,
    user: { id: string; name: string; avatar: string }
  ): Promise<VelaEvent | null> {
    try {
      await apiClient.post(`/events/${eventId}/join`);
    } catch {
      // Mock fallback
    }

    eventsCache = eventsCache.map((event) => {
      if (event.id === eventId) {
        const isJoined = !event.isJoined;
        const attendees = isJoined
          ? [...event.attendees, { id: user.id, name: user.name, avatar: user.avatar, exactMatch: true }]
          : event.attendees.filter((a) => a.id !== user.id);

        return {
          ...event,
          isJoined,
          attendees,
        };
      }
      return event;
    });

    return eventsCache.find((e) => e.id === eventId) || null;
  },
};

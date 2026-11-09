import { apiClient } from './api/client';
import { BirthdayTwin, AgeCategory } from '../types/vela';
import { MOCK_TWINS } from './mockData';

let twinsCache: BirthdayTwin[] = [...MOCK_TWINS];

export const twinsService = {
  async getBirthdayTwins(dateOfBirth: string, category: AgeCategory = 'all'): Promise<BirthdayTwin[]> {
    try {
      const params = new URLSearchParams();
      params.append('dob', dateOfBirth);
      if (category && category !== 'all') params.append('category', category);

      const data = await apiClient.get<BirthdayTwin[]>(`/users/twins?${params.toString()}`);
      if (Array.isArray(data) && data.length > 0) {
        twinsCache = data;
        return data;
      }
      return this.filterLocal(twinsCache, category);
    } catch {
      return this.filterLocal(twinsCache, category);
    }
  },

  filterLocal(twins: BirthdayTwin[], category: AgeCategory): BirthdayTwin[] {
    if (category === 'all') return twins;
    return twins.filter((t) => t.ageCategory === category);
  },

  async inviteTwin(twinId: string): Promise<boolean> {
    try {
      await apiClient.post(`/users/twins/${twinId}/invite`);
    } catch {
      // Graceful offline mock handling
    }

    twinsCache = twinsCache.map((twin) =>
      twin.id === twinId ? { ...twin, isInvited: true } : twin
    );
    return true;
  },
};

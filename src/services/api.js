// API Configuration and Services
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

class ApiService {
  constructor() {
    this.baseURL = API_BASE_URL;
  }

  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    const config = {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    };

    try {
      const response = await fetch(url, config);
      
      if (!response.ok) {
        const error = await response.json().catch(() => ({}));
        throw new Error(error.detail || error.message || `HTTP ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('API Request Error:', error);
      throw error;
    }
  }

  // Auth endpoints
  async login(credentials) {
    return this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
  }

  async register(userData) {
    return this.request('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  }

  // Fighter endpoints
  async getFighters(token, filters = {}) {
    const params = new URLSearchParams(filters);
    return this.request(`/fighters?${params}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
  }

  async getFighter(token, fighterId) {
    return this.request(`/fighters/${fighterId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
  }

  async createFighter(token, fighter) {
    return this.request('/fighters', {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
      body: JSON.stringify(fighter),
    });
  }

  async updateFighter(token, fighterId, updates) {
    return this.request(`/fighters/${fighterId}`, {
      method: 'PUT',
      headers: { Authorization: `Bearer ${token}` },
      body: JSON.stringify(updates),
    });
  }

  // Combat endpoints
  async optimizeTeam(token, data) {
    return this.request('/combat/optimize', {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
      body: JSON.stringify(data),
    });
  }

  async predictBattle(token, data) {
    return this.request('/combat/predict', {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
      body: JSON.stringify(data),
    });
  }

  async simulateBattle(token, data) {
    return this.request('/combat/simulate', {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
      body: JSON.stringify(data),
    });
  }

  async getRecommendations(token, userId, params = {}) {
    const query = new URLSearchParams(params);
    return this.request(`/combat/recommendations/${userId}?${query}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
  }

  // Battle endpoints
  async getBattleHistory(token, filters = {}) {
    const params = new URLSearchParams(filters);
    return this.request(`/battles/history?${params}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
  }

  async getBattle(token, battleId) {
    return this.request(`/battles/${battleId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
  }

  async recordBattle(token, battle) {
    return this.request('/battles', {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
      body: JSON.stringify(battle),
    });
  }

  // Analytics endpoints
  async getPerformanceAnalytics(token, days = 30) {
    return this.request(`/analytics/performance?days=${days}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
  }

  async getFighterMeta(token) {
    return this.request('/analytics/fighter-meta', {
      headers: { Authorization: `Bearer ${token}` },
    });
  }

  async getBasiliskAnalysis(token) {
    return this.request('/analytics/basilisk-intelligence', {
      headers: { Authorization: `Bearer ${token}` },
    });
  }

  // System endpoints
  async healthCheck() {
    return this.request('/health');
  }

  async getSystemMetrics(token) {
    return this.request('/metrics', {
      headers: { Authorization: `Bearer ${token}` },
    });
  }
}

export const api = new ApiService();
export default api;
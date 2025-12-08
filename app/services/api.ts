const API_BASE_URL = "/api"; 

// ============ Types ============

export interface AboutInfo {
  height: number | null;
  weight: number | null;
  description: string | null;
}

export interface AboutResponse {
  data: {
    pokemonId: number;
    aboutInfo: AboutInfo;
  };
}

export interface NicknameResponse {
  data: {
    pokemonId: number;
    nickname: string | null;
  };
}

export interface HealthCheckResponse {
  status: string;
  message: string;
  timestamp: string;
}

// ============ Fetch Helper ============

async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;

  const config: RequestInit = {
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
    ...options,
  };

  const response = await fetch(url, config);

  if (!response.ok) {
    throw new Error(`API Error: ${response.status} ${response.statusText}`);
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return response.json();
}

// ============ Nickname API ============

export async function getNickname(id: number): Promise<NicknameResponse> {
  return apiRequest<NicknameResponse>(`/pokemon/${id}/nickname`);
}

export async function setNickname(
  id: number,
  nickname: string
): Promise<{ data: { pokemonId: number; nickname: string } }> {
  return apiRequest(`/pokemon/${id}/nickname`, {
    method: "PUT",
    body: JSON.stringify({ nickname }),
  });
}

export async function deleteNickname(id: number): Promise<void> {
  return apiRequest<void>(`/pokemon/${id}/nickname`, { method: "DELETE" });
}

// ============ About Info API ============

export async function getAboutInfo(id: number): Promise<AboutResponse> {
  return apiRequest<AboutResponse>(`/pokemon/${id}/about`);
}

export async function setAboutInfo(
  id: number,
  aboutInfo: AboutInfo
): Promise<AboutResponse> {
  return apiRequest<AboutResponse>(`/pokemon/${id}/about`, {
    method: "PUT",
    body: JSON.stringify(aboutInfo),
  });
}

export async function deleteAboutInfo(id: number): Promise<void> {
  return apiRequest<void>(`/pokemon/${id}/about`, { method: "DELETE" });
}

// ============ Health Check ============

export async function healthCheck(): Promise<HealthCheckResponse> {
  return apiRequest<HealthCheckResponse>("/health");
}

// ============ Backward Compatibility ============

export const apiService = {
  getNickname,
  setNickname,
  deleteNickname,
  getAboutInfo,
  setAboutInfo,
  deleteAboutInfo,
  healthCheck,
};
const API_BASE = import.meta.env.DEV ? '/api' : (import.meta.env.VITE_API_BASE || '/api');

let accessToken: string | null = localStorage.getItem('admin_token');

export function setToken(token: string | null) {
  accessToken = token;
  if (token) {
    localStorage.setItem('admin_token', token);
  } else {
    localStorage.removeItem('admin_token');
  }
}

export function getToken(): string | null {
  return accessToken;
}

let refreshPromise: Promise<boolean> | null = null;

async function tryRefresh(): Promise<boolean> {
  if (refreshPromise) return refreshPromise;

  refreshPromise = (async () => {
    try {
      const res = await fetch(`${API_BASE}/auth/refresh`, {
        method: 'POST',
        credentials: 'include',
      });
      if (!res.ok) {
        setToken(null);
        return false;
      }
      const data = await res.json();
      if (data.accessToken) {
        setToken(data.accessToken);
        return true;
      }
      return false;
    } catch {
      return false;
    } finally {
      refreshPromise = null;
    }
  })();

  return refreshPromise;
}

async function request<T>(
  path: string,
  options: RequestInit = {}
): Promise<T> {
  const headers: Record<string, string> = {};

  if (accessToken) {
    headers['Authorization'] = `Bearer ${accessToken}`;
  }

  if (!(options.body instanceof FormData)) {
    headers['Content-Type'] = 'application/json';
  }

  if (options.headers) {
    const h = options.headers as Record<string, string>;
    Object.assign(headers, h);
  }

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 30000);

  const res = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers,
    credentials: 'include',
    signal: controller.signal,
  }).finally(() => clearTimeout(timeoutId));

  if (res.status === 401 && accessToken) {
    const refreshed = await tryRefresh();
    if (refreshed) {
      headers['Authorization'] = `Bearer ${accessToken}`;
      const retryTimeoutId = setTimeout(() => controller.abort(), 30000);
      const retry = await fetch(`${API_BASE}${path}`, {
        ...options,
        headers,
        credentials: 'include',
        signal: controller.signal,
      }).finally(() => clearTimeout(retryTimeoutId));

      if (!retry.ok) {
        const err = await retry.json().catch(() => ({ error: 'Ошибка запроса' }));
        throw new Error(err.error || `HTTP ${retry.status}`);
      }
      return retry.json();
    }
    setToken(null);
    throw new Error('Сессия истекла');
  }

  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: `HTTP ${res.status}` }));
    throw new Error(err.error || `HTTP ${res.status}`);
  }

  return res.json();
}

export const api = {
  auth: {
    login: (username: string, password: string) =>
      request<{ accessToken: string; admin: { id: string; username: string } }>(
        '/auth/login',
        { method: 'POST', body: JSON.stringify({ username, password }) }
      ),
    logout: () =>
      request<{ message: string }>('/auth/logout', { method: 'POST' }),
  },

  projects: {
    list: (params?: Record<string, string>) => {
      const qs = params ? '?' + new URLSearchParams(params).toString() : '';
      return request<{
        projects: ProjectData[];
        pagination: { page: number; limit: number; total: number; totalPages: number };
      }>(`/projects${qs}`);
    },
    get: (id: string) => request<ProjectData>(`/projects/${id}`),
    create: (data: Partial<ProjectData>) =>
      request<ProjectData>('/projects', { method: 'POST', body: JSON.stringify(data) }),
    update: (id: string, data: Partial<ProjectData>) =>
      request<ProjectData>(`/projects/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
    delete: (id: string) =>
      request<{ message: string }>(`/projects/${id}`, { method: 'DELETE' }),
    updateOrder: (items: { id: string; order: number }[]) =>
      request<{ message: string }>('/projects/order', {
        method: 'PUT',
        body: JSON.stringify({ items }),
      }),
  },

  upload: {
    file: (file: File) => {
      const fd = new FormData();
      fd.append('file', file);
      return request<{ url: string; path: string; originalName: string }>('/upload', {
        method: 'POST',
        body: fd,
      });
    },
    bundle: (file: File, projectId: string) => {
      const fd = new FormData();
      fd.append('bundle', file);
      fd.append('projectId', projectId);
      return request<{ message: string; bundlePath: string }>('/upload/bundle', {
        method: 'POST',
        body: fd,
      });
    },
  },

  contacts: {
    send: (data: { name: string; email: string; phone?: string; message: string }) =>
      request<{ message: string }>('/contacts', { method: 'POST', body: JSON.stringify(data) }),
  },
};

export interface ProjectData {
  id: string;
  title: string;
  description: string;
  category: string;
  tags: string[];
  coverImage: string;
  screenshots: string[];
  liveUrl: string | null;
  previewType: 'IFRAME' | 'SCREENSHOT' | 'STATIC_BUNDLE' | 'NONE';
  staticBundlePath: string | null;
  isComplexSystem: boolean;
  order: number;
  visible: boolean;
  createdAt: string;
  updatedAt: string;
}
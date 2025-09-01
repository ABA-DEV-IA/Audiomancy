import { User } from '@/types/user';
import { login, register, modify } from '../userService';

describe('User Service', () => {
  const mockUser: User = {
    id: '1',
    email: 'test@example.com',
    username: 'TestUser',
    password_hash: 'hashedpassword',
    created_at: new Date('2025-01-01T00:00:00Z'),
  };

  const mockResponse = {
    success: true,
    message: 'OK',
    user: mockUser,
  };

  beforeEach(() => {
    global.fetch = jest.fn();
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('login doit retourner l’utilisateur', async () => {
    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => mockResponse,
    });

    const user = await login('test@example.com', 'password123');

    expect(fetch).toHaveBeenCalledWith(
      '/api/user/proxyConnexion',
      expect.objectContaining({
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: 'test@example.com', password: 'password123' }),
      }),
    );

    expect(user).toEqual(mockUser);
  });

  it('register doit retourner l’utilisateur', async () => {
    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => mockResponse,
    });

    const user = await register('test@example.com', 'TestUser', 'password123');

    expect(fetch).toHaveBeenCalledWith(
      '/api/user/proxyCreate',
      expect.objectContaining({
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: 'test@example.com',
          username: 'TestUser',
          password: 'password123',
        }),
      }),
    );

    expect(user).toEqual(mockUser);
  });

  it('modify doit retourner l’utilisateur', async () => {
    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => mockResponse,
    });

    const user = await modify('1', 'NewUsername', 'newpassword');

    expect(fetch).toHaveBeenCalledWith(
      '/api/user/proxyModify',
      expect.objectContaining({
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: '1', username: 'NewUsername', password: 'newpassword' }),
      }),
    );

    expect(user).toEqual(mockUser);
  });

  it('login lance une erreur si response.ok est false', async () => {
    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: false,
      status: 401,
      text: async () => 'Unauthorized',
    });

    await expect(login('test@example.com', 'wrongpassword')).rejects.toThrow(
      'API error 401: Unauthorized',
    );
  });

  it('modify lance une erreur si response.ok est false', async () => {
    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: false,
      status: 500,
      text: async () => 'Server error',
    });

    await expect(modify('1', 'NewUsername', 'newpassword')).rejects.toThrow(
      'API error 500: Server error',
    );
  });
});

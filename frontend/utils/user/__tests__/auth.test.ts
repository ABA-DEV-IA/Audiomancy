import { handleLogin } from '@/utils/user/auth';
import { login as loginService } from '@/services/userService';

jest.mock('@/services/userService');

test('handleLogin returns user on success', async () => {
  (loginService as jest.Mock).mockResolvedValue({ id: 1, email: 'test@test.com' });
  const result = await handleLogin('test@test.com', 'password');
  expect(result.user).toBeDefined();
  expect(result.error).toBeUndefined();
});

test('handleLogin returns error on failure', async () => {
  (loginService as jest.Mock).mockRejectedValue(new Error('Invalid credentials'));
  const result = await handleLogin('wrong@test.com', 'badpass');
  expect(result.user).toBeUndefined();
  expect(result.error).toBe('Invalid credentials');
});

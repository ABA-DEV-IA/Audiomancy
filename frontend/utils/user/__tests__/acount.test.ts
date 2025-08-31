// saveProfile.test.ts
import { saveProfile } from '@/utils/user/acount';
import { modify as modifyService } from '@/services/userService';

// Mock du service
jest.mock('@/services/userService', () => ({
  modify: jest.fn(),
}));

describe('saveProfile', () => {
  const mockModify = modifyService as jest.MockedFunction<typeof modifyService>;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('doit retourner une erreur si userId est undefined', async () => {
    const result = await saveProfile(undefined, 'Alice');
    expect(result).toEqual({ success: false, error: 'Utilisateur non connecté' });
    expect(mockModify).not.toHaveBeenCalled();
  });

  it('doit appeler modifyService avec username uniquement si newPassword non fourni', async () => {
    mockModify.mockResolvedValueOnce({}); // simulate success

    const result = await saveProfile('user123', 'Alice');

    expect(mockModify).toHaveBeenCalledWith('user123', 'Alice');
    expect(result).toEqual({ success: true });
  });

  it('doit appeler modifyService avec username et newPassword si fourni', async () => {
    mockModify.mockResolvedValueOnce({}); // simulate success

    const result = await saveProfile('user123', 'Alice', 'newPass');

    expect(mockModify).toHaveBeenCalledWith('user123', 'Alice', 'newPass');
    expect(result).toEqual({ success: true });
  });

  it('doit retourner une erreur si modifyService échoue', async () => {
    mockModify.mockRejectedValueOnce(new Error('Erreur API'));

    const result = await saveProfile('user123', 'Alice');

    expect(mockModify).toHaveBeenCalledWith('user123', 'Alice');
    expect(result).toEqual({ success: false, error: 'Erreur API' });
  });

  it('doit gérer les erreurs sans message', async () => {
    mockModify.mockRejectedValueOnce({});

    const result = await saveProfile('user123', 'Alice');

    expect(result).toEqual({ success: false, error: 'Erreur lors de la sauvegarde' });
  });
});

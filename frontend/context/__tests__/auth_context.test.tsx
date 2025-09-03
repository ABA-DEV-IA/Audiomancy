import { render, screen, fireEvent } from '@testing-library/react';
import { User } from '@/types/user';
import { AuthProvider, useAuth } from '../auth_context';

const mockUser: User = {
  id: '1',
  email: 'test@example.com',
  username: 'TestUser',
  password_hash: 'hash',
  created_at: new Date('2025-01-01T00:00:00Z'),
};

// Composant de test qui consomme le contexte
function TestComponent() {
  const { user, isAuthenticated, login, logout } = useAuth();

  return (
    <div>
      <span data-testid="username">{user?.username || 'No User'}</span>
      <span data-testid="auth">{isAuthenticated ? 'Yes' : 'No'}</span>
      <button onClick={() => login(mockUser)}>Login</button>
      <button onClick={logout}>Logout</button>
    </div>
  );
}

describe('AuthContext', () => {
  it('doit avoir un état initial correct', () => {
    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>,
    );

    expect(screen.getByTestId('username').textContent).toBe('No User');
    expect(screen.getByTestId('auth').textContent).toBe('No');
  });

  it('doit se connecter correctement avec login', () => {
    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>,
    );

    fireEvent.click(screen.getByText('Login'));

    expect(screen.getByTestId('username').textContent).toBe('TestUser');
    expect(screen.getByTestId('auth').textContent).toBe('Yes');
  });

  it('doit se déconnecter correctement avec logout', () => {
    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>,
    );

    fireEvent.click(screen.getByText('Login'));
    fireEvent.click(screen.getByText('Logout'));

    expect(screen.getByTestId('username').textContent).toBe('No User');
    expect(screen.getByTestId('auth').textContent).toBe('No');
  });

  it('doit lancer une erreur si useAuth est utilisé en dehors du provider', () => {
    const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {}); // pour éviter le log d’erreur

    function WrongComponent() {
      useAuth();
      return null;
    }

    expect(() => render(<WrongComponent />)).toThrow(
      'useAuth doit être utilisé dans un AuthProvider',
    );

    consoleErrorSpy.mockRestore();
  });
});

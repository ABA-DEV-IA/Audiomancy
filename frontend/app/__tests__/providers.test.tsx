import { render, screen } from '@testing-library/react';
import React from 'react';
import { useAuth } from '@/context/auth_context';
import { Providers } from '../providers';

// Composant test pour vérifier le contexte
function TestChild() {
  const { isAuthenticated, user } = useAuth();
  return (
    <div>
      <span data-testid="auth-status">{isAuthenticated ? 'yes' : 'no'}</span>
      <span data-testid="auth-user">{user?.username ?? 'no-user'}</span>
    </div>
  );
}

describe('Providers', () => {
  it('fournit le AuthProvider et rend les enfants', () => {
    render(
      <Providers>
        <TestChild />
      </Providers>,
    );

    expect(screen.getByTestId('auth-status').textContent).toBe('no');
    expect(screen.getByTestId('auth-user').textContent).toBe('no-user');
  });
});

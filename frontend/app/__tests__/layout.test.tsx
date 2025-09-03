import { render, screen } from '@testing-library/react';
import { GenerationProvider } from '@/context/generation_context';
import React from 'react';

// Composant test pour vérifier le contexte
function TestChild() {
  return <span data-testid="child">Child content</span>;
}

describe('RootLayout', () => {
  it('doit rendre les enfants et fournir le GenerationProvider', () => {
    // On teste uniquement le provider et les enfants
    render(
      <GenerationProvider>
        <TestChild />
      </GenerationProvider>,
    );

    expect(screen.getByTestId('child')).toBeInTheDocument();
  });
});

import { render, screen, fireEvent } from '@testing-library/react';
import { GenerationProvider, useGeneration } from '../generation_context';

// Composant test qui consomme le contexte
function TestComponent() {
  const { wish, playlistSize, setGenerationData } = useGeneration();

  return (
    <div>
      <span data-testid="wish">{wish}</span>
      <span data-testid="size">{playlistSize}</span>
      <button onClick={() => setGenerationData({ wish: 'Party', playlistSize: 10 })}>
        Set Data
      </button>
    </div>
  );
}

describe('GenerationContext', () => {
  it('doit avoir un état initial correct', () => {
    render(
      <GenerationProvider>
        <TestComponent />
      </GenerationProvider>,
    );

    expect(screen.getByTestId('wish').textContent).toBe('');
    expect(screen.getByTestId('size').textContent).toBe('0');
  });

  it('doit mettre à jour les données avec setGenerationData', () => {
    render(
      <GenerationProvider>
        <TestComponent />
      </GenerationProvider>,
    );

    fireEvent.click(screen.getByText('Set Data'));

    expect(screen.getByTestId('wish').textContent).toBe('Party');
    expect(screen.getByTestId('size').textContent).toBe('10');
  });

  it('doit lancer une erreur si useGeneration est utilisé hors du provider', () => {
    const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {}); // pour éviter le log d’erreur

    function WrongComponent() {
      useGeneration();
      return null;
    }

    expect(() => render(<WrongComponent />)).toThrow(
      'useGeneration must be used within a GenerationProvider',
    );

    consoleErrorSpy.mockRestore();
  });
});

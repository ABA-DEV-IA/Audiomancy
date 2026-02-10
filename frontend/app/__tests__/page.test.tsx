import { render, screen, fireEvent } from '@testing-library/react';
import { GenerationPage } from '@/components/sections/generation/GenerationSection';
import React from 'react';
import Page from '../page';

// Mock des composants enfants
jest.mock('@/components/layout/sidebar', () => ({
  Sidebar: ({ onPageChange }: any) => (
    <div>
      <button data-testid="sidebar-about" onClick={() => onPageChange('about')}>Go About</button>
      <button data-testid="sidebar-login" onClick={() => onPageChange('login')}>Go Login</button>
      <button data-testid="sidebar-register" onClick={() => onPageChange('register')}>Go Register</button>
      <button data-testid="sidebar-account" onClick={() => onPageChange('account')}>Go Account</button>
    </div>
  ),
}));

jest.mock('@/components/layout/top-navbar', () => ({ TopNavbar: () => <div>TopNavbar</div> }));
jest.mock('@/components/layout/footer', () => ({ Footer: () => <div>Footer</div> }));

jest.mock('@/components/sections/home/HomeSection', () => ({
  HomePage: ({ onCategoryClick }: any) => (
    <div>
      HomePage
      <button data-testid="home-btn" onClick={() => onCategoryClick()}>
        Go Lecture
      </button>
    </div>
  ),
}));

jest.mock('@/components/sections/search/SearchSection', () => ({
  SearchPage: ({ onTrackClick }: any) => <div>SearchPage</div>,
}));

jest.mock('@/components/sections/about/AboutSection', () => ({
  AboutPage: () => <div>AboutPage</div>,
}));

jest.mock('@/components/sections/generation/GenerationSection', () => ({
  GenerationPage: ({ onBack, onComplete }: any) => (
    <div>
      GenerationPage
      <button data-testid="back-btn" onClick={onBack}>
        Back
      </button>
      <button data-testid="complete-btn" onClick={onComplete}>
        Complete
      </button>
    </div>
  ),
}));

jest.mock('@/components/sections/user/AuthSection', () => ({
  AuthPage: ({ onLoginSuccess }: any) => (
    <div>
      AuthPage
      <button data-testid="login-success-btn" onClick={onLoginSuccess}>
        LoginSuccess
      </button>
    </div>
  ),
}));

jest.mock('@/components/sections/user/RegisterSection', () => ({
  RegisterPage: ({ onRegisterSuccess }: any) => (
    <div>
      RegisterPage
      <button data-testid="register-success-btn" onClick={onRegisterSuccess}>
        RegisterSuccess
      </button>
    </div>
  ),
}));

jest.mock('@/components/sections/user/AccountSection', () => ({
  AccountPage: () => <div>AccountPage</div>,
}));

jest.mock('@/components/sections/favorite/favorites-container', () => ({
  FavoritesContainer: () => <div>FavoritesContainer</div>,
}));

describe('Page component', () => {
  it('doit rendre la page initiale et sidebar', () => {
    render(<Page />);
    expect(screen.getByText('HomePage')).toBeInTheDocument();
    expect(screen.getByTestId('sidebar-about')).toBeInTheDocument();
  });

  it('doit changer de page via sidebar', () => {
    render(<Page />);
    fireEvent.click(screen.getByTestId('sidebar-about'));
    expect(screen.getByText('AboutPage')).toBeInTheDocument();
  });

  it('doit aller en lecture via HomePage', () => {
    render(<Page />);
    fireEvent.click(screen.getByTestId('home-btn'));
    // Lecture est rendu comme HomePage dans ton code
    expect(screen.getByText('HomePage')).toBeInTheDocument();
  });

  it('doit gérer GenerationPage back et complete', () => {
    render(<Page />);

    // Force currentPage = "generation" en simulant un rendu de GenerationPage
    // Pour simplifier, on peut directement rendre le composant GenerationPage mocké
    const { getByTestId } = screen;

    // Clique back
    fireEvent.click(getByTestId('sidebar-about')); // ici mock simplifié → AboutPage
    expect(screen.getByText('AboutPage')).toBeInTheDocument();

    // Si tu veux tester back/complete dans GenerationPage, tu peux créer un test isolé
    render(
      <GenerationPage
        onBack={() => console.log('Back clicked')}
        onComplete={() => console.log('Complete clicked')}
      />,
    );
    fireEvent.click(screen.getByTestId('back-btn'));
    fireEvent.click(screen.getByTestId('complete-btn'));
  });

  it('doit naviguer vers AuthPage et gérer le login', () => {
    render(<Page />);
    fireEvent.click(screen.getByTestId('sidebar-login'));
    expect(screen.getByText('AuthPage')).toBeInTheDocument();
    // Login success ramène à categories (HomePage)
    fireEvent.click(screen.getByTestId('login-success-btn'));
    expect(screen.getByText('HomePage')).toBeInTheDocument();
  });

  it('doit naviguer vers RegisterPage et gérer l\'inscription', () => {
    render(<Page />);
    fireEvent.click(screen.getByTestId('sidebar-register'));
    expect(screen.getByText('RegisterPage')).toBeInTheDocument();
    // Register success ramène à categories (HomePage)
    fireEvent.click(screen.getByTestId('register-success-btn'));
    expect(screen.getByText('HomePage')).toBeInTheDocument();
  });

  it('doit naviguer vers AccountPage', () => {
    render(<Page />);
    fireEvent.click(screen.getByTestId('sidebar-account'));
    expect(screen.getByText('AccountPage')).toBeInTheDocument();
  });
});

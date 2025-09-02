import { render, screen, fireEvent } from "@testing-library/react";
import React from "react";
import Page from "../page";

// === Mocks ===
jest.mock("@/components/layout/sidebar", () => ({
  Sidebar: ({ onPageChange }: any) => (
    <div>
      <button data-testid="to-home" onClick={() => onPageChange("categories")}>Home</button>
      <button data-testid="to-about" onClick={() => onPageChange("about")}>About</button>
      <button data-testid="to-generation" onClick={() => onPageChange("generation")}>Generation</button>
      <button data-testid="to-recherches" onClick={() => onPageChange("recherches")}>Recherches</button>
      <button data-testid="to-favorites" onClick={() => onPageChange("favorites")}>Favorites</button>
      <button data-testid="to-login" onClick={() => onPageChange("login")}>Login</button>
      <button data-testid="to-register" onClick={() => onPageChange("register")}>Register</button>
      <button data-testid="to-account" onClick={() => onPageChange("acount")}>Account</button>
    </div>
  ),
}));

jest.mock("@/components/layout/top-navbar", () => ({
  TopNavbar: () => <div>TopNavbar</div>,
}));
jest.mock("@/components/layout/footer", () => ({
  Footer: () => <div>Footer</div>,
}));

jest.mock("@/components/sections/home/HomeSection", () => ({
  HomePage: ({ onCategoryClick }: any) => (
    <div>
      HomePage
      <button data-testid="home-btn" onClick={onCategoryClick}>
        Go Lecture
      </button>
    </div>
  ),
}));

jest.mock("@/components/sections/search/SearchSection", () => ({
  SearchPage: ({ onTrackClick }: any) => (
    <div>
      SearchPage
      <button data-testid="search-btn" onClick={() => onTrackClick("track-1")}>
        Select Track
      </button>
    </div>
  ),
}));

jest.mock("@/components/sections/about/AboutSection", () => ({
  AboutPage: () => <div>AboutPage</div>,
}));

jest.mock("@/components/sections/generation/GenerationSection", () => ({
  GenerationPage: ({ onBack, onComplete }: any) => (
    <div>
      GenerationPage
      <button data-testid="back-btn" onClick={onBack}>Back</button>
      <button data-testid="complete-btn" onClick={onComplete}>Complete</button>
    </div>
  ),
}));

jest.mock("@/components/sections/user/AuthSection", () => ({
  AuthPage: ({ onLoginSuccess, onSwitchToRegister }: any) => (
    <div>
      AuthPage
      <button data-testid="login-success-btn" onClick={onLoginSuccess}>LoginSuccess</button>
      <button data-testid="switch-register-btn" onClick={onSwitchToRegister}>SwitchToRegister</button>
    </div>
  ),
}));

jest.mock("@/components/sections/user/RegisterSection", () => ({
  RegisterPage: ({ onRegisterSuccess, onSwitchToLogin }: any) => (
    <div>
      RegisterPage
      <button data-testid="register-success-btn" onClick={onRegisterSuccess}>RegisterSuccess</button>
      <button data-testid="switch-login-btn" onClick={onSwitchToLogin}>SwitchToLogin</button>
    </div>
  ),
}));

jest.mock("@/components/sections/user/AccountSection", () => ({
  AccountPage: () => <div>AccountPage</div>,
}));

jest.mock("@/components/sections/favorite/favorites-container", () => ({
  FavoritesContainer: () => <div>FavoritesPage</div>,
}));

// === Tests ===
describe("Page component", () => {
  it("rend la page initiale (HomePage) + Sidebar", () => {
    render(<Page />);
    expect(screen.getByText("HomePage")).toBeInTheDocument();
    expect(screen.getByText("TopNavbar")).toBeInTheDocument();
    expect(screen.getByText("Footer")).toBeInTheDocument();
    expect(screen.getByTestId("to-about")).toBeInTheDocument(); // bouton mocké de la sidebar
  });

  it("change de page via Sidebar (AboutPage)", () => {
    render(<Page />);
    fireEvent.click(screen.getByTestId("to-about"));
    expect(screen.getByText("AboutPage")).toBeInTheDocument();
  });

  it("va en lecture via HomePage (Go Lecture)", () => {
    render(<Page />);
    fireEvent.click(screen.getByTestId("home-btn"));
    // lecture réutilise HomePage
    expect(screen.getByText("HomePage")).toBeInTheDocument();
  });

  it("va en lecture via SearchPage (onTrackClick)", () => {
    render(<Page />);
    fireEvent.click(screen.getByTestId("to-recherches"));
    expect(screen.getByText("SearchPage")).toBeInTheDocument();
    fireEvent.click(screen.getByTestId("search-btn"));
    expect(screen.getByText("HomePage")).toBeInTheDocument(); // lecture = HomePage
  });

  it("GenerationPage: Back renvoie aux catégories (HomePage)", () => {
    render(<Page />);
    fireEvent.click(screen.getByTestId("to-generation"));
    expect(screen.getByText("GenerationPage")).toBeInTheDocument();
    fireEvent.click(screen.getByTestId("back-btn"));
    expect(screen.getByText("HomePage")).toBeInTheDocument();
  });

  it("GenerationPage: Complete renvoie à lecture (HomePage)", () => {
    render(<Page />);
    fireEvent.click(screen.getByTestId("to-generation"));
    expect(screen.getByText("GenerationPage")).toBeInTheDocument();
    fireEvent.click(screen.getByTestId("complete-btn"));
    expect(screen.getByText("HomePage")).toBeInTheDocument(); // lecture = HomePage
  });

  it("AuthPage: switch vers Register puis retour Login puis succès login", () => {
    render(<Page />);
    fireEvent.click(screen.getByTestId("to-login"));
    expect(screen.getByText("AuthPage")).toBeInTheDocument();

    fireEvent.click(screen.getByTestId("switch-register-btn"));
    expect(screen.getByText("RegisterPage")).toBeInTheDocument();

    fireEvent.click(screen.getByTestId("switch-login-btn"));
    expect(screen.getByText("AuthPage")).toBeInTheDocument();

    fireEvent.click(screen.getByTestId("login-success-btn"));
    expect(screen.getByText("HomePage")).toBeInTheDocument();
  });

  it("RegisterPage: succès d'inscription renvoie aux catégories (HomePage)", () => {
    render(<Page />);
    fireEvent.click(screen.getByTestId("to-register"));
    expect(screen.getByText("RegisterPage")).toBeInTheDocument();

    fireEvent.click(screen.getByTestId("register-success-btn"));
    expect(screen.getByText("HomePage")).toBeInTheDocument();
  });

  it("FavoritesPage", () => {
    render(<Page />);
    fireEvent.click(screen.getByTestId("to-favorites"));
    expect(screen.getByText("FavoritesPage")).toBeInTheDocument();
  });

  it("AccountPage (clé 'acount')", () => {
    render(<Page />);
    fireEvent.click(screen.getByTestId("to-account"));
    expect(screen.getByText("AccountPage")).toBeInTheDocument();
  });
});

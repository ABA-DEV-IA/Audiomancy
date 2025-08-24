import { render, screen, fireEvent } from '@testing-library/react';
import { HomePage } from '@/components/sections/home/HomeSection';
import { useRouter } from 'next/navigation';
import categoriesList from '@/config/categories/categories_du_jour.json';
import { homeConfig } from '@/config/site/home.config';

// Mock du router Next.js
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}));

describe('HomePage', () => {
  const pushMock = jest.fn();

  beforeEach(() => {
    (useRouter as jest.Mock).mockReturnValue({ push: pushMock });
    sessionStorage.clear();
  });

  it('should render header with title and subtitle', () => {
    render(<HomePage />);
    expect(screen.getByText(homeConfig.header.title)).toBeInTheDocument();
    expect(screen.getByText(homeConfig.header.subtitle)).toBeInTheDocument();
  });

  it('should render all categories sections', () => {
    render(<HomePage />);
    expect(screen.getByText('Mood')).toBeInTheDocument();
    expect(screen.getByText('Activités')).toBeInTheDocument();

    // Vérifie qu’un nom de catégorie du fichier JSON apparaît
    const firstMoodCategory = categoriesList.categories.mood[0];
    expect(screen.getByText(firstMoodCategory.title)).toBeInTheDocument();
  });

  it('should navigate when a category is clicked', () => {
    render(<HomePage />);

    const firstMoodCategory = categoriesList.categories.mood[0];

    const categoryButton = screen.getByText(firstMoodCategory.title);
    fireEvent.click(categoryButton);

    // Vérifie que sessionStorage est mis à jour
    const storedTags = JSON.parse(sessionStorage.getItem('selectedTags') || '[]');
    expect(storedTags).toEqual(firstMoodCategory.tags);

    // Vérifie que le router push a été appelé avec le bon id
    expect(pushMock).toHaveBeenCalledWith(`/lecture/${firstMoodCategory.id}`);
  });

  it('should fallback to default header color if fetch fails', async () => {
    // Mock fetch pour renvoyer une erreur
    global.fetch = jest.fn().mockRejectedValue(new Error('Network error'));

    render(<HomePage />);
    const headerDiv = screen.getByRole('banner', { hidden: true }) || screen.getByText(homeConfig.header.title).parentElement;
    expect(headerDiv).toHaveStyle({ backgroundColor: '#6A0DAD' });
  });
});

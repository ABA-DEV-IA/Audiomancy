import { CategoryCard } from '@/components/sections/home/CategoryCard';
import { Category } from '@/types/category';

interface CategorySectionProps {
  title: string;
  categories: Category[];
  fallbackImage: string;
  onCategoryClick: (id: string, tags: string) => void;
}

export function CategorySection({
  title,
  categories,
  fallbackImage,
  onCategoryClick,
}: CategorySectionProps) {
  return (
    <div className="mb-12">
      <div className="flex items-center justify-center mb-8">
        <div className="flex-1 h-px bg-white max-w-32" />
        <span className="text-white italic mx-8 text-xl">{title}</span>
        <div className="flex-1 h-px bg-white max-w-32" />
      </div>

      <div className="grid grid-cols-3 gap-8 max-w-4xl mx-auto">
        {categories.map((category, index) => (
          <CategoryCard
            key={`${title}-${index}`}
            category={category}
            fallbackImage={fallbackImage}
            onClick={() => onCategoryClick(category.id, category.tags)}
          />
        ))}
      </div>
    </div>
  );
}

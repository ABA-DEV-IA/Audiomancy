import { Star, Heart, Code } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

interface Feature {
  icon: 'Star' | 'Heart' | 'Code';
  label: string;
}

interface Project {
  name: string;
  tagline: string;
  description: string[];
  features: Feature[];
}

interface Props {
  project: Project;
}

export function AboutProjectCard({ project }: Props) {
  return (
    <Card className="border border-[#A45EE5] bg-[#301934]">
      <CardContent className="p-8">
        <div className="text-center mb-6">
          <div className="w-16 h-16 bg-[#6A0DAD] rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-3xl">🔮</span>
          </div>
          <h2 className="text-2xl font-bold text-white mb-4">{project.name}</h2>
        </div>

        <div className="text-[#D9B3FF] space-y-4 text-center">
          <p className="text-lg italic">"{project.tagline}"</p>
          {project.description.map((text, i) => (
            <p key={i}>{text}</p>
          ))}
        </div>


    <div className="flex flex-wrap justify-center mt-6 gap-6 text-[#FF934F]">
      {project.features.map((feature, i) => {
        const Icons = { Star, Heart, Code };
        const IconComponent = Icons[feature.icon];
        return (
          <div key={i} className="flex items-center flex-none">
            {IconComponent && <IconComponent className="h-5 w-5 mr-2" />}
            <span>{feature.label}</span>
          </div>
        );
      })}
    </div>    
    </CardContent>
    </Card>
  );
}

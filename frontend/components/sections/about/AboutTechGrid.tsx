import { Card, CardContent } from '@/components/ui/card';

interface Tech {
  name: string;
  color: string;
}

interface Props {
  technologies: Tech[];
}

export function AboutTechGrid({ technologies }: Props) {
  return (
    <Card className="bg-[#301934] border-[#A3D5FF]">
      <CardContent className="p-8">
        <h2 className="text-2xl font-bold text-white text-center mb-6">Technologies Enchantées</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          {technologies.map((tech, i) => (
            <div key={i} className="p-3 rounded-lg bg-[#2B2B2B]">
              <span style={{ color: tech.color }} className="font-medium">{tech.name}</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

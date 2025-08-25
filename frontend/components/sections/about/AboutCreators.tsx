import { Card, CardContent } from '@/components/ui/card';

interface Creator {
  name: string;
  role: string;
  description: string;
  color: string;
  avatar: string;
}

interface Props {
  creators: Creator[];
}

export function AboutCreators({ creators }: Props) {
  return (
    <div>
      <h2 className="text-2xl font-bold text-[#D9B3FF] text-center mb-8">Les Architectes de la Magie</h2>
      <div className="grid md:grid-cols-3 gap-6">
        {creators.map((creator, i) => (
          <Card
            key={i}
            className="bg-[#301934] border-[#A45EE5] hover:border-[#FF7BAC] transition-colors"
          >
            <CardContent className="p-6 text-center">
              <div
                className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 text-3xl"
                style={{ backgroundColor: `${creator.color}20` }}
              >
                {creator.avatar}
              </div>
              <h3 className="text-xl font-bold text-white mb-2">{creator.name}</h3>
              <p className="text-[#FF934F] font-medium mb-3">{creator.role}</p>
              <p className="text-[#D9B3FF] text-sm">{creator.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

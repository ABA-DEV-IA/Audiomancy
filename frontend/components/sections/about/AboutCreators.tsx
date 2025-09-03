import { Card, CardContent } from '@/components/ui/card';

interface Creator {
  name: string;
  role: string;
  description: string;
  color: string;
  avatar: string; // emoji ou URL d'image
  github: string;
}

interface Props {
  creators: Creator[];
}

export function AboutCreators({ creators }: Props) {
  return (
    <div>
      <h2 className="text-2xl font-bold text-[#D9B3FF] text-center mb-8">
        Les Architectes de l’Application
      </h2>
      <div className="grid md:grid-cols-3 gap-6">
        {creators.map((creator, i) => {
          const isImage = creator.avatar.startsWith('http') || creator.avatar.startsWith('/');
          return (
            <a
              key={i}
              href={creator.github}
              target="_blank"
              rel="noopener noreferrer"
              className="block h-full"
            >
              <Card className="bg-[#301934] border-[#A45EE5] hover:border-[#FF7BAC] transition-colors h-full">
                <CardContent className="p-6 text-center flex flex-col justify-start min-h-[300px]">
                  <div
                    className="w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-4 overflow-hidden"
                    style={{ backgroundColor: `${creator.color}20` }}
                  >
                    {isImage ? (
                      <img
                        src={creator.avatar}
                        alt={creator.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span className="text-3xl">{creator.avatar}</span>
                    )}
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white mb-2">{creator.name}</h3>
                    <p className="text-[#FF934F] font-medium mb-3">{creator.role}</p>
                    <p className="text-[#D9B3FF] text-sm line-clamp-4">{creator.description}</p>
                  </div>
                </CardContent>
              </Card>
            </a>
          );
        })}
      </div>
    </div>
  );
}

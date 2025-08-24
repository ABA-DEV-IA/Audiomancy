import { Github } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface Props {
  projectName: string;
  github: { url: string; label: string };
}

export function AboutGitHubCard({ projectName, github }: Props) {
  return (
    <Card className="bg-[#301934] border-[#4CE0B3]">
      <CardContent className="p-8 text-center">
        <div className="w-16 h-16 bg-[#4CE0B3] rounded-full flex items-center justify-center mx-auto mb-6">
          <Github className="h-8 w-8 text-[#2B2B2B]" />
        </div>
        <h2 className="text-2xl font-bold text-white mb-4">Code Source Mystique</h2>
        <p className="text-[#D9B3FF] mb-6">
          {projectName} est un projet open source. Découvrez nos sortilèges de code, contribuez à la magie ou créez votre propre incantation !
        </p>
        <Button
          className="bg-[#4CE0B3] hover:bg-[#4CE0B3]/80 text-[#2B2B2B] font-bold px-8 py-3"
          onClick={() => window.open(github.url, '_blank')}
        >
          <Github className="h-5 w-5 mr-2" />
          {github.label}
        </Button>
      </CardContent>
    </Card>
  );
}

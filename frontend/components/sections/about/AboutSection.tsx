'use client';

import { AboutProjectCard } from './AboutProjectCard';
import { AboutCreators } from './AboutCreators';
import { AboutGitHubCard } from './AboutGitHubCard';
import { AboutTechGrid } from './AboutTechGrid';
import { aboutConfig } from '@/config/site/about.config';

export function AboutPage() {
  const { project, creators, github, technologies } = aboutConfig;

  return (
    <div className="h-full flex flex-col bg-[#2B2B2B] text-white ">
      {/* Header */}
      <div
        className="bg-[#6A0DAD] text-white p-8 text-center">
        <h1 className="text-4xl font-bold mb-2 tracking-wider">À PROPOS</h1>
        <p style={{ color: 'hsl(var(--accent))' }} className="italic">
          ~ Découvrez l&apos;univers de {project.name} ~
        </p>
      </div>

      {/* Content */}
      <div
        className="flex-1 p-8 overflow-y-auto"
      >
        <div className="max-w-4xl mx-auto space-y-12">
          <AboutProjectCard project={project} />
          <AboutCreators creators={creators} />
          <AboutGitHubCard projectName={project.name} github={github} />
          <AboutTechGrid technologies={technologies} />
        </div>
      </div>
    </div>
  );
}

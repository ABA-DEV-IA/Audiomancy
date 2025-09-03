'use client';

import { AboutProjectCard } from './AboutProjectCard';
import { AboutCreators } from './AboutCreators';
import { AboutGitHubCard } from './AboutGitHubCard';
import { AboutTechGrid } from './AboutTechGrid';
import { aboutConfig } from '@/config/site/about.config';

export function AboutPage() {
  const { project, creators, github, technologies } = aboutConfig;

  return (
    <div className="min-h-screen flex flex-col bg-[#2B2B2B] text-white overflow-x-hidden overflow-y-auto">
      {/* Header */}
      <div className="sticky top-0 z-50 bg-[#6A0DAD] text-white p-4 sm:p-8 text-center">
        <h1 className="text-2xl sm:text-4xl font-bold mb-2 tracking-wider">
          À PROPOS
        </h1>
        <p className="italic text-sm sm:text-base" style={{ color: 'hsl(var(--accent))' }}>
          ~ Découvrez l&apos;univers de {project.name} ~
        </p>
      </div>

      {/* Content */}
      <div className="flex-1 w-full px-4 sm:px-8 py-6">
        <div className="max-w-4xl w-full mx-auto flex flex-col gap-12">
          <AboutProjectCard project={project} />
          <AboutCreators creators={creators} />
          <AboutGitHubCard projectName={project.name} github={github} />
          <AboutTechGrid technologies={technologies} />
        </div>
      </div>
    </div>
  );
}

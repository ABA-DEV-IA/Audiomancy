'use client';

import {
  Github, Star, Heart, Code,
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { aboutConfig } from '@/config/site/about.config';

export function AboutPage() {
  const {
    project, github, creators, technologies,
  } = aboutConfig;

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="bg-[#6A0DAD] text-white p-8 text-center">
        <h1 className="text-4xl font-bold mb-2 tracking-wider">À PROPOS</h1>
        <p className="text-[#D9B3FF] italic">
          ~ Découvrez l'univers de
          {project.name}
          {' '}
          ~
        </p>
      </div>

      {/* Content */}
      <div className="flex-1 bg-[#2B2B2B] p-8 overflow-y-auto">
        <div className="max-w-4xl mx-auto space-y-12">
          {/* Section Projet */}
          <Card className="bg-[#301934] border-[#A45EE5]">
            <CardContent className="p-8">
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-[#6A0DAD] rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-3xl">🔮</span>
                </div>
                <h2 className="text-2xl font-bold text-white mb-4">{project.name}</h2>
              </div>

              <div className="text-[#D9B3FF] space-y-4 text-center">
                <p className="text-lg italic">
                  "
                  {project.tagline}
                  "
                </p>
                {project.description.map((text, i) => (
                  <p key={i}>{text}</p>
                ))}
              </div>

              <div className="flex justify-center mt-6">
                <div className="flex items-center space-x-6 text-[#FF934F]">
                  {project.features.map((feature, index) => {
                    const Icon = { Star, Heart, Code }[feature.icon as keyof typeof import('lucide-react')];
                    return (
                      <div key={index} className="flex items-center">
                        {Icon && <Icon className="h-5 w-5 mr-2" />}
                        <span>{feature.label}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Créateurs */}
          <div>
            <h2 className="text-2xl font-bold text-[#D9B3FF] text-center mb-8">Les Architectes de la Magie</h2>
            <div className="grid md:grid-cols-3 gap-6">
              {creators.map((creator, index) => (
                <Card key={index} className="bg-[#301934] border-[#A45EE5] hover:border-[#FF7BAC] transition-colors">
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

          {/* GitHub */}
          <Card className="bg-[#301934] border-[#4CE0B3]">
            <CardContent className="p-8 text-center">
              <div className="w-16 h-16 bg-[#4CE0B3] rounded-full flex items-center justify-center mx-auto mb-6">
                <Github className="h-8 w-8 text-[#2B2B2B]" />
              </div>
              <h2 className="text-2xl font-bold text-white mb-4">Code Source Mystique</h2>
              <p className="text-[#D9B3FF] mb-6">
                {project.name}
                {' '}
                est un projet open source. Découvrez nos sortilèges de code, contribuez à la magie ou
                créez votre propre incantation !
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

          {/* Technologies */}
          <Card className="bg-[#301934] border-[#A3D5FF]">
            <CardContent className="p-8">
              <h2 className="text-2xl font-bold text-white text-center mb-6">Technologies Enchantées</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                {technologies.map((tech, index) => (
                  <div key={index} className="p-3 rounded-lg bg-[#2B2B2B]">
                    <span style={{ color: tech.color }} className="font-medium">
                      {tech.name}
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

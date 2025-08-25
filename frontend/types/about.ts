export interface Feature {
  label: string;
  icon: 'Star' | 'Heart' | 'Code';
}

export interface Project {
  name: string;
  tagline: string;
  description: string[];
  features: Feature[];
}

export interface Creator {
  name: string;
  role: string;
  avatar: string;
  color: string;
  description: string;
}

export interface Technology {
  name: string;
  color: string;
}

export interface AboutConfig {
  project: Project;
  creators: Creator[];
  github: {
    url: string;
    label: string;
  };
  technologies: Technology[];
}

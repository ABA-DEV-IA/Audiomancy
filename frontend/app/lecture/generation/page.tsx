// lecture/generation/page.tsx

'use client';

import { GenerationProvider } from '@/context/generation_context';
import LectureGeneratePage from '@/components/sections/lecture/lectureGenerateSection';

export default function Page() {
  return (
    <LectureGeneratePage />
  );
}

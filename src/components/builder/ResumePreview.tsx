import type { Resume } from '@/types/resume';
import { cn } from '@/lib/utils';

interface ResumePreviewProps {
  resume: Resume;
  className?: string;
}

export function ResumePreview({ resume, className }: ResumePreviewProps) {
  const { personalInfo, summary, skills, experience, education, projects } = resume;

  return (
    <div className={cn(
      "bg-white shadow-hero rounded-lg overflow-hidden mx-auto",
      "w-full max-w-[600px] aspect-[8.5/11]",
      className
    )}>
      <div className="p-6 md:p-8 h-full overflow-y-auto text-[10px] md:text-xs leading-relaxed text-gray-800">
        {/* Header / Personal Info */}
        <header className="text-center mb-4 pb-4 border-b border-gray-200">
          <h1 className="text-lg md:text-xl font-bold text-gray-900 mb-1">
            {personalInfo.fullName || 'Your Name'}
          </h1>
          {personalInfo.title && (
            <p className="text-gray-600 mb-2">{personalInfo.title}</p>
          )}
          <div className="flex flex-wrap items-center justify-center gap-x-3 gap-y-1 text-gray-500">
            {personalInfo.email && <span>{personalInfo.email}</span>}
            {personalInfo.phone && <span>{personalInfo.phone}</span>}
            {personalInfo.location && <span>{personalInfo.location}</span>}
          </div>
          {(personalInfo.linkedIn || personalInfo.website) && (
            <div className="flex items-center justify-center gap-3 mt-1 text-gray-500">
              {personalInfo.linkedIn && <span>{personalInfo.linkedIn}</span>}
              {personalInfo.website && <span>{personalInfo.website}</span>}
            </div>
          )}
        </header>

        {/* Summary */}
        {summary && (
          <section className="mb-4">
            <h2 className="text-xs md:text-sm font-bold text-gray-900 mb-2 uppercase tracking-wide">
              Professional Summary
            </h2>
            <p className="text-gray-700">{summary}</p>
          </section>
        )}

        {/* Skills */}
        {skills.length > 0 && (
          <section className="mb-4">
            <h2 className="text-xs md:text-sm font-bold text-gray-900 mb-2 uppercase tracking-wide">
              Skills
            </h2>
            <p className="text-gray-700">{skills.join(' • ')}</p>
          </section>
        )}

        {/* Experience */}
        {experience.length > 0 && (
          <section className="mb-4">
            <h2 className="text-xs md:text-sm font-bold text-gray-900 mb-2 uppercase tracking-wide">
              Experience
            </h2>
            <div className="space-y-3">
              {experience.map((exp) => (
                <div key={exp.id}>
                  <div className="flex justify-between items-start mb-1">
                    <div>
                      <p className="font-semibold text-gray-900">{exp.position}</p>
                      <p className="text-gray-600">{exp.company}{exp.location && ` • ${exp.location}`}</p>
                    </div>
                    <p className="text-gray-500 text-right shrink-0">
                      {exp.startDate} - {exp.endDate || 'Present'}
                    </p>
                  </div>
                  {exp.description && (
                    <p className="text-gray-700 mb-1">{exp.description}</p>
                  )}
                  {exp.achievements.length > 0 && (
                    <ul className="list-disc list-inside text-gray-700 space-y-0.5">
                      {exp.achievements.map((ach, i) => (
                        <li key={i}>{ach}</li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Projects */}
        {projects.length > 0 && (
          <section className="mb-4">
            <h2 className="text-xs md:text-sm font-bold text-gray-900 mb-2 uppercase tracking-wide">
              Projects
            </h2>
            <div className="space-y-3">
              {projects.map((proj) => (
                <div key={proj.id}>
                  <div className="flex justify-between items-start mb-1">
                    <p className="font-semibold text-gray-900">{proj.name}</p>
                    {proj.link && (
                      <p className="text-gray-500 text-right shrink-0">{proj.link}</p>
                    )}
                  </div>
                  {proj.description && (
                    <p className="text-gray-700 mb-1">{proj.description}</p>
                  )}
                  {proj.technologies.length > 0 && (
                    <p className="text-gray-500 text-[9px] md:text-[10px]">
                      Technologies: {proj.technologies.join(', ')}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Education */}
        {education.length > 0 && (
          <section>
            <h2 className="text-xs md:text-sm font-bold text-gray-900 mb-2 uppercase tracking-wide">
              Education
            </h2>
            <div className="space-y-2">
              {education.map((edu) => (
                <div key={edu.id}>
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-semibold text-gray-900">
                        {edu.degree} {edu.field && `in ${edu.field}`}
                      </p>
                      <p className="text-gray-600">{edu.institution}</p>
                    </div>
                    <div className="text-right shrink-0">
                      <p className="text-gray-500">
                        {edu.startDate} - {edu.endDate}
                      </p>
                      {edu.gpa && (
                        <p className="text-gray-500">GPA: {edu.gpa}</p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}

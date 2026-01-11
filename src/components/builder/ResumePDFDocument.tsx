import { Document, Page, Text, View, StyleSheet, Font } from '@react-pdf/renderer';
import type { Resume } from '@/types/resume';

// Register fonts (using system fonts that are ATS-safe)
Font.register({
  family: 'Helvetica',
  fonts: [
    { src: 'https://fonts.gstatic.com/s/roboto/v30/KFOmCnqEu92Fr1Me5Q.ttf', fontWeight: 400 },
    { src: 'https://fonts.gstatic.com/s/roboto/v30/KFOlCnqEu92Fr1MmWUlvAw.ttf', fontWeight: 700 },
  ],
});

interface ResumePDFDocumentProps {
  resume: Resume;
  pageSize: 'A4' | 'LETTER';
  showWatermark: boolean;
}

const styles = StyleSheet.create({
  page: {
    padding: 40,
    fontFamily: 'Helvetica',
    fontSize: 10,
    lineHeight: 1.5,
    color: '#333333',
  },
  watermark: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%) rotate(-45deg)',
    fontSize: 60,
    color: '#E5E7EB',
    opacity: 0.3,
    fontWeight: 'bold',
  },
  // Header section
  header: {
    marginBottom: 20,
    paddingBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
    textAlign: 'center',
  },
  name: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 4,
  },
  title: {
    fontSize: 12,
    color: '#6B7280',
    marginBottom: 8,
  },
  contactRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    flexWrap: 'wrap',
    gap: 8,
  },
  contactItem: {
    fontSize: 9,
    color: '#6B7280',
  },
  contactSeparator: {
    fontSize: 9,
    color: '#D1D5DB',
    marginHorizontal: 4,
  },
  // Section styles
  section: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 8,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
    paddingBottom: 4,
  },
  paragraph: {
    fontSize: 10,
    color: '#374151',
    lineHeight: 1.6,
  },
  // Skills
  skillsText: {
    fontSize: 10,
    color: '#374151',
  },
  // Experience / Education entries
  entryContainer: {
    marginBottom: 12,
  },
  entryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 4,
  },
  entryTitle: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#111827',
  },
  entrySubtitle: {
    fontSize: 10,
    color: '#6B7280',
    marginTop: 2,
  },
  entryDate: {
    fontSize: 9,
    color: '#6B7280',
    textAlign: 'right',
  },
  entryDescription: {
    fontSize: 10,
    color: '#374151',
    marginTop: 4,
    lineHeight: 1.5,
  },
  // Bullet list
  bulletList: {
    marginTop: 4,
  },
  bulletItem: {
    flexDirection: 'row',
    marginBottom: 2,
  },
  bullet: {
    width: 12,
    fontSize: 10,
    color: '#374151',
  },
  bulletText: {
    flex: 1,
    fontSize: 10,
    color: '#374151',
    lineHeight: 1.5,
  },
  // Project specific
  projectTech: {
    fontSize: 9,
    color: '#6B7280',
    marginTop: 4,
    fontStyle: 'italic',
  },
  projectLink: {
    fontSize: 9,
    color: '#2563EB',
    marginTop: 2,
  },
  // Education specific
  gpa: {
    fontSize: 9,
    color: '#6B7280',
    marginTop: 2,
  },
});

export function ResumePDFDocument({ resume, pageSize, showWatermark }: ResumePDFDocumentProps) {
  const { personalInfo, summary, skills, experience, education, projects } = resume;

  const ContactInfo = () => {
    const items = [
      personalInfo.email,
      personalInfo.phone,
      personalInfo.location,
    ].filter(Boolean);

    const links = [
      personalInfo.linkedIn,
      personalInfo.website,
    ].filter(Boolean);

    return (
      <View>
        <View style={styles.contactRow}>
          {items.map((item, idx) => (
            <View key={idx} style={{ flexDirection: 'row' }}>
              <Text style={styles.contactItem}>{item}</Text>
              {idx < items.length - 1 && <Text style={styles.contactSeparator}>|</Text>}
            </View>
          ))}
        </View>
        {links.length > 0 && (
          <View style={[styles.contactRow, { marginTop: 4 }]}>
            {links.map((link, idx) => (
              <View key={idx} style={{ flexDirection: 'row' }}>
                <Text style={styles.contactItem}>{link}</Text>
                {idx < links.length - 1 && <Text style={styles.contactSeparator}>|</Text>}
              </View>
            ))}
          </View>
        )}
      </View>
    );
  };

  return (
    <Document title={resume.name} author={personalInfo.fullName || 'Resume Builder'}>
      <Page size={pageSize} style={styles.page}>
        {/* Watermark */}
        {showWatermark && (
          <Text style={styles.watermark}>DRAFT</Text>
        )}

        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.name}>{personalInfo.fullName || 'Your Name'}</Text>
          {personalInfo.title && <Text style={styles.title}>{personalInfo.title}</Text>}
          <ContactInfo />
        </View>

        {/* Summary */}
        {summary && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Professional Summary</Text>
            <Text style={styles.paragraph}>{summary}</Text>
          </View>
        )}

        {/* Skills */}
        {skills.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Skills</Text>
            <Text style={styles.skillsText}>{skills.join(' • ')}</Text>
          </View>
        )}

        {/* Experience */}
        {experience.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Experience</Text>
            {experience.map((exp) => (
              <View key={exp.id} style={styles.entryContainer}>
                <View style={styles.entryHeader}>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.entryTitle}>{exp.position}</Text>
                    <Text style={styles.entrySubtitle}>
                      {exp.company}{exp.location ? ` • ${exp.location}` : ''}
                    </Text>
                  </View>
                  <Text style={styles.entryDate}>
                    {exp.startDate} - {exp.current ? 'Present' : exp.endDate}
                  </Text>
                </View>
                {exp.description && (
                  <Text style={styles.entryDescription}>{exp.description}</Text>
                )}
                {exp.achievements.length > 0 && (
                  <View style={styles.bulletList}>
                    {exp.achievements.filter(a => a.trim()).map((achievement, idx) => (
                      <View key={idx} style={styles.bulletItem}>
                        <Text style={styles.bullet}>•</Text>
                        <Text style={styles.bulletText}>{achievement}</Text>
                      </View>
                    ))}
                  </View>
                )}
              </View>
            ))}
          </View>
        )}

        {/* Projects */}
        {projects.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Projects</Text>
            {projects.map((proj) => (
              <View key={proj.id} style={styles.entryContainer}>
                <View style={styles.entryHeader}>
                  <Text style={styles.entryTitle}>{proj.name}</Text>
                  {(proj.startDate || proj.endDate) && (
                    <Text style={styles.entryDate}>
                      {proj.startDate}{proj.endDate ? ` - ${proj.endDate}` : ''}
                    </Text>
                  )}
                </View>
                {proj.link && <Text style={styles.projectLink}>{proj.link}</Text>}
                {proj.description && (
                  <Text style={styles.entryDescription}>{proj.description}</Text>
                )}
                {proj.technologies.length > 0 && (
                  <Text style={styles.projectTech}>
                    Technologies: {proj.technologies.join(', ')}
                  </Text>
                )}
              </View>
            ))}
          </View>
        )}

        {/* Education */}
        {education.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Education</Text>
            {education.map((edu) => (
              <View key={edu.id} style={styles.entryContainer}>
                <View style={styles.entryHeader}>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.entryTitle}>
                      {edu.degree}{edu.field ? ` in ${edu.field}` : ''}
                    </Text>
                    <Text style={styles.entrySubtitle}>{edu.institution}</Text>
                  </View>
                  <View>
                    <Text style={styles.entryDate}>
                      {edu.startDate} - {edu.endDate}
                    </Text>
                    {edu.gpa && <Text style={styles.gpa}>GPA: {edu.gpa}</Text>}
                  </View>
                </View>
                {edu.achievements.length > 0 && (
                  <View style={styles.bulletList}>
                    {edu.achievements.filter(a => a.trim()).map((achievement, idx) => (
                      <View key={idx} style={styles.bulletItem}>
                        <Text style={styles.bullet}>•</Text>
                        <Text style={styles.bulletText}>{achievement}</Text>
                      </View>
                    ))}
                  </View>
                )}
              </View>
            ))}
          </View>
        )}
      </Page>
    </Document>
  );
}

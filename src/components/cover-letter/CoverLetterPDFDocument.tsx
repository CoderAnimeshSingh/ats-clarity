import { Document, Page, Text, View, StyleSheet, Font } from '@react-pdf/renderer';
import type { CoverLetter } from '@/types/resume';

// Register fonts
Font.register({
  family: 'Helvetica',
  fonts: [
    { src: 'https://cdn.jsdelivr.net/npm/@canvas-fonts/helvetica@1.0.4/Helvetica.ttf', fontWeight: 'normal' },
    { src: 'https://cdn.jsdelivr.net/npm/@canvas-fonts/helvetica@1.0.4/Helvetica-Bold.ttf', fontWeight: 'bold' },
  ],
});

interface CoverLetterPDFDocumentProps {
  coverLetter: CoverLetter;
  pageSize: 'A4' | 'LETTER';
  showWatermark: boolean;
}

const styles = StyleSheet.create({
  page: {
    padding: 60,
    fontFamily: 'Helvetica',
    fontSize: 11,
    lineHeight: 1.6,
    color: '#1a1a1a',
  },
  content: {
    whiteSpace: 'pre-wrap',
  },
  watermark: {
    position: 'absolute',
    top: '40%',
    left: '20%',
    fontSize: 60,
    color: '#e0e0e0',
    opacity: 0.3,
    transform: 'rotate(-45deg)',
    fontWeight: 'bold',
  },
  date: {
    marginBottom: 30,
    textAlign: 'right',
  },
  body: {
    textAlign: 'justify',
  },
});

export function CoverLetterPDFDocument({ coverLetter, pageSize, showWatermark }: CoverLetterPDFDocumentProps) {
  const currentDate = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <Document>
      <Page size={pageSize} style={styles.page}>
        {showWatermark && (
          <Text style={styles.watermark}>DRAFT</Text>
        )}
        
        <View style={styles.date}>
          <Text>{currentDate}</Text>
        </View>
        
        <View style={styles.body}>
          <Text style={styles.content}>{coverLetter.content}</Text>
        </View>
      </Page>
    </Document>
  );
}

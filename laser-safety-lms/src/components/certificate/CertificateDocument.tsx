'use client';

import { Document, Page, Text, View, StyleSheet, Font } from '@react-pdf/renderer';

const styles = StyleSheet.create({
  page: {
    backgroundColor: '#0f0f0f',
    padding: 60,
    fontFamily: 'Helvetica',
  },
  border: {
    border: '3px solid #dc2626',
    borderRadius: 4,
    padding: 40,
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },
  innerBorder: {
    border: '1px solid #7f1d1d',
    borderRadius: 2,
    padding: 30,
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  logo: {
    fontSize: 36,
    marginBottom: 8,
    color: '#dc2626',
  },
  company: {
    fontSize: 11,
    color: '#9ca3af',
    letterSpacing: 3,
    textTransform: 'uppercase',
    marginBottom: 24,
  },
  title: {
    fontSize: 32,
    color: '#ffffff',
    fontFamily: 'Helvetica-Bold',
    marginBottom: 6,
    letterSpacing: 2,
  },
  subtitle: {
    fontSize: 13,
    color: '#6b7280',
    letterSpacing: 1,
    marginBottom: 40,
  },
  certifyText: {
    fontSize: 11,
    color: '#9ca3af',
    marginBottom: 12,
    letterSpacing: 1,
  },
  name: {
    fontSize: 36,
    color: '#f87171',
    fontFamily: 'Helvetica-BoldOblique',
    marginBottom: 8,
    letterSpacing: 1,
  },
  nameUnderline: {
    width: 300,
    height: 1,
    backgroundColor: '#dc2626',
    marginBottom: 28,
    opacity: 0.5,
  },
  courseLabel: {
    fontSize: 10,
    color: '#6b7280',
    letterSpacing: 2,
    marginBottom: 8,
    textTransform: 'uppercase',
  },
  courseTitle: {
    fontSize: 20,
    color: '#e5e7eb',
    fontFamily: 'Helvetica-Bold',
    marginBottom: 4,
    textAlign: 'center',
  },
  score: {
    fontSize: 11,
    color: '#22c55e',
    marginBottom: 36,
  },
  dateRow: {
    flexDirection: 'row',
    gap: 60,
    marginTop: 20,
  },
  dateCol: {
    alignItems: 'center',
  },
  dateValue: {
    fontSize: 12,
    color: '#e5e7eb',
    fontFamily: 'Helvetica-Bold',
    marginBottom: 4,
  },
  dateLabel: {
    fontSize: 9,
    color: '#6b7280',
    letterSpacing: 2,
    textTransform: 'uppercase',
  },
  footer: {
    marginTop: 30,
    fontSize: 9,
    color: '#4b5563',
    textAlign: 'center',
    letterSpacing: 1,
  },
});

interface CertificateDocumentProps {
  name: string;
  courseTitle: string;
  completedAt: string;
  score?: number;
  total?: number;
}

export default function CertificateDocument({
  name,
  courseTitle,
  completedAt,
  score,
  total,
}: CertificateDocumentProps) {
  const date = new Date(completedAt).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const scoreText = score !== undefined && total !== undefined
    ? `Score: ${score}/${total} (${Math.round((score / total) * 100)}%)`
    : '';

  return (
    <Document>
      <Page size="A4" orientation="landscape" style={styles.page}>
        <View style={styles.border}>
          <View style={styles.innerBorder}>
            <Text style={styles.logo}>⬤</Text>
            <Text style={styles.company}>Laser Safety Services</Text>

            <Text style={styles.title}>CERTIFICATE</Text>
            <Text style={styles.subtitle}>OF COMPLETION</Text>

            <Text style={styles.certifyText}>THIS CERTIFIES THAT</Text>
            <Text style={styles.name}>{name}</Text>
            <View style={styles.nameUnderline} />

            <Text style={styles.courseLabel}>has successfully completed</Text>
            <Text style={styles.courseTitle}>{courseTitle}</Text>
            {scoreText ? <Text style={styles.score}>{scoreText}</Text> : null}

            <View style={styles.dateRow}>
              <View style={styles.dateCol}>
                <Text style={styles.dateValue}>{date}</Text>
                <Text style={styles.dateLabel}>Date Completed</Text>
              </View>
              <View style={styles.dateCol}>
                <Text style={styles.dateValue}>LASER-LMS</Text>
                <Text style={styles.dateLabel}>Certificate ID</Text>
              </View>
            </View>

            <Text style={styles.footer}>
              This certificate verifies completion of laser safety training in accordance with ANSI Z136 and applicable regulations.
            </Text>
          </View>
        </View>
      </Page>
    </Document>
  );
}

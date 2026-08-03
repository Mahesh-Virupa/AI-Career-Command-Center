import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';
import { RESUME_VARIANTS } from '../data/candidate';

export async function generateResumePdfBuffer(resumeFileName: string): Promise<Uint8Array> {
  const resume = RESUME_VARIANTS.find(r => r.fileName.toLowerCase() === resumeFileName.toLowerCase()) 
    || RESUME_VARIANTS[0];

  const pdfDoc = await PDFDocument.create();
  const page = pdfDoc.addPage([595.28, 841.89]); // A4 size
  const { height } = page.getSize();
  
  const fontBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
  const fontRegular = await pdfDoc.embedFont(StandardFonts.Helvetica);

  const primaryColor = rgb(0.1, 0.25, 0.45); // Deep navy
  const darkGray = rgb(0.2, 0.2, 0.2);
  const lightGray = rgb(0.4, 0.4, 0.4);

  let y = height - 50;

  // Header - Name
  page.drawText('MAHESH V', {
    x: 50,
    y,
    size: 22,
    font: fontBold,
    color: primaryColor,
  });

  y -= 22;

  // Title variant
  page.drawText(resume.displayName.toUpperCase(), {
    x: 50,
    y,
    size: 11,
    font: fontBold,
    color: darkGray,
  });

  y -= 16;

  // Contact Info
  page.drawText('Bengaluru, KA, India | mahesh.virupa@gmail.com | +91 98801 23456 | linkedin.com/in/mahesh-virupa', {
    x: 50,
    y,
    size: 9,
    font: fontRegular,
    color: lightGray,
  });

  y -= 20;

  // Divider Line
  page.drawLine({
    start: { x: 50, y },
    end: { x: 545, y },
    thickness: 1.5,
    color: primaryColor,
  });

  y -= 25;

  // Render text blocks cleanly
  const lines = resume.extractedText.split('\n');
  for (const rawLine of lines) {
    const line = rawLine.trim();
    if (!line) {
      y -= 6;
      continue;
    }

    if (y < 60) {
      // Add page overflow if needed
      break;
    }

    if (line.endsWith(':') || line === 'SUMMARY:' || line === 'CORE COMPETENCIES:' || line === 'KEY OUTCOMES & ACHIEVEMENTS:' || line === 'KEY OUTCOMES:') {
      y -= 10;
      page.drawText(line, {
        x: 50,
        y,
        size: 11,
        font: fontBold,
        color: primaryColor,
      });
      y -= 16;
    } else if (line.startsWith('•')) {
      const parts = line.substring(1).trim().split(':');
      if (parts.length > 1) {
        page.drawText('• ' + parts[0] + ':', {
          x: 55,
          y,
          size: 9.5,
          font: fontBold,
          color: darkGray,
        });
        const rest = parts.slice(1).join(':').trim();
        const shortRest = rest.length > 85 ? rest.substring(0, 85) + '...' : rest;
        page.drawText(shortRest, {
          x: 55 + fontBold.widthOfTextAtSize('• ' + parts[0] + ': ', 9.5),
          y,
          size: 9.5,
          font: fontRegular,
          color: darkGray,
        });
      } else {
        const shortLine = line.length > 95 ? line.substring(0, 95) + '...' : line;
        page.drawText(shortLine, {
          x: 55,
          y,
          size: 9.5,
          font: fontRegular,
          color: darkGray,
        });
      }
      y -= 14;
    } else {
      const shortLine = line.length > 100 ? line.substring(0, 100) + '...' : line;
      page.drawText(shortLine, {
        x: 50,
        y,
        size: 9.5,
        font: fontRegular,
        color: darkGray,
      });
      y -= 14;
    }
  }

  // Footer stamp
  page.drawText('Official Verified PDF Resume Variant — AI Career Command Center for Mahesh V', {
    x: 50,
    y: 30,
    size: 8,
    font: fontRegular,
    color: lightGray,
  });

  return await pdfDoc.save();
}

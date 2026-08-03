import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';
import { store } from '../db/store';

export async function generateResumePdfBuffer(resumeFileName: string): Promise<Uint8Array> {
  const allResumes = store.getResumes();
  const uploadedResumes = allResumes.filter(r => !['res_arch', 'res_principal_eng', 'res_sr_eng_mgr', 'res_dir_eng'].includes(r.id));
  
  const resume = allResumes.find(r => r.fileName.toLowerCase() === resumeFileName.toLowerCase() || r.id === resumeFileName)
    || (uploadedResumes.length > 0 ? uploadedResumes[uploadedResumes.length - 1] : allResumes[allResumes.length - 1]);

  if (!resume) {
    throw new Error('No résumé found in store');
  }

  const pdfDoc = await PDFDocument.create();
  let page = pdfDoc.addPage([595.28, 841.89]); // A4 size
  const { height, width } = page.getSize();
  const marginX = 45;
  const maxLineWidth = width - marginX * 2;
  
  const fontBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
  const fontRegular = await pdfDoc.embedFont(StandardFonts.Helvetica);

  const primaryColor = rgb(0.1, 0.25, 0.45); // Deep navy
  const darkGray = rgb(0.2, 0.2, 0.2);
  const lightGray = rgb(0.4, 0.4, 0.4);

  let y = height - 45;

  const addNewPageIfNeeded = (requiredSpace = 20) => {
    if (y < 45 + requiredSpace) {
      page = pdfDoc.addPage([595.28, 841.89]);
      y = height - 45;
      return true;
    }
    return false;
  };

  // Header - Name
  page.drawText('MAHESH V', {
    x: marginX,
    y,
    size: 20,
    font: fontBold,
    color: primaryColor,
  });

  y -= 20;

  // Title variant
  page.drawText((resume.displayName || resume.fileName).toUpperCase(), {
    x: marginX,
    y,
    size: 11,
    font: fontBold,
    color: darkGray,
  });

  y -= 15;

  // Contact Info
  page.drawText('Bengaluru, KA, India | mahesh.virupa@gmail.com | +91 98865 49126 | linkedin.com/in/mahesh-v-8187476', {
    x: marginX,
    y,
    size: 9,
    font: fontRegular,
    color: lightGray,
  });

  y -= 15;

  // Divider Line
  page.drawLine({
    start: { x: marginX, y },
    end: { x: width - marginX, y },
    thickness: 1.5,
    color: primaryColor,
  });

  y -= 20;

  // Helper to wrap text into lines fitting maxLineWidth
  const wrapText = (text: string, font: any, size: number, maxWidth: number): string[] => {
    const words = text.split(' ');
    const lines: string[] = [];
    let currentLine = '';

    for (const word of words) {
      const testLine = currentLine ? `${currentLine} ${word}` : word;
      const testWidth = font.widthOfTextAtSize(testLine, size);
      if (testWidth <= maxWidth) {
        currentLine = testLine;
      } else {
        if (currentLine) lines.push(currentLine);
        currentLine = word;
      }
    }
    if (currentLine) lines.push(currentLine);
    return lines;
  };

  // Render text blocks without truncating
  const paragraphs = resume.extractedText.split('\n');
  for (const rawParagraph of paragraphs) {
    const para = rawParagraph.trim();
    if (!para) {
      y -= 6;
      addNewPageIfNeeded(15);
      continue;
    }

    const isHeader = para.endsWith(':') || 
      ['SUMMARY:', 'CORE COMPETENCIES:', 'KEY OUTCOMES & ACHIEVEMENTS:', 'KEY OUTCOMES:', 'PROFESSIONAL EXPERIENCE:', 'EDUCATION & CERTIFICATIONS:'].includes(para.toUpperCase());

    if (isHeader) {
      y -= 8;
      addNewPageIfNeeded(25);
      page.drawText(para.toUpperCase(), {
        x: marginX,
        y,
        size: 10.5,
        font: fontBold,
        color: primaryColor,
      });
      y -= 15;
    } else {
      const isBullet = para.startsWith('•') || para.startsWith('-');
      const cleanPara = isBullet ? para.substring(1).trim() : para;
      const bulletPrefix = isBullet ? '• ' : '';
      const indentX = isBullet ? marginX + 12 : marginX;
      const availWidth = isBullet ? maxLineWidth - 12 : maxLineWidth;

      const wrappedLines = wrapText(cleanPara, fontRegular, 9, availWidth);

      for (let i = 0; i < wrappedLines.length; i++) {
        addNewPageIfNeeded(16);
        const lineText = wrappedLines[i];
        
        if (i === 0 && isBullet) {
          page.drawText(bulletPrefix, {
            x: marginX,
            y,
            size: 9,
            font: fontBold,
            color: darkGray,
          });
        }

        page.drawText(lineText, {
          x: indentX,
          y,
          size: 9,
          font: fontRegular,
          color: darkGray,
        });

        y -= 13;
      }
    }
  }

  // Footer on final page
  addNewPageIfNeeded(20);
  page.drawText('Official Loaded PDF Résumé — AI Career Command Center for Mahesh V', {
    x: marginX,
    y: 20,
    size: 7.5,
    font: fontRegular,
    color: lightGray,
  });

  return await pdfDoc.save();
}

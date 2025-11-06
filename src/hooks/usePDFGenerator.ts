import { jsPDF } from "jspdf";
import { useStartupContext } from "./useStartupContext";

export function usePDFGenerator() {
  const { startupData } = useStartupContext();

  const generateReportPDF = (content: string, agentName: string) => {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.width;
    const pageHeight = doc.internal.pageSize.height;
    const margin = 25.4; // 1 inch in mm
    const lineHeight = 6;
    const maxWidth = pageWidth - (margin * 2);

    let yPosition = margin;

    // Helper function to add text with word wrap
    const addWrappedText = (text: string, fontSize: number = 12, isBold: boolean = false) => {
      doc.setFontSize(fontSize);
      if (isBold) {
        doc.setFont("helvetica", "bold");
      } else {
        doc.setFont("helvetica", "normal");
      }

      const lines = doc.splitTextToSize(text, maxWidth);
      lines.forEach((line: string) => {
        if (yPosition > pageHeight - margin) {
          doc.addPage();
          yPosition = margin;
        }
        doc.text(line, margin, yPosition);
        yPosition += lineHeight;
      });
      yPosition += 2; // Extra spacing after text blocks
    };

    // Header
    addWrappedText(`${agentName} Report`, 16, true);
    
    // Startup name if available
    if (startupData?.fullName) {
      addWrappedText(`User: ${startupData.fullName}`, 12, true);
    }

    // Date and time
    const now = new Date();
    addWrappedText(`Generated: ${now.toLocaleDateString()} at ${now.toLocaleTimeString()}`, 10);
    addWrappedText(`Agent: ${agentName}`, 10);

    // Horizontal divider
    yPosition += 5;
    doc.setDrawColor(0, 0, 0);
    doc.line(margin, yPosition, pageWidth - margin, yPosition);
    yPosition += 10;

    // Process the content
    const sections = content.split('\n\n');
    
    sections.forEach((section) => {
      if (section.trim()) {
        // Check for headings (lines that end with : or contain certain keywords)
        if (section.includes(':') && section.split('\n').length === 1) {
          addWrappedText(section, 12, true);
        } else if (section.startsWith('•') || section.match(/^\d+\./)) {
          // Handle bullet points and numbered lists
          addWrappedText(section, 11);
        } else {
          // Regular content
          addWrappedText(section, 11);
        }
      }
    });

    // Save the PDF
    const fileName = `${agentName.toLowerCase()}-report-${Date.now()}.pdf`;
    doc.save(fileName);
  };

  return { generateReportPDF };
}
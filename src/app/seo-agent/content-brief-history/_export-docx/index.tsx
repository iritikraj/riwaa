/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import React, { useState } from 'react';
import { Download, Loader2 } from 'lucide-react';
import { Document, Packer, Paragraph, TextRun, HeadingLevel } from 'docx';

export default function ExportDocxButton({ data, topic }: { data: any; topic: string }) {
  const [isExporting, setIsExporting] = useState(false);

  const generateDocx = async () => {
    setIsExporting(true);
    try {
      const sections = [];

      // 1. Meta Data Section
      sections.push(
        new Paragraph({ text: "Content Strategy Brief", heading: HeadingLevel.TITLE }),
        new Paragraph({ text: `Topic: ${topic}`, heading: HeadingLevel.HEADING_2 }),
        new Paragraph({ text: "" }),
        new Paragraph({
          children: [
            new TextRun({ text: "URL Slug: ", bold: true }),
            new TextRun(data.url_slug || 'N/A'),
          ],
        }),
        new Paragraph({
          children: [
            new TextRun({ text: "Meta Title: ", bold: true }),
            new TextRun(data.meta_title || 'N/A'),
          ],
        }),
        new Paragraph({
          children: [
            new TextRun({ text: "Meta Description: ", bold: true }),
            new TextRun(data.meta_description || 'N/A'),
          ],
        }),
        new Paragraph({ text: "" }),
        // new Paragraph({ text: data.h1 || 'N/A', heading: HeadingLevel.HEADING_1 }),
        new Paragraph({ text: `H1: ${data.h1 || 'N/A'}`, heading: HeadingLevel.HEADING_1 }),
        new Paragraph({ text: "" }),
        new Paragraph({ text: "Strategic Summary", heading: HeadingLevel.HEADING_2 }),
        new Paragraph({ text: data.strategic_summary || 'N/A' }),
        new Paragraph({ text: "" })
      );

      // 2. Architecture (H2s and H3s)
      if (data.architecture && Array.isArray(data.architecture)) {
        data.architecture.forEach((h2: any) => {
          // Add H2
          // sections.push(new Paragraph({ text: h2.heading, heading: HeadingLevel.HEADING_2 }));
          sections.push(new Paragraph({ text: `H2: ${h2.heading}`, heading: HeadingLevel.HEADING_2 }));

          // Add Intent
          if (h2.intent_direction) {
            sections.push(new Paragraph({
              children: [new TextRun({ text: "Direction: ", bold: true }), new TextRun({ text: h2.intent_direction, italics: true })]
            }));
          }

          // Add Entities (FIXED HERE)
          if (h2.assigned_entities && h2.assigned_entities.length > 0) {
            sections.push(new Paragraph({
              children: [new TextRun({ text: "Required Entities:", bold: true })]
            }));
            h2.assigned_entities.forEach((entity: string) => {
              sections.push(new Paragraph({ text: entity, bullet: { level: 0 } }));
            });
          }

          // Add H3 Children
          if (h2.children && Array.isArray(h2.children)) {
            h2.children.forEach((h3: any) => {
              // sections.push(new Paragraph({ text: h3.heading, heading: HeadingLevel.HEADING_3 }));
              sections.push(new Paragraph({ text: `H3: ${h3.heading}`, heading: HeadingLevel.HEADING_3 }));
              if (h3.intent_direction) {
                sections.push(new Paragraph({
                  children: [new TextRun({ text: "Direction: ", bold: true }), new TextRun({ text: h3.intent_direction, italics: true })]
                }));
              }

              // Add H3 Entities (FIXED HERE)
              if (h3.assigned_entities && h3.assigned_entities.length > 0) {
                sections.push(new Paragraph({
                  children: [new TextRun({ text: "Required Entities:", bold: true })]
                }));
                h3.assigned_entities.forEach((entity: string) => {
                  sections.push(new Paragraph({ text: entity, bullet: { level: 0 } }));
                });
              }
            });
          }
          sections.push(new Paragraph({ text: "" })); // Spacing
        });
      }

      // 3. FAQs
      if (data.faqs && Array.isArray(data.faqs)) {
        sections.push(new Paragraph({ text: "Frequently Asked Questions", heading: HeadingLevel.HEADING_2 }));
        data.faqs.forEach((faq: any) => {
          sections.push(
            new Paragraph({ text: faq.question, heading: HeadingLevel.HEADING_3 }),
            new Paragraph({
              children: [new TextRun({ text: "Answer Direction: ", bold: true }), new TextRun({ text: faq.answer_direction, italics: true })]
            }),
            new Paragraph({ text: "" })
          );
        });
      }

      // Build Document
      const doc = new Document({
        sections: [{ properties: {}, children: sections }]
      });

      // Export and Download
      const blob = await Packer.toBlob(doc);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `Brief_${topic.replace(/\s+/g, '_')}.docx`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);

    } catch (error) {
      console.error("Failed to generate DOCX:", error);
      alert("Failed to generate document.");
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <button
      onClick={generateDocx}
      disabled={isExporting}
      className="print:hidden inline-flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white text-sm font-medium rounded-lg hover:bg-emerald-700 transition-colors disabled:opacity-70"
    >
      {isExporting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
      {isExporting ? 'Generating...' : 'Export .docx'}
    </button>
  );
}
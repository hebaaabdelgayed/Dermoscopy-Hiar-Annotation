
import { Annotation, FeatureType, Stats } from '../types';
import { FEATURES } from '../constants';

export const downloadAnnotatedImage = (
  imageUrl: string,
  annotations: Annotation[],
  stats: Stats,
  naturalSize: { width: number; height: number },
  patientId: string
) => {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  const img = new Image();
  img.crossOrigin = 'anonymous';
  img.onload = () => {
    // Set canvas size to image size
    canvas.width = naturalSize.width;
    canvas.height = naturalSize.height;

    // Draw the original image
    ctx.drawImage(img, 0, 0, naturalSize.width, naturalSize.height);

    // Draw annotations
    annotations.forEach(annotation => {
      const feature = FEATURES.find(f => f.id === annotation.type);
      if (feature) {
        ctx.beginPath();
        ctx.arc(annotation.x, annotation.y, annotation.radius, 0, 2 * Math.PI, false);
        ctx.fillStyle = feature.color;
        ctx.globalAlpha = 0.7;
        ctx.fill();
        ctx.lineWidth = 1;
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.8)';
        ctx.stroke();
      }
    });

    // Draw the results report
    drawReport(ctx, stats, naturalSize.width, naturalSize.height, patientId);

    // Trigger download
    const link = document.createElement('a');
    const timestamp = new Date().toISOString().replace(/:/g, '-');
    const filename = patientId
      ? `report-${patientId}-${timestamp}.png`
      : `report-${timestamp}.png`;
    link.download = filename;
    link.href = canvas.toDataURL('image/png');
    link.click();
  };
  img.src = imageUrl;
};

const drawReport = (ctx: CanvasRenderingContext2D, stats: Stats, canvasWidth: number, canvasHeight: number, patientId: string) => {
    const vellusCount = stats[FeatureType.VELLUS_HAIR] || 0;
    const terminalCount = stats[FeatureType.TERMINAL_HAIR] || 0;
    const totalHairCount = vellusCount + terminalCount;
    const vellusToTerminalRatio = terminalCount > 0 ? (vellusCount / terminalCount).toFixed(2) : 'N/A';
    
    const fu1Count = stats[FeatureType.FOLLICULAR_UNIT_1] || 0;
    const fu2Count = stats[FeatureType.FOLLICULAR_UNIT_2] || 0;
    const fu3PlusCount = stats[FeatureType.FOLLICULAR_UNIT_3_PLUS] || 0;
    const totalFUCount = fu1Count + fu2Count + fu3PlusCount;
    
    const anagenCount = stats[FeatureType.ANAGEN_HAIR] || 0;
    const telogenCount = stats[FeatureType.TELOGEN_HAIR] || 0;
    const totalPhaseCount = anagenCount + telogenCount;
    const anagenToTelogenRatio = telogenCount > 0 ? (anagenCount / telogenCount).toFixed(2) : 'N/A';

    const getPercentage = (count: number, total: number) => {
        if (total === 0) return '0.0%';
        return `${((count / total) * 100).toFixed(1)}%`;
    };

    const reportLines = [
        `Patient ID: ${patientId || 'N/A'}`,
        '--- Analysis Report ---',
        `Total Hairs: ${totalHairCount}`,
        `Vellus Hairs: ${vellusCount} (${getPercentage(vellusCount, totalHairCount)})`,
        `Terminal Hairs: ${terminalCount} (${getPercentage(terminalCount, totalHairCount)})`,
        `V:T Ratio: ${vellusToTerminalRatio}`,
        '',
        `Total FUs: ${totalFUCount}`,
        `  - 1-Hair FUs: ${fu1Count} (${getPercentage(fu1Count, totalFUCount)})`,
        `  - 2-Hair FUs: ${fu2Count} (${getPercentage(fu2Count, totalFUCount)})`,
        `  - 3+ Hair FUs: ${fu3PlusCount} (${getPercentage(fu3PlusCount, totalFUCount)})`,
        '',
        `Anagen Hairs: ${anagenCount} (${getPercentage(anagenCount, totalPhaseCount)})`,
        `Telogen Hairs: ${telogenCount} (${getPercentage(telogenCount, totalPhaseCount)})`,
        `A:T Ratio: ${anagenToTelogenRatio}`,
    ];

    const padding = 20;
    const lineHeight = 28;
    const fontSize = 22;
    const boxWidth = 430;
    const boxHeight = reportLines.length * lineHeight + padding;
    const startX = canvasWidth - boxWidth - padding;
    const startY = padding;

    ctx.globalAlpha = 0.85;
    ctx.fillStyle = '#1f2937'; // gray-800
    ctx.fillRect(startX, startY, boxWidth, boxHeight);
    
    ctx.globalAlpha = 1.0;
    ctx.fillStyle = '#f3f4f6'; // gray-100
    ctx.font = `bold ${fontSize}px sans-serif`;
    
    reportLines.forEach((line, index) => {
        const y = startY + padding + index * lineHeight;
        ctx.fillText(line, startX + padding / 2, y);
    });
};

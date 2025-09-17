
import React, { useRef, useEffect, useState, useCallback } from 'react';
import { Annotation } from '../types';
import { FEATURES } from '../constants';

interface AnnotationCanvasProps {
  imageUrl: string;
  annotations: Annotation[];
  onAnnotate: (x: number, y: number) => void;
  zoom: number;
  brushSize: number;
  activeFeatureColor: string;
  showAnnotations: boolean;
}

const AnnotationCanvas: React.FC<AnnotationCanvasProps> = ({
  imageUrl,
  annotations,
  onAnnotate,
  zoom,
  brushSize,
  activeFeatureColor,
  showAnnotations,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  const [naturalSize, setNaturalSize] = useState({ width: 0, height: 0 });
  const [mousePos, setMousePos] = useState<{ x: number; y: number } | null>(null);

  useEffect(() => {
    const image = imageRef.current;
    if (image) {
      const handleLoad = () => {
        setNaturalSize({ width: image.naturalWidth, height: image.naturalHeight });
      };
      image.addEventListener('load', handleLoad);
      if (image.complete) {
        handleLoad();
      }
      return () => image.removeEventListener('load', handleLoad);
    }
  }, [imageUrl]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas?.getContext('2d');
    if (context && canvas && naturalSize.width > 0) {
      canvas.width = naturalSize.width;
      canvas.height = naturalSize.height;

      context.clearRect(0, 0, canvas.width, canvas.height);

      if (showAnnotations) {
        annotations.forEach(annotation => {
          const feature = FEATURES.find(f => f.id === annotation.type);
          if (feature) {
            context.beginPath();
            context.arc(annotation.x, annotation.y, annotation.radius, 0, 2 * Math.PI, false);
            context.fillStyle = feature.color;
            context.globalAlpha = 0.7;
            context.fill();
            context.lineWidth = 1;
            context.strokeStyle = 'rgba(255, 255, 255, 0.8)';
            context.stroke();
          }
        });
      }
    }
  }, [annotations, naturalSize, showAnnotations]);

  const getCanvasCoordinates = (e: React.MouseEvent<HTMLDivElement>): { x: number; y: number } | null => {
    const canvas = canvasRef.current;
    if (!canvas) return null;
    const rect = canvas.getBoundingClientRect();
    const x = (e.clientX - rect.left) / zoom;
    const y = (e.clientY - rect.top) / zoom;
    return { x, y };
  };

  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const coords = getCanvasCoordinates(e);
    if (coords) {
      onAnnotate(coords.x, coords.y);
    }
  };

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const coords = getCanvasCoordinates(e);
    if (coords) {
      setMousePos(coords);
    }
  }, [zoom]);
  
  const handleMouseLeave = useCallback(() => {
    setMousePos(null);
  }, []);

  return (
    <div 
      ref={containerRef} 
      className="flex-1 w-full h-full relative overflow-auto bg-black rounded-b-lg cursor-crosshair"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onClick={handleClick}
    >
      <div
        className="relative"
        style={{
          width: naturalSize.width * zoom,
          height: naturalSize.height * zoom,
        }}
      >
        <img
          ref={imageRef}
          src={imageUrl}
          alt="Dermoscopic"
          className="absolute top-0 left-0"
          style={{ width: '100%', height: '100%' }}
        />
        <canvas
          ref={canvasRef}
          className="absolute top-0 left-0"
          style={{ width: '100%', height: '100%' }}
        />
        {mousePos && (
          <div
            className="absolute rounded-full pointer-events-none border-2"
            style={{
              left: mousePos.x * zoom,
              top: mousePos.y * zoom,
              width: brushSize * 2,
              height: brushSize * 2,
              transform: 'translate(-50%, -50%)',
              borderColor: activeFeatureColor,
              backgroundColor: `${activeFeatureColor}40`,
            }}
          />
        )}
      </div>
    </div>
  );
};

export default AnnotationCanvas;

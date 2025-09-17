
import React, { useState, useCallback, useMemo, useEffect } from 'react';
import { Annotation, FeatureType, Stats } from './types';
import { FEATURES } from './constants';
import ControlPanel from './components/ControlPanel';
import AnnotationCanvas from './components/AnnotationCanvas';
import ResultsPanel from './components/ResultsPanel';
import ImageUploader from './components/ImageUploader';
import { downloadAnnotatedImage } from './services/downloadService';


const App: React.FC = () => {
  const [image, setImage] = useState<string | null>(null);
  const [naturalSize, setNaturalSize] = useState<{ width: number; height: number }>({ width: 0, height: 0 });
  const [annotations, setAnnotations] = useState<Annotation[]>([]);
  const [activeFeature, setActiveFeature] = useState<FeatureType>(FEATURES[0].id);
  const [zoom, setZoom] = useState(1);
  const [brushSize, setBrushSize] = useState(5);
  const [stats, setStats] = useState<Stats>({});
  const [patientId, setPatientId] = useState('');
  const [showAnnotations, setShowAnnotations] = useState(true);

  useEffect(() => {
    const newStats: Stats = {};
    FEATURES.forEach(feature => {
      newStats[feature.id] = annotations.filter(a => a.type === feature.id).length;
    });
    setStats(newStats);
  }, [annotations]);

  const handleImageUpload = useCallback((file: File) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const result = reader.result as string;
      setImage(result);
      setAnnotations([]);
      setZoom(1);
      setPatientId('');
      setShowAnnotations(true);

      const img = new Image();
      img.onload = () => {
        setNaturalSize({ width: img.width, height: img.height });
      };
      img.src = result;
    };
    reader.readAsDataURL(file);
  }, []);

  const handleAnnotate = useCallback((x: number, y: number) => {
    const newAnnotation: Annotation = {
      id: new Date().toISOString(),
      x,
      y,
      type: activeFeature,
      radius: brushSize,
    };
    setAnnotations(prev => [...prev, newAnnotation]);
  }, [activeFeature, brushSize]);
  
  const handleUndo = useCallback(() => {
    setAnnotations(prev => prev.slice(0, -1));
  }, []);

  const handleClear = useCallback(() => {
    if (window.confirm('Are you sure you want to clear all annotations?')) {
      setAnnotations([]);
    }
  }, []);
  
  const handleDownload = useCallback(() => {
    if (!image) return;
    downloadAnnotatedImage(image, annotations, stats, naturalSize, patientId);
  }, [image, annotations, stats, naturalSize, patientId]);
  

  const memoizedStats = useMemo(() => stats, [stats]);

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col p-4 font-sans">
      <header className="text-center mb-4">
        <h1 className="text-3xl font-bold text-gray-100 tracking-wider">Dermoscopic Hair Annotator</h1>
        <p className="text-gray-400">Upload, annotate, and analyze hair and scalp images with precision.</p>
      </header>
      
      {!image ? (
        <ImageUploader onImageUpload={handleImageUpload} />
      ) : (
        <main className="flex-1 grid grid-cols-1 lg:grid-cols-4 gap-6 h-full">
          <div className="lg:col-span-3 bg-gray-800 rounded-lg shadow-2xl p-4 flex flex-col overflow-hidden">
             <ControlPanel
              activeFeature={activeFeature}
              setActiveFeature={setActiveFeature}
              zoom={zoom}
              setZoom={setZoom}
              brushSize={brushSize}
              setBrushSize={setBrushSize}
              onUndo={handleUndo}
              onClear={handleClear}
              onDownload={handleDownload}
              hasAnnotations={annotations.length > 0}
              patientId={patientId}
              setPatientId={setPatientId}
              showAnnotations={showAnnotations}
              setShowAnnotations={setShowAnnotations}
            />
            <AnnotationCanvas
              imageUrl={image}
              annotations={annotations}
              onAnnotate={handleAnnotate}
              zoom={zoom}
              brushSize={brushSize}
              activeFeatureColor={FEATURES.find(f => f.id === activeFeature)?.color || '#ffffff'}
              showAnnotations={showAnnotations}
            />
          </div>
          <div className="lg:col-span-1 bg-gray-800 rounded-lg shadow-2xl p-6">
            <ResultsPanel stats={memoizedStats} />
          </div>
        </main>
      )}
    </div>
  );
};

export default App;
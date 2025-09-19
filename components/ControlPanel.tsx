
import React from 'react';
import { FeatureType } from '../types';
import { FEATURES } from '../constants';

interface ControlPanelProps {
  activeFeature: FeatureType;
  setActiveFeature: (feature: FeatureType) => void;
  zoom: number;
  setZoom: (zoom: number) => void;
  brushSize: number;
  setBrushSize: (size: number) => void;
  onUndo: () => void;
  onClear: () => void;
  onDownload: () => void;
  hasAnnotations: boolean;
  patientId: string;
  setPatientId: (id: string) => void;
  patientName: string;
  setPatientName: (name: string) => void;
  showAnnotations: boolean;
  setShowAnnotations: (show: boolean) => void;
}

const ControlPanel: React.FC<ControlPanelProps> = ({
  activeFeature,
  setActiveFeature,
  zoom,
  setZoom,
  brushSize,
  setBrushSize,
  onUndo,
  onClear,
  onDownload,
  hasAnnotations,
  patientId,
  setPatientId,
  patientName,
  setPatientName,
  showAnnotations,
  setShowAnnotations,
}) => {
  return (
    <div className="bg-gray-900/50 rounded-lg p-4 mb-4 flex flex-wrap items-center justify-between gap-4">
      <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
              <label htmlFor="patientId" className="text-sm font-medium text-gray-300">Patient ID:</label>
              <input
                  id="patientId"
                  type="text"
                  value={patientId}
                  onChange={e => setPatientId(e.target.value)}
                  placeholder="Enter ID"
                  className="bg-gray-700 text-white rounded-md px-2 py-1 text-sm w-32 focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all"
              />
          </div>
          <div className="flex items-center gap-2">
              <label htmlFor="patientName" className="text-sm font-medium text-gray-300">Patient Name:</label>
              <input
                  id="patientName"
                  type="text"
                  value={patientName}
                  onChange={e => setPatientName(e.target.value)}
                  placeholder="Enter name"
                  className="bg-gray-700 text-white rounded-md px-2 py-1 text-sm w-40 focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all"
              />
          </div>
      </div>
      
      <div className="flex items-center gap-2 flex-wrap">
        <span className="font-semibold mr-2 text-gray-300">Features:</span>
        {FEATURES.map(feature => (
          <button
            key={feature.id}
            onClick={() => setActiveFeature(feature.id)}
            className={`px-3 py-1.5 text-sm font-medium rounded-full transition-all duration-200 flex items-center gap-2 shadow-md ${
              activeFeature === feature.id
                ? 'text-white scale-110 shadow-lg'
                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
            }`}
            style={{ backgroundColor: activeFeature === feature.id ? feature.color : undefined }}
          >
            <span
              className="w-3 h-3 rounded-full block"
              style={{ backgroundColor: activeFeature !== feature.id ? feature.color : 'rgba(255,255,255,0.5)' }}
            ></span>
            {feature.label}
          </button>
        ))}
      </div>

      <div className="flex items-center gap-6 flex-wrap">
         <div className="flex items-center gap-2">
          <label htmlFor="zoom" className="text-sm font-medium text-gray-300">Zoom</label>
          <input
            id="zoom"
            type="range"
            min="0.2"
            max="5"
            step="0.1"
            value={zoom}
            onChange={e => setZoom(parseFloat(e.target.value))}
            className="w-32 h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
          />
        </div>
        <div className="flex items-center gap-2">
          <label htmlFor="brushSize" className="text-sm font-medium text-gray-300">Brush</label>
          <input
            id="brushSize"
            type="range"
            min="1"
            max="20"
            step="1"
            value={brushSize}
            onChange={e => setBrushSize(parseInt(e.target.value, 10))}
            className="w-32 h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
          />
        </div>
        <div className="flex items-center gap-2">
          <input
            id="showAnnotations"
            type="checkbox"
            checked={showAnnotations}
            onChange={e => setShowAnnotations(e.target.checked)}
            className="w-4 h-4 text-blue-600 bg-gray-700 border-gray-600 rounded focus:ring-blue-500 cursor-pointer"
          />
          <label htmlFor="showAnnotations" className="text-sm font-medium text-gray-300 cursor-pointer">Show Annotations</label>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <button onClick={onUndo} disabled={!hasAnnotations} className="px-4 py-2 text-sm bg-yellow-600 hover:bg-yellow-500 rounded-lg disabled:bg-gray-600 disabled:cursor-not-allowed transition-colors">Undo</button>
        <button onClick={onClear} disabled={!hasAnnotations} className="px-4 py-2 text-sm bg-red-700 hover:bg-red-600 rounded-lg disabled:bg-gray-600 disabled:cursor-not-allowed transition-colors">Clear All</button>
        <button onClick={onDownload} className="px-4 py-2 text-sm bg-blue-600 hover:bg-blue-500 rounded-lg transition-colors">Download Report</button>
      </div>
    </div>
  );
};

export default ControlPanel;
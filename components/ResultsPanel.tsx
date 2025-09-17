import React from 'react';
import { Stats, FeatureType } from '../types';
import { FEATURES } from '../constants';

interface ResultsPanelProps {
  stats: Stats;
}

const StatItem: React.FC<{ label: string; value: string | number; color?: string; isBold?: boolean }> = ({ label, value, color, isBold }) => (
    <div className={`flex justify-between items-center py-2 px-3 rounded-md ${isBold ? 'bg-gray-700/50' : ''}`}>
      <div className="flex items-center gap-2">
        {color && <div className="w-3 h-3 rounded-full" style={{ backgroundColor: color }}></div>}
        <span className={`${isBold ? 'font-bold text-white' : 'text-gray-300'}`}>{label}</span>
      </div>
      <span className={`font-mono ${isBold ? 'font-bold text-white' : 'text-gray-300'}`}>{value}</span>
    </div>
);


const ResultsPanel: React.FC<ResultsPanelProps> = ({ stats }) => {
  const vellusCount = stats[FeatureType.VELLUS_HAIR] || 0;
  const terminalCount = stats[FeatureType.TERMINAL_HAIR] || 0;
  const anagenCount = stats[FeatureType.ANAGEN_HAIR] || 0;
  const telogenCount = stats[FeatureType.TELOGEN_HAIR] || 0;

  const totalHairCount = vellusCount + terminalCount;
  const totalPhaseCount = anagenCount + telogenCount;
  
  const fu1Count = stats[FeatureType.FOLLICULAR_UNIT_1] || 0;
  const fu2Count = stats[FeatureType.FOLLICULAR_UNIT_2] || 0;
  const fu3PlusCount = stats[FeatureType.FOLLICULAR_UNIT_3_PLUS] || 0;
  const totalFUCount = fu1Count + fu2Count + fu3PlusCount;
  
  const hairsInFU = (fu1Count * 1) + (fu2Count * 2) + (fu3PlusCount * 3); // Assume 3 for 3+
  const avgHairsPerFU = totalFUCount > 0 ? (hairsInFU / totalFUCount).toFixed(2) : '0.00';
  
  const vellusToTerminalRatio = terminalCount > 0 ? (vellusCount / terminalCount).toFixed(2) : 'N/A';
  const anagenToTelogenRatio = telogenCount > 0 ? (anagenCount / telogenCount).toFixed(2) : 'N/A';

  const getPercentage = (count: number, total: number) => {
    if (total === 0) return '0.0%';
    return `${((count / total) * 100).toFixed(1)}%`;
  };

  return (
    <div className="h-full flex flex-col">
      <h2 className="text-xl font-bold mb-4 pb-2 border-b-2 border-gray-700">Analysis Report</h2>
      <div className="space-y-4 flex-1 overflow-y-auto pr-2">
        
        <div>
          <h3 className="text-lg font-semibold text-blue-300 mb-2">Summary</h3>
          <div className="space-y-1">
            <StatItem label="Total Hair Count" value={totalHairCount} isBold />
            <StatItem label="Total Follicular Units" value={totalFUCount} isBold />
            <StatItem label="Avg. Hairs per FU" value={avgHairsPerFU} />
            <StatItem label="Vellus:Terminal Ratio" value={vellusToTerminalRatio} />
            <StatItem label="Anagen:Telogen Ratio" value={anagenToTelogenRatio} />
          </div>
        </div>

        <div>
          <h3 className="text-lg font-semibold text-green-300 mb-2">Hair Details</h3>
          <div className="space-y-1">
            <StatItem 
              label={FEATURES.find(f => f.id === FeatureType.VELLUS_HAIR)?.label || ''} 
              value={`${vellusCount} (${getPercentage(vellusCount, totalHairCount)})`}
              color={FEATURES.find(f => f.id === FeatureType.VELLUS_HAIR)?.color}
            />
            <StatItem 
              label={FEATURES.find(f => f.id === FeatureType.TERMINAL_HAIR)?.label || ''}
              value={`${terminalCount} (${getPercentage(terminalCount, totalHairCount)})`}
              color={FEATURES.find(f => f.id === FeatureType.TERMINAL_HAIR)?.color}
            />
          </div>
        </div>
        
        <div>
          <h3 className="text-lg font-semibold text-purple-300 mb-2">Follicular Units</h3>
          <div className="space-y-1">
            <StatItem 
              label={FEATURES.find(f => f.id === FeatureType.FOLLICULAR_UNIT_1)?.label || ''}
              value={`${fu1Count} (${getPercentage(fu1Count, totalFUCount)})`}
              color={FEATURES.find(f => f.id === FeatureType.FOLLICULAR_UNIT_1)?.color}
            />
             <StatItem 
              label={FEATURES.find(f => f.id === FeatureType.FOLLICULAR_UNIT_2)?.label || ''}
              value={`${fu2Count} (${getPercentage(fu2Count, totalFUCount)})`}
              color={FEATURES.find(f => f.id === FeatureType.FOLLICULAR_UNIT_2)?.color}
            />
             <StatItem 
              label={FEATURES.find(f => f.id === FeatureType.FOLLICULAR_UNIT_3_PLUS)?.label || ''}
              value={`${fu3PlusCount} (${getPercentage(fu3PlusCount, totalFUCount)})`}
              color={FEATURES.find(f => f.id === FeatureType.FOLLICULAR_UNIT_3_PLUS)?.color}
            />
          </div>
        </div>
        
        <div>
          <h3 className="text-lg font-semibold text-yellow-300 mb-2">Hair Phase Details</h3>
          <div className="space-y-1">
             <StatItem 
              label={FEATURES.find(f => f.id === FeatureType.ANAGEN_HAIR)?.label || ''}
              value={`${anagenCount} (${getPercentage(anagenCount, totalPhaseCount)})`}
              color={FEATURES.find(f => f.id === FeatureType.ANAGEN_HAIR)?.color}
            />
             <StatItem 
              label={FEATURES.find(f => f.id === FeatureType.TELOGEN_HAIR)?.label || ''}
              value={`${telogenCount} (${getPercentage(telogenCount, totalPhaseCount)})`}
              color={FEATURES.find(f => f.id === FeatureType.TELOGEN_HAIR)?.color}
            />
          </div>
        </div>

      </div>
    </div>
  );
};

export default ResultsPanel;

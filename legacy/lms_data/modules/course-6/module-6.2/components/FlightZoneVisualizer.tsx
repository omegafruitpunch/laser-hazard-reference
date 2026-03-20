/**
 * Flight Zone Visualizer - Interactive Airspace Diagram
 * 
 * FAA Official Aesthetic with map-based visualization
 * Enhanced with zone diagram styling and aviation warning colors
 */

import React, { useState } from 'react';
import { FAAColors, FAAIcons, ZoneConfig } from '../../styles/FAAAviationStyles';

interface FlightZone {
  id: string;
  name: string;
  acronym: string;
  exposureLimit: string;
  exposureValue: number;
  exposureUnit: string;
  description: string;
  radius: string;
  altitude: string;
  color: string;
  bgColor: string;
  textColor: string;
  borderColor: string;
  icon: string;
  criticalPhases: string[];
  warningLevel: 'critical' | 'caution' | 'warning' | 'safe';
}

const flightZones: FlightZone[] = [
  {
    id: 'lfz',
    name: 'Laser Free Zone',
    acronym: 'LFZ',
    exposureLimit: '50 nW/cm²',
    exposureValue: 50,
    exposureUnit: 'nW/cm²',
    description: 'Airspace where laser radiation should be virtually eliminated to prevent any visual distraction to pilots.',
    radius: '< 2 NM',
    altitude: '< 2,000 ft AGL',
    color: ZoneConfig.lfz.color,
    bgColor: ZoneConfig.lfz.bgLight,
    textColor: ZoneConfig.lfz.textColor,
    borderColor: ZoneConfig.lfz.borderColor,
    icon: '⛔',
    criticalPhases: ['Final approach', 'Takeoff initial climb', 'Missed approach'],
    warningLevel: 'critical'
  },
  {
    id: 'cfz',
    name: 'Critical Flight Zone',
    acronym: 'CFZ',
    exposureLimit: '5 µW/cm²',
    exposureValue: 5,
    exposureUnit: 'µW/cm²',
    description: 'Airspace where exposure should not exceed levels that cause glare, which can impair pilot vision.',
    radius: '10 NM',
    altitude: 'up to 10,000 ft AGL',
    color: ZoneConfig.cfz.color,
    bgColor: ZoneConfig.cfz.bgLight,
    textColor: ZoneConfig.cfz.textColor,
    borderColor: ZoneConfig.cfz.borderColor,
    icon: '⚠️',
    criticalPhases: ['Approach', 'Departure', 'Low-level navigation', 'Emergency operations'],
    warningLevel: 'caution'
  },
  {
    id: 'sfz',
    name: 'Sensitive Flight Zone',
    acronym: 'SFZ',
    exposureLimit: '100 µW/cm²',
    exposureValue: 100,
    exposureUnit: 'µW/cm²',
    description: 'Airspace where exposure should not exceed levels that cause flashblindness or afterimages.',
    radius: 'Variable',
    altitude: 'Variable',
    color: ZoneConfig.sfz.color,
    bgColor: ZoneConfig.sfz.bgLight,
    textColor: ZoneConfig.sfz.textColor,
    borderColor: ZoneConfig.sfz.borderColor,
    icon: '👁️',
    criticalPhases: ['Training areas', 'Helicopter routes', 'Aerobatic areas'],
    warningLevel: 'warning'
  },
  {
    id: 'nfz',
    name: 'Normal Flight Zone',
    acronym: 'NFZ',
    exposureLimit: 'MPE Limits',
    exposureValue: 2.6,
    exposureUnit: 'mW/cm²',
    description: 'All other airspace where normal MPE limits apply for eye safety.',
    radius: 'All remaining airspace',
    altitude: 'Above 10,000 ft AGL',
    color: ZoneConfig.nfz.color,
    bgColor: ZoneConfig.nfz.bgLight,
    textColor: ZoneConfig.nfz.textColor,
    borderColor: ZoneConfig.nfz.borderColor,
    icon: '✓',
    criticalPhases: ['En route cruise', 'High altitude operations'],
    warningLevel: 'safe'
  }
];

interface VisualEffect {
  id: string;
  name: string;
  description: string;
  characteristics: string[];
  duration: string;
  severity: 'low' | 'medium' | 'high';
  color: string;
  bgColor: string;
  textColor: string;
  icon: string;
  zone: string;
  threshold: string;
}

const visualEffects: VisualEffect[] = [
  {
    id: 'distraction',
    name: 'Distraction',
    description: 'Mental interference from bright light - pilot attention is drawn away from instruments.',
    characteristics: [
      'Light brighter than background',
      'Vision not physically blocked',
      'Mental focus disrupted',
      'Can be managed by pilot'
    ],
    duration: 'While light is visible',
    severity: 'low',
    color: '#10b981',
    bgColor: 'bg-green-50',
    textColor: 'text-green-800',
    icon: '👀',
    zone: 'LFZ / LFED',
    threshold: '50 nW/cm²'
  },
  {
    id: 'glare',
    name: 'Glare',
    description: 'Inability to see past the laser light while it remains on - like oncoming headlights.',
    characteristics: [
      'Cannot see through the light',
      'Blocks portion of vision',
      'Effect ends when light removed',
      'Disorients pilot'
    ],
    duration: 'While light is on',
    severity: 'medium',
    color: '#f59e0b',
    bgColor: 'bg-amber-50',
    textColor: 'text-amber-800',
    icon: '💡',
    zone: 'CFZ / CZED',
    threshold: '5 µW/cm²'
  },
  {
    id: 'flashblindness',
    name: 'Flashblindness',
    description: 'Vision-impairing afterimages that persist after the light is gone - like camera flash.',
    characteristics: [
      'Afterimages persist',
      'Can last seconds to minutes',
      'Most serious hazard',
      'Critical during landing/takeoff'
    ],
    duration: 'Seconds to minutes',
    severity: 'high',
    color: '#dc2626',
    bgColor: 'bg-red-50',
    textColor: 'text-red-800',
    icon: '⚡',
    zone: 'SFZ / SZED',
    threshold: '100 µW/cm²'
  }
];

export const FlightZoneVisualizer: React.FC = () => {
  const [selectedZone, setSelectedZone] = useState<FlightZone>(flightZones[0]);
  const [activeTab, setActiveTab] = useState<'zones' | 'effects' | 'calculator'>('zones');
  const [showLayers, setShowLayers] = useState({
    lfz: true,
    cfz: true,
    sfz: true,
    nfz: true
  });
  const [showAircraft, setShowAircraft] = useState(true);

  // Calculator state
  const [laserPower, setLaserPower] = useState(1000); // mW
  const [beamDivergence, setBeamDivergence] = useState(1); // mrad
  const [wavelength, setWavelength] = useState(532); // nm (green)
  const [visualCorrectionFactor, setVisualCorrectionFactor] = useState(0.8621);

  // Calculate distances
  const calculateDistance = (power: number, divergence: number, threshold: number, vcf: number) => {
    const powerWatts = power / 1000;
    const distanceFeet = (32.8 / divergence) * Math.sqrt((12732 * powerWatts * vcf) / (threshold * 100));
    return Math.round(distanceFeet);
  };

  const szedDistance = calculateDistance(laserPower, beamDivergence, 0.0001, visualCorrectionFactor);
  const czedDistance = Math.round(szedDistance * 4.47);
  const lfedDistance = Math.round(szedDistance * 44.7);

  const wavelengthColors: Record<number, string> = {
    445: '#3b82f6', // Blue
    532: '#22c55e', // Green
    633: '#ef4444', // Red
    1064: '#6b7280', // IR (invisible)
  };

  return (
    <div className="max-w-7xl mx-auto">
      {/* FAA Header */}
      <div className="bg-[#002868] text-white p-6 rounded-t-xl">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center">
            <span className="text-4xl mr-4">🎯</span>
            <div>
              <h2 className="text-2xl font-bold">Flight Zone Visualizer</h2>
              <p className="text-blue-100">FAA Flight Zones and Exposure Limits per AC 70-1B</p>
            </div>
          </div>
          <div className="flex gap-2">
            {Object.entries(ZoneConfig).map(([key, zone]) => (
              <span key={key} className="px-3 py-1 rounded-lg text-xs font-bold bg-white/20">
                {zone.acronym}
              </span>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-white rounded-b-xl shadow-lg p-6">
        {/* Tabs - FAA Style */}
        <div className="flex justify-center mb-8">
          <div className="bg-gray-100 p-2 rounded-xl inline-flex">
            {[
              { id: 'zones', label: 'Flight Zones', icon: '🎯' },
              { id: 'effects', label: 'Visual Effects', icon: '👁️' },
              { id: 'calculator', label: 'Distance Calculator', icon: '📐' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-6 py-3 rounded-lg font-bold transition-all flex items-center ${
                  activeTab === tab.id
                    ? 'bg-[#002868] text-white shadow-md'
                    : 'text-gray-600 hover:text-gray-800'
                }`}
              >
                <span className="mr-2 text-xl">{tab.icon}</span>
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Zones Tab */}
        {activeTab === 'zones' && (
          <div className="grid lg:grid-cols-3 gap-6">
            {/* Zone Selector */}
            <div className="lg:col-span-1 space-y-3">
              <h3 className="font-bold text-[#002868] mb-4 text-lg flex items-center">
                <span className="mr-2">🎯</span> Select Zone
              </h3>
              {flightZones.map((zone) => (
                <button
                  key={zone.id}
                  onClick={() => setSelectedZone(zone)}
                  className={`w-full p-4 rounded-xl border-2 text-left transition-all ${
                    selectedZone.id === zone.id
                      ? `${zone.bgColor} ${zone.borderColor} shadow-lg`
                      : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  <div className="flex items-center">
                    <span className="text-3xl mr-3">{zone.icon}</span>
                    <div className="flex-1">
                      <div className={`font-bold ${selectedZone.id === zone.id ? zone.textColor : 'text-gray-800'}`}>
                        {zone.acronym}
                      </div>
                      <div className="text-sm text-gray-600">{zone.name}</div>
                    </div>
                  </div>
                  <div className={`mt-2 text-xs font-mono bg-white/80 inline-block px-2 py-1 rounded 
                    border ${zone.borderColor} ${zone.textColor}`}>
                    ≤ {zone.exposureLimit}
                  </div>
                </button>
              ))}

              {/* Layer Toggles */}
              <div className="mt-6 p-5 bg-gray-50 rounded-xl border-2 border-gray-200">
                <h4 className="font-bold text-[#002868] mb-4 text-sm flex items-center">
                  <span className="mr-2">👁️</span> Map Layers
                </h4>
                {flightZones.map((zone) => (
                  <label key={zone.id} className="flex items-center mb-3 cursor-pointer hover:bg-white p-2 rounded transition-colors">
                    <input
                      type="checkbox"
                      checked={showLayers[zone.id as keyof typeof showLayers]}
                      onChange={(e) => setShowLayers(prev => ({ ...prev, [zone.id]: e.target.checked }))}
                      className="mr-3 w-5 h-5"
                    />
                    <span 
                      className="w-4 h-4 rounded-full mr-3 border-2 border-white shadow"
                      style={{ backgroundColor: zone.color }}
                    />
                    <span className="text-sm font-medium text-gray-700">{zone.acronym}</span>
                  </label>
                ))}
                <label className="flex items-center cursor-pointer hover:bg-white p-2 rounded transition-colors mt-4 pt-4 border-t">
                  <input
                    type="checkbox"
                    checked={showAircraft}
                    onChange={(e) => setShowAircraft(e.target.checked)}
                    className="mr-3 w-5 h-5"
                  />
                  <span className="text-2xl mr-3">✈️</span>
                  <span className="text-sm font-medium text-gray-700">Show Aircraft</span>
                </label>
              </div>
            </div>

            {/* Zone Visual - Map Style */}
            <div className="lg:col-span-2">
              {/* Airspace Map */}
              <div className="bg-[#0f172a] rounded-xl p-6 mb-6 relative overflow-hidden" style={{ minHeight: '450px' }}>
                {/* Grid lines */}
                <div className="absolute inset-0 opacity-20">
                  <div className="h-full w-full" style={{
                    backgroundImage: `
                      linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
                      linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)
                    `,
                    backgroundSize: '50px 50px'
                  }} />
                </div>

                {/* Airport center */}
                <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 z-20">
                  <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center shadow-2xl border-4 border-[#002868]">
                    <span className="text-3xl">✈️</span>
                  </div>
                  <div className="text-center text-white text-sm mt-2 font-bold bg-black/50 px-3 py-1 rounded-full">
                    Airport
                  </div>
                </div>

                {/* Zone Circles with aviation styling */}
                {showLayers.lfz && (
                  <div 
                    className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 
                      rounded-full border-4 border-red-500 flex items-center justify-center z-10"
                    style={{ width: '100px', height: '100px', backgroundColor: 'rgba(239, 68, 68, 0.3)' }}
                  >
                    <span className="text-white text-sm font-bold bg-red-600 px-2 py-1 rounded">LFZ</span>
                  </div>
                )}
                
                {showLayers.cfz && (
                  <div 
                    className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 
                      rounded-full border-4 border-orange-500"
                    style={{ width: '220px', height: '220px', backgroundColor: 'rgba(249, 115, 22, 0.15)' }}
                  >
                    <span className="absolute top-2 left-1/2 transform -translate-x-1/2 text-white text-sm 
                      font-bold bg-orange-500 px-2 py-1 rounded">CFZ</span>
                  </div>
                )}
                
                {showLayers.sfz && (
                  <div 
                    className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 
                      rounded-full border-4 border-yellow-500"
                    style={{ width: '300px', height: '300px', backgroundColor: 'rgba(234, 179, 8, 0.1)' }}
                  >
                    <span className="absolute top-1/4 right-2 text-white text-sm font-bold 
                      bg-yellow-600 px-2 py-1 rounded">SFZ</span>
                  </div>
                )}
                
                {showLayers.nfz && (
                  <div 
                    className="absolute inset-8 rounded-xl border-4 border-green-500/30"
                    style={{ backgroundColor: 'rgba(34, 197, 94, 0.05)' }}
                  >
                    <span className="absolute bottom-4 right-4 text-green-400 text-sm font-bold 
                      bg-green-900/50 px-2 py-1 rounded">NFZ</span>
                  </div>
                )}

                {/* Aircraft indicators */}
                {showAircraft && (
                  <>
                    <div className="absolute top-10 left-10 text-2xl animate-pulse">✈️</div>
                    <div className="absolute top-20 right-20 text-xl">🚁</div>
                    <div className="absolute bottom-32 left-20 text-lg">🛸</div>
                  </>
                )}

                {/* Altitude indicators */}
                <div className="absolute left-4 top-4 text-gray-400 text-xs space-y-1 bg-black/30 p-2 rounded">
                  <div>↑ 10,000+ ft AGL (NFZ)</div>
                  <div>↑ 2,000 ft AGL (CFZ)</div>
                  <div>↑ Surface (LFZ)</div>
                </div>

                {/* Compass rose */}
                <div className="absolute bottom-4 left-4 w-16 h-16 rounded-full border-2 border-white/30 
                  flex items-center justify-center bg-black/30">
                  <span className="text-white text-xs font-bold">N</span>
                  <div className="absolute top-1 text-white text-xs">▲</div>
                </div>

                {/* Scale */}
                <div className="absolute bottom-4 right-4 bg-black/50 text-white text-xs p-3 rounded-lg">
                  <div className="flex items-center mb-1">
                    <div className="w-24 h-0.5 bg-white mr-2"></div>
                    <span>10 NM</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-12 h-0.5 bg-white/50 mr-2"></div>
                    <span className="text-gray-400">5 NM</span>
                  </div>
                </div>
              </div>

              {/* Selected Zone Details */}
              <div className="bg-white rounded-xl shadow-lg overflow-hidden border-2 border-gray-200">
                <div 
                  className="p-5 text-white"
                  style={{ backgroundColor: selectedZone.color }}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <span className="text-4xl mr-4">{selectedZone.icon}</span>
                      <div>
                        <h3 className="text-2xl font-bold">{selectedZone.name}</h3>
                        <p className="opacity-90 font-mono">{selectedZone.acronym}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-4xl font-bold">{selectedZone.exposureLimit}</div>
                      <div className="text-sm opacity-90">Maximum Exposure</div>
                    </div>
                  </div>
                </div>

                <div className="p-6 grid md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-bold text-[#002868] mb-4 flex items-center">
                      <span className="mr-2">📋</span> Zone Specifications
                    </h4>
                    <table className="w-full text-sm">
                      <tbody className="divide-y divide-gray-200">
                        <tr>
                          <td className="py-3 text-gray-600">Typical Radius:</td>
                          <td className="py-3 font-bold text-gray-800">{selectedZone.radius}</td>
                        </tr>
                        <tr>
                          <td className="py-3 text-gray-600">Altitude:</td>
                          <td className="py-3 font-bold text-gray-800">{selectedZone.altitude}</td>
                        </tr>
                        <tr>
                          <td className="py-3 text-gray-600">Exposure Limit:</td>
                          <td className="py-3 font-bold font-mono" style={{ color: selectedZone.color }}>
                            {selectedZone.exposureLimit}
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                  <div>
                    <h4 className="font-bold text-[#002868] mb-4 flex items-center">
                      <span className="mr-2">✈️</span> Critical Flight Phases
                    </h4>
                    <ul className="space-y-2">
                      {selectedZone.criticalPhases.map((phase, idx) => (
                        <li key={idx} className="flex items-center text-gray-700 bg-gray-50 p-2 rounded-lg">
                          <span className="w-3 h-3 rounded-full mr-3" style={{ backgroundColor: selectedZone.color }}></span>
                          {phase}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="px-6 pb-6">
                  <h4 className="font-bold text-[#002868] mb-2">Description</h4>
                  <p className="text-gray-700 leading-relaxed">{selectedZone.description}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Effects Tab */}
        {activeTab === 'effects' && (
          <div className="space-y-6">
            <div className="grid md:grid-cols-3 gap-6">
              {visualEffects.map((effect) => (
                <div key={effect.id} className="bg-white rounded-xl shadow-lg overflow-hidden border-2 border-gray-200">
                  <div className={`p-5 text-white`} style={{ backgroundColor: effect.color }}>
                    <div className="text-5xl mb-3">{effect.icon}</div>
                    <h3 className="text-xl font-bold">{effect.name}</h3>
                    <span className={`inline-block mt-2 px-3 py-1 rounded-full text-xs font-bold bg-black/30`}>
                      {effect.severity.toUpperCase()} SEVERITY
                    </span>
                  </div>
                  <div className="p-5">
                    <p className="text-gray-700 mb-4 leading-relaxed">{effect.description}</p>
                    
                    <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                      <div className="text-xs text-gray-500 uppercase font-bold mb-1">Triggered In</div>
                      <div className="font-bold text-[#002868]">{effect.zone}</div>
                      <div className="text-sm font-mono text-gray-600">{effect.threshold}</div>
                    </div>
                    
                    <h4 className="font-bold text-gray-800 text-sm mb-2">Characteristics:</h4>
                    <ul className="space-y-1 mb-4">
                      {effect.characteristics.map((char, idx) => (
                        <li key={idx} className="text-sm text-gray-600 flex items-start">
                          <span className="mr-2 text-[#002868]">•</span>{char}
                        </li>
                      ))}
                    </ul>

                    <div className="text-sm text-gray-500 bg-gray-50 p-2 rounded">
                      <strong>Duration:</strong> {effect.duration}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Comparison Table */}
            <div className="bg-white rounded-xl shadow-lg overflow-hidden border-2 border-gray-200">
              <div className="p-5 bg-[#002868] text-white">
                <h3 className="font-bold text-lg flex items-center">
                  <span className="mr-2">📊</span> Visual Effect Comparison
                </h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-gray-100">
                    <tr>
                      <th className="p-4 text-left font-bold text-[#002868]">Effect</th>
                      <th className="p-4 text-left font-bold text-[#002868]">Zone Triggered</th>
                      <th className="p-4 text-left font-bold text-[#002868]">Threshold</th>
                      <th className="p-4 text-left font-bold text-[#002868]">Recovery</th>
                      <th className="p-4 text-left font-bold text-[#002868]">Primary Risk</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    <tr className="hover:bg-gray-50">
                      <td className="p-4 font-medium flex items-center">
                        <span className="w-3 h-3 rounded-full bg-green-500 mr-2"></span>
                        Distraction
                      </td>
                      <td className="p-4">LFED (beyond LFZ)</td>
                      <td className="p-4 font-mono text-green-600 font-bold">50 nW/cm²</td>
                      <td className="p-4">Immediate when light removed</td>
                      <td className="p-4">Loss of situational awareness</td>
                    </tr>
                    <tr className="hover:bg-gray-50">
                      <td className="p-4 font-medium flex items-center">
                        <span className="w-3 h-3 rounded-full bg-amber-500 mr-2"></span>
                        Glare
                      </td>
                      <td className="p-4">CZED (within CFZ)</td>
                      <td className="p-4 font-mono text-amber-600 font-bold">5 µW/cm²</td>
                      <td className="p-4">When light removed</td>
                      <td className="p-4">Obscured vision</td>
                    </tr>
                    <tr className="hover:bg-gray-50">
                      <td className="p-4 font-medium flex items-center">
                        <span className="w-3 h-3 rounded-full bg-red-500 mr-2"></span>
                        Flashblindness
                      </td>
                      <td className="p-4">SZED (within SFZ)</td>
                      <td className="p-4 font-mono text-red-600 font-bold">100 µW/cm²</td>
                      <td className="p-4">Seconds to minutes</td>
                      <td className="p-4">Afterimages, temporary vision loss</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Calculator Tab */}
        {activeTab === 'calculator' && (
          <div className="grid lg:grid-cols-2 gap-6">
            {/* Input Panel */}
            <div className="bg-white rounded-xl shadow-lg p-6 border-2 border-gray-200">
              <h3 className="text-xl font-bold text-[#002868] mb-6 flex items-center">
                <span className="mr-2">⚡</span> Laser Parameters
              </h3>
              
              <div className="space-y-6">
                <div className="p-4 bg-gray-50 rounded-xl">
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    Laser Power: <span className="text-[#002868] text-lg">{laserPower}</span> mW
                  </label>
                  <input
                    type="range"
                    min="1"
                    max="10000"
                    value={laserPower}
                    onChange={(e) => setLaserPower(Number(e.target.value))}
                    className="w-full h-2 bg-gray-300 rounded-lg appearance-none cursor-pointer"
                  />
                  <div className="flex justify-between text-xs text-gray-500 mt-2 font-mono">
                    <span>1 mW</span>
                    <span>10 W</span>
                  </div>
                </div>

                <div className="p-4 bg-gray-50 rounded-xl">
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    Beam Divergence: <span className="text-[#002868] text-lg">{beamDivergence}</span> mrad
                  </label>
                  <input
                    type="range"
                    min="0.1"
                    max="5"
                    step="0.1"
                    value={beamDivergence}
                    onChange={(e) => setBeamDivergence(Number(e.target.value))}
                    className="w-full h-2 bg-gray-300 rounded-lg appearance-none cursor-pointer"
                  />
                  <div className="flex justify-between text-xs text-gray-500 mt-2 font-mono">
                    <span>0.1 mrad</span>
                    <span>5 mrad</span>
                  </div>
                </div>

                <div className="p-4 bg-gray-50 rounded-xl">
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    Wavelength: <span className="text-lg" style={{ color: wavelengthColors[wavelength] }}>
                      {wavelength}
                    </span> nm
                  </label>
                  <select
                    value={wavelength}
                    onChange={(e) => {
                      const wl = Number(e.target.value);
                      setWavelength(wl);
                      const vcfMap: Record<number, number> = {
                        445: 0.0380,
                        532: 0.8621,
                        633: 0.2653,
                        1064: 0,
                      };
                      setVisualCorrectionFactor(vcfMap[wl] || 0.5);
                    }}
                    className="w-full p-3 border-2 border-gray-300 rounded-lg focus:border-[#002868] 
                      focus:ring-2 focus:ring-blue-200"
                  >
                    <option value={445}>445 nm (Blue)</option>
                    <option value={532}>532 nm (Green - Brightest)</option>
                    <option value={633}>633 nm (Red)</option>
                    <option value={1064}>1064 nm (Infrared)</option>
                  </select>
                </div>

                <div className="p-4 bg-blue-50 rounded-xl border-2 border-blue-200">
                  <div className="flex justify-between items-center">
                    <div>
                      <div className="text-sm text-gray-600">Visual Correction Factor</div>
                      <div className="text-2xl font-bold text-[#002868] font-mono">{visualCorrectionFactor}</div>
                    </div>
                    <div className="text-right text-sm text-gray-600 max-w-[150px]">
                      {wavelength === 532 ? 'Green appears brightest' : 
                       wavelength === 445 ? 'Blue appears dimmer' :
                       wavelength === 633 ? 'Red appears dimmer' :
                       'Infrared - no visual effect'}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Results Panel */}
            <div className="space-y-4">
              {/* LFED - Green */}
              <div className="bg-white rounded-xl shadow-lg overflow-hidden border-2 border-green-500">
                <div className="p-5 bg-green-600 text-white">
                  <div className="flex justify-between items-center">
                    <div>
                      <h4 className="font-bold text-xl">LFZ Boundary</h4>
                      <p className="text-sm opacity-90">Laser Free Zone Limit</p>
                    </div>
                    <div className="text-right">
                      <div className="text-4xl font-bold">{lfedDistance.toLocaleString()}</div>
                      <div className="text-sm">feet</div>
                    </div>
                  </div>
                  <div className="mt-3 text-xs bg-green-700/50 inline-block px-3 py-1 rounded-full">
                    Threshold: 50 nW/cm² | Distraction Prevention
                  </div>
                </div>
                <div className="p-4">
                  <p className="text-sm text-gray-700">
                    Beyond this distance, laser light should not cause distraction. 
                    Within this zone, <strong className="text-red-600">no laser radiation should reach aircraft</strong>.
                  </p>
                </div>
              </div>

              {/* CZED - Orange */}
              <div className="bg-white rounded-xl shadow-lg overflow-hidden border-2 border-orange-500">
                <div className="p-5 bg-orange-500 text-white">
                  <div className="flex justify-between items-center">
                    <div>
                      <h4 className="font-bold text-xl">CFZ Boundary</h4>
                      <p className="text-sm opacity-90">Critical Flight Zone Limit</p>
                    </div>
                    <div className="text-right">
                      <div className="text-4xl font-bold">{czedDistance.toLocaleString()}</div>
                      <div className="text-sm">feet</div>
                    </div>
                  </div>
                  <div className="mt-3 text-xs bg-orange-600/50 inline-block px-3 py-1 rounded-full">
                    Threshold: 5 µW/cm² | Glare Prevention
                  </div>
                </div>
                <div className="p-4">
                  <p className="text-sm text-gray-700">
                    Beyond this distance, the laser should not cause glare. 
                    Between LFZ and this boundary, exposure can cause <strong className="text-amber-600">glare effects</strong>.
                  </p>
                </div>
              </div>

              {/* SZED - Yellow */}
              <div className="bg-white rounded-xl shadow-lg overflow-hidden border-2 border-yellow-500">
                <div className="p-5 bg-yellow-500 text-white">
                  <div className="flex justify-between items-center">
                    <div>
                      <h4 className="font-bold text-xl">SFZ Boundary</h4>
                      <p className="text-sm opacity-90">Sensitive Flight Zone Limit</p>
                    </div>
                    <div className="text-right">
                      <div className="text-4xl font-bold">{szedDistance.toLocaleString()}</div>
                      <div className="text-sm">feet</div>
                    </div>
                  </div>
                  <div className="mt-3 text-xs bg-yellow-600/50 inline-block px-3 py-1 rounded-full">
                    Threshold: 100 µW/cm² | Flashblindness Prevention
                  </div>
                </div>
                <div className="p-4">
                  <p className="text-sm text-gray-700">
                    Beyond this distance, the laser should not cause flashblindness. 
                    Between CFZ and this boundary, exposure can cause <strong className="text-yellow-600">flashblindness</strong>.
                  </p>
                </div>
              </div>

              {/* Formula Reference */}
              <div className="bg-gray-50 rounded-xl p-4 border-2 border-gray-200">
                <h4 className="font-bold text-[#002868] mb-2 text-sm">Distance Relationships</h4>
                <div className="grid grid-cols-2 gap-2 text-xs font-mono">
                  <div className="bg-white p-2 rounded">CZED = SZED × 4.47</div>
                  <div className="bg-white p-2 rounded">LFED = SZED × 44.7</div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default FlightZoneVisualizer;

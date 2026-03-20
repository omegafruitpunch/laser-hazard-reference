/**
 * SafetyDeviceReference Component
 * 
 * Reference guide for electrical safety devices used in laser systems,
 * including testing procedures and applicability.
 */

import React, { useState } from 'react';
import { safetyDevices, SafetyDevice } from '../data';

type FilterType = 'all' | 'interlock' | 'ground_fault' | 'surge_protection' | 'emergency_stop' | 'circuit_breaker';

export const SafetyDeviceReference: React.FC = () => {
  const [filter, setFilter] = useState<FilterType>('all');
  const [selectedDevice, setSelectedDevice] = useState<SafetyDevice | null>(null);

  const filteredDevices = filter === 'all' 
    ? safetyDevices 
    : safetyDevices.filter(d => d.type === filter);

  const getTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      'interlock': 'Safety Interlock',
      'ground_fault': 'Ground Fault Protection',
      'surge_protection': 'Surge Protection',
      'emergency_stop': 'Emergency Stop',
      'circuit_breaker': 'Circuit Protection'
    };
    return labels[type] || type;
  };

  return (
    <div className="safety-device-reference">
      <div className="reference-header">
        <h3>Electrical Safety Devices Reference</h3>
        <p>
          Reference guide for electrical safety devices used in laser systems. 
          Select a device type to filter, or click on a device for detailed information.
        </p>
      </div>

      <div className="device-filters">
        <button 
          className={filter === 'all' ? 'active' : ''}
          onClick={() => setFilter('all')}
        >
          All Devices
        </button>
        <button 
          className={filter === 'interlock' ? 'active' : ''}
          onClick={() => setFilter('interlock')}
        >
          Interlocks
        </button>
        <button 
          className={filter === 'ground_fault' ? 'active' : ''}
          onClick={() => setFilter('ground_fault')}
        >
          GFCI
        </button>
        <button 
          className={filter === 'emergency_stop' ? 'active' : ''}
          onClick={() => setFilter('emergency_stop')}
        >
          E-Stop
        </button>
        <button 
          className={filter === 'circuit_breaker' ? 'active' : ''}
          onClick={() => setFilter('circuit_breaker')}
        >
          Circuit Protection
        </button>
        <button 
          className={filter === 'surge_protection' ? 'active' : ''}
          onClick={() => setFilter('surge_protection')}
        >
          Surge Protection
        </button>
      </div>

      <div className="devices-grid">
        {filteredDevices.map(device => (
          <div 
            key={device.id}
            className="device-card"
            onClick={() => setSelectedDevice(device)}
          >
            <div className="device-type">{getTypeLabel(device.type)}</div>
            <h4 className="device-name">{device.name}</h4>
            <p className="device-purpose">{device.purpose}</p>
            <div className="device-meta">
              <span className="test-frequency">Test: {device.testFrequency}</span>
            </div>
          </div>
        ))}
      </div>

      {selectedDevice && (
        <div className="device-detail-modal" onClick={() => setSelectedDevice(null)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <button className="close-btn" onClick={() => setSelectedDevice(null)}>×</button>
            
            <div className="detail-header">
              <span className="device-type">{getTypeLabel(selectedDevice.type)}</span>
              <h3>{selectedDevice.name}</h3>
            </div>

            <div className="detail-section">
              <h4>Purpose</h4>
              <p>{selectedDevice.purpose}</p>
            </div>

            <div className="detail-section">
              <h4>Testing Procedure</h4>
              <p>{selectedDevice.testMethod}</p>
              <div className="test-frequency">
                <strong>Test Frequency:</strong> {selectedDevice.testFrequency}
              </div>
            </div>

            <div className="detail-section">
              <h4>Applicable Equipment</h4>
              <ul>
                {selectedDevice.applicableEquipment.map((eq, idx) => (
                  <li key={idx}>{eq.replace(/-/g, ' ')}</li>
                ))}
              </ul>
            </div>

            <div className="detail-section">
              <h4>Regulatory References</h4>
              <ul className="regulatory-list">
                {selectedDevice.type === 'interlock' && (
                  <>
                    <li>21 CFR 1040.11(f)(1) - Protective housing interlock</li>
                    <li>ANSI Z136.1 Section 4.3.1 - Interlock requirements</li>
                    <li>IEC 60825-1 Section 4.5 - Safety interlocks</li>
                  </>
                )}
                {selectedDevice.type === 'emergency_stop' && (
                  <>
                    <li>ANSI Z136.1 Section 4.3.8 - Emergency stop</li>
                    <li>IEC 60204-1 - Emergency stop function</li>
                  </>
                )}
                {selectedDevice.type === 'ground_fault' && (
                  <>
                    <li>OSHA 29 CFR 1926.404 - GFCI requirements</li>
                    <li>NEC Article 210.8 - GFCI protection</li>
                  </>
                )}
                {selectedDevice.type === 'circuit_breaker' && (
                  <>
                    <li>NEC Article 240 - Overcurrent protection</li>
                    <li>NFPA 70 - National Electrical Code</li>
                  </>
                )}
                {selectedDevice.type === 'surge_protection' && (
                  <>
                    <li>NFPA 780 - Surge protection</li>
                    <li>IEC 61643 - SPD requirements</li>
                  </>
                )}
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

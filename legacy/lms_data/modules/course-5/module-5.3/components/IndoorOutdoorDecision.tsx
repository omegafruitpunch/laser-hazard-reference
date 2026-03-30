/**
 * Indoor/Outdoor Decision Tree Component
 * 
 * Interactive decision tree for determining whether a show
 * is classified as indoor or outdoor for Canadian regulations
 */

interface DecisionNode {
  id: string;
  question: string;
  yesTarget?: string;
  noTarget?: string;
  result?: 'indoor' | 'outdoor' | 'uncertain';
  explanation?: string;
}

export const IndoorOutdoorDecision: React.FC = () => {
  const [currentNode, setCurrentNode] = React.useState<string>('start');
  const [path, setPath] = React.useState<string[]>([]);

  const decisionNodes: Record<string, DecisionNode> = {
    start: {
      id: 'start',
      question: 'Is the laser show being conducted inside a building or enclosed structure?',
      yesTarget: 'enclosed_check',
      noTarget: 'open_air'
    },
    enclosed_check: {
      id: 'enclosed_check',
      question: 'Is the structure fully enclosed with a roof and walls on all sides?',
      yesTarget: 'indoor_result',
      noTarget: 'partial_enclosure'
    },
    partial_enclosure: {
      id: 'partial_enclosure',
      question: 'Are any laser beams projected outside the structure or visible from outside?',
      yesTarget: 'outdoor_result',
      noTarget: 'roof_only'
    },
    roof_only: {
      id: 'roof_only',
      question: 'Is it an open-sided tent or canopy with only a roof?',
      yesTarget: 'outdoor_result',
      noTarget: 'uncertain_result'
    },
    open_air: {
      id: 'open_air',
      question: 'Is the show in open air with no roof or only temporary canopy?',
      yesTarget: 'aviation_check',
      noTarget: 'enclosed_check'
    },
    aviation_check: {
      id: 'aviation_check',
      question: 'Could the laser beams affect aircraft or airspace?',
      yesTarget: 'outdoor_result',
      noTarget: 'ground_only_check'
    },
    ground_only_check: {
      id: 'ground_only_check',
      question: 'Are all beams terminated on ground-level surfaces only?',
      yesTarget: 'uncertain_result',
      noTarget: 'outdoor_result'
    },
    indoor_result: {
      id: 'indoor_result',
      result: 'indoor',
      question: 'Result: Indoor Show',
      explanation: 'Indoor shows do not require Transport Canada authorization. Maintain MPE below 2.5 mW/cm² and comply with provincial OHS requirements.'
    },
    outdoor_result: {
      id: 'outdoor_result',
      result: 'outdoor',
      question: 'Result: Outdoor Show',
      explanation: 'Outdoor shows REQUIRE Transport Canada authorization. Submit Notice of Proposal to appropriate Civil Aviation Regional Office.'
    },
    uncertain_result: {
      id: 'uncertain_result',
      result: 'uncertain',
      question: 'Result: Uncertain Classification',
      explanation: 'Contact Transport Canada for clarification. When in doubt, submit Notice of Proposal to ensure compliance.'
    }
  };

  const current = decisionNodes[currentNode];

  const handleAnswer = (answer: 'yes' | 'no') => {
    const nextNode = answer === 'yes' ? current.yesTarget : current.noTarget;
    if (nextNode) {
      setPath([...path, currentNode]);
      setCurrentNode(nextNode);
    }
  };

  const reset = () => {
    setCurrentNode('start');
    setPath([]);
  };

  const goBack = () => {
    if (path.length > 0) {
      const previous = path[path.length - 1];
      setPath(path.slice(0, -1));
      setCurrentNode(previous);
    }
  };

  const getResultColor = (result?: string) => {
    switch (result) {
      case 'indoor': return '#27ae60';
      case 'outdoor': return '#e74c3c';
      case 'uncertain': return '#f39c12';
      default: return '#3498db';
    }
  };

  return (
    <div className="indoor-outdoor-decision">
      <div className="decision-tree">
        <div 
          className="current-node"
          style={{ borderColor: getResultColor(current.result) }}
        >
          <div className="node-icon">
            {current.result === 'indoor' && '🏢'}
            {current.result === 'outdoor' && '🌤️'}
            {current.result === 'uncertain' && '❓'}
            {!current.result && '❓'}
          </div>
          
          <h4>{current.question}</h4>
          
          {current.explanation && (
            <p className="explanation">{current.explanation}</p>
          )}

          {!current.result && (
            <div className="answer-buttons">
              <button onClick={() => handleAnswer('yes')} className="yes-button">
                Yes
              </button>
              <button onClick={() => handleAnswer('no')} className="no-button">
                No
              </button>
            </div>
          )}

          {current.result && (
            <div className="result-actions">
              <button onClick={reset} className="restart-button">
                Start Over
              </button>
            </div>
          )}
        </div>

        {path.length > 0 && !current.result && (
          <button onClick={goBack} className="back-button">
            ← Go Back
          </button>
        )}
      </div>

      <div className="progress-track">
        <h5>Decision Path</h5>
        <div className="path-nodes">
          {path.map((nodeId, idx) => (
            <div key={idx} className="path-node">
              <span className="node-dot" />
              <span className="node-label">
                {decisionNodes[nodeId].question.substring(0, 30)}...
              </span>
            </div>
          ))}
          <div className="path-node current">
            <span className="node-dot" />
            <span className="node-label">Current</span>
          </div>
        </div>
      </div>

      <div className="edge-cases">
        <h5>Common Edge Cases</h5>
        <ul>
          <li>
            <strong>Stadium with retractable roof:</strong> 
            If roof open = outdoor; roof closed = indoor
          </li>
          <li>
            <strong>Open-sided tent:</strong> 
            Generally considered outdoor
          </li>
          <li>
            <strong>Building courtyard:</strong> 
            If beams contained within walls = indoor; if beams leave courtyard = outdoor
          </li>
          <li>
            <strong>Under bridge/overpass:</strong> 
            Consult Transport Canada - may still be considered outdoor
          </li>
          <li>
            <strong>Glass atriums:</strong> 
            If beams could exit through glass = outdoor classification
          </li>
        </ul>
      </div>
    </div>
  );
};

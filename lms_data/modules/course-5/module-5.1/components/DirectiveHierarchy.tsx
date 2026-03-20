/**
 * Directive Hierarchy Visualizer Component
 * 
 * Collapsible pyramid showing the EU regulatory hierarchy
 * from Directive 2006/25/EC down to national implementations
 */

interface HierarchyLevel {
  tier: number;
  title: string;
  subtitle: string;
  content: {
    description: string;
    keyPoints: string[];
    legalBasis?: string;
    relationship?: string;
    examples?: { country: string; standard: string }[];
  };
}

export const DirectiveHierarchy: React.FC = () => {
  const [expandedTier, setExpandedTier] = React.useState<number | null>(1);

  const hierarchyLevels: HierarchyLevel[] = [
    {
      tier: 1,
      title: "EU Directive 2006/25/EC",
      subtitle: "The Foundation",
      content: {
        description: "Minimum health and safety requirements regarding worker exposure to artificial optical radiation",
        keyPoints: [
          "Applies to all EU member states",
          "Employers must assess and manage optical radiation risks",
          "Exposure limit values (ELVs) must not be exceeded",
          "Worker information and training mandatory"
        ],
        legalBasis: "Article 153 of the Treaty on the Functioning of the European Union"
      }
    },
    {
      tier: 2,
      title: "EN 60825-1",
      subtitle: "The Harmonized Standard",
      content: {
        description: "European adoption of IEC 60825-1 for laser product safety",
        keyPoints: [
          "Harmonized standard under EU Directive",
          "Provides presumption of conformity",
          "Covers laser classification and labeling",
          "Product safety requirements (not workplace exposure)"
        ],
        relationship: "Links Directive requirements to technical specifications"
      }
    },
    {
      tier: 3,
      title: "National Implementation",
      subtitle: "Country-Specific Requirements",
      content: {
        description: "Each EU member state implements through national laws and may add specific requirements",
        keyPoints: [
          "National legislation transposes EU directives",
          "Additional requirements may be added",
          "Enforcement varies by country",
          "Status classifications reflect national practice"
        ],
        examples: [
          { country: "Austria", standard: "OENORM S1105:2014" },
          { country: "Finland", standard: "STUK Regulations" },
          { country: "Sweden", standard: "Swedish Radiation Safety Authority" },
          { country: "Netherlands", standard: "NEN 6025x + ARBO" }
        ]
      }
    }
  ];

  return (
    <div className="directive-hierarchy-visualizer">
      <div className="hierarchy-pyramid">
        {hierarchyLevels.map((level) => (
          <div
            key={level.tier}
            className={`pyramid-level tier-${level.tier} ${expandedTier === level.tier ? 'expanded' : ''}`}
            onClick={() => setExpandedTier(expandedTier === level.tier ? null : level.tier)}
          >
            <div className="level-header">
              <span className="tier-number">{level.tier}</span>
              <div className="level-titles">
                <h4>{level.title}</h4>
                <span className="subtitle">{level.subtitle}</span>
              </div>
              <span className="expand-icon">
                {expandedTier === level.tier ? '−' : '+'}
              </span>
            </div>
            
            {expandedTier === level.tier && (
              <div className="level-content">
                <p className="description">{level.content.description}</p>
                
                <div className="key-points">
                  <h5>Key Points:</h5>
                  <ul>
                    {level.content.keyPoints.map((point, idx) => (
                      <li key={idx}>{point}</li>
                    ))}
                  </ul>
                </div>

                {level.content.legalBasis && (
                  <div className="legal-basis">
                    <strong>Legal Basis:</strong> {level.content.legalBasis}
                  </div>
                )}

                {level.content.relationship && (
                  <div className="relationship">
                    <strong>Relationship:</strong> {level.content.relationship}
                  </div>
                )}

                {level.content.examples && (
                  <div className="examples">
                    <h5>National Examples:</h5>
                    <div className="example-grid">
                      {level.content.examples.map((ex, idx) => (
                        <div key={idx} className="example-item">
                          <span className="country">{ex.country}</span>
                          <span className="standard">{ex.standard}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="ce-marking-section">
        <h4>CE Marking Flow</h4>
        <div className="flow-diagram">
          <div className="flow-step">
            <span className="step-number">1</span>
            <span className="step-label">Product Design</span>
            <span className="step-detail">To EN 60825-1</span>
          </div>
          <div className="flow-arrow">→</div>
          <div className="flow-step">
            <span className="step-number">2</span>
            <span className="step-label">Testing</span>
            <span className="step-detail">Verify compliance</span>
          </div>
          <div className="flow-arrow">→</div>
          <div className="flow-step">
            <span className="step-number">3</span>
            <span className="step-label">Technical File</span>
            <span className="step-detail">Documentation</span>
          </div>
          <div className="flow-arrow">→</div>
          <div className="flow-step highlight">
            <span className="step-number">4</span>
            <span className="step-label">CE Marking</span>
            <span className="step-detail">Declaration of Conformity</span>
          </div>
        </div>
        <p className="note">
          <strong>Note:</strong> CE marking is a manufacturer's self-declaration of conformity, 
          not a safety certification. It enables free movement within the EU single market.
        </p>
      </div>
    </div>
  );
};

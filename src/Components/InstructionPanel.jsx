import { Wrench, Layers, ArrowRight, Lightbulb } from "lucide-react";

function InstructionPanel({ instructions = [], connections = [] }) {
  if (!instructions || instructions.length === 0) {
    return null;
  }

  return (
    <div className="instruction-panel">
      <div className="instruction-header">
        <div className="instruction-header-left">
          <Wrench size={16} className="text-amber-400" />
          <h3>Step-by-Step Hardware Assembly Guide</h3>
        </div>
      </div>

      <div className="instruction-content">
        <ol className="steps-list">
          {instructions.map((step, idx) => (
            <li key={idx} className="step-item">
              <span className="step-number">{idx + 1}</span>
              <span className="step-text">
                {step.replace(/^\d+[.)]\s*/, "")}
              </span>
            </li>
          ))}
        </ol>

        {/* Quick Connection Netlist Summary */}
        {connections.length > 0 && (
          <div className="netlist-box">
            <div className="netlist-header">
              <Layers size={14} className="text-red-400" />
              <h4>Pin Wiring Netlist ({connections.length} wires)</h4>
            </div>
            <div className="netlist-tags">
              {connections.map((conn, idx) => (
                <div key={idx} className="netlist-tag">
                  <span className="net-from">
                    {conn.from.component}
                    <small>({conn.from.pin})</small>
                  </span>
                  <ArrowRight size={11} className="text-amber-400" />
                  <span className="net-to">
                    {conn.to.component}
                    <small>({conn.to.pin})</small>
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Beginner Electrical Safety Tip */}
        <div className="safety-tip">
          <div className="tip-badge">
            <Lightbulb size={13} className="text-amber-400" />
            <span>Beginner Tip</span>
          </div>
          <p>
            Always ensure the ESP32 is unplugged from USB power while making or altering jumper wire connections on your breadboard.
          </p>
        </div>
      </div>
    </div>
  );
}

export default InstructionPanel;

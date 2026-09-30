function ResistorNode({ component, layout }) {
  const { width = 100, pins = {} } = layout;
  const pin1 = pins["1"] || { x: 0, y: 15 };
  const pin2 = pins["2"] || { x: width, y: 15 };

  return (
    <g transform={`translate(${layout.x}, ${layout.y})`} className="circuit-node resistor-node">
      {/* Lead wire on left */}
      <line
        x1={pin1.x}
        y1={pin1.y}
        x2="20"
        y2="15"
        stroke="#94a3b8"
        strokeWidth="2.5"
        strokeLinecap="round"
      />

      {/* Lead wire on right */}
      <line
        x1="80"
        y1="15"
        x2={pin2.x}
        y2={pin2.y}
        stroke="#94a3b8"
        strokeWidth="2.5"
        strokeLinecap="round"
      />

      {/* Resistor Ceramic Body */}
      <rect
        x="20"
        y="5"
        width="60"
        height="20"
        rx="6"
        fill="#d4a373"
        stroke="#78350f"
        strokeWidth="1.5"
      />

      {/* Resistor Color Bands (220Ω: Red - Red - Brown - Gold) */}
      <rect x="30" y="5" width="5" height="20" fill="#dc2626" />
      <rect x="40" y="5" width="5" height="20" fill="#dc2626" />
      <rect x="50" y="5" width="5" height="20" fill="#78350f" />
      <rect x="65" y="5" width="5" height="20" fill="#eab308" />

      {/* Pin 1 Terminal */}
      <circle cx={pin1.x} cy={pin1.y} r="4" fill="#f8fafc" stroke="#475569" strokeWidth="1.5" />
      <text x={pin1.x} y={pin1.y + 14} fill="#fbbf24" fontSize="10" fontWeight="bold" textAnchor="middle" fontFamily="sans-serif">
        1
      </text>

      {/* Pin 2 Terminal */}
      <circle cx={pin2.x} cy={pin2.y} r="4" fill="#f8fafc" stroke="#475569" strokeWidth="1.5" />
      <text x={pin2.x} y={pin2.y + 14} fill="#fbbf24" fontSize="10" fontWeight="bold" textAnchor="middle" fontFamily="sans-serif">
        2
      </text>

      {/* Component Name / Value Label */}
      <text
        x="50"
        y="-3"
        fill="#fef3c7"
        fontSize="12"
        fontWeight="bold"
        textAnchor="middle"
        fontFamily="sans-serif"
      >
        {component.name || "Resistor"}
      </text>
    </g>
  );
}

export default ResistorNode;

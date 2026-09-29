function ButtonNode({ component, layout }) {
  const { width = 75, height = 75, pins = {} } = layout;
  const pin1 = pins["1"] || { x: 0, y: height / 2 };
  const pin2 = pins["2"] || { x: width, y: height / 2 };

  return (
    <g transform={`translate(${layout.x}, ${layout.y})`} className="circuit-node button-node">
      {/* Metal terminals / legs */}
      <line x1={pin1.x} y1={pin1.y} x2="15" y2={height / 2} stroke="#94a3b8" strokeWidth="2.5" strokeLinecap="round" />
      <line x1={width - 15} y1={height / 2} x2={pin2.x} y2={pin2.y} stroke="#94a3b8" strokeWidth="2.5" strokeLinecap="round" />

      {/* Tactile Switch Body */}
      <rect
        x="12"
        y="12"
        width={width - 24}
        height={height - 24}
        rx="6"
        fill="#1e293b"
        stroke="#475569"
        strokeWidth="2"
      />

      {/* Corner mounting metal pins */}
      <rect x="15" y="15" width="6" height="6" rx="1" fill="#94a3b8" />
      <rect x={width - 21} y="15" width="6" height="6" rx="1" fill="#94a3b8" />
      <rect x="15" y={height - 21} width="6" height="6" rx="1" fill="#94a3b8" />
      <rect x={width - 21} y={height - 21} width="6" height="6" rx="1" fill="#94a3b8" />

      {/* Push Button Cap */}
      <circle cx={width / 2} cy={height / 2} r="16" fill="#0f172a" stroke="#38bdf8" strokeWidth="2" />
      <circle cx={width / 2} cy={height / 2} r="11" fill="#0284c7" />

      {/* Pin 1 Terminal Pad */}
      <circle cx={pin1.x} cy={pin1.y} r="4" fill="#f8fafc" stroke="#475569" strokeWidth="1.5" />
      <text x={pin1.x} y={pin1.y + 14} fill="#94a3b8" fontSize="10" textAnchor="middle" fontFamily="sans-serif">
        1
      </text>

      {/* Pin 2 Terminal Pad */}
      <circle cx={pin2.x} cy={pin2.y} r="4" fill="#f8fafc" stroke="#475569" strokeWidth="1.5" />
      <text x={pin2.x} y={pin2.y + 14} fill="#94a3b8" fontSize="10" textAnchor="middle" fontFamily="sans-serif">
        2
      </text>

      {/* Label */}
      <text
        x={width / 2}
        y="-4"
        fill="#f1f5f9"
        fontSize="11"
        fontWeight="600"
        textAnchor="middle"
        fontFamily="sans-serif"
      >
        {component.name || "Push Button"}
      </text>
    </g>
  );
}

export default ButtonNode;

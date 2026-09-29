function BuzzerNode({ component, layout }) {
  const { radius = 28, pins = {} } = layout;
  const pinPos = pins["+"] || { x: -radius, y: 0 };
  const pinNeg = pins["-"] || { x: radius, y: 0 };

  return (
    <g transform={`translate(${layout.x}, ${layout.y})`} className="circuit-node buzzer-node">
      {/* Sound Waves Graphic */}
      <path
        d="M -10 -36 A 38 38 0 0 1 10 -36"
        fill="none"
        stroke="#f59e0b"
        strokeWidth="1.5"
        strokeDasharray="3 3"
        opacity="0.8"
      />
      <path
        d="M -16 -42 A 46 46 0 0 1 16 -42"
        fill="none"
        stroke="#f59e0b"
        strokeWidth="2"
        strokeDasharray="4 4"
        opacity="0.6"
      />

      {/* Terminal Leads */}
      <line
        x1={pinPos.x}
        y1={pinPos.y}
        x2="-20"
        y2="0"
        stroke="#94a3b8"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
      <line
        x1="20"
        y1="0"
        x2={pinNeg.x}
        y2={pinNeg.y}
        stroke="#94a3b8"
        strokeWidth="2.5"
        strokeLinecap="round"
      />

      {/* Cylindrical Piezo Housing Body */}
      <circle
        cx="0"
        cy="0"
        r={radius}
        fill="#18181b"
        stroke="#3f3f46"
        strokeWidth="3"
      />

      {/* Center Sound Emission Cavity */}
      <circle
        cx="0"
        cy="0"
        r="10"
        fill="#09090b"
        stroke="#27272a"
        strokeWidth="2"
      />

      {/* Polarity Markers */}
      <text
        x="-14"
        y="-12"
        fill="#ef4444"
        fontSize="12"
        fontWeight="bold"
        textAnchor="middle"
        fontFamily="sans-serif"
      >
        +
      </text>
      <text
        x="14"
        y="-12"
        fill="#94a3b8"
        fontSize="12"
        fontWeight="bold"
        textAnchor="middle"
        fontFamily="sans-serif"
      >
        -
      </text>

      {/* Terminal Pads */}
      <circle cx={pinPos.x} cy={pinPos.y} r="4" fill="#ef4444" stroke="#ffffff" strokeWidth="1.5" />
      <text
        x={pinPos.x}
        y={pinPos.y + 14}
        fill="#f87171"
        fontSize="9"
        fontWeight="bold"
        textAnchor="middle"
        fontFamily="sans-serif"
      >
        + (VCC)
      </text>

      <circle cx={pinNeg.x} cy={pinNeg.y} r="4" fill="#64748b" stroke="#ffffff" strokeWidth="1.5" />
      <text
        x={pinNeg.x}
        y={pinNeg.y + 14}
        fill="#cbd5e1"
        fontSize="9"
        fontWeight="bold"
        textAnchor="middle"
        fontFamily="sans-serif"
      >
        - (GND)
      </text>

      {/* Label */}
      <text
        x="0"
        y="40"
        fill="#e4e4e7"
        fontSize="11"
        fontWeight="600"
        textAnchor="middle"
        fontFamily="sans-serif"
      >
        {component.name || "Piezo Buzzer"}
      </text>
    </g>
  );
}

export default BuzzerNode;

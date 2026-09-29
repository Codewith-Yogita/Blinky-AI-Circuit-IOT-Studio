function LEDNode({ component, layout }) {
  const { radius = 25, pins = {} } = layout;
  const anode = pins.anode || { x: -radius, y: 0 };
  const cathode = pins.cathode || { x: radius, y: 0 };

  return (
    <g transform={`translate(${layout.x}, ${layout.y})`} className="circuit-node led-node">
      {/* Subtle Glow Background */}
      <circle cx="0" cy="0" r="28" fill="#ef4444" opacity="0.18" />

      {/* Terminal Leads */}
      <line
        x1={anode.x}
        y1={anode.y}
        x2="-18"
        y2="0"
        stroke="#94a3b8"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
      <line
        x1="18"
        y1="0"
        x2={cathode.x}
        y2={cathode.y}
        stroke="#94a3b8"
        strokeWidth="2.5"
        strokeLinecap="round"
      />

      {/* LED Plastic Rim (Flat edge on cathode side) */}
      <circle
        cx="0"
        cy="0"
        r="20"
        fill="#b91c1c"
        stroke="#ef4444"
        strokeWidth="2"
      />

      {/* Glass Bulb Dome */}
      <circle
        cx="0"
        cy="0"
        r="16"
        fill="#ef4444"
      />

      {/* 3D Glass Light Reflection */}
      <ellipse
        cx="-4"
        cy="-5"
        rx="6"
        ry="3"
        fill="#ffffff"
        opacity="0.5"
        transform="rotate(-25, -4, -5)"
      />

      {/* Cathode Notch indicator line */}
      <line x1="16" y1="-10" x2="16" y2="10" stroke="#7f1d1d" strokeWidth="2" />

      {/* Anode Terminal Dot & Label */}
      <circle cx={anode.x} cy={anode.y} r="4" fill="#f8fafc" stroke="#475569" strokeWidth="1.5" />
      <text
        x={anode.x}
        y={anode.y - 8}
        fill="#f87171"
        fontSize="10"
        fontWeight="bold"
        textAnchor="middle"
        fontFamily="sans-serif"
      >
        A (+)
      </text>

      {/* Cathode Terminal Dot & Label */}
      <circle cx={cathode.x} cy={cathode.y} r="4" fill="#f8fafc" stroke="#475569" strokeWidth="1.5" />
      <text
        x={cathode.x}
        y={cathode.y - 8}
        fill="#94a3b8"
        fontSize="10"
        fontWeight="bold"
        textAnchor="middle"
        fontFamily="sans-serif"
      >
        K (-)
      </text>

      {/* Component Name */}
      <text
        x="0"
        y="36"
        fill="#f1f5f9"
        fontSize="12"
        fontWeight="600"
        textAnchor="middle"
        fontFamily="sans-serif"
      >
        {component.name || "LED"}
      </text>
    </g>
  );
}

export default LEDNode;

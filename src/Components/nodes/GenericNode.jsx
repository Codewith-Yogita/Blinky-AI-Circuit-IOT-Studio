function GenericNode({ component, layout }) {
  const { width = 120, height = 70, pins = {} } = layout;

  return (
    <g transform={`translate(${layout.x}, ${layout.y})`} className="circuit-node generic-node">
      {/* Module Body */}
      <rect
        x="0"
        y="0"
        width={width}
        height={height}
        rx="8"
        fill="#1e293b"
        stroke="#64748b"
        strokeWidth="2"
        strokeDasharray="4 2"
      />

      {/* Header Badge */}
      <rect x="0" y="0" width={width} height="20" rx="8" fill="#334155" />
      <rect x="0" y="12" width={width} height="8" fill="#334155" />
      <text
        x={width / 2}
        y="14"
        fill="#94a3b8"
        fontSize="10"
        fontWeight="600"
        textAnchor="middle"
        fontFamily="sans-serif"
      >
        {(component.type || "MODULE").toUpperCase()}
      </text>

      {/* Component Name */}
      <text
        x={width / 2}
        y="42"
        fill="#f8fafc"
        fontSize="12"
        fontWeight="bold"
        textAnchor="middle"
        fontFamily="sans-serif"
      >
        {component.name || component.id}
      </text>

      {/* Dynamic Pin Terminals */}
      {Object.entries(pins).map(([pinName, pos]) => (
        <g key={pinName} className="pin-group">
          <circle
            cx={pos.x}
            cy={pos.y}
            r="4"
            fill="#38bdf8"
            stroke="#ffffff"
            strokeWidth="1.5"
          />
          <text
            x={pos.x}
            y={pos.y > height / 2 ? pos.y + 12 : pos.y - 6}
            fill="#cbd5e1"
            fontSize="9"
            textAnchor="middle"
            fontFamily="sans-serif"
          >
            {pinName}
          </text>
        </g>
      ))}
    </g>
  );
}

export default GenericNode;

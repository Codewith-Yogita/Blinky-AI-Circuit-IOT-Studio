function ESP32Node({ component, layout }) {
  const { width = 200, height = 200, pins = {} } = layout;

  return (
    <g transform={`translate(${layout.x}, ${layout.y})`} className="circuit-node esp32-node">
      {/* Board PCB Base */}
      <rect
        x="0"
        y="0"
        width={width}
        height={height}
        rx="10"
        fill="#18121e"
        stroke="#f59e0b"
        strokeWidth="2.5"
      />

      {/* Mounting Holes */}
      <circle cx="12" cy="12" r="4" fill="#0f172a" stroke="#64748b" strokeWidth="1" />
      <circle cx="12" cy={height - 12} r="4" fill="#0f172a" stroke="#64748b" strokeWidth="1" />
      <circle cx={width - 12} cy="12" r="4" fill="#0f172a" stroke="#64748b" strokeWidth="1" />
      <circle cx={width - 12} cy={height - 12} r="4" fill="#0f172a" stroke="#64748b" strokeWidth="1" />

      {/* PCB Antenna at top */}
      <rect x="25" y="8" width="50" height="24" rx="2" fill="#2d1b10" stroke="#f59e0b" strokeWidth="0.8" />
      <path
        d="M 30 24 L 30 14 L 40 14 L 40 24 L 50 24 L 50 14 L 60 14 L 60 24 L 70 24"
        stroke="#fbbf24"
        strokeWidth="1.5"
        fill="none"
      />

      {/* ESP-WROOM-32 Metal RF Shield */}
      <rect
        x="25"
        y="42"
        width="115"
        height="110"
        rx="6"
        fill="#120c18"
        stroke="#f59e0b"
        strokeWidth="1.5"
      />
      <text
        x="82"
        y="75"
        fill="#fef3c7"
        textAnchor="middle"
        fontSize="12"
        fontWeight="bold"
        fontFamily="sans-serif"
      >
        ESP-WROOM-32
      </text>
      <text
        x="82"
        y="95"
        fill="#f59e0b"
        textAnchor="middle"
        fontSize="10"
        fontWeight="bold"
        fontFamily="sans-serif"
      >
        Wi-Fi + BT SoC
      </text>
      <text
        x="82"
        y="125"
        fill="#fbbf24"
        textAnchor="middle"
        fontSize="11"
        fontWeight="700"
        fontFamily="sans-serif"
      >
        {component.model || "ESP32 DevKit V1"}
      </text>

      {/* Micro USB Port at bottom */}
      <rect
        x="15"
        y={height - 24}
        width="36"
        height="18"
        rx="3"
        fill="#451a03"
        stroke="#f59e0b"
        strokeWidth="1"
      />

      {/* Dynamic Pin Headers on Right Edge */}
      {Object.entries(pins).map(([pinName, pos]) => {
        const isGND = pinName.toUpperCase().includes("GND");
        const pinColor = isGND ? "#64748b" : "#f59e0b";

        return (
          <g key={pinName} className="pin-group">
            {/* Terminal Pad */}
            <circle
              cx={pos.x}
              cy={pos.y}
              r="7"
              fill={pinColor}
              stroke="#ffffff"
              strokeWidth="1.5"
            />
            {/* Inner Core */}
            <circle cx={pos.x} cy={pos.y} r="3" fill="#0f172a" />

            {/* Pin Label */}
            <text
              x={pos.x - 12}
              y={pos.y + 4}
              fill="#fef3c7"
              fontSize="12"
              fontWeight="bold"
              textAnchor="end"
              fontFamily="sans-serif"
            >
              {pinName}
            </text>
          </g>
        );
      })}

      {/* Board Label */}
      <text
        x="100"
        y={height - 8}
        fill="#f59e0b"
        fontSize="10"
        fontWeight="bold"
        textAnchor="middle"
        fontFamily="sans-serif"
      >
        {component.id || "esp32"}
      </text>
    </g>
  );
}

export default ESP32Node;

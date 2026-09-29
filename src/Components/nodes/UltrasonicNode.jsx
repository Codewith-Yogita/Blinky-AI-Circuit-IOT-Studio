function UltrasonicNode({ layout }) {
  const { width = 140, height = 75, pins = {} } = layout;

  const pinVCC = pins.VCC || { x: 25, y: height };
  const pinTRIG = pins.TRIG || { x: 55, y: height };
  const pinECHO = pins.ECHO || { x: 85, y: height };
  const pinGND = pins.GND || { x: 115, y: height };

  return (
    <g transform={`translate(${layout.x}, ${layout.y})`} className="circuit-node ultrasonic-node">
      {/* Blue PCB Board Base */}
      <rect
        x="0"
        y="0"
        width={width}
        height={height}
        rx="8"
        fill="#1e3a8a"
        stroke="#3b82f6"
        strokeWidth="2"
      />

      {/* Mounting Screwholes */}
      <circle cx="8" cy="8" r="3" fill="#0f172a" stroke="#60a5fa" strokeWidth="1" />
      <circle cx={width - 8} cy="8" r="3" fill="#0f172a" stroke="#60a5fa" strokeWidth="1" />
      <circle cx="8" cy={height - 8} r="3" fill="#0f172a" stroke="#60a5fa" strokeWidth="1" />
      <circle cx={width - 8} cy={height - 8} r="3" fill="#0f172a" stroke="#60a5fa" strokeWidth="1" />

      {/* Left Ultrasonic Transducer Cylinder (Transmitter "T") */}
      <circle
        cx="38"
        cy="34"
        r="24"
        fill="#475569"
        stroke="#94a3b8"
        strokeWidth="2.5"
      />
      <circle cx="38" cy="34" r="18" fill="#334155" stroke="#cbd5e1" strokeWidth="1" />
      <circle cx="38" cy="34" r="8" fill="#1e293b" />
      <text x="38" y="38" fill="#f8fafc" fontSize="12" fontWeight="bold" textAnchor="middle" fontFamily="sans-serif">
        T
      </text>

      {/* Right Ultrasonic Transducer Cylinder (Receiver "R") */}
      <circle
        cx="102"
        cy="34"
        r="24"
        fill="#475569"
        stroke="#94a3b8"
        strokeWidth="2.5"
      />
      <circle cx="102" cy="34" r="18" fill="#334155" stroke="#cbd5e1" strokeWidth="1" />
      <circle cx="102" cy="34" r="8" fill="#1e293b" />
      <text x="102" y="38" fill="#f8fafc" fontSize="12" fontWeight="bold" textAnchor="middle" fontFamily="sans-serif">
        R
      </text>

      {/* Crystal Oscillator in Center */}
      <rect x="64" y="26" width="12" height="18" rx="2" fill="#cbd5e1" stroke="#64748b" strokeWidth="1" />

      {/* Sensor Label */}
      <text
        x={width / 2}
        y="12"
        fill="#93c5fd"
        fontSize="10"
        fontWeight="bold"
        textAnchor="middle"
        fontFamily="sans-serif"
      >
        HC-SR04 ULTRASONIC
      </text>

      {/* Pin 1: VCC */}
      <circle cx={pinVCC.x} cy={pinVCC.y} r="4" fill="#ef4444" stroke="#ffffff" strokeWidth="1.5" />
      <text x={pinVCC.x} y={pinVCC.y - 8} fill="#fca5a5" fontSize="9" fontWeight="bold" textAnchor="middle" fontFamily="sans-serif">
        VCC
      </text>

      {/* Pin 2: TRIG */}
      <circle cx={pinTRIG.x} cy={pinTRIG.y} r="4" fill="#f59e0b" stroke="#ffffff" strokeWidth="1.5" />
      <text x={pinTRIG.x} y={pinTRIG.y - 8} fill="#fde68a" fontSize="9" fontWeight="bold" textAnchor="middle" fontFamily="sans-serif">
        TRIG
      </text>

      {/* Pin 3: ECHO */}
      <circle cx={pinECHO.x} cy={pinECHO.y} r="4" fill="#f59e0b" stroke="#ffffff" strokeWidth="1.5" />
      <text x={pinECHO.x} y={pinECHO.y - 8} fill="#fde68a" fontSize="9" fontWeight="bold" textAnchor="middle" fontFamily="sans-serif">
        ECHO
      </text>

      {/* Pin 4: GND */}
      <circle cx={pinGND.x} cy={pinGND.y} r="4" fill="#64748b" stroke="#ffffff" strokeWidth="1.5" />
      <text x={pinGND.x} y={pinGND.y - 8} fill="#cbd5e1" fontSize="9" fontWeight="bold" textAnchor="middle" fontFamily="sans-serif">
        GND
      </text>
    </g>
  );
}

export default UltrasonicNode;

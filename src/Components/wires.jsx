import { useState } from "react";

/**
 * Computes a clean, collision-avoiding SVG path between two electrical pin coordinates.
 * - Left-to-right connections use smooth horizontal S-curves.
 * - Return loops (e.g. Cathode -> GND) route around the bottom channel to avoid crossing components.
 */
function generateWirePath(start, end) {
  const dx = end.x - start.x;
  const dy = end.y - start.y;

  // Case 1: Forward flow (source is to the left of target)
  if (dx >= 30) {
    const midX = start.x + dx * 0.5;
    return `M ${start.x} ${start.y} C ${midX} ${start.y}, ${midX} ${end.y}, ${end.x} ${end.y}`;
  }

  // Case 2: Vertical / near-vertical connection
  if (Math.abs(dx) < 30) {
    const midY = start.y + dy * 0.5;
    return `M ${start.x} ${start.y} C ${start.x} ${midY}, ${end.x} ${midY}, ${end.x} ${end.y}`;
  }

  // Case 3: Return loop (source is to the right of target, like LED Cathode -> ESP32 GND)
  // Route under the circuit along the bottom wiring channel to keep the board legible
  const channelY = Math.max(start.y, end.y) + 70;
  const exitX = start.x + 35;
  const entryX = end.x + 40;

  return `M ${start.x} ${start.y} C ${exitX} ${start.y}, ${exitX} ${channelY}, ${(start.x + end.x) / 2} ${channelY} S ${entryX} ${end.y}, ${end.x} ${end.y}`;
}

function Wire({ start, end, color = "#f59e0b", label }) {
  const [isHovered, setIsHovered] = useState(false);
  const pathData = generateWirePath(start, end);

  return (
    <g
      className="circuit-wire-group"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{ cursor: "pointer" }}
    >
      {/* Outer casing / outline stroke: Prevents overlapping wires from blending */}
      <path
        d={pathData}
        stroke="#090d16"
        strokeWidth={isHovered ? 8 : 6}
        fill="none"
        strokeLinecap="round"
      />

      {/* Main conductive wire */}
      <path
        d={pathData}
        stroke={color}
        strokeWidth={isHovered ? 4.5 : 3}
        fill="none"
        strokeLinecap="round"
        filter={isHovered ? "drop-shadow(0 0 4px " + color + ")" : undefined}
        style={{ transition: "stroke-width 0.2s ease" }}
      />

      {/* Terminal solder dots at start and end for hardware realism */}
      <circle cx={start.x} cy={start.y} r={isHovered ? 4 : 3} fill={color} />
      <circle cx={end.x} cy={end.y} r={isHovered ? 4 : 3} fill={color} />

      {/* Accessible SVG tooltip showing connection details */}
      {label && <title>{label}</title>}
    </g>
  );
}

export default Wire;
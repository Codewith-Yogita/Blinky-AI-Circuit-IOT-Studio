import WokwiCircuitCanvas from "./WokwiCircuitCanvas";

/**
 * Clean, direct Circuit Diagram Simulation.
 * Renders the authentic breadboard circuit diagram simulation directly without extraneous toolbars, banners, or sub-tabs.
 */
function CircuitDiagram({ circuit }) {
  if (!circuit) {
    return (
      <div className="p-8 text-center text-zinc-400 font-mono text-xs">
        No circuit data available to display.
      </div>
    );
  }

  return (
    <div className="wokwi-circuit-wrapper w-full overflow-hidden rounded-2xl">
      <WokwiCircuitCanvas circuit={circuit} />
    </div>
  );
}

export default CircuitDiagram;
"use client";

import SimpleTerminalBackground from '../background/SimpleTerminalBackground';

export default function HomeBackground() {
  return (
    <div className="fixed inset-0 w-full h-full z-0 overflow-hidden pointer-events-none">
      <SimpleTerminalBackground />
    </div>
  );
}

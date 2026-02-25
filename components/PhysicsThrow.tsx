"use client";

import { useEffect, useRef } from "react";
import Matter from "matter-js";

export default function PhysicsThrow() {
  const sceneRef = useRef<HTMLDivElement>(null);
  // We use refs to store the engine/render instances so we can access them in the resize handler
  const engineRef = useRef<Matter.Engine | null>(null);
  const renderRef = useRef<Matter.Render | null>(null);
  const runnerRef = useRef<Matter.Runner | null>(null);

  useEffect(() => {
    if (!sceneRef.current) return;

    const {
      Engine,
      Render,
      Runner,
      Bodies,
      Composite,
      Mouse,
      MouseConstraint,
      Body,
      Events,
    } = Matter;

    const container = sceneRef.current;

    // ---------------- SETUP ----------------
    // Calculate initial size
    let width = container.clientWidth;
    let height = width * 0.5; // 2:1 Aspect Ratio

    const engine = Engine.create();
    engine.gravity.y = 1;
    engineRef.current = engine;

    const render = Render.create({
      element: container,
      engine: engine,
      options: {
        width,
        height,
        wireframes: false,
        background: "#0A0A0E",
        pixelRatio: window.devicePixelRatio,
      },
    });
    renderRef.current = render;

    // ---------------- WALLS ----------------
    // We make the floor/ceiling HUGE (10,000px) so we don't have to stretch them, only move them.
    const wallOptions = { isStatic: true, render: { fillStyle: "#0A0A0E" } };

    const floor = Bodies.rectangle(width / 2, height + 50, 10000, 100, wallOptions);
    const ceiling = Bodies.rectangle(width / 2, -50, 10000, 100, wallOptions);

    // Left/Right walls need to be normal height, we will resize their height on window resize
    const leftWall = Bodies.rectangle(-50, height / 2, 100, height * 4, wallOptions);
    const rightWall = Bodies.rectangle(width + 50, height / 2, 100, height * 4, wallOptions);

    Composite.add(engine.world, [floor, ceiling, leftWall, rightWall]);

    // ---------------- OBJECTS ----------------
    const ball = Bodies.circle(width * 0.2, height - 100, 36, {
      density: 0.04,
      restitution: 0.8,
      frictionAir: 0.005,
      render: { fillStyle: "#FFC300" }, // Set the ball to Primary Accent (Gold)
    });

    const blocksData = [{ x: 0.72, h: 80 }, { x: 0.78, h: 130 }, { x: 0.84, h: 60 }];
    const blocks = blocksData.map((b) =>
      Bodies.rectangle(width * b.x, height - b.h / 2 - 20, 56, b.h, {
        density: 0.01,
        friction: 0.5,
        restitution: 0.2,
        render: { fillStyle: "#1A1A24", strokeStyle: "#2D2D3B", lineWidth: 1 }, // Set blocks to matching surface cards color
      })
    );

    Composite.add(engine.world, [ball, ...blocks]);

    // ---------------- MOUSE ----------------
    const mouse = Mouse.create(render.canvas);
    mouse.pixelRatio = window.devicePixelRatio || 1;

    const mouseConstraint = MouseConstraint.create(engine, {
      mouse: mouse,
      constraint: { stiffness: 0.2, render: { visible: false } },
    });
    Composite.add(engine.world, mouseConstraint);
    render.mouse = mouse;

    // ---------------- RESIZE HANDLER ----------------
    const handleResize = () => {
      if (!container || !render || !engine) return;

      // 1. Get new dimensions
      const newWidth = container.clientWidth;
      const newHeight = newWidth * 0.5; // Maintain 2:1 aspect ratio

      // 2. Update Render Canvas
      render.canvas.width = newWidth;
      render.canvas.height = newHeight;

      // 3. Update Mouse (Critical for drag alignment)
      // Note: We don't need to manually set pixelRatio again usually, 
      // but we do need to tell Matter the offset changed if using absolute positioning (not needed here)

      // 4. Reposition Walls
      // Floor: Move to new bottom
      Body.setPosition(floor, { x: newWidth / 2, y: newHeight + 50 });

      // Ceiling: Move to new center (x only)
      Body.setPosition(ceiling, { x: newWidth / 2, y: -50 });

      // Right Wall: Move to new right edge
      Body.setPosition(rightWall, { x: newWidth + 50, y: newHeight / 2 });

      // Left Wall: Keep at left, just update Y center
      Body.setPosition(leftWall, { x: -50, y: newHeight / 2 });
    };

    window.addEventListener("resize", handleResize);

    // ---------------- START ----------------
    Render.run(render);
    const runner = Runner.create();
    runnerRef.current = runner;
    Runner.run(runner, engine);

    // ---------------- CLEANUP ----------------
    return () => {
      window.removeEventListener("resize", handleResize);

      Render.stop(render);
      Runner.stop(runner);
      if (mouse) Mouse.clearSourceEvents(mouse);
      Engine.clear(engine);
      render.canvas.remove();
    };
  }, []);

  return (
    <div className="w-full bg-background py-24 flex justify-center">
      {/* aspect-[2/1] ensures the div has height before canvas loads 
        max-h-[80vh] prevents it from becoming too tall on huge screens
      */}
      <div
        ref={sceneRef}
        className="relative w-full max-w-[1200px] aspect-[2/1] max-h-[80vh] cursor-grab active:cursor-grabbing rounded-xl overflow-hidden shadow-2xl shadow-accent/5 ring-1 ring-white/10"
        style={{ touchAction: "none" }}
      />
    </div>
  );
}
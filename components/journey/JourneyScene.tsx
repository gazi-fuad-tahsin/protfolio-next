"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import {
  AdaptiveDpr,
  Environment,
  Float,
  Lightformer,
  Sparkles,
  Stars,
} from "@react-three/drei";
import type { MotionValue } from "motion/react";
import { useMemo, useRef } from "react";
import * as THREE from "three";
import { models } from "./Models";

export type Station = {
  year: string;
  title: string;
  model: string;
  color: string;
};
export type SceneTheme = "light" | "dark";

/** Models are authored at ~2 units; this keeps them small and tidy on their pedestals. */
const MODEL_SCALE = 0.68;

const palette = {
  light: {
    bg: "#f3f3f9",
    fog: [16, 46] as [number, number],
    floor: "#e9e9f2",
    floorRough: 0.95,
    floorMetal: 0,
    pedestal: "#ffffff",
    path: "#5359d2",
    pathOpacity: 0.45,
    ambient: 1.1,
    sun: 1.4,
    sparkle: "#8b90ff",
    stars: false,
  },
  dark: {
    bg: "#07070d",
    fog: [12, 42] as [number, number],
    floor: "#0b0b14",
    floorRough: 0.55,
    floorMetal: 0.8,
    pedestal: "#161724",
    path: "#8b90ff",
    pathOpacity: 0.55,
    ambient: 0.45,
    sun: 1.1,
    sparkle: "#a5aaff",
    stars: true,
  },
};

/** World layout: stations zig-zag down a corridor along −Z. */
const GAP = 12;
const stationPos = (i: number, narrow: boolean): THREE.Vector3 =>
  new THREE.Vector3((i % 2 ? 1 : -1) * (narrow ? 1.0 : 2.2), 0, -i * GAP);

function useCameraRig(stations: Station[], narrow: boolean) {
  return useMemo(() => {
    const pos: THREE.Vector3[] = [new THREE.Vector3(0, 5.5, 12)]; // intro: high & far
    const look: THREE.Vector3[] = [new THREE.Vector3(0, 0, -GAP * 1.5)];
    stations.forEach((_, i) => {
      const p = stationPos(i, narrow);
      // camera sits in front of each station, slightly to the opposite side, looking at it
      pos.push(
        new THREE.Vector3(
          -p.x * (narrow ? 0.3 : 0.5),
          1.45,
          p.z + (narrow ? 6.2 : 5.0),
        ),
      );
      look.push(new THREE.Vector3(p.x * 0.85, 0.75, p.z));
    });
    return {
      pos: new THREE.CatmullRomCurve3(pos, false, "centripetal"),
      look: new THREE.CatmullRomCurve3(look, false, "centripetal"),
    };
  }, [stations, narrow]);
}

function Rig({
  progress,
  stations,
  narrow,
}: {
  progress: MotionValue<number>;
  stations: Station[];
  narrow: boolean;
}) {
  const { camera } = useThree();
  const rig = useCameraRig(stations, narrow);
  const target = useRef(new THREE.Vector3());
  const lookNow = useRef(new THREE.Vector3(0, 0, -20));
  const mouse = useRef(new THREE.Vector2());

  useFrame((state, dt) => {
    const p = THREE.MathUtils.clamp(progress.get(), 0, 1);
    rig.pos.getPoint(p, target.current);
    mouse.current.lerp(state.pointer, 0.05); // tiny parallax from the pointer
    target.current.x += mouse.current.x * 0.3;
    target.current.y += mouse.current.y * 0.15;
    const k = 1 - Math.pow(0.004, Math.min(dt, 0.05)); // frame-rate independent, softer smoothing
    camera.position.lerp(target.current, k);
    lookNow.current.lerp(rig.look.getPoint(p), k);
    camera.lookAt(lookNow.current);
  });
  return null;
}

/** Glowing floor path that links the stations. */
function Path({
  stations,
  narrow,
  theme,
}: {
  stations: Station[];
  narrow: boolean;
  theme: SceneTheme;
}) {
  const geo = useMemo(() => {
    const pts = [
      new THREE.Vector3(0, -0.02, 10),
      ...stations.map((_, i) => stationPos(i, narrow).setY(-0.02)),
      new THREE.Vector3(0, -0.02, -stations.length * GAP),
    ];
    return new THREE.TubeGeometry(
      new THREE.CatmullRomCurve3(pts, false, "centripetal"),
      400,
      0.04,
      8,
      false,
    );
  }, [stations, narrow]);
  const c = palette[theme];
  return (
    <mesh geometry={geo}>
      <meshBasicMaterial
        color={c.path}
        transparent
        opacity={c.pathOpacity}
        toneMapped={false}
      />
    </mesh>
  );
}

function Pedestal({
  color,
  theme,
  activeRef,
}: {
  color: string;
  theme: SceneTheme;
  activeRef: React.RefObject<boolean>;
}) {
  const ring = useRef<THREE.Mesh>(null);
  useFrame(({ clock }) => {
    if (!ring.current) return;
    ring.current.rotation.z = clock.elapsedTime * 0.4;
    const m = ring.current.material as THREE.MeshBasicMaterial;
    m.opacity = THREE.MathUtils.lerp(
      m.opacity,
      activeRef.current ? 0.95 : 0.35,
      0.08,
    );
  });
  return (
    <group>
      <mesh position={[0, -0.1, 0]}>
        <cylinderGeometry args={[1.05, 1.15, 0.2, 64]} />
        <meshStandardMaterial
          color={palette[theme].pedestal}
          metalness={theme === "dark" ? 0.5 : 0}
          roughness={theme === "dark" ? 0.3 : 0.6}
        />
      </mesh>
      <mesh ref={ring} position={[0, 0.006, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.94, 1.04, 96]} />
        <meshBasicMaterial
          color={color}
          transparent
          opacity={0.4}
          toneMapped={false}
        />
      </mesh>
      <mesh position={[0, 0.003, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[0.94, 64]} />
        <meshStandardMaterial
          color={color}
          transparent
          opacity={theme === "dark" ? 0.1 : 0.14}
        />
      </mesh>
    </group>
  );
}

/** Label pill drawn to a canvas texture and shown as a sprite (stays inside WebGL — no extra React roots). */
function Label({
  text,
  color,
  position,
}: {
  text: string;
  color: string;
  position: [number, number, number];
}) {
  const { texture, aspect } = useMemo(() => {
    const label = text.toUpperCase();
    const h = 112;
    const c = document.createElement("canvas");
    const ctx = c.getContext("2d")!;
    ctx.font = "700 60px Antonio, 'Arial Narrow', Arial, sans-serif";
    const w = Math.max(200, Math.ceil(ctx.measureText(label).width) + 96);
    c.width = w;
    c.height = h;
    ctx.shadowColor = color;
    ctx.shadowBlur = 22;
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.roundRect(16, 10, w - 32, h - 20, (h - 20) / 2);
    ctx.fill();
    ctx.shadowBlur = 0;
    ctx.fillStyle = "#0b0b14";
    ctx.font = "700 60px Antonio, 'Arial Narrow', Arial, sans-serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(label, w / 2, h / 2 + 3);
    const t = new THREE.CanvasTexture(c);
    t.colorSpace = THREE.SRGBColorSpace;
    t.anisotropy = 4;
    return { texture: t, aspect: w / h };
  }, [text, color]);
  const height = 0.5;
  return (
    <sprite position={position} scale={[height * aspect, height, 1]}>
      <spriteMaterial
        map={texture}
        transparent
        depthWrite={false}
        toneMapped={false}
      />
    </sprite>
  );
}

function StationObject({
  s,
  i,
  narrow,
  theme,
  activeIndex,
}: {
  s: Station;
  i: number;
  narrow: boolean;
  theme: SceneTheme;
  activeIndex: MotionValue<number>;
}) {
  const group = useRef<THREE.Group>(null);
  const light = useRef<THREE.PointLight>(null);
  const activeRef = useRef(false);
  const Model = models[s.model] ?? models.trophy;
  const p = stationPos(i, narrow);

  useFrame(({ clock }, dt) => {
    const active = Math.round(activeIndex.get()) === i;
    activeRef.current = active;
    if (group.current) {
      const target = (active ? 1.08 : 0.9) * MODEL_SCALE;
      group.current.scale.setScalar(
        THREE.MathUtils.lerp(
          group.current.scale.x,
          target,
          1 - Math.pow(0.002, dt),
        ),
      );
      // gentle sway instead of a full spin, so flat models (gears, shield, bag) always face the viewer
      group.current.rotation.y =
        Math.sin(clock.elapsedTime * (active ? 0.7 : 0.45) + i) *
        (active ? 0.55 : 0.35);
    }
    if (light.current)
      light.current.intensity = THREE.MathUtils.lerp(
        light.current.intensity,
        active ? 14 : 3,
        0.06,
      );
  });

  return (
    <group position={p}>
      <Pedestal color={s.color} theme={theme} activeRef={activeRef} />
      <pointLight
        ref={light}
        position={[0, 2.4, 1.2]}
        color={s.color}
        intensity={3}
        distance={7}
        decay={2}
      />
      <Float
        speed={1.5}
        rotationIntensity={0.2}
        floatIntensity={0.5}
        floatingRange={[0, 0.18]}
      >
        <group ref={group} position={[0, 0.06, 0]} scale={MODEL_SCALE}>
          <Model color={s.color} />
        </group>
      </Float>
      <Label text={s.year} color={s.color} position={[0, 2.25, 0]} />
    </group>
  );
}

export default function JourneyScene({
  stations,
  progress,
  activeIndex,
  narrow,
  theme,
  paused = false,
  onReady,
  onContextLost,
}: {
  stations: Station[];
  progress: MotionValue<number>;
  activeIndex: MotionValue<number>;
  narrow: boolean;
  theme: SceneTheme;
  /** off-screen: render only on demand (resize, theme change) instead of every frame */
  paused?: boolean;
  /** first frame is on screen */
  onReady?: () => void;
  /** the GPU dropped the WebGL context — the parent re-creates the canvas */
  onContextLost?: () => void;
}) {
  const c = palette[theme];
  const length = stations.length * GAP;
  return (
    <Canvas
      frameloop={paused ? "demand" : "always"}
      dpr={[1, 1.5]}
      performance={{ min: 0.6 }}
      camera={{
        position: [0, 5.5, 12],
        fov: narrow ? 60 : 46,
        near: 0.1,
        far: 200,
      }}
      gl={{ antialias: true, powerPreference: "high-performance" }}
      onCreated={({ gl }) => {
        gl.domElement.addEventListener(
          "webglcontextlost",
          (e) => {
            e.preventDefault();
            onContextLost?.();
          },
          { once: true },
        );
        // wait one frame so the first image is actually drawn before revealing it
        requestAnimationFrame(() => requestAnimationFrame(() => onReady?.()));
      }}
    >
      <AdaptiveDpr pixelated={false} />
      <color attach="background" args={[c.bg]} />
      <fog attach="fog" args={[c.bg, c.fog[0], c.fog[1]]} />

      <ambientLight intensity={c.ambient} />
      <directionalLight position={[6, 10, 6]} intensity={c.sun} />
      {/* procedural reflections — no HDR download */}
      <Environment resolution={64}>
        <Lightformer
          intensity={2.5}
          position={[0, 6, -6]}
          scale={[14, 4, 1]}
          color="#ffffff"
        />
        <Lightformer
          intensity={1.4}
          position={[-8, 2, 2]}
          scale={[4, 8, 1]}
          rotation-y={Math.PI / 2}
          color="#8b90ff"
        />
        <Lightformer
          intensity={1.0}
          position={[8, 2, 2]}
          scale={[4, 8, 1]}
          rotation-y={-Math.PI / 2}
          color="#f472b6"
        />
      </Environment>

      {c.stars && (
        <Stars
          radius={90}
          depth={60}
          count={2000}
          factor={4}
          saturation={0}
          fade
          speed={0.6}
        />
      )}
      <Sparkles
        count={80}
        scale={[14, 7, length + 20]}
        position={[0, 3, -length / 2]}
        size={theme === "dark" ? 2.4 : 3}
        speed={0.3}
        color={c.sparkle}
        opacity={theme === "dark" ? 1 : 0.7}
      />

      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.2, -length / 2]}>
        <planeGeometry args={[80, length + 60]} />
        <meshStandardMaterial
          color={c.floor}
          metalness={c.floorMetal}
          roughness={c.floorRough}
        />
      </mesh>

      <Path stations={stations} narrow={narrow} theme={theme} />
      {stations.map((s, i) => (
        <StationObject
          key={s.year + s.title}
          s={s}
          i={i}
          narrow={narrow}
          theme={theme}
          activeIndex={activeIndex}
        />
      ))}

      <Rig progress={progress} stations={stations} narrow={narrow} />
    </Canvas>
  );
}

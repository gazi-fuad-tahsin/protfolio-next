"use client";

import { RoundedBox } from "@react-three/drei";
import { useFrame, type ThreeElements } from "@react-three/fiber";
import { useMemo, useRef, type ReactNode } from "react";
import * as THREE from "three";

/**
 * Soft "clay" models built from primitives (no downloads). Rounded shapes,
 * matte pastel materials and small accent glows, so they sit nicely in both
 * the light and dark theme. Each fits in roughly 2 × 2 units on y = 0.
 */

type P = { color: string };

const Clay = ({
  color,
  rough = 0.55,
  metal = 0.05,
}: {
  color: string;
  rough?: number;
  metal?: number;
}) => (
  <meshStandardMaterial color={color} roughness={rough} metalness={metal} />
);
const Glow = ({
  color,
  intensity = 1.2,
}: {
  color: string;
  intensity?: number;
}) => (
  <meshStandardMaterial
    color={color}
    emissive={color}
    emissiveIntensity={intensity}
    roughness={0.4}
  />
);

const WHITE = "#f4f4fa";
const SOFT = "#dfe1ec";
const INK = "#2b2d3c";

function Spin({
  speed = 1,
  children,
  ...rest
}: { speed?: number; children: ReactNode } & ThreeElements["group"]) {
  const ref = useRef<THREE.Group>(null);
  useFrame((_, dt) => {
    if (ref.current) ref.current.rotation.y += dt * speed;
  });
  return (
    <group ref={ref} {...rest}>
      {children}
    </group>
  );
}

/* ───────────────────────────── career ───────────────────────────── */

export function Trophy({ color }: P) {
  const cup = useMemo(() => {
    const pts = [
      [0.08, 0],
      [0.5, 0.04],
      [0.56, 0.3],
      [0.52, 0.62],
      [0.38, 0.86],
      [0.14, 0.95],
    ].map(([x, y]) => new THREE.Vector2(x, y));
    return new THREE.LatheGeometry(pts, 48);
  }, []);
  return (
    <group>
      <RoundedBox args={[1, 0.22, 1]} radius={0.08} position={[0, 0.11, 0]}>
        <Clay color={INK} />
      </RoundedBox>
      <RoundedBox args={[0.6, 0.18, 0.6]} radius={0.06} position={[0, 0.31, 0]}>
        <Clay color={SOFT} />
      </RoundedBox>
      <mesh position={[0, 0.55, 0]}>
        <cylinderGeometry args={[0.07, 0.14, 0.32, 24]} />
        <Clay color={color} rough={0.3} metal={0.45} />
      </mesh>
      <mesh position={[0, 1.66, 0]} rotation={[Math.PI, 0, 0]} geometry={cup}>
        <meshStandardMaterial
          color={color}
          roughness={0.3}
          metalness={0.45}
          side={THREE.DoubleSide}
        />
      </mesh>
      {[-1, 1].map((s) => (
        <mesh
          key={s}
          position={[s * 0.54, 1.22, 0]}
          rotation={[0, 0, (s * -Math.PI) / 2]}
        >
          <torusGeometry args={[0.2, 0.055, 16, 32, Math.PI]} />
          <Clay color={color} rough={0.3} metal={0.45} />
        </mesh>
      ))}
      <mesh position={[0, 1.15, 0.53]}>
        <octahedronGeometry args={[0.1]} />
        <Glow color="#fff3c4" />
      </mesh>
    </group>
  );
}

export function Bag({ color }: P) {
  return (
    <group>
      <RoundedBox
        args={[1.15, 1.3, 0.62]}
        radius={0.12}
        position={[0, 0.65, 0]}
      >
        <Clay color={color} />
      </RoundedBox>
      <mesh position={[0, 1.3, 0]}>
        <torusGeometry args={[0.3, 0.05, 14, 32, Math.PI]} />
        <Clay color={INK} />
      </mesh>
      <mesh position={[0, 0.7, 0.32]}>
        <circleGeometry args={[0.24, 32]} />
        <Clay color={WHITE} />
      </mesh>
      <mesh position={[0, 0.7, 0.33]}>
        <torusGeometry args={[0.13, 0.03, 8, 24, Math.PI * 1.4]} />
        <Clay color={color} />
      </mesh>
      <RoundedBox
        args={[0.42, 0.42, 0.42]}
        radius={0.05}
        position={[0.85, 0.21, 0.2]}
        rotation={[0, 0.5, 0]}
      >
        <Clay color="#e9c39b" />
      </RoundedBox>
    </group>
  );
}

export function Cap({ color }: P) {
  const tassel = useRef<THREE.Group>(null);
  useFrame(({ clock }) => {
    if (tassel.current)
      tassel.current.rotation.z = Math.sin(clock.elapsedTime * 2) * 0.15;
  });
  return (
    <group>
      <RoundedBox
        args={[1.3, 0.24, 0.9]}
        radius={0.05}
        position={[0, 0.12, 0]}
        rotation={[0, 0.25, 0]}
      >
        <Clay color="#4f63d8" />
      </RoundedBox>
      <RoundedBox
        args={[1.15, 0.22, 0.82]}
        radius={0.05}
        position={[0, 0.35, 0]}
        rotation={[0, -0.15, 0]}
      >
        <Clay color={color} />
      </RoundedBox>
      <group position={[0, 0.85, 0]} rotation={[0.1, 0.6, 0]}>
        <mesh position={[0, -0.1, 0]}>
          <cylinderGeometry args={[0.38, 0.42, 0.34, 32]} />
          <Clay color={INK} />
        </mesh>
        <RoundedBox
          args={[1.25, 0.07, 1.25]}
          radius={0.03}
          position={[0, 0.1, 0]}
          rotation={[0, Math.PI / 4, 0]}
        >
          <Clay color="#353849" />
        </RoundedBox>
        <mesh position={[0, 0.15, 0]}>
          <sphereGeometry args={[0.06, 16, 16]} />
          <Glow color={color} intensity={0.6} />
        </mesh>
        <group ref={tassel} position={[0.46, 0.13, 0.46]}>
          <mesh position={[0, -0.25, 0]}>
            <cylinderGeometry args={[0.018, 0.018, 0.5, 8]} />
            <Glow color="#fbbf24" intensity={0.5} />
          </mesh>
          <mesh position={[0, -0.52, 0]}>
            <coneGeometry args={[0.07, 0.17, 12]} />
            <Glow color="#fbbf24" intensity={0.5} />
          </mesh>
        </group>
      </group>
    </group>
  );
}

/** TS4U — a laptop with code on screen and a coffee */
export function Laptop({ color }: P) {
  const lines = useRef<THREE.Group>(null);
  useFrame(({ clock }) => {
    if (!lines.current) return;
    lines.current.children.forEach((c, i) => {
      c.scale.x =
        0.35 + 0.65 * ((Math.sin(clock.elapsedTime * 1.6 - i * 0.7) + 1) / 2);
    });
  });
  return (
    <group rotation={[0, -0.35, 0]}>
      <RoundedBox args={[1.5, 0.08, 1.0]} radius={0.04} position={[0, 0.04, 0]}>
        <Clay color={SOFT} />
      </RoundedBox>
      <group position={[0, 0.08, -0.48]} rotation={[-0.25, 0, 0]}>
        <RoundedBox
          args={[1.5, 0.98, 0.06]}
          radius={0.04}
          position={[0, 0.49, 0]}
        >
          <Clay color={SOFT} />
        </RoundedBox>
        <mesh position={[0, 0.5, 0.032]}>
          <planeGeometry args={[1.34, 0.82]} />
          <meshStandardMaterial color="#141522" roughness={0.6} />
        </mesh>
        <group ref={lines} position={[-0.56, 0.78, 0.035]}>
          {[0.7, 0.5, 0.85, 0.4, 0.65, 0.55].map((w, i) => (
            <mesh key={i} position={[0, -i * 0.11, 0]}>
              <planeGeometry args={[w, 0.05]} />
              <meshBasicMaterial
                color={[color, "#a5b4fc", "#86efac", "#fcd34d"][i % 4]}
                toneMapped={false}
              />
            </mesh>
          ))}
        </group>
      </group>
      <group position={[0.95, 0, 0.25]}>
        <mesh position={[0, 0.17, 0]}>
          <cylinderGeometry args={[0.13, 0.12, 0.34, 24]} />
          <Clay color={color} />
        </mesh>
        <mesh position={[0.14, 0.18, 0]} rotation={[0, 0, Math.PI / 2]}>
          <torusGeometry args={[0.07, 0.025, 8, 16]} />
          <Clay color={color} />
        </mesh>
      </group>
    </group>
  );
}

export function Server({ color }: P) {
  const leds = useRef<THREE.MeshStandardMaterial[]>([]);
  useFrame(({ clock }) => {
    const t = clock.elapsedTime;
    leds.current.forEach((m, i) => {
      if (m)
        m.emissiveIntensity =
          0.4 + Math.max(0, Math.sin(t * (2.5 + i * 0.6) + i)) * 2.2;
    });
  });
  return (
    <group>
      <RoundedBox args={[1, 1.8, 0.8]} radius={0.1} position={[0, 0.9, 0]}>
        <Clay color={SOFT} />
      </RoundedBox>
      {Array.from({ length: 4 }, (_, i) => (
        <group key={i} position={[0, 0.35 + i * 0.4, 0.41]}>
          <RoundedBox args={[0.82, 0.28, 0.04]} radius={0.015}>
            <Clay color="#3a3d52" />
          </RoundedBox>
          <mesh position={[-0.28, 0, 0.03]}>
            <sphereGeometry args={[0.035, 12, 12]} />
            <meshStandardMaterial
              ref={(m) => {
                if (m) leds.current[i] = m;
              }}
              color={i % 2 ? "#22c55e" : color}
              emissive={i % 2 ? "#22c55e" : color}
              emissiveIntensity={1}
            />
          </mesh>
          {[0, 1, 2].map((k) => (
            <mesh key={k} position={[0.02 + k * 0.12, 0, 0.025]}>
              <planeGeometry args={[0.07, 0.14]} />
              <meshStandardMaterial color="#1c1e2b" />
            </mesh>
          ))}
        </group>
      ))}
      <Spin speed={0.9} position={[0, 0.95, 0]}>
        {Array.from({ length: 5 }, (_, i) => {
          const a = (i / 5) * Math.PI * 2;
          return (
            <RoundedBox
              key={i}
              args={[0.13, 0.13, 0.13]}
              radius={0.03}
              position={[
                Math.cos(a) * 0.85,
                Math.sin(a * 2) * 0.25,
                Math.sin(a) * 0.85,
              ]}
            >
              <Glow color={color} intensity={1} />
            </RoundedBox>
          );
        })}
      </Spin>
    </group>
  );
}

function Person({
  color,
  scale = 1,
  position = [0, 0, 0] as [number, number, number],
}: {
  color: string;
  scale?: number;
  position?: [number, number, number];
}) {
  return (
    <group position={position} scale={scale}>
      <mesh position={[0, 0.36, 0]}>
        <capsuleGeometry args={[0.18, 0.3, 8, 16]} />
        <Clay color={color} />
      </mesh>
      <mesh position={[0, 0.8, 0]}>
        <sphereGeometry args={[0.15, 24, 24]} />
        <Clay color="#ffe3cf" />
      </mesh>
    </group>
  );
}

export function Team({ color }: P) {
  const star = useMemo(() => {
    const shape = new THREE.Shape();
    for (let i = 0; i < 10; i++) {
      const r = i % 2 ? 0.11 : 0.25;
      const a = (i / 10) * Math.PI * 2 + Math.PI / 2;
      if (i === 0) shape.moveTo(Math.cos(a) * r, Math.sin(a) * r);
      else shape.lineTo(Math.cos(a) * r, Math.sin(a) * r);
    }
    shape.closePath();
    return new THREE.ExtrudeGeometry(shape, {
      depth: 0.07,
      bevelEnabled: true,
      bevelSize: 0.02,
      bevelThickness: 0.02,
      bevelSegments: 3,
    });
  }, []);
  const team = ["#7dd3fc", "#86efac", "#fcd34d", "#f9a8d4"];
  return (
    <group>
      <Person color={color} scale={1.2} />
      {team.map((c, i) => {
        const a = (i / team.length) * Math.PI * 2 + Math.PI / 4;
        return (
          <Person
            key={c}
            color={c}
            scale={0.8}
            position={[Math.cos(a) * 0.8, 0, Math.sin(a) * 0.8]}
          />
        );
      })}
      <Spin speed={1.2} position={[0, 1.5, 0]}>
        <mesh geometry={star}>
          <Glow color="#fcd34d" intensity={0.8} />
        </mesh>
      </Spin>
    </group>
  );
}

export function Rocket({ color }: P) {
  const body = useMemo(() => {
    const pts = [
      [0.02, 0],
      [0.27, 0.05],
      [0.34, 0.35],
      [0.34, 1.0],
      [0.27, 1.35],
      [0.13, 1.6],
      [0.02, 1.7],
    ].map(([x, y]) => new THREE.Vector2(x, y));
    return new THREE.LatheGeometry(pts, 40);
  }, []);
  const flame = useRef<THREE.Mesh>(null);
  const ship = useRef<THREE.Group>(null);
  useFrame(({ clock }) => {
    const t = clock.elapsedTime;
    if (flame.current) flame.current.scale.y = 0.85 + Math.sin(t * 28) * 0.12;
    if (ship.current) ship.current.position.y = 0.35 + Math.sin(t * 1.3) * 0.1;
  });
  return (
    <group ref={ship}>
      <mesh geometry={body}>
        <Clay color={WHITE} rough={0.4} />
      </mesh>
      <mesh position={[0, 1.36, 0]}>
        <cylinderGeometry args={[0.27, 0.34, 0.1, 40]} />
        <Clay color={color} />
      </mesh>
      <mesh position={[0, 0.95, 0.32]}>
        <sphereGeometry args={[0.11, 24, 24]} />
        <meshStandardMaterial
          color="#7dd3fc"
          emissive="#38bdf8"
          emissiveIntensity={0.35}
          roughness={0.2}
        />
      </mesh>
      {[0, 1, 2].map((i) => {
        const a = (i / 3) * Math.PI * 2;
        return (
          <RoundedBox
            key={i}
            args={[0.32, 0.42, 0.06]}
            radius={0.025}
            position={[Math.cos(a) * 0.34, 0.24, Math.sin(a) * 0.34]}
            rotation={[0, -a, 0]}
          >
            <Clay color={color} />
          </RoundedBox>
        );
      })}
      <mesh ref={flame} position={[0, -0.26, 0]} rotation={[Math.PI, 0, 0]}>
        <coneGeometry args={[0.18, 0.55, 24, 1, true]} />
        <meshBasicMaterial
          color="#fb923c"
          transparent
          opacity={0.9}
          toneMapped={false}
        />
      </mesh>
      <mesh position={[0, -0.14, 0]} rotation={[Math.PI, 0, 0]}>
        <coneGeometry args={[0.1, 0.3, 16]} />
        <meshBasicMaterial color="#fef3c7" toneMapped={false} />
      </mesh>
    </group>
  );
}

/* ───────────────────────── backend & security ───────────────────────── */

/** 01 · Request — a laptop and a phone sending a request */
export function Devices({ color }: P) {
  const ping = useRef<THREE.Mesh>(null);
  useFrame(({ clock }) => {
    if (!ping.current) return;
    const t = (clock.elapsedTime % 1.6) / 1.6;
    ping.current.scale.setScalar(0.3 + t * 1.2);
    (ping.current.material as THREE.MeshBasicMaterial).opacity = 0.8 * (1 - t);
  });
  return (
    <group>
      <group position={[-0.45, 0, 0]} rotation={[0, 0.35, 0]}>
        <RoundedBox
          args={[1.05, 0.06, 0.7]}
          radius={0.025}
          position={[0, 0.03, 0]}
        >
          <Clay color={SOFT} />
        </RoundedBox>
        <group position={[0, 0.06, -0.33]} rotation={[-0.2, 0, 0]}>
          <RoundedBox
            args={[1.05, 0.68, 0.05]}
            radius={0.02}
            position={[0, 0.34, 0]}
          >
            <Clay color={SOFT} />
          </RoundedBox>
          <mesh position={[0, 0.35, 0.027]}>
            <planeGeometry args={[0.92, 0.56]} />
            <Glow color={color} intensity={0.35} />
          </mesh>
        </group>
      </group>
      <RoundedBox
        args={[0.36, 0.72, 0.06]}
        radius={0.025}
        position={[0.6, 0.38, 0.15]}
        rotation={[0, -0.4, 0]}
      >
        <Clay color={INK} />
      </RoundedBox>
      <mesh position={[0.6, 0.39, 0.18]} rotation={[0, -0.4, 0]}>
        <planeGeometry args={[0.28, 0.58]} />
        <Glow color={color} intensity={0.45} />
      </mesh>
      <mesh ref={ping} position={[0.1, 1.15, 0]}>
        <torusGeometry args={[0.25, 0.02, 8, 48]} />
        <meshBasicMaterial
          color={color}
          transparent
          opacity={0.6}
          toneMapped={false}
        />
      </mesh>
    </group>
  );
}

/** 02 · Gateway — an arch with a filter field that requests pass through */
export function Gateway({ color }: P) {
  const packets = useRef<THREE.Group>(null);
  useFrame(({ clock }) => {
    if (!packets.current) return;
    packets.current.children.forEach((c, i) => {
      const t = ((clock.elapsedTime * 0.5 + i / 3) % 1) * 2 - 1;
      c.position.z = t * 1.1;
      c.visible = Math.abs(t) < 0.98;
    });
  });
  return (
    <group>
      {[-0.65, 0.65].map((x) => (
        <RoundedBox
          key={x}
          args={[0.26, 1.5, 0.4]}
          radius={0.08}
          position={[x, 0.75, 0]}
        >
          <Clay color={SOFT} />
        </RoundedBox>
      ))}
      <RoundedBox args={[1.6, 0.26, 0.46]} radius={0.08} position={[0, 1.6, 0]}>
        <Clay color={color} />
      </RoundedBox>
      <mesh position={[0, 0.75, 0]}>
        <planeGeometry args={[1.04, 1.4]} />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={0.5}
          transparent
          opacity={0.22}
          side={THREE.DoubleSide}
        />
      </mesh>
      <group ref={packets} position={[0, 0.75, 0]}>
        {[0, 1, 2].map((i) => (
          <RoundedBox
            key={i}
            args={[0.16, 0.16, 0.16]}
            radius={0.04}
            position={[(i - 1) * 0.28, (i - 1) * 0.25, 0]}
          >
            <Glow color={i === 1 ? "#86efac" : color} intensity={1} />
          </RoundedBox>
        ))}
      </group>
    </group>
  );
}

/** 03 · Auth — padlock and key */
export function Lock({ color }: P) {
  const key = useRef<THREE.Group>(null);
  useFrame(({ clock }) => {
    if (key.current)
      key.current.rotation.z = Math.sin(clock.elapsedTime * 1.5) * 0.25;
  });
  return (
    <group>
      <mesh position={[0, 1.18, 0]}>
        <torusGeometry args={[0.32, 0.08, 16, 40, Math.PI]} />
        <Clay color={SOFT} rough={0.3} metal={0.4} />
      </mesh>
      {[-0.32, 0.32].map((x) => (
        <mesh key={x} position={[x, 1.08, 0]}>
          <cylinderGeometry args={[0.08, 0.08, 0.2, 16]} />
          <Clay color={SOFT} rough={0.3} metal={0.4} />
        </mesh>
      ))}
      <RoundedBox args={[1.0, 0.85, 0.4]} radius={0.12} position={[0, 0.6, 0]}>
        <Clay color={color} />
      </RoundedBox>
      <mesh position={[0, 0.66, 0.21]}>
        <circleGeometry args={[0.09, 24]} />
        <Clay color={INK} />
      </mesh>
      <mesh position={[0, 0.52, 0.21]}>
        <planeGeometry args={[0.06, 0.18]} />
        <Clay color={INK} />
      </mesh>
      <group ref={key} position={[0.85, 0.5, 0.3]}>
        <mesh>
          <torusGeometry args={[0.12, 0.04, 12, 24]} />
          <Glow color="#fcd34d" intensity={0.5} />
        </mesh>
        <mesh position={[0, -0.32, 0]}>
          <cylinderGeometry args={[0.03, 0.03, 0.42, 10]} />
          <Glow color="#fcd34d" intensity={0.5} />
        </mesh>
        {[0, 1].map((i) => (
          <mesh key={i} position={[0.06, -0.38 - i * 0.1, 0]}>
            <boxGeometry args={[0.1, 0.04, 0.04]} />
            <Glow color="#fcd34d" intensity={0.5} />
          </mesh>
        ))}
      </group>
    </group>
  );
}

function gearGeometry(r: number, teeth: number) {
  const s = new THREE.Shape();
  const inner = r * 0.82;
  for (let i = 0; i < teeth * 2; i++) {
    const a0 = (i / (teeth * 2)) * Math.PI * 2;
    const a1 = ((i + 1) / (teeth * 2)) * Math.PI * 2;
    const rr = i % 2 ? inner : r;
    if (i === 0) s.moveTo(Math.cos(a0) * rr, Math.sin(a0) * rr);
    s.lineTo(Math.cos(a0) * rr, Math.sin(a0) * rr);
    s.lineTo(Math.cos(a1) * rr, Math.sin(a1) * rr);
  }
  const hole = new THREE.Path();
  hole.absarc(0, 0, r * 0.3, 0, Math.PI * 2, true);
  s.holes.push(hole);
  return new THREE.ExtrudeGeometry(s, {
    depth: 0.16,
    bevelEnabled: true,
    bevelSize: 0.025,
    bevelThickness: 0.025,
    bevelSegments: 2,
  });
}

/** 04 · Logic — interlocking gears */
export function Gears({ color }: P) {
  const big = useMemo(() => gearGeometry(0.62, 12), []);
  const small = useMemo(() => gearGeometry(0.4, 8), []);
  const a = useRef<THREE.Mesh>(null);
  const b = useRef<THREE.Mesh>(null);
  useFrame((_, dt) => {
    if (a.current) a.current.rotation.z += dt * 0.6;
    if (b.current) b.current.rotation.z -= dt * 0.6 * (12 / 8);
  });
  return (
    <group position={[0, 0.85, 0]}>
      <mesh ref={a} geometry={big} position={[-0.32, 0, 0]}>
        <Clay color={color} />
      </mesh>
      <mesh
        ref={b}
        geometry={small}
        position={[0.62, 0.42, 0.02]}
        rotation={[0, 0, 0.2]}
      >
        <Clay color={SOFT} />
      </mesh>
      <mesh position={[-0.32, 0, 0.1]}>
        <sphereGeometry args={[0.1, 16, 16]} />
        <Glow color={color} intensity={0.8} />
      </mesh>
    </group>
  );
}

/** 05 · Data — database stack with a cache bolt */
export function Database({ color }: P) {
  const bolt = useMemo(() => {
    const s = new THREE.Shape();
    s.moveTo(0.05, 0.3);
    s.lineTo(-0.12, 0);
    s.lineTo(0.0, 0);
    s.lineTo(-0.06, -0.3);
    s.lineTo(0.14, 0.05);
    s.lineTo(0.02, 0.05);
    s.closePath();
    return new THREE.ExtrudeGeometry(s, {
      depth: 0.06,
      bevelEnabled: true,
      bevelSize: 0.015,
      bevelThickness: 0.015,
      bevelSegments: 2,
    });
  }, []);
  const bands = useRef<THREE.MeshStandardMaterial[]>([]);
  useFrame(({ clock }) => {
    bands.current.forEach((m, i) => {
      if (m)
        m.emissiveIntensity =
          0.3 + Math.max(0, Math.sin(clock.elapsedTime * 2 - i)) * 1.4;
    });
  });
  return (
    <group>
      {[0, 1, 2].map((i) => (
        <group key={i} position={[0, 0.25 + i * 0.42, 0]}>
          <mesh>
            <cylinderGeometry args={[0.55, 0.55, 0.34, 40]} />
            <Clay color={i === 2 ? color : SOFT} />
          </mesh>
          <mesh position={[0, 0.17, 0]} rotation={[Math.PI / 2, 0, 0]}>
            <torusGeometry args={[0.55, 0.025, 10, 48]} />
            <meshStandardMaterial
              ref={(m) => {
                if (m) bands.current[i] = m;
              }}
              color={color}
              emissive={color}
              emissiveIntensity={0.5}
            />
          </mesh>
        </group>
      ))}
      <Spin speed={1.1} position={[0.85, 1.25, 0]}>
        <mesh geometry={bolt}>
          <Glow color="#fcd34d" intensity={1} />
        </mesh>
      </Spin>
    </group>
  );
}

/** 06 · Real-time — a hub broadcasting rings, with an email envelope */
export function Signal({ color }: P) {
  const rings = useRef<THREE.Group>(null);
  const env = useRef<THREE.Group>(null);
  useFrame(({ clock }) => {
    const t = clock.elapsedTime;
    rings.current?.children.forEach((c, i) => {
      const k = (t * 0.6 + i / 3) % 1;
      c.scale.setScalar(0.4 + k * 1.4);
      ((c as THREE.Mesh).material as THREE.MeshBasicMaterial).opacity =
        0.7 * (1 - k);
    });
    if (env.current) {
      env.current.position.y = 1.35 + Math.sin(t * 1.4) * 0.1;
      env.current.rotation.y = Math.sin(t * 0.8) * 0.4;
    }
  });
  return (
    <group>
      <mesh position={[0, 0.2, 0]}>
        <cylinderGeometry args={[0.35, 0.45, 0.4, 32]} />
        <Clay color={SOFT} />
      </mesh>
      <mesh position={[0, 0.6, 0]}>
        <cylinderGeometry args={[0.05, 0.05, 0.5, 12]} />
        <Clay color={SOFT} />
      </mesh>
      <mesh position={[0, 0.9, 0]}>
        <sphereGeometry args={[0.16, 24, 24]} />
        <Glow color={color} intensity={1.2} />
      </mesh>
      <group ref={rings} position={[0, 0.9, 0]}>
        {[0, 1, 2].map((i) => (
          <mesh key={i} rotation={[Math.PI / 2, 0, 0]}>
            <torusGeometry args={[0.45, 0.018, 8, 64]} />
            <meshBasicMaterial
              color={color}
              transparent
              opacity={0.5}
              toneMapped={false}
            />
          </mesh>
        ))}
      </group>
      <group ref={env} position={[0.7, 1.35, 0.2]}>
        <RoundedBox args={[0.5, 0.34, 0.05]} radius={0.02}>
          <Clay color={WHITE} />
        </RoundedBox>
        <mesh position={[0, 0.05, 0.03]} rotation={[0, 0, Math.PI]}>
          <coneGeometry args={[0.26, 0.2, 3]} />
          <Clay color={color} />
        </mesh>
      </group>
    </group>
  );
}

/** Security — a shield that blocks an incoming bug */
export function Shield({ color }: P) {
  const shield = useMemo(() => {
    const s = new THREE.Shape();
    s.moveTo(0, 0.75);
    s.bezierCurveTo(0.35, 0.65, 0.55, 0.6, 0.6, 0.55);
    s.lineTo(0.55, 0.0);
    s.bezierCurveTo(0.5, -0.4, 0.25, -0.6, 0, -0.75);
    s.bezierCurveTo(-0.25, -0.6, -0.5, -0.4, -0.55, 0.0);
    s.lineTo(-0.6, 0.55);
    s.bezierCurveTo(-0.55, 0.6, -0.35, 0.65, 0, 0.75);
    return new THREE.ExtrudeGeometry(s, {
      depth: 0.18,
      bevelEnabled: true,
      bevelSize: 0.05,
      bevelThickness: 0.05,
      bevelSegments: 4,
    });
  }, []);
  const check = useMemo(() => {
    const s = new THREE.Shape();
    s.moveTo(-0.25, 0.02);
    s.lineTo(-0.08, -0.16);
    s.lineTo(0.27, 0.2);
    s.lineTo(0.2, 0.27);
    s.lineTo(-0.08, -0.02);
    s.lineTo(-0.18, -0.06);
    s.closePath();
    return new THREE.ExtrudeGeometry(s, {
      depth: 0.06,
      bevelEnabled: true,
      bevelSize: 0.015,
      bevelThickness: 0.015,
      bevelSegments: 2,
    });
  }, []);
  const bug = useRef<THREE.Group>(null);
  useFrame(({ clock }) => {
    if (!bug.current) return;
    const t = (clock.elapsedTime % 2.4) / 2.4;
    // the bug flies in, hits the shield and bounces away
    const x = t < 0.5 ? 1.6 - t * 2 : 0.6 + (t - 0.5) * 2 * 1.4;
    bug.current.position.set(x, 0.95 + Math.sin(t * Math.PI * 2) * 0.1, 0.35);
    bug.current.visible = t < 0.95;
  });
  return (
    <group>
      <group position={[0, 0.95, 0]}>
        <mesh geometry={shield}>
          <Clay color={color} />
        </mesh>
        <mesh geometry={check} position={[0, 0, 0.24]}>
          <Glow color={WHITE} intensity={0.4} />
        </mesh>
      </group>
      <group ref={bug}>
        <mesh>
          <sphereGeometry args={[0.1, 16, 16]} />
          <Glow color="#ef4444" intensity={0.8} />
        </mesh>
        {[-1, 1].map((s) => (
          <mesh
            key={s}
            position={[0, 0.06, s * 0.08]}
            rotation={[s * 0.6, 0, 0]}
          >
            <sphereGeometry args={[0.06, 12, 12]} />
            <meshStandardMaterial color="#fecaca" transparent opacity={0.7} />
          </mesh>
        ))}
      </group>
    </group>
  );
}

export const models: Record<string, (p: P) => React.JSX.Element> = {
  trophy: Trophy,
  bag: Bag,
  cap: Cap,
  laptop: Laptop,
  server: Server,
  team: Team,
  rocket: Rocket,
  devices: Devices,
  gateway: Gateway,
  lock: Lock,
  gears: Gears,
  database: Database,
  signal: Signal,
  shield: Shield,
};

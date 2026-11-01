import { useEffect, useRef, useState, type RefObject } from 'react';
import { assetUrl } from '../utils/assetUrl';

export function UnderwaterBottle3D({ motion }: { motion: RefObject<{ progress: number }> }) {
  const host = useRef<HTMLDivElement>(null);
  const [ready, setReady] = useState(false);
  useEffect(() => {
    let disposed = false;
    let release = () => {};
    async function setup() {
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
      const T = await import('three');
      const { RoomEnvironment } = await import('three/addons/environments/RoomEnvironment.js');
      if (disposed || !host.current) return;
      const el = host.current;
      const renderer = new T.WebGLRenderer({ alpha: true, antialias: true, powerPreference: 'low-power' });
      renderer.setPixelRatio(Math.min(devicePixelRatio, 1.5));
      renderer.setClearColor(0x000000, 0);
      renderer.toneMapping = T.ACESFilmicToneMapping;
      el.appendChild(renderer.domElement);
      const scene = new T.Scene();
      const camera = new T.PerspectiveCamera(32, 1, .1, 60);
      camera.position.set(0, .15, 11);
      const pmrem = new T.PMREMGenerator(renderer);
      const room = new RoomEnvironment();
      const env = pmrem.fromScene(room, .04);
      scene.environment = env.texture;
      scene.add(new T.HemisphereLight(0xb5efff, 0x123c69, 2));
      const light = new T.DirectionalLight(0xb8edff, 4);
      light.position.set(-3, 6, 4); scene.add(light);
      const rim = new T.DirectionalLight(0x46c9ff, 3);
      rim.position.set(3, 1, -3); scene.add(rim);
      const bottle = new T.Group(); scene.add(bottle);
      const points = [new T.Vector2(0, -2.6), new T.Vector2(.5, -2.6)];
      for (let i = 0; i <= 92; i++) {
        const y = -2.55 + i * .05;
        const radius = y < .65 ? .63 + .035 * Math.cos(y * 29) : .63 - Math.max(0, y - 1.1) * .39;
        points.push(new T.Vector2(Math.max(.24, radius), y));
      }
      points.push(new T.Vector2(.24, 2.35), new T.Vector2(0, 2.35));
      const plastic = new T.MeshPhysicalMaterial({ color: 0xc7eff6, roughness: .14, metalness: .05, transmission: .35, thickness: .18, transparent: true, opacity: .78, clearcoat: 1, envMapIntensity: 1.5 });
      bottle.add(new T.Mesh(new T.LatheGeometry(points, 64), plastic));
      const capMaterial = new T.MeshStandardMaterial({ color: 0x124ea1, roughness: .28, metalness: .15 });
      const cap = new T.Mesh(new T.CylinderGeometry(.28, .28, .38, 48), capMaterial);
      cap.position.y = 2.38; bottle.add(cap);
      for (let i = 0; i < 32; i++) {
        const ridge = new T.Mesh(new T.BoxGeometry(.018, .30, .025), capMaterial);
        const a = i / 32 * Math.PI * 2;
        ridge.position.set(Math.sin(a) * .28, 2.38, Math.cos(a) * .28);
        ridge.rotation.y = a; bottle.add(ridge);
      }
      const canvas = document.createElement('canvas'); canvas.width = 2048; canvas.height = 640;
      const ctx = canvas.getContext('2d')!;
      ctx.fillStyle = '#eef7fa'; ctx.fillRect(0, 0, 2048, 640);
      for (const x of [512, 1536]) {
        ctx.fillStyle = '#174b7a'; ctx.textAlign = 'center'; ctx.font = '42px Georgia';
        ctx.fillText('ПРИРОДНЫЙ ЭЛЕМЕНТ', x, 130);
        ctx.fillStyle = '#9bcde5'; ctx.beginPath(); ctx.moveTo(x - 360, 430);
        ctx.lineTo(x - 140, 250); ctx.lineTo(x - 20, 345); ctx.lineTo(x + 135, 205); ctx.lineTo(x + 360, 430); ctx.fill();
        ctx.fillStyle = '#fff'; ctx.beginPath(); ctx.moveTo(x + 135, 205); ctx.lineTo(x + 65, 310); ctx.lineTo(x + 145, 280); ctx.lineTo(x + 210, 305); ctx.fill();
        ctx.fillStyle = '#174b7a'; ctx.font = '26px Arial'; ctx.fillText('АРТЕЗИАНСКАЯ ВОДА', x, 515);
        ctx.font = '21px Arial'; ctx.fillText('КРЫМ • 1,5 л', x, 565);
      }
      const labelTexture = new T.CanvasTexture(canvas); labelTexture.colorSpace = T.SRGBColorSpace;
      const label = new T.Mesh(new T.CylinderGeometry(.672, .672, 1.25, 64, 1, true), new T.MeshStandardMaterial({ map: labelTexture, roughness: .55 }));
      label.position.y = .6; label.rotation.y = Math.PI / 2; bottle.add(label);
      const bubbleGeometry = new T.SphereGeometry(1, 10, 8);
      const bubbleMaterial = new T.MeshPhysicalMaterial({ color: 0xd2f8ff, transparent: true, opacity: .48, roughness: .08, metalness: .25, clearcoat: 1 });
      const bubbles = Array.from({ length: innerWidth < 700 ? 32 : 65 }, (_, i) => {
        const mesh = new T.Mesh(bubbleGeometry, bubbleMaterial);
        mesh.scale.setScalar(.025 + (i % 7) * .012); scene.add(mesh); return mesh;
      });
      let visible = false;
      const resize = new ResizeObserver(() => {
        const { width, height } = el.getBoundingClientRect();
        if (!width || !height) return;
        renderer.setSize(width, height); camera.aspect = width / height; camera.updateProjectionMatrix();
      }); resize.observe(el);
      const observer = new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; }); observer.observe(el);
      let lastTime = 0, bubbleTravel = 0;
      renderer.setAnimationLoop((time) => {
        const dt = Math.min((time - lastTime) / 1000, .05);
        lastTime = time;
        if (!visible || document.hidden) return;
        const t = time / 1000, p = motion.current.progress;
        bubbleTravel += dt * (1.6 + p * 4);
        bottle.rotation.set(.06 * Math.sin(t), -.22 + p * .85, -.055 + Math.sin(p * Math.PI) * .14);
        bubbles.forEach((bubble, i) => {
          const a = i * 2.4 + t * .2;
          const radius = .8 + (i % 9) * .09;
          bubble.position.set(Math.sin(a) * radius, ((bubbleTravel + i * .31) % 7) - 3.5, Math.cos(a) * radius);
        });
        renderer.render(scene, camera);
      });
      setReady(true);
      release = () => {
        observer.disconnect(); resize.disconnect(); renderer.setAnimationLoop(null);
        scene.traverse((object) => { if (object instanceof T.Mesh) { object.geometry.dispose(); const materials = Array.isArray(object.material) ? object.material : [object.material]; materials.forEach(m => m.dispose()); } });
        labelTexture.dispose(); env.dispose(); room.dispose(); pmrem.dispose(); renderer.dispose(); renderer.domElement.remove();
      };
    }
    setup().catch(() => { /* Keep the product photograph if WebGL is unavailable. */ });
    return () => { disposed = true; release(); };
  }, [motion]);
  return <div className="underwater-model" ref={host}>{!ready && <img src={assetUrl('assets/bottle-hero.webp')} alt="" className="underwater-model__fallback" />}</div>;
}

import * as THREE from 'https://esm.sh/three@0.163.0';
import { GLTFLoader } from 'https://esm.sh/three@0.163.0/examples/jsm/loaders/GLTFLoader.js';

const LIME = 0xc9f546;
const LIME_CSS = '#C9F546';
const BG = '#07070A';
const S = 256;

function makeFaceTex() {
  const c = document.createElement('canvas');
  c.width = c.height = S;
  const ctx = c.getContext('2d');
  // Dark bg
  ctx.fillStyle = 'rgba(7,7,10,0.65)';
  ctx.fillRect(0, 0, S, S);
  // Lime border
  ctx.strokeStyle = LIME_CSS;
  ctx.lineWidth = 3;
  ctx.strokeRect(1.5, 1.5, S - 3, S - 3);
  // "4s" text
  ctx.fillStyle = LIME_CSS;
  ctx.font = 'bold 96px "Syne", sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('4s', S / 2, S / 2);
  return new THREE.CanvasTexture(c);
}

function circleLine(radius, color, opacity, dashed) {
  const pts = [];
  const seg = dashed ? 64 : 128;
  for (let i = 0; i <= seg; i++) {
    const a = (i / seg) * Math.PI * 2;
    pts.push(new THREE.Vector3(Math.cos(a) * radius, Math.sin(a) * radius, 0));
  }
  const geo = new THREE.BufferGeometry().setFromPoints(pts);
  const mat = dashed
    ? new THREE.LineDashedMaterial({ color, transparent: true, opacity, dashSize: 0.15, gapSize: 0.12 })
    : new THREE.LineBasicMaterial({ color, transparent: true, opacity });
  const line = new THREE.Line(geo, mat);
  if (dashed) line.computeLineDistances();
  return line;
}

async function init() {
  const canvas = document.getElementById('hero3d');
  if (!canvas) return;

  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
  renderer.setPixelRatio(Math.min(devicePixelRatio, 2));

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 100);
  camera.position.z = 3.8;

  const SIZE = 1.1;
  const tex = makeFaceTex();
  const mats = Array(6).fill(null).map(() =>
    new THREE.MeshBasicMaterial({ map: tex, transparent: true, opacity: 0.92 })
  );

  // Load cube.glb — apply per-face materials
  const gltf = await new Promise((res, rej) => new GLTFLoader().load('/cube.glb', res, null, rej));
  let cube = new THREE.Object3D();
  gltf.scene.traverse(child => {
    if (!child.isMesh) return;
    child.geometry.scale(SIZE, SIZE, SIZE);
    child.material = mats;
    cube.add(child);
    const edges = new THREE.LineSegments(
      new THREE.EdgesGeometry(child.geometry),
      new THREE.LineBasicMaterial({ color: LIME, transparent: true, opacity: 0.9 })
    );
    cube.add(edges);
  });
  scene.add(cube);

  // Orbit rings — match design: outer dashed white, mid dashed lime, inner solid white
  const orb1 = circleLine(1.85, 0xffffff, 0.08, true);   // .orb  — dashed white
  const orb2 = circleLine(1.5,  LIME,     0.14, true);    // .orb.b — dashed lime
  const orb3 = circleLine(1.18, 0xffffff, 0.04, false);   // .orb.c — solid white faint

  orb1.rotation.x = Math.PI / 5;
  orb2.rotation.x = -Math.PI / 4;
  orb3.rotation.x = Math.PI / 3;
  scene.add(orb1, orb2, orb3);

  function resize() {
    const el = canvas.parentElement;
    const s = el ? (Math.min(el.clientWidth, el.clientHeight) || 460) : 460;
    renderer.setSize(s, s, false);
  }
  resize();
  window.addEventListener('resize', resize);

  let tx = 0, ty = 0;
  document.addEventListener('mousemove', e => {
    tx = (e.clientX / window.innerWidth - 0.5) * 0.5;
    ty = (e.clientY / window.innerHeight - 0.5) * 0.35;
  });

  let t = 0;
  (function loop() {
    requestAnimationFrame(loop);
    t += 0.004;
    // Match design: sp 16s linear = ~0.393 rad/s → 0.0025 per frame @60fps
    cube.rotation.y = t * 0.7;
    cube.rotation.x = t * 0.45;
    // Orbit spin speeds (design: 40s / 28s reverse / 18s)
    orb1.rotation.z = t * 0.10;          // slow forward
    orb2.rotation.z = -t * 0.14;         // medium reverse
    orb3.rotation.z = t * 0.22;          // faster forward
    scene.rotation.y += (tx - scene.rotation.y) * 0.04;
    scene.rotation.x += (ty - scene.rotation.x) * 0.04;
    renderer.render(scene, camera);
  })();
}

init();

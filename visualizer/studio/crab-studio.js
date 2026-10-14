// A model sheet for the crab critter (src/crab.js): a hero shot, a
// turnaround and every face. `npm run studio` builds it; open
// studio/crab.html in a browser.

import * as THREE from 'three'
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js'
import { makeCrab, crabPose, setFace, FACES } from '../src/crab.js'
import { kitFor } from '../src/crab-kits.js'
import { roleOf } from '../src/critters.js'

const renderer = new THREE.WebGLRenderer({ antialias: true, preserveDrawingBuffer: true, alpha: true })
renderer.setPixelRatio(2)
renderer.shadowMap.enabled = true
renderer.shadowMap.type = THREE.PCFSoftShadowMap
renderer.outputColorSpace = THREE.SRGBColorSpace

const scene = new THREE.Scene()
const pmrem = new THREE.PMREMGenerator(renderer)
scene.environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture
scene.environmentIntensity = 0.55
scene.add(new THREE.HemisphereLight('#ffffff', '#d8cfc2', 1.1))
const sun = new THREE.DirectionalLight('#fffaf2', 2.2)
sun.position.set(-3, 7, 5)
sun.castShadow = true
sun.shadow.mapSize.set(2048, 2048)
sun.shadow.radius = 6
Object.assign(sun.shadow.camera, { left: -4, right: 4, top: 4, bottom: -4 })
scene.add(sun)
const floor = new THREE.Mesh(new THREE.CircleGeometry(6, 48), new THREE.ShadowMaterial({ opacity: 0.18 }))
floor.rotation.x = -Math.PI / 2
floor.receiveShadow = true
scene.add(floor)

let crab = makeCrab()
scene.add(crab.root)
crabPose(crab, 0.3)
crab.blinkAt = 99
const camera = new THREE.PerspectiveCamera(30, 1, 0.1, 100)

function shot(w, h, { yaw = 0, pitch = 0.32, dist = 7.8, target = 1.05, face = 'happy', fov = 30, wave = false } = {}) {
  // The hero raises its right claw in a wave, like the mascot sheet.
  const arm = crab.arms[1]
  arm.rotation.set(wave ? 0 : -0.15, wave ? -0.2 : 0, wave ? 1.2 : 0)
  // Out to the side with the pincer turned to point up; put back after.
  const hand = arm.userData.hand
  hand.userData.rest ??= hand.rotation.clone()
  if (wave) hand.rotation.set(0.1, Math.PI / 2 - 0.25, 0)
  else hand.rotation.copy(hand.userData.rest)
  renderer.setSize(w, h, false)
  camera.aspect = w / h
  camera.fov = fov
  camera.updateProjectionMatrix()
  camera.position.set(Math.sin(yaw) * Math.cos(pitch) * dist, target + Math.sin(pitch) * dist, Math.cos(yaw) * Math.cos(pitch) * dist)
  camera.lookAt(0, target, 0)
  crab.mood = face
  setFace(crab, face)
  renderer.render(scene, camera)
  const img = new Image()
  img.src = renderer.domElement.toDataURL('image/png')
  return img
}

const put = (sel, img, label) => {
  const fig = document.createElement('figure')
  fig.append(img)
  if (label) fig.append(Object.assign(document.createElement('figcaption'), { textContent: label }))
  document.querySelector(sel).append(fig)
}

put('#hero', shot(900, 640, { yaw: -0.45, pitch: 0.16, dist: 7.0, wave: true }))
for (const [label, yaw] of [['Front', 0], ['Three-quarter', 0.7], ['Side', Math.PI / 2], ['Back', Math.PI]]) {
  put('#turn', shot(320, 280, { yaw, dist: 8.4, pitch: 0.12, target: 0.9 }), label)
}
for (const f of FACES) put('#faces', shot(240, 220, { face: f, dist: 8.6, pitch: 0.2 }), f[0].toUpperCase() + f.slice(1))
// In each of the office's ten critter colours (index.html's tokens), as a
// thread's crab would wear them.
const COLOURS = [
  ['Coral', '#ec7a5c'], ['Tangerine', '#f0913a'], ['Mustard', '#e9ad35'], ['Leaf', '#5fb35a'], ['Teal', '#2fa59a'],
  ['Sky', '#4b9be0'], ['Lilac', '#9a7ae0'], ['Pink', '#e872a0'], ['Berry', '#c0569a'], ['Slate', '#6f849c'],
]
for (const [name, hex] of COLOURS) {
  crab.mats.orange.color.set(hex)
  put('#colours', shot(480, 400, { yaw: -0.45, dist: 8.6, pitch: 0.2 }), name)
}
// The team: each kind of helper in its kit and a colour of its own.
const TEAM = [
  ['session', '#ef6a2e'], ['general-purpose', '#5fb35a'], ['Explore', '#4b9be0'],
  ['Plan', '#9a7ae0'], ['code-reviewer', '#e872a0'], ['test-runner', '#2fa59a'],
]
for (const [type, hex] of TEAM) {
  scene.remove(crab.root)
  crab = makeCrab({ orange: hex, kit: kitFor(type) })
  scene.add(crab.root)
  crabPose(crab, 0.3)
  crab.blinkAt = 99
  const kit = kitFor(type)
  put('#team', shot(480, 420, { yaw: -0.55, dist: 8.8, pitch: 0.22 }), `${roleOf(type)} · ${kit === 'none' ? 'plain' : kit === 'gem' ? 'gem (in the office)' : kit}`)
}
// And from behind, where the backpack and headphones show best.
for (const [type, hex] of TEAM.filter(([t]) => ['Explore', 'test-runner', 'Plan'].includes(t))) {
  scene.remove(crab.root)
  crab = makeCrab({ orange: hex, kit: kitFor(type) })
  scene.add(crab.root)
  crabPose(crab, 0.3)
  put('#team-back', shot(480, 420, { yaw: Math.PI - 0.6, dist: 8.8, pitch: 0.25 }), `${roleOf(type)}, from behind`)
}
document.body.dataset.ready = '1'

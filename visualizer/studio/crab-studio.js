// A model sheet for the crab critter (src/crab.js): a hero shot, a
// turnaround and every face. `npm run studio` builds it; open
// studio/crab.html in a browser.

import * as THREE from 'three'
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js'
import { makeCrab, crabPose, setFace, FACES } from '../src/crab.js'

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

const crab = makeCrab()
scene.add(crab.root)
crabPose(crab, 0.3)
crab.blinkAt = 99
const camera = new THREE.PerspectiveCamera(30, 1, 0.1, 100)

function shot(w, h, { yaw = 0, pitch = 0.32, dist = 7.8, target = 1.05, face = 'happy', fov = 30 } = {}) {
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

put('#hero', shot(900, 640, { yaw: -0.5, pitch: 0.28, dist: 7.2 }))
for (const [label, yaw] of [['Front', 0], ['Three-quarter', 0.7], ['Side', Math.PI / 2], ['Back', Math.PI]]) {
  put('#turn', shot(320, 280, { yaw, dist: 8.4 }), label)
}
for (const f of FACES) put('#faces', shot(240, 220, { face: f, dist: 7.6, pitch: 0.2 }), f[0].toUpperCase() + f.slice(1))
document.body.dataset.ready = '1'

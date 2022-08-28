import React, { useEffect } from 'react'
import {
  PerspectiveCamera,
  Scene,
  BufferGeometry,
  BufferAttribute,
  ShaderMaterial,
  Color,
  Points,
  WebGLRenderer,
} from 'three'

const SEPARATION = 150,
  AMOUNTX = 50,
  AMOUNTY = 50,
  HEIGHT = 75

let container: HTMLElement | null
let camera: PerspectiveCamera
let scene: Scene
let renderer: WebGLRenderer

let count = 1
let particles: Points

let mouseX = 0
let mouseY = 0
let windowHalfX = window.innerWidth / 2
let windowHalfY = window.innerHeight / 2

function init() {
  container = window.document.getElementById('bg') || document.createElement('div')

  document.body.appendChild(container)
  camera = new PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 10000000)
  scene = new Scene()

  const numParticles = AMOUNTX * AMOUNTY
  const positions = new Float32Array(numParticles * 3)
  const scales = new Float32Array(numParticles)

  let i = 0,
    j = 0
  for (let ix = 0; ix < AMOUNTX; ix++) {
    for (let iy = 0; iy < AMOUNTY; iy++) {
      positions[i] = ix * SEPARATION - (AMOUNTX * SEPARATION) / 2 // x
      positions[i + 1] = 0 // y
      positions[i + 2] = iy * SEPARATION - (AMOUNTY * SEPARATION) / 2 // z
      scales[j] = 1
      i += 3
      j++
    }
  }

  const geometry = new BufferGeometry()
  geometry.setAttribute('position', new BufferAttribute(positions, 3))
  geometry.setAttribute('scale', new BufferAttribute(scales, 1))

  const material = new ShaderMaterial({
    uniforms: {
      color: { value: new Color(0xffffff) },
    },
    vertexShader: document.getElementById('vertexshader')?.textContent || '',
    fragmentShader: document.getElementById('fragmentshader')?.textContent || '',
  })

  particles = new Points(geometry, material)
  scene.add(particles)

  renderer = new WebGLRenderer({ antialias: true })
  renderer.setPixelRatio(window.devicePixelRatio)
  renderer.setSize(window.innerWidth, window.innerHeight)

  container.appendChild(renderer.domElement)
  document.addEventListener('mousemove', onDocumentMouseMove, false)
  document.addEventListener('touchstart', onDocumentTouchStart, false)
  document.addEventListener('touchmove', onDocumentTouchMove, false)

  window.addEventListener('resize', onWindowResize, false)
}

function onWindowResize() {
  windowHalfX = window.innerWidth / 2
  windowHalfY = window.innerHeight / 2
  camera.aspect = window.innerWidth / window.innerHeight
  camera.updateProjectionMatrix()
  renderer.setSize(window.innerWidth, window.innerHeight)
}

function setMouse(x: number, y: number) {
  mouseX = (x - windowHalfX) / windowHalfX
  mouseY = -(y - windowHalfY) / windowHalfY
}

function onDocumentMouseMove(event: MouseEvent) {
  setMouse(event.clientX, event.clientY)
}

function onDocumentTouchStart(event: TouchEvent) {
  if (event.touches.length === 1) {
    event.preventDefault()
    setMouse(event.touches[0].pageX, event.touches[0].pageY)
  }
}

function onDocumentTouchMove(event: TouchEvent) {
  if (event.touches.length === 1) {
    event.preventDefault()
    setMouse(event.touches[0].pageX, event.touches[0].pageY)
  }
}

function animate() {
  requestAnimationFrame(animate)
  render()
}

function render() {
  // Noence from 0.0 to 1.0
  const noence = (Math.sin(count / 4) + 1) / 2
  const noence_inv = 1 - noence

  camera.position.x = -mouseX * 500
  camera.position.y = 1000 - mouseY * 500
  camera.position.z = 1000 - mouseY * 250
  camera.lookAt(scene.position)

  if (particles.geometry instanceof BufferGeometry) {
    const positions = particles.geometry.attributes.position.array
    const scales = particles.geometry.attributes.scale.array
    let i = 0,
      j = 0
    for (let ix = 0; ix < AMOUNTX; ix++) {
      for (let iy = 0; iy < AMOUNTY; iy++) {
        const dx = Math.sin((ix + count) * 0.3)
        const dy = Math.sin((iy + count) * 0.5)
        // @ts-ignore
        positions[i + 1] = dx * HEIGHT + dy * HEIGHT
        // @ts-ignore
        scales[j] = (dx + 1) * 8 + (dy + 1) * 8
        i += 3
        j++
      }
    }

    // @ts-ignore
    particles.material.uniforms.color.value.setRGB(1 - 0.5 * noence_inv, 0.2 + 0.8 * noence, 1)
    if (particles.geometry.attributes.position instanceof BufferAttribute)
      particles.geometry.attributes.position.needsUpdate = true
    if (particles.geometry.attributes.scale instanceof BufferAttribute)
      particles.geometry.attributes.scale.needsUpdate = true
  }
  renderer.render(scene, camera)

  count += 0.05 + 0.01 * noence
}

const Background: React.FC = ({ children }) => {
  useEffect(() => {
    init()
    animate()
  }, [])

  return <div id="bg">{children}</div>
}

export default Background

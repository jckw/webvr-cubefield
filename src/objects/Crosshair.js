import * as THREE from 'three'

const Crosshair = new THREE.Mesh(
    new THREE.RingBufferGeometry(0.02, 0.04, 32),
    new THREE.MeshBasicMaterial({
        color: 0xffffff,
        opacity: 0.5,
        transparent: true
    })
)

Crosshair.position.z = -2

export default Crosshair
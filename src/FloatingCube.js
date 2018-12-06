import * as THREE from 'three'

class FloatingCube extends THREE.Mesh {
    constructor(position) {
        super(
            new THREE.BoxBufferGeometry(0.15, 0.15, 0.15),
            new THREE.MeshLambertMaterial({ color: Math.random() * 0xffffff })
        )

        this.setPosition(Math.random() * 8 - 2 + position.x, 0, position.z - 5 - Math.random() * 10)
        this.setVelocity(0, 0, 0)
    }

    setPosition = (x, y, z) => {
        this.position.x = x
        this.position.y = y
        this.position.z = z
    }

    setRotation = (x, y, z) => {
        this.rotation.x = x
        this.rotation.y = y
        this.rotation.z = z
    }

    addRotation = (dx, dy, dz) => {
        this.rotation.x += dx
        this.rotation.y += dy
        this.rotation.z += dz
    }

    setVelocity = (x, y, z) => {
        if (!this.userData.velocity) {
            this.userData.velocity = new THREE.Vector3()
        }

        this.userData.velocity.x = x
        this.userData.velocity.y = y
        this.userData.velocity.z = z
    }

    update(delta) {
        this.position.add(this.userData.velocity)
    }
}

export default FloatingCube

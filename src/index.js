import THREE from './geometries/BoxLineGeometry'
import WebVR from './libs/WebVR'

import Crosshair from './objects/Crosshair'
import FloatingCube from './FloatingCube'

class Scene {
    constructor() {
        const container = document.getElementById('root')

        this.clock = new THREE.Clock()

        // Set up scene
        this.scene = new THREE.Scene()
        this.scene.fog = new THREE.FogExp2(0x000000, 0.5)
        this.scene.background = new THREE.Color(0x000000)

        this.camera = new THREE.PerspectiveCamera(
            70,
            window.innerWidth / window.innerHeight,
            0.1,
            10
        )
        this.camera.add(Crosshair)
        // this.scene.add(this.camera)

        // Needed to attach the camera to, so that we can move it.
        this.me = new THREE.Object3D()
        this.me.add(this.camera)
        this.me.userData.speed = 0.01
        this.scene.add(this.me)

        // Use as a container
        this.room = new THREE.Object3D()
        this.room.position.y = 1.5

        this.scene.add(this.room)
        this.scene.add(new THREE.HemisphereLight(0x606060, 0x404040))

        const light = new THREE.DirectionalLight(0xffffff)
        light.position.set(1, 1, 1).normalize()
        this.scene.add(light)

        // Create a bunch of cubes
        for (let i = 0; i < 50; i++) {
            const object = new FloatingCube(new THREE.Vector3(0, 0, 0))
            this.room.add(object)
        }

        this.raycaster = new THREE.Raycaster()
        this.renderer = new THREE.WebGLRenderer({ antialias: true })
        this.renderer.setPixelRatio(window.devicePixelRatio)
        this.renderer.setSize(window.innerWidth, window.innerHeight)
        this.renderer.vr.enabled = true

        // Append component to container
        container.appendChild(this.renderer.domElement)

        window.addEventListener('resize', this.onWindowResize, false)

        // Related to WebVR on Edge.
        window.addEventListener('vrdisplaypointerrestricted', this.onPointerRestricted, false)
        window.addEventListener('vrdisplaypointerunrestricted', this.onPointerUnrestricted, false)
        document.body.appendChild(WebVR.createButton(this.renderer))

        this.animate()
    }

    onPointerRestricted = () => {
        let pointerLockElement = this.renderer.domElement

        if (pointerLockElement && typeof pointerLockElement.requestPointerLock === 'function') {
            pointerLockElement.requestPointerLock()
        }
    }

    onPointerUnrestricted = () => {
        let currentPointerLockElement = document.pointerLockElement
        let expectedPointerLockElement = this.renderer.domElement
        if (
            currentPointerLockElement &&
            currentPointerLockElement === expectedPointerLockElement &&
            typeof document.exitPointerLock === 'function'
        ) {
            document.exitPointerLock()
        }
    }

    onWindowResize = () => {
        this.camera.aspect = window.innerWidth / window.innerHeight
        this.camera.updateProjectionMatrix()
        this.renderer.setSize(window.innerWidth, window.innerHeight)
    }

    animate = () => {
        // For WebVR, we must use this over requestAnimationFrame.
        this.renderer.setAnimationLoop(this.render)
    }

    render = () => {
        const delta = this.clock.getDelta() * 60

        // Move forwards
        this.me.translateZ(-this.me.userData.speed * delta)
        this.me.userData.speed += 0.000001

        // Move left or right depending on head tilt
        const quaternion = this.camera.getWorldQuaternion(new THREE.Quaternion())
        this.me.translateX(-quaternion.z * 0.1)

        // Find intersections between crosshairs and camera
        this.raycaster.setFromCamera({ x: 0, y: 0 }, this.camera)
        let intersects = this.raycaster.intersectObjects(this.room.children)

        if (intersects.length > 0) {
            if (this.INTERSECTED != intersects[0].object) {
                if (this.INTERSECTED)
                    this.INTERSECTED.material.emissive.setHex(this.INTERSECTED.currentHex)
                this.INTERSECTED = intersects[0].object
                this.INTERSECTED.currentHex = this.INTERSECTED.material.emissive.getHex()

                this.INTERSECTED.material.emissive.setHex(0x0000ff)
            }
        } else {
            if (this.INTERSECTED)
                this.INTERSECTED.material.emissive.setHex(this.INTERSECTED.currentHex)
            this.INTERSECTED = undefined
        }

        const myPosition = this.me.getWorldPosition(new THREE.Vector3())
        const cubesPassed = this.room.children.filter(c => {
            const cWorldPos = c.getWorldPosition(new THREE.Vector3())

            return cWorldPos.distanceTo(myPosition) > 5 && cWorldPos.z > myPosition.z
        })

        cubesPassed.map(c => {
            this.room.remove(c)
            this.room.add(new FloatingCube(myPosition))
        })

        this.room.children.map(c => c.update(delta))

        this.renderer.render(this.scene, this.camera)
    }
}

new Scene()

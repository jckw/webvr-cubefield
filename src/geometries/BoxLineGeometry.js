/**
 * @author mrdoob / http://mrdoob.com/
 */
import * as THREE from 'three'

THREE.BoxLineGeometry = function(
    width,
    height,
    depth,
    widthSegments,
    heightSegments,
    depthSegments
) {
    THREE.BufferGeometry.call(this)

    width = width || 1
    height = height || 1
    depth = depth || 1

    widthSegments = Math.floor(widthSegments) || 1
    heightSegments = Math.floor(heightSegments) || 1
    depthSegments = Math.floor(depthSegments) || 1

    let widthHalf = width / 2
    let heightHalf = height / 2
    let depthHalf = depth / 2

    let segmentWidth = width / widthSegments
    let segmentHeight = height / heightSegments
    let segmentDepth = depth / depthSegments

    let vertices = []

    let x = -widthHalf,
        y = -heightHalf,
        z = -depthHalf

    for (let i = 0; i <= widthSegments; i++) {
        vertices.push(x, -heightHalf, -depthHalf, x, heightHalf, -depthHalf)
        vertices.push(x, heightHalf, -depthHalf, x, heightHalf, depthHalf)
        vertices.push(x, heightHalf, depthHalf, x, -heightHalf, depthHalf)
        vertices.push(x, -heightHalf, depthHalf, x, -heightHalf, -depthHalf)

        x += segmentWidth
    }

    for (let i = 0; i <= heightSegments; i++) {
        vertices.push(-widthHalf, y, -depthHalf, widthHalf, y, -depthHalf)
        vertices.push(widthHalf, y, -depthHalf, widthHalf, y, depthHalf)
        vertices.push(widthHalf, y, depthHalf, -widthHalf, y, depthHalf)
        vertices.push(-widthHalf, y, depthHalf, -widthHalf, y, -depthHalf)

        y += segmentHeight
    }

    for (let i = 0; i <= depthSegments; i++) {
        vertices.push(-widthHalf, -heightHalf, z, -widthHalf, heightHalf, z)
        vertices.push(-widthHalf, heightHalf, z, widthHalf, heightHalf, z)
        vertices.push(widthHalf, heightHalf, z, widthHalf, -heightHalf, z)
        vertices.push(widthHalf, -heightHalf, z, -widthHalf, -heightHalf, z)

        z += segmentDepth
    }

    this.addAttribute('position', new THREE.Float32BufferAttribute(vertices, 3))
}

THREE.BoxLineGeometry.prototype = Object.create(THREE.BufferGeometry.prototype)
THREE.BoxLineGeometry.prototype.constructor = THREE.BoxLineGeometry

export default THREE
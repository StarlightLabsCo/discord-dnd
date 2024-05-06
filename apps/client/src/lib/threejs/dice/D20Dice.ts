import * as THREE from "three";
import { SceneSubject } from "../SceneSubject.js";

export class D20Dice implements SceneSubject {
    private camera!: THREE.PerspectiveCamera;

    private dice!: THREE.Mesh;
    private edges!: THREE.LineSegments;
    private debugLines!: THREE.LineSegments;

    private numberOrder = [
        1, 6, 8, 15, 17, 19, 3, 10, 12, 20, 5, 7, 9, 11, 13, 18, 2, 4, 14, 16,
    ];

    private rolling = false;
    private rollVelocity = new THREE.Vector3();
    private angularVelocity = new THREE.Vector3();
    private rollAcceleration = new THREE.Vector3(0, 0, -9.81);
    private rollDeceleration = 0.95;
    private angularDeceleration = 0.95;
    private bounceFactor = 0.7;
    private groundLevel = 0;
    private maxZ = 4;

    constructor(scene: THREE.Scene, camera: THREE.PerspectiveCamera) {
        this.camera = camera;
        this.init(scene);
        this.initDebugLines(scene);
    }

    async init(scene: THREE.Scene) {
        const geometry = new THREE.IcosahedronGeometry(1, 0);
        geometry.computeVertexNormals();

        const { texture, uvs } = this.createNumbersTexture();
        geometry.setAttribute("uv", new THREE.Float32BufferAttribute(uvs, 2));

        const material = new THREE.MeshBasicMaterial({ map: texture });
        this.dice = new THREE.Mesh(geometry, material);

        const edgesGeometry = new THREE.EdgesGeometry(geometry);
        const edgesMaterial = new THREE.LineBasicMaterial({
            color: 0x000000,
            linewidth: 1,
        });
        this.edges = new THREE.LineSegments(edgesGeometry, edgesMaterial);

        scene.add(this.dice);
        scene.add(this.edges);
    }

    private createNumbersTexture() {
        const tileDimension = new THREE.Vector2(4, 5);
        const tileSize = 512;

        const canvas = document.createElement("canvas");
        canvas.width = tileSize * tileDimension.x;
        canvas.height = tileSize * tileDimension.y;
        const context = canvas.getContext("2d")!;
        context.fillStyle = "#400";
        context.fillRect(0, 0, canvas.width, canvas.height);

        const baseUVs = [
            [0.067, 0.25],
            [0.933, 0.25],
            [0.5, 1],
        ].map((p) => new THREE.Vector2(...p));

        const uvs: number[] = [];

        for (let i = 0; i < 20; i++) {
            const number = this.numberOrder[i] - 1;
            const u = number % tileDimension.x;
            const v = Math.floor(number / tileDimension.x);
            uvs.push(
                (baseUVs[0].x + u) / tileDimension.x,
                (baseUVs[0].y + v) / tileDimension.y,
                (baseUVs[1].x + u) / tileDimension.x,
                (baseUVs[1].y + v) / tileDimension.y,
                (baseUVs[2].x + u) / tileDimension.x,
                (baseUVs[2].y + v) / tileDimension.y
            );

            context.textAlign = "center";
            context.textBaseline = "middle";
            context.font = `bold ${tileSize / 3}px Arial`;
            context.fillStyle = "orange";
            context.fillText(
                this.numberOrder[i].toString(),
                (u + 0.5) * tileSize,
                canvas.height - (v + 0.5) * tileSize
            );
        }

        const texture = new THREE.CanvasTexture(canvas);
        texture.needsUpdate = true;

        return { texture, uvs };
    }

    update(deltaTime: number): void {
        if (this.rolling) {
            this.rollDice(deltaTime);
        } else {
            this.bounce(deltaTime);
        }
        this.updateDebugLines();
    }

    private rollDice(deltaTime: number) {
        console.log(`----> deltaTime: ${deltaTime} <-----`);
        console.log(`this.rollVelocity: `);
        console.log(this.rollVelocity);
        console.log(`this.angularVelocity: `);
        console.log(this.angularVelocity);
        console.log(`this.dice.position: `);
        console.log(this.dice.position);
        console.log(`this.dice.rotation: `);
        console.log(this.dice.rotation);

        this.rollVelocity.add(
            this.rollAcceleration.clone().multiplyScalar(deltaTime)
        );
        this.dice.position.add(
            this.rollVelocity.clone().multiplyScalar(deltaTime)
        );

        const angle = this.angularVelocity.length() * deltaTime;
        const axis = this.angularVelocity.normalize();
        const quaternionDelta = new THREE.Quaternion().setFromAxisAngle(
            axis,
            angle
        );
        this.dice.quaternion.multiplyQuaternions(
            quaternionDelta,
            this.dice.quaternion
        );

        this.angularVelocity.multiplyScalar(this.angularDeceleration);
        this.rollVelocity.multiplyScalar(this.rollDeceleration);

        if (this.dice.position.z < this.groundLevel) {
            this.dice.position.z = this.groundLevel;
            this.rollVelocity.z = -this.rollVelocity.z * this.bounceFactor;
            this.angularVelocity.multiplyScalar(this.bounceFactor);
        }

        this.constrainAndBounceWithinBounds();
        this.edges.position.copy(this.dice.position);
        this.edges.rotation.copy(this.dice.rotation);

        // Zero out velocities if they are very low to stop the dice
        if (
            this.rollVelocity.length() < 0.05 ||
            this.angularVelocity.length() < 0.05
        ) {
            this.rollVelocity.set(0, 0, 0);
            this.angularVelocity.set(0, 0, 0);
            this.rolling = false;
            this.alignFaceToCamera(
                this.camera.getWorldDirection(new THREE.Vector3())
            );
        }
    }

    private initDebugLines(scene: THREE.Scene) {
        const material = new THREE.LineBasicMaterial({ color: 0xff0000 });
        const geometry = new THREE.BufferGeometry().setFromPoints([
            new THREE.Vector3(-1, -1, 0),
            new THREE.Vector3(1, -1, 0),
            new THREE.Vector3(1, 1, 0),
            new THREE.Vector3(-1, 1, 0),
            new THREE.Vector3(-1, -1, 0),
        ]);
        this.debugLines = new THREE.LineSegments(geometry, material);
        scene.add(this.debugLines);
    }

    private updateDebugLines() {
        const vFOV = (this.camera.fov * Math.PI) / 180;
        const height = 2 * Math.tan(vFOV / 2) * this.camera.position.z;
        const width = height * this.camera.aspect;
        const halfWidth = width / 2;
        const halfHeight = height / 2;

        const points = [
            new THREE.Vector3(
                this.camera.position.x - halfWidth,
                this.camera.position.y - halfHeight,
                0
            ),
            new THREE.Vector3(
                this.camera.position.x + halfWidth,
                this.camera.position.y - halfHeight,
                0
            ),
            new THREE.Vector3(
                this.camera.position.x + halfWidth,
                this.camera.position.y + halfHeight,
                0
            ),
            new THREE.Vector3(
                this.camera.position.x - halfWidth,
                this.camera.position.y + halfHeight,
                0
            ),
            new THREE.Vector3(
                this.camera.position.x - halfWidth,
                this.camera.position.y - halfHeight,
                0
            ),
        ];

        this.debugLines.geometry.setFromPoints(points);
    }

    private constrainAndBounceWithinBounds() {
        const frustum = new THREE.Frustum();
        const projScreenMatrix = new THREE.Matrix4();
        projScreenMatrix.multiplyMatrices(
            this.camera.projectionMatrix,
            this.camera.matrixWorldInverse
        );
        frustum.setFromProjectionMatrix(projScreenMatrix);

        const diceBounds = new THREE.Box3().setFromObject(this.dice);
        const center = diceBounds.getCenter(new THREE.Vector3());

        const vFOV = (this.camera.fov * Math.PI) / 180;
        const height = 2 * Math.tan(vFOV / 2) * this.camera.position.z;
        const width = height * this.camera.aspect;

        const halfWidth = width / 2;
        const halfHeight = height / 2;

        const minX = this.camera.position.x - halfWidth + diceBounds.min.x;
        const maxX = this.camera.position.x + halfWidth - diceBounds.max.x;
        const minY = this.camera.position.y - halfHeight + diceBounds.min.y;
        const maxY = this.camera.position.y + halfHeight - diceBounds.max.y;

        const clampedX = Math.max(minX, Math.min(maxX, center.x));
        const clampedY = Math.max(minY, Math.min(maxY, center.y));
        const clampedZ = Math.max(
            this.groundLevel,
            Math.min(this.maxZ, center.z)
        );

        this.dice.position.set(clampedX, clampedY, clampedZ);

        if (center.x <= minX || center.x >= maxX) {
            this.rollVelocity.x = -this.rollVelocity.x * this.bounceFactor;
        }
        if (center.y <= minY || center.y >= maxY) {
            this.rollVelocity.y = -this.rollVelocity.y * this.bounceFactor;
        }
        if (center.z <= this.groundLevel || center.z >= this.maxZ) {
            this.rollVelocity.z = -this.rollVelocity.z * this.bounceFactor;
        }
    }

    private bounce(delta: number) {
        const bounceMagnitude = 0.5;
        const bounceSpeed = 4;

        const bounce =
            Math.sin(delta * ((2 * Math.PI) / bounceSpeed)) ** 3 *
            bounceMagnitude;

        this.dice.position.z = Math.max(0, bounce);
        this.edges.position.z = Math.max(0, bounce);
    }

    private roll() {
        this.rolling = true;
        const translationalMagnitude = 50; // Increased translational magnitude for more energetic movement
        const angularMagnitude = 20; // Increased angular magnitude for more energetic rotation

        const angleX = Math.random() * 2 * Math.PI;
        const angleY = Math.random() * 2 * Math.PI;

        this.rollVelocity.set(
            translationalMagnitude * Math.sin(angleX),
            translationalMagnitude * Math.sin(angleY),
            translationalMagnitude * Math.cos(angleX)
        );

        const angularX = Math.random() * 2 * Math.PI;
        const angularY = Math.random() * 2 * Math.PI;
        const angularZ = Math.random() * 2 * Math.PI;

        this.angularVelocity = new THREE.Vector3(
            angularMagnitude * Math.sin(angularX),
            angularMagnitude * Math.sin(angularY),
            angularMagnitude * Math.sin(angularZ)
        );
    }

    private alignFaceToCamera(cameraDirection: THREE.Vector3) {
        const geometry = this.dice.geometry as THREE.BufferGeometry;
        const normals = geometry.getAttribute("normal");
        const indices = geometry.getIndex();
        if (!indices) return;

        let closestFaceIndex = -1;
        let maxDot = -Infinity;

        for (let i = 0; i < indices.count; i += 3) {
            const normal = new THREE.Vector3(
                (normals.getX(indices.getX(i)) +
                    normals.getX(indices.getX(i + 1)) +
                    normals.getX(indices.getX(i + 2))) /
                    3,
                (normals.getY(indices.getX(i)) +
                    normals.getY(indices.getX(i + 1)) +
                    normals.getY(indices.getX(i + 2))) /
                    3,
                (normals.getZ(indices.getX(i)) +
                    normals.getZ(indices.getX(i + 1)) +
                    normals.getZ(indices.getX(i + 2))) /
                    3
            ).normalize();

            const dot = normal.dot(cameraDirection);
            if (dot > maxDot) {
                maxDot = dot;
                closestFaceIndex = i;
            }
        }

        if (closestFaceIndex !== -1) {
            const targetNormal = new THREE.Vector3(
                (normals.getX(indices.getX(closestFaceIndex)) +
                    normals.getX(indices.getX(closestFaceIndex + 1)) +
                    normals.getX(indices.getX(closestFaceIndex + 2))) /
                    3,
                (normals.getY(indices.getX(closestFaceIndex)) +
                    normals.getY(indices.getX(closestFaceIndex + 1)) +
                    normals.getY(indices.getX(closestFaceIndex + 2))) /
                    3,
                (normals.getZ(indices.getX(closestFaceIndex)) +
                    normals.getZ(indices.getX(closestFaceIndex + 1)) +
                    normals.getZ(indices.getX(closestFaceIndex + 2))) /
                    3
            ).normalize();

            const quaternion = new THREE.Quaternion().setFromUnitVectors(
                targetNormal,
                cameraDirection
            );
            this.dice.quaternion.multiplyQuaternions(
                quaternion,
                this.dice.quaternion
            );
        }
    }

    getInteractiveObjects(): THREE.Object3D[] {
        return [this.dice, this.edges];
    }

    onClick(): void {
        this.roll();
    }
}

import * as THREE from "three";
import { SceneSubject } from "../SceneSubject.js";

export class D20Dice implements SceneSubject {
    private camera!: THREE.PerspectiveCamera;

    private dice!: THREE.Mesh;
    private edges!: THREE.LineSegments;

    private numberOrder = [
        1, 12, 2, 13, 3, 14, 4, 15, 5, 16, 6, 17, 7, 18, 8, 19, 9, 20, 10, 11,
    ];

    private faceIndexToNumberIndex = {
        0: 13,
        1: 12,
        2: 11,
        3: 10,
        4: 14,
        5: 17,
        6: 18,
        7: 19,
        8: 15,
        9: 16,
        10: 3,
        11: 2,
        12: 1,
        13: 0,
        14: 4,
        15: 8,
        16: 9,
        17: 5,
        18: 6,
        19: 7,
    };

    private DiceState = {
        Ready: "Ready",
        Rolling: "Rolling",
        Transition: "Transition",
        Stopped: "Stopped",
    } as const;

    private state: keyof typeof this.DiceState = this.DiceState.Ready;

    private bounceTime = 0;

    private translationalVelocity = new THREE.Vector3();
    private angularVelocity = new THREE.Vector3();
    private bounceFactor = 0.7;
    private groundLevel = 0;

    private chosenNumber = -1;

    constructor(scene: THREE.Scene, camera: THREE.PerspectiveCamera) {
        this.camera = camera;
        this.init(scene);
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

        this.setNumberToCamera(20);

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
            context.font = `bold ${tileSize / 3.1}px Arial`;
            context.fillStyle = "orange";
            let displayNumber = this.numberOrder[i].toString();
            if (displayNumber === "6" || displayNumber === "9") {
                displayNumber += ".";
            }
            context.fillText(
                displayNumber,
                (u + 0.5) * tileSize,
                canvas.height - (v + 0.5) * tileSize
            );
        }

        const texture = new THREE.CanvasTexture(canvas);
        texture.needsUpdate = true;

        return { texture, uvs };
    }

    update(deltaTime: number): void {
        switch (this.state) {
            case this.DiceState.Ready:
                this.bounceStep(deltaTime);
                break;
            case this.DiceState.Rolling:
                this.rollStep(deltaTime);
                break;
            case this.DiceState.Stopped:
                break;
        }
    }

    private rollStep(deltaTime: number) {
        this.dice.position.add(
            this.translationalVelocity.clone().multiplyScalar(deltaTime)
        );

        const angle = this.angularVelocity.length();
        const axis = this.angularVelocity.normalize();
        const quaternionDelta = new THREE.Quaternion().setFromAxisAngle(
            axis,
            angle
        );
        this.dice.quaternion.multiply(quaternionDelta);

        if (this.dice.position.z < this.groundLevel) {
            this.dice.position.z = this.groundLevel;
            this.translationalVelocity.z =
                -this.translationalVelocity.z * this.bounceFactor;
        }

        this.constrainAndBounceWithinBounds();
        this.edges.position.copy(this.dice.position);
        this.edges.rotation.copy(this.dice.rotation);
    }

    private constrainAndBounceWithinBounds() {
        const halfWidth =
            this.camera.aspect *
            Math.tan((this.camera.fov * Math.PI) / 360) *
            Math.abs(this.camera.position.z);
        const halfHeight =
            Math.tan((this.camera.fov * Math.PI) / 360) *
            Math.abs(this.camera.position.z);

        const diceBounds = new THREE.Box3().setFromObject(this.dice);
        const min = diceBounds.min;
        const max = diceBounds.max;

        // Check and handle X boundaries
        if (min.x < -halfWidth) {
            this.dice.position.x += -halfWidth - min.x;
            this.translationalVelocity.x =
                -this.translationalVelocity.x * this.bounceFactor;
        } else if (max.x > halfWidth) {
            this.dice.position.x += halfWidth - max.x;
            this.translationalVelocity.x =
                -this.translationalVelocity.x * this.bounceFactor;
        }

        // Check and handle Y boundaries
        if (min.y < -halfHeight) {
            this.dice.position.y += -halfHeight - min.y;
            this.translationalVelocity.y =
                -this.translationalVelocity.y * this.bounceFactor;
        } else if (max.y > halfHeight) {
            this.dice.position.y += halfHeight - max.y;
            this.translationalVelocity.y =
                -this.translationalVelocity.y * this.bounceFactor;
        }
    }

    private easeInOutElastic(x: number): number {
        const c5 = (2 * Math.PI) / 4.5;

        return x === 0
            ? 0
            : x === 1
              ? 1
              : x < 0.5
                ? -(
                      Math.pow(2, 20 * x - 10) *
                      Math.sin((20 * x - 11.125) * c5)
                  ) / 2
                : (Math.pow(2, -20 * x + 10) *
                      Math.sin((20 * x - 11.125) * c5)) /
                      2 +
                  1;
    }

    private bounceStep(delta: number) {
        this.bounceTime += delta;
        const duration = 2;
        const pauseDuration = 1;
        const effectiveDuration = duration + pauseDuration;
        const normalizedTime = (this.bounceTime % effectiveDuration) / duration;

        if (normalizedTime <= 1) {
            const bounceValue = this.easeInOutElastic(
                normalizedTime * 2 <= 1
                    ? normalizedTime * 2
                    : 2 - normalizedTime * 2
            );

            this.dice.position.z = bounceValue / 3;
            this.edges.position.z = bounceValue / 3;
        } else {
            this.dice.position.z = 0;
            this.edges.position.z = 0;
        }

        if (this.bounceTime >= effectiveDuration) {
            this.bounceTime = 0;
        }
    }

    private roll() {
        this.state = this.DiceState.Rolling;

        const xComponentMultiplier = 100;
        const yComponentMultiplier = 100;
        const zComponentMultiplier = 0.2;

        const angularMagnitude = 400;

        const theta = Math.PI / 4 + (Math.random() * Math.PI) / 2;
        const phi = Math.PI / 4 + (Math.random() * Math.PI) / 2;

        const translationalX =
            xComponentMultiplier * Math.sin(phi) * Math.cos(theta);
        const translationalY =
            yComponentMultiplier * Math.sin(phi) * Math.sin(theta);
        const translationalZ = zComponentMultiplier * Math.cos(phi);

        this.translationalVelocity.set(
            translationalX,
            translationalY,
            translationalZ
        );

        const angularX = angularMagnitude * (Math.random() < 0.5 ? -1 : 1);
        const angularY = angularMagnitude * (Math.random() < 0.5 ? -1 : 1);
        const angularZ = angularMagnitude * (Math.random() < 0.5 ? -1 : 1);

        this.angularVelocity.set(angularX, angularY, angularZ);

        this.dice.position.add(this.translationalVelocity);
        this.dice.rotation.set(angularX, angularY, angularZ);
    }

    getInteractiveObjects(): THREE.Object3D[] {
        return [this.dice, this.edges];
    }

    onClick(): void {
        if (this.state !== this.DiceState.Ready) return;

        this.chosenNumber = Math.floor(Math.random() * 20) + 1;
        console.log(this.chosenNumber);
        this.roll();
        setTimeout(() => {
            this.state = this.DiceState.Transition;
            this.dice.position.set(0, 0, 0);
            this.edges.position.set(0, 0, 0);
            this.setNumberToCamera(this.chosenNumber);
            this.state = this.DiceState.Stopped;
        }, 1000);
    }

    // ------ Utils ------
    private processFace(
        i1: number,
        i2: number,
        i3: number
    ): { normal: THREE.Vector3; faceCenter: THREE.Vector3 } {
        const positions = this.dice.geometry.getAttribute("position");
        const normals = this.dice.geometry.getAttribute("normal");

        const v1 = new THREE.Vector3(
            positions.getX(i1),
            positions.getY(i1),
            positions.getZ(i1)
        );
        const v2 = new THREE.Vector3(
            positions.getX(i2),
            positions.getY(i2),
            positions.getZ(i2)
        );
        const v3 = new THREE.Vector3(
            positions.getX(i3),
            positions.getY(i3),
            positions.getZ(i3)
        );

        const faceCenter = new THREE.Vector3(
            (v1.x + v2.x + v3.x) / 3,
            (v1.y + v2.y + v3.y) / 3,
            (v1.z + v2.z + v3.z) / 3
        );

        const normal = new THREE.Vector3(
            (normals.getX(i1) + normals.getX(i2) + normals.getX(i3)) / 3,
            (normals.getY(i1) + normals.getY(i2) + normals.getY(i3)) / 3,
            (normals.getZ(i1) + normals.getZ(i2) + normals.getZ(i3)) / 3
        ).normalize();

        return { normal, faceCenter };
    }

    private getNumberNormal(number: number): THREE.Vector3 | undefined {
        const index = this.numberOrder.indexOf(number);
        const faceIndex = Object.keys(this.faceIndexToNumberIndex).find(
            (key: string) =>
                this.faceIndexToNumberIndex[
                    key as unknown as keyof typeof this.faceIndexToNumberIndex
                ] === index
        );
        if (!faceIndex) return;

        const { normal } = this.processFace(
            parseInt(faceIndex) * 3,
            parseInt(faceIndex) * 3 + 1,
            parseInt(faceIndex) * 3 + 2
        );

        return normal;
    }

    private setNumberToCamera(number: number) {
        const normal = this.getNumberNormal(number);
        if (!normal) return;

        const quaternion = new THREE.Quaternion().setFromUnitVectors(
            normal,
            this.camera.getWorldDirection(new THREE.Vector3())
        );
        this.dice.quaternion.copy(quaternion);
        this.edges.quaternion.copy(quaternion);
    }
}

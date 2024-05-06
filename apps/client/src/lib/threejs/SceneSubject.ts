import * as THREE from "three";

export abstract class SceneSubject {
    constructor(scene: THREE.Scene) {}
    abstract update(deltaTime: number): void;
    abstract getInteractiveObjects(): THREE.Object3D[];
    abstract onClick(): void;
}

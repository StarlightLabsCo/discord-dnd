import * as THREE from "three";
import Stats from "three/examples/jsm/libs/stats.module.js";
import { SceneSubject } from "./SceneSubject";
import { D20Dice } from "./dice/D20Dice";

export class SceneManager {
    private scene!: THREE.Scene;
    private camera!: THREE.PerspectiveCamera;
    private renderer!: THREE.WebGLRenderer;
    private stats!: Stats;
    private sceneSubjects: SceneSubject[] = [];
    private raycaster = new THREE.Raycaster();
    private mouse = new THREE.Vector2();

    constructor(private threeRootElement: React.RefObject<HTMLDivElement>) {
        this.init();
    }

    init() {
        if (!this.threeRootElement.current) return;

        const width = this.threeRootElement.current.clientWidth;
        const height = this.threeRootElement.current.clientHeight;

        this.renderer = this.buildRenderer(width, height);
        this.scene = new THREE.Scene();
        this.camera = this.buildCamera(width / height);

        this.threeRootElement.current.appendChild(this.renderer.domElement);

        // Attach Scene Subjects
        this.createSceneSubjects();

        // Attach Stats
        this.stats = new Stats();
        document.body.appendChild(this.stats.dom);

        // Event Listeners
        this.setupEventListeners();
    }

    private setupEventListeners() {
        window.addEventListener("resize", this.onWindowResize);
        document.addEventListener("mousemove", this.onMouseMove, false);
        document.addEventListener("click", this.onMouseClick, false);
    }

    update = (deltaTime: number) => {
        this.checkIntersects();
        this.sceneSubjects.forEach((subject) => subject.update(deltaTime));
        this.renderer.render(this.scene, this.camera);
        this.stats.update();
    };

    private buildRenderer(width: number, height: number): THREE.WebGLRenderer {
        const renderer = new THREE.WebGLRenderer({
            alpha: true,
            antialias: true,
        });
        renderer.setSize(width, height);
        renderer.setPixelRatio(window.devicePixelRatio);
        return renderer;
    }

    private buildCamera(aspect: number): THREE.PerspectiveCamera {
        const camera = new THREE.PerspectiveCamera(75, aspect, 0.1, 1000);
        camera.position.z = 5;
        return camera;
    }

    private onWindowResize = () => {
        if (!this.threeRootElement.current) return;

        const width = this.threeRootElement.current.clientWidth;
        const height = this.threeRootElement.current.clientHeight;

        this.camera.aspect = width / height;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(width, height);
    };

    private createSceneSubjects = () => {
        this.sceneSubjects = [new D20Dice(this.scene, this.camera)];
    };

    private getIntersections(): {
        intersects: THREE.Intersection[];
        subject: SceneSubject | null;
    } {
        this.raycaster.setFromCamera(this.mouse, this.camera);
        const interactiveObjects = this.sceneSubjects.flatMap((subject) =>
            subject.getInteractiveObjects()
        );
        const intersects = this.raycaster.intersectObjects(
            interactiveObjects,
            true
        );

        let subject: SceneSubject | null = null;
        if (intersects.length > 0) {
            const intersectedObject = intersects[0].object;
            subject =
                this.sceneSubjects.find((s) =>
                    s.getInteractiveObjects().includes(intersectedObject)
                ) || null;
        }

        return { intersects, subject };
    }

    private checkIntersects() {
        const { subject } = this.getIntersections();
        if (subject) {
            this.renderer.domElement.style.cursor = "pointer";
        } else {
            this.renderer.domElement.style.cursor = "auto";
        }
    }

    private onMouseMove = (event: MouseEvent) => {
        const rect = this.renderer.domElement.getBoundingClientRect();
        this.mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
        this.mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
    };

    private onMouseClick = (event: MouseEvent) => {
        const rect = this.renderer.domElement.getBoundingClientRect();
        this.mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
        this.mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

        const { subject } = this.getIntersections();
        if (subject) {
            subject.onClick();
        }
    };

    destructor() {
        window.removeEventListener("resize", this.onWindowResize);
        document.removeEventListener("mousemove", this.onMouseMove, false);
    }
}

import { SceneManager } from "./SceneManager";

export const initThreeJS = (
    threeRootElement: React.RefObject<HTMLDivElement>
) => {
    if (!threeRootElement.current) return;

    const sceneManager = new SceneManager(threeRootElement);
    let lastTime = Date.now();

    const animate = function () {
        requestAnimationFrame(animate);
        const now = Date.now();
        const deltaTime = (now - lastTime) * 0.001; // seconds
        lastTime = now;
        sceneManager.update(deltaTime);
    };

    animate();
};

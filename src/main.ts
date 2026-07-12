import { createAppState } from "./state";
import { createScene } from "./scene/setup";
import { prebuildTexturePools, prebuildCloudLayers, spawnCloudAtMouse } from "./scene/clouds";
import { createHillLayers } from "./scene/hills";
import { placeTreeClusters } from "./scene/trees";
import { createCelestialObjects } from "./scene/celestial";
import { createBirdFlock } from "./scene/birds";
import { createDustMotes } from "./scene/particles";
import { createCvClouds } from "./cv-clouds";
import { setupKeyboard } from "./input/keyboard";
import { setupMouse } from "./input/mouse";
import { setupTouch } from "./input/touch";
import { createAnimationLoop } from "./systems/animation";
import { updateCloudCount, showClickHint } from "./hud";
import "./style.css";

const state = createAppState();
const { scene, camera, renderer } = createScene();
state.scene = scene;
state.camera = camera;
state.renderer = renderer;

prebuildTexturePools(state);
prebuildCloudLayers(scene, state);
createHillLayers(scene, state);
placeTreeClusters(scene, state);
createCelestialObjects(scene, state);
createBirdFlock(scene, state);
createDustMotes(scene, state);
createCvClouds(scene, state);

setupKeyboard(state);
setupMouse(state, (x, y) => spawnCloudAtMouse(x, y, state));
setupTouch(state, (x, y) => spawnCloudAtMouse(x, y, state));

updateCloudCount(state);
showClickHint();
createAnimationLoop(state);

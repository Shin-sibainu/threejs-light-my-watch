import * as THREE from "./build/three.module.js";
import { OrbitControls } from "./controls/OrbitControls.js";
// import { RectAreaLightHelper } from 'three/examples/jsm/helpers/RectAreaLightHelper.js'

//UIデバッグ
const gui = new dat.GUI();

//サイズ
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};

//シーン
const scene = new THREE.Scene();

//カメラ
const camera = new THREE.PerspectiveCamera(
  75,
  sizes.width / sizes.height,
  0.1,
  1000
);
camera.position.x = -2;
camera.position.y = 1;
camera.position.z = 4;
scene.add(camera);

//ライト
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
// ambientLight.color = new THREE.Color(0xffffff)
// ambientLight.intensity = 0.5;
// scene.add(ambientLight);
// gui.add(ambientLight, "intensity").min(0).max(1).step(0.001);

const directionalLight = new THREE.DirectionalLight(0x0fffff, 0.5);
directionalLight.position.set(1, 0.55, 0);
scene.add(directionalLight);

const hemiSphereLight = new THREE.HemisphereLight(0x0ffff0, 0xffff00, 0.5);
hemiSphereLight.position.set(1, 0.25, 2);
scene.add(hemiSphereLight);

const pointLight = new THREE.PointLight(0xff4000, 0.3, 10, 2);
pointLight.position.set(-1, 0, 1.5);
scene.add(pointLight);

//MeshstarndardMaterialとMeshPhysicalMaterialでしか機能しない。
const rectAreaLight = new THREE.RectAreaLight(0x4eff00, 0.5, 3, 4);
rectAreaLight.position.set(1.5, 0, 1);
rectAreaLight.lookAt(0, 0, 0);
scene.add(rectAreaLight);

//spotlight
const spotLight = new THREE.SpotLight(0xffffff, 0.5, 6, Math.PI * 0.1, 0.1, 1);
spotLight.position.set(0, 2, 3);
scene.add(spotLight);

console.log(spotLight.target);
spotLight.target.position.x = -1;
scene.add(spotLight.target);

const hemisphereLightHelper = new THREE.HemisphereLightHelper(
  hemiSphereLight,
  0.2
);
scene.add(hemisphereLightHelper);

const directionalLightHelper = new THREE.DirectionalLightHelper(
  directionalLight,
  0.2
);
scene.add(directionalLightHelper);

const pointLightHelper = new THREE.PointLightHelper(pointLight, 0.2);
scene.add(pointLightHelper);

const spotLightHelper = new THREE.SpotLightHelper(spotLight);
scene.add(spotLightHelper);
window.requestAnimationFrame(() => {
  spotLightHelper.update();
});

//これは例外(importする必要あり。)
const rectAreaLightHelper = new RectAreaLightHelper(rectAreaLight);
scene.add(rectAreaLightHelper);

//マテリアル
const material = new THREE.MeshStandardMaterial();
material.roughness = 0.3;

//オブジェクト
const sphere = new THREE.Mesh(new THREE.SphereGeometry(0.5, 32, 32), material);
sphere.position.x = -1.5;

const cube = new THREE.Mesh(new THREE.BoxGeometry(0.75, 0.75, 0.75), material);

const torus = new THREE.Mesh(
  new THREE.TorusGeometry(0.3, 0.2, 32, 64),
  material
);
torus.position.x = 1.5;

const plane = new THREE.Mesh(new THREE.PlaneGeometry(5, 5), material);
plane.rotation.x = -Math.PI * 0.5;
plane.position.y = -0.65;

scene.add(sphere, cube, torus, plane);

window.addEventListener("resize", () => {
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;

  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();

  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});

//レンダラー
const renderer = new THREE.WebGLRenderer();
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
document.body.appendChild(renderer.domElement);

//コントロール
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;

const clock = new THREE.Clock();

const animate = () => {
  const elapsedTime = clock.getElapsedTime();

  // Update objects
  sphere.rotation.y = 0.1 * elapsedTime;
  cube.rotation.y = 0.1 * elapsedTime;
  torus.rotation.y = 0.1 * elapsedTime;

  sphere.rotation.x = 0.15 * elapsedTime;
  cube.rotation.x = 0.15 * elapsedTime;
  torus.rotation.x = 0.15 * elapsedTime;

  controls.update();

  renderer.render(scene, camera);

  window.requestAnimationFrame(animate);
};

animate();

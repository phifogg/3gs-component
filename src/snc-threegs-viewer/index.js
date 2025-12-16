import {createCustomElement} from '@servicenow/ui-core';
import snabbdom from '@servicenow/ui-renderer-snabbdom';
import styles from './styles.scss';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

let sceneState = {
	camera: null,
	scene: null,
	renderer: null,
	loader: null,
	modelLoaded: false,
	fileUrl: null
};

const initScene = () => {
	// Do not assume window size here — container size will be applied when mounted
	sceneState.camera = new THREE.PerspectiveCamera(70, 1, 0.01, 10);
	sceneState.camera.position.z = 1;
	sceneState.scene = new THREE.Scene();

	// Add simple lighting so PBR materials are visible
	const ambient = new THREE.AmbientLight(0xffffff, 1);
	sceneState.scene.add(ambient);
	const directional = new THREE.DirectionalLight(0xffffff, 0.6);
	directional.position.set(1, 1, 1).normalize();
	sceneState.scene.add(directional);

	sceneState.renderer = new THREE.WebGLRenderer({ antialias: true });
	sceneState.renderer.setPixelRatio(window.devicePixelRatio || 1);
	sceneState.loader = new GLTFLoader();
	sceneState.resizeObserver = null; // will be created per-container
};

const loadModel = () => {
	if (!sceneState.renderer) {
		initScene();
	}

	if (sceneState.modelLoaded || !sceneState.fileUrl) return;

	sceneState.loader.load(sceneState.fileUrl, (gltf) => {
		const model = gltf.scene || gltf.scenes[0];

		// center model
		const box = new THREE.Box3().setFromObject(model);
		const center = box.getCenter(new THREE.Vector3());
		model.position.x -= center.x;
		model.position.y -= center.y;
		model.position.z -= center.z;

		sceneState.scene.add(model);

		// Fit camera to model
		const size = box.getSize(new THREE.Vector3());
		const maxDim = Math.max(size.x, size.y, size.z);
		if (maxDim > 0) {
			const fov = sceneState.camera.fov * (Math.PI / 180);
			let cameraZ = Math.abs(maxDim / 2 / Math.tan(fov / 2));
			sceneState.camera.position.z = cameraZ * 2; // some padding
			sceneState.camera.near = cameraZ / 100;
			sceneState.camera.far = cameraZ * 100;
			sceneState.camera.updateProjectionMatrix();
		}

		// Render once after load
		sceneState.renderer.render(sceneState.scene, sceneState.camera);
		sceneState.renderer.setAnimationLoop( animate );
		sceneState.modelLoaded = true;

	}, (xhr) => {
		// Progress callback
	}, (error) => {
		// Error callback
		console.error('An error occurred while loading the model', error);
	});
};

function animate( time ) {
	sceneState.scene.rotation.x += 0.01;
	sceneState.scene.rotation.y += 0.01;
	sceneState.renderer.render( sceneState.scene, sceneState.camera );
}

const view = (state, {updateState}) => {
	const {properties} = state;
	
	// Store fileUrl in sceneState for later use
	if (properties && properties.fileurl) {
		sceneState.fileUrl = properties.fileurl;
	}

	return (
		<div>
			<h1>My ThreeGS Viewer</h1>
			{sceneState.fileUrl && <div>Loading model: {sceneState.fileUrl}</div>}
			<div id="canvas-container" hook-insert={(vnode) => {
				if (!vnode.elm.querySelector('canvas')) {
					if (!sceneState.renderer) {
						initScene();
					}

					// set renderer size to the container's size
					const setSizeToContainer = () => {
						let w = Math.max(1, vnode.elm.clientWidth);
						let h = Math.max(0, vnode.elm.clientHeight);
						// if container has no height (e.g. not styled), give it a sensible min-height
						if (h === 0) {
							vnode.elm.style.minHeight = '400px';
							h = Math.max(1, vnode.elm.clientHeight);
						}

						// set canvas CSS to fill container
						sceneState.renderer.domElement.style.display = 'block';
						sceneState.renderer.domElement.style.width = '100%';
						sceneState.renderer.domElement.style.height = '100%';

						// use devicePixelRatio for resolution
						const dpr = window.devicePixelRatio || 1;
						sceneState.renderer.setSize(Math.floor(w * dpr), Math.floor(h * dpr));
						// but keep CSS size to container pixels
						sceneState.renderer.domElement.style.width = w + 'px';
						sceneState.renderer.domElement.style.height = h + 'px';

						sceneState.camera.aspect = w / h;
						sceneState.camera.updateProjectionMatrix();
					};

					setSizeToContainer();
					if (!vnode.elm.contains(sceneState.renderer.domElement)) {
						vnode.elm.appendChild(sceneState.renderer.domElement);
					}

					// observe container resizes and update renderer/camera
					if (!sceneState.resizeObserver) {
						sceneState.resizeObserver = new ResizeObserver(() => {
							setSizeToContainer();
						});
						sceneState.resizeObserver.observe(vnode.elm);
					}

					// Load model once container is ready
					if (!sceneState.modelLoaded) {
						loadModel();
					}
				}
			}}></div>
		</div>
	);
};

createCustomElement('snc-threegs-viewer', {
	view,
	styles,
	properties: {
		fileurl: { schema: { type: 'string' }, default: 'https://empddraes.service-now.com/sys_attachment.do?sysparm_referring_url=tear_off&view=true&sys_id=1d6cddec87f17a107099cae50cbb35e1'}
	}
});


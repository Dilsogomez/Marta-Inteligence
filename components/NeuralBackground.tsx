import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import SimplexNoise from 'simplex-noise';

export const NeuralBackground = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!canvasRef.current) return;

    // --- Configuration from Snippet ---
    const conf = {
      fov: 75,
      cameraZ: 75,
      xyCoef: 50,
      zCoef: 10,
      lightIntensity: 0.9,
      ambientColor: 0x000000,
      light1Color: 0x0E09DC,
      light2Color: 0x1CD1E1,
      light3Color: 0x18C02C,
      light4Color: 0xee3bcf,
    };

    let renderer: THREE.WebGLRenderer, scene: THREE.Scene, camera: THREE.PerspectiveCamera;
    let width: number, height: number, wWidth: number, wHeight: number;
    
    let plane: THREE.Mesh;
    const simplex = new SimplexNoise();

    const mouse = new THREE.Vector2();
    const mousePlane = new THREE.Plane(new THREE.Vector3(0, 0, 1), 0);
    const mousePosition = new THREE.Vector3();
    const raycaster = new THREE.Raycaster();

    // Lights
    let light1: THREE.PointLight, light2: THREE.PointLight, light3: THREE.PointLight, light4: THREE.PointLight;

    function init() {
      if (!canvasRef.current) return;

      renderer = new THREE.WebGLRenderer({ canvas: canvasRef.current, antialias: true, alpha: true });
      camera = new THREE.PerspectiveCamera(conf.fov);
      camera.position.z = conf.cameraZ;

      updateSize();
      window.addEventListener('resize', updateSize, false);

      document.addEventListener('mousemove', handleMouseMove);

      initScene();
      animate();
    }

    function handleMouseMove(e: MouseEvent) {
      if (!width || !height) return;
      const v = new THREE.Vector3();
      camera.getWorldDirection(v);
      v.normalize();
      mousePlane.normal = v;
      mouse.x = (e.clientX / width) * 2 - 1;
      mouse.y = - (e.clientY / height) * 2 + 1;
      raycaster.setFromCamera(mouse, camera);
      raycaster.ray.intersectPlane(mousePlane, mousePosition);
    }

    function initScene() {
      scene = new THREE.Scene();
      initLights();

      // Using MeshLambertMaterial to react to lights
      let mat = new THREE.MeshLambertMaterial({ color: 0xffffff, side: THREE.DoubleSide });
      // PlaneGeometry(width, height, widthSegments, heightSegments)
      // Using dynamic segments based on size for resolution
      let geo = new THREE.PlaneGeometry(wWidth, wHeight, Math.floor(wWidth / 2), Math.floor(wHeight / 2));
      plane = new THREE.Mesh(geo, mat);
      scene.add(plane);

      plane.rotation.x = -Math.PI / 2 - 0.2;
      plane.position.y = -25;
      camera.position.z = 60;
    }

    function initLights() {
      const r = 30;
      const y = 10;
      const lightDistance = 500;

      light1 = new THREE.PointLight(conf.light1Color, conf.lightIntensity, lightDistance);
      light1.position.set(0, y, r);
      scene.add(light1);
      
      light2 = new THREE.PointLight(conf.light2Color, conf.lightIntensity, lightDistance);
      light2.position.set(0, -y, -r);
      scene.add(light2);
      
      light3 = new THREE.PointLight(conf.light3Color, conf.lightIntensity, lightDistance);
      light3.position.set(r, y, 0);
      scene.add(light3);
      
      light4 = new THREE.PointLight(conf.light4Color, conf.lightIntensity, lightDistance);
      light4.position.set(-r, y, 0);
      scene.add(light4);
    }

    function animate() {
      if (!canvasRef.current) return; // Stop if unmounted
      requestAnimationFrame(animate);

      animatePlane();
      animateLights();

      renderer.render(scene, camera);
    }

    function animatePlane() {
      if (!plane) return;
      const positionAttribute = plane.geometry.attributes.position;
      const gArray = positionAttribute.array as Float32Array;
      const time = Date.now() * 0.0002;
      
      // Simplex noise logic from snippet
      // gArray structure: [x, y, z, x, y, z, ...]
      for (let i = 0; i < gArray.length; i += 3) {
        gArray[i + 2] = simplex.noise4D(gArray[i] / conf.xyCoef, gArray[i + 1] / conf.xyCoef, time, mouse.x + mouse.y) * conf.zCoef;
      }
      positionAttribute.needsUpdate = true;
    }

    function animateLights() {
      if (!light1 || !light2 || !light3 || !light4) return;
      const time = Date.now() * 0.001;
      const d = 50;
      light1.position.x = Math.sin(time * 0.1) * d;
      light1.position.z = Math.cos(time * 0.2) * d;
      light2.position.x = Math.cos(time * 0.3) * d;
      light2.position.z = Math.sin(time * 0.4) * d;
      light3.position.x = Math.sin(time * 0.5) * d;
      light3.position.z = Math.sin(time * 0.6) * d;
      light4.position.x = Math.sin(time * 0.7) * d;
      light4.position.z = Math.cos(time * 0.8) * d;
    }

    function updateSize() {
      width = window.innerWidth;
      height = window.innerHeight;
      if (renderer && camera) {
        renderer.setSize(width, height);
        camera.aspect = width / height;
        camera.updateProjectionMatrix();
        
        // Recalculate plane size based on camera
        const wsize = getRendererSize();
        wWidth = wsize[0];
        wHeight = wsize[1];
      }
    }

    function getRendererSize() {
      const cam = new THREE.PerspectiveCamera(camera.fov, camera.aspect);
      const vFOV = cam.fov * Math.PI / 180;
      const h = 2 * Math.tan(vFOV / 2) * Math.abs(conf.cameraZ);
      const w = h * cam.aspect;
      return [w, h];
    }

    init();

    // Cleanup
    return () => {
      window.removeEventListener('resize', updateSize);
      document.removeEventListener('mousemove', handleMouseMove);
      if (renderer) renderer.dispose();
    };
  }, []);

  return (
    <div className="absolute top-0 left-0 w-full h-full -z-10 overflow-hidden bg-white dark:bg-black transition-colors duration-300">
        {/* Canvas Layer with Blend Mode to ensure visibility (white on white = black via exclusion) */}
        <canvas 
            ref={canvasRef} 
            className="absolute top-0 left-0 w-full h-full object-cover mix-blend-exclusion" 
        />
    </div>
  );
};
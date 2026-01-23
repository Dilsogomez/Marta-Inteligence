import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js';
import { OutputPass } from 'three/addons/postprocessing/OutputPass.js';

// --- SHADERS ---
const noiseFunctions = `
vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec4 mod289(vec4 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec4 permute(vec4 x) { return mod289(((x * 34.0) + 1.0) * x); }
vec4 taylorInvSqrt(vec4 r) { return 1.79284291400159 - 0.85373472095314 * r; }

float snoise(vec3 v) {
    const vec2 C = vec2(1.0/6.0, 1.0/3.0);
    const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);
    
    vec3 i = floor(v + dot(v, C.yyy));
    vec3 x0 = v - i + dot(i, C.xxx);
    
    vec3 g = step(x0.yzx, x0.xyz);
    vec3 l = 1.0 - g;
    vec3 i1 = min(g.xyz, l.zxy);
    vec3 i2 = max(g.xyz, l.zxy);
    
    vec3 x1 = x0 - i1 + C.xxx;
    vec3 x2 = x0 - i2 + C.yyy;
    vec3 x3 = x0 - D.yyy;
    
    i = mod289(i);
    vec4 p = permute(permute(permute(
        i.z + vec4(0.0, i1.z, i2.z, 1.0))
        + i.y + vec4(0.0, i1.y, i2.y, 1.0))
        + i.x + vec4(0.0, i1.x, i2.x, 1.0));
        
    float n_ = 0.142857142857;
    vec3 ns = n_ * D.wyz - D.xzx;
    
    vec4 j = p - 49.0 * floor(p * ns.z * ns.z);
    vec4 x_ = floor(j * ns.z);
    vec4 y_ = floor(j - 7.0 * x_);
    
    vec4 x = x_ * ns.x + ns.yyyy;
    vec4 y = y_ * ns.x + ns.yyyy;
    vec4 h = 1.0 - abs(x) - abs(y);
    
    vec4 b0 = vec4(x.xy, y.xy);
    vec4 b1 = vec4(x.zw, y.zw);
    
    vec4 s0 = floor(b0) * 2.0 + 1.0;
    vec4 s1 = floor(b1) * 2.0 + 1.0;
    vec4 sh = -step(h, vec4(0.0));
    
    vec4 a0 = b0.xzyw + s0.xzyw * sh.xxyy;
    vec4 a1 = b1.xzyw + s1.xzyw * sh.zzww;
    
    vec3 p0 = vec3(a0.xy, h.x);
    vec3 p1 = vec3(a0.zw, h.y);
    vec3 p2 = vec3(a1.xy, h.z);
    vec3 p3 = vec3(a1.zw, h.w);
    
    vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2,p2), dot(p3,p3)));
    p0 *= norm.x;
    p1 *= norm.y;
    p2 *= norm.z;
    p3 *= norm.w;
    
    vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
    m = m * m;
    return 42.0 * dot(m * m, vec4(dot(p0,x0), dot(p1,x1), dot(p2,x2), dot(p3,x3)));
}`;

const nodeShader = {
    vertexShader: `${noiseFunctions}
    attribute float nodeSize;
    attribute float nodeType;
    attribute vec3 nodeColor;
    attribute float distanceFromRoot;
    
    uniform float uTime;
    uniform vec3 uPulsePositions[3];
    uniform float uPulseTimes[3];
    uniform float uPulseSpeed;
    uniform float uBaseNodeSize;
    
    varying vec3 vColor;
    varying float vNodeType;
    varying vec3 vPosition;
    varying float vPulseIntensity;
    varying float vDistanceFromRoot;
    varying float vGlow;
    
    float getPulseIntensity(vec3 worldPos, vec3 pulsePos, float pulseTime) {
        if (pulseTime < 0.0) return 0.0;
        float timeSinceClick = uTime - pulseTime;
        if (timeSinceClick < 0.0 || timeSinceClick > 4.0) return 0.0;
        float pulseRadius = timeSinceClick * uPulseSpeed;
        float distToClick = distance(worldPos, pulsePos);
        float pulseThickness = 3.0;
        float waveProximity = abs(distToClick - pulseRadius);
        return smoothstep(pulseThickness, 0.0, waveProximity) * smoothstep(4.0, 0.0, timeSinceClick);
    }
    
    void main() {
        vNodeType = nodeType;
        vColor = nodeColor;
        vDistanceFromRoot = distanceFromRoot;
        vec3 worldPos = (modelMatrix * vec4(position, 1.0)).xyz;
        vPosition = worldPos;
        float totalPulseIntensity = 0.0;
        for (int i = 0; i < 3; i++) {
            totalPulseIntensity += getPulseIntensity(worldPos, uPulsePositions[i], uPulseTimes[i]);
        }
        vPulseIntensity = min(totalPulseIntensity, 1.0);
        float breathe = sin(uTime * 0.7 + distanceFromRoot * 0.15) * 0.15 + 0.85;
        float baseSize = nodeSize * breathe;
        float pulseSize = baseSize * (1.0 + vPulseIntensity * 2.5);
        vGlow = 0.5 + 0.5 * sin(uTime * 0.5 + distanceFromRoot * 0.2);
        vec3 modifiedPosition = position;
        if (nodeType > 0.5) {
            float noise = snoise(position * 0.08 + uTime * 0.08);
            modifiedPosition += normal * noise * 0.15;
        }
        vec4 mvPosition = modelViewMatrix * vec4(modifiedPosition, 1.0);
        gl_PointSize = pulseSize * uBaseNodeSize * (1000.0 / -mvPosition.z);
        gl_Position = projectionMatrix * mvPosition;
    }`,
    fragmentShader: `
    uniform float uTime;
    uniform vec3 uPulseColors[3];
    
    varying vec3 vColor;
    varying float vNodeType;
    varying vec3 vPosition;
    varying float vPulseIntensity;
    varying float vDistanceFromRoot;
    varying float vGlow;
    
    void main() {
        vec2 center = 2.0 * gl_PointCoord - 1.0;
        float dist = length(center);
        if (dist > 1.0) discard;
        float glow1 = 1.0 - smoothstep(0.0, 0.5, dist);
        float glow2 = 1.0 - smoothstep(0.0, 1.0, dist);
        float glowStrength = pow(glow1, 1.2) + glow2 * 0.3;
        float breatheColor = 0.9 + 0.1 * sin(uTime * 0.6 + vDistanceFromRoot * 0.25);
        vec3 baseColor = vColor * breatheColor;
        vec3 finalColor = baseColor;
        if (vPulseIntensity > 0.0) {
            vec3 pulseColor = mix(vec3(1.0), uPulseColors[0], 0.4);
            finalColor = mix(baseColor, pulseColor, vPulseIntensity * 0.8);
            finalColor *= (1.0 + vPulseIntensity * 1.2);
            glowStrength *= (1.0 + vPulseIntensity);
        }
        float coreBrightness = smoothstep(0.4, 0.0, dist);
        finalColor += vec3(1.0) * coreBrightness * 0.3;
        float alpha = glowStrength * (0.95 - 0.3 * dist);
        float camDistance = length(vPosition - cameraPosition);
        float distanceFade = smoothstep(100.0, 15.0, camDistance);
        if (vNodeType > 0.5) {
            finalColor *= 1.1;
            alpha *= 0.9;
        }
        finalColor *= (1.0 + vGlow * 0.1);
        gl_FragColor = vec4(finalColor, alpha * distanceFade);
    }`
};

const connectionShader = {
    vertexShader: `${noiseFunctions}
    attribute vec3 startPoint;
    attribute vec3 endPoint;
    attribute float connectionStrength;
    attribute float pathIndex;
    attribute vec3 connectionColor;
    
    uniform float uTime;
    uniform vec3 uPulsePositions[3];
    uniform float uPulseTimes[3];
    uniform float uPulseSpeed;
    
    varying vec3 vColor;
    varying float vConnectionStrength;
    varying float vPulseIntensity;
    varying float vPathPosition;
    varying float vDistanceFromCamera;
    
    float getPulseIntensity(vec3 worldPos, vec3 pulsePos, float pulseTime) {
        if (pulseTime < 0.0) return 0.0;
        float timeSinceClick = uTime - pulseTime;
        if (timeSinceClick < 0.0 || timeSinceClick > 4.0) return 0.0;
        
        float pulseRadius = timeSinceClick * uPulseSpeed;
        float distToClick = distance(worldPos, pulsePos);
        float pulseThickness = 3.0;
        float waveProximity = abs(distToClick - pulseRadius);
        
        return smoothstep(pulseThickness, 0.0, waveProximity) * smoothstep(4.0, 0.0, timeSinceClick);
    }
    
    void main() {
        float t = position.x;
        vPathPosition = t;
        vec3 midPoint = mix(startPoint, endPoint, 0.5);
        float pathOffset = sin(t * 3.14159) * 0.15;
        vec3 perpendicular = normalize(cross(normalize(endPoint - startPoint), vec3(0.0, 1.0, 0.0)));
        if (length(perpendicular) < 0.1) perpendicular = vec3(1.0, 0.0, 0.0);
        midPoint += perpendicular * pathOffset;
        vec3 p0 = mix(startPoint, midPoint, t);
        vec3 p1 = mix(midPoint, endPoint, t);
        vec3 finalPos = mix(p0, p1, t);
        float noiseTime = uTime * 0.15;
        float noise = snoise(vec3(pathIndex * 0.08, t * 0.6, noiseTime));
        finalPos += perpendicular * noise * 0.12;
        vec3 worldPos = (modelMatrix * vec4(finalPos, 1.0)).xyz;
        float totalPulseIntensity = 0.0;
        for (int i = 0; i < 3; i++) {
            totalPulseIntensity += getPulseIntensity(worldPos, uPulsePositions[i], uPulseTimes[i]);
        }
        vPulseIntensity = min(totalPulseIntensity, 1.0);
        vColor = connectionColor;
        vConnectionStrength = connectionStrength;
        
        vDistanceFromCamera = length(worldPos - cameraPosition);
        gl_Position = projectionMatrix * modelViewMatrix * vec4(finalPos, 1.0);
    }`,
    fragmentShader: `
    uniform float uTime;
    uniform vec3 uPulseColors[3];
    
    varying vec3 vColor;
    varying float vConnectionStrength;
    varying float vPulseIntensity;
    varying float vPathPosition;
    varying float vDistanceFromCamera;
    
    void main() {
        float flowPattern1 = sin(vPathPosition * 25.0 - uTime * 4.0) * 0.5 + 0.5;
        float flowPattern2 = sin(vPathPosition * 15.0 - uTime * 2.5 + 1.57) * 0.5 + 0.5;
        float combinedFlow = (flowPattern1 + flowPattern2 * 0.5) / 1.5;
        
        vec3 baseColor = vColor * (0.8 + 0.2 * sin(uTime * 0.6 + vPathPosition * 12.0));
        float flowIntensity = 0.4 * combinedFlow * vConnectionStrength;
        vec3 finalColor = baseColor;
        if (vPulseIntensity > 0.0) {
            vec3 pulseColor = mix(vec3(1.0), uPulseColors[0], 0.3);
            finalColor = mix(baseColor, pulseColor * 1.2, vPulseIntensity * 0.7);
            flowIntensity += vPulseIntensity * 0.8;
        }
        finalColor *= (0.7 + flowIntensity + vConnectionStrength * 0.5);
        float baseAlpha = 0.7 * vConnectionStrength;
        float flowAlpha = combinedFlow * 0.3;
        float alpha = baseAlpha + flowAlpha;
        alpha = mix(alpha, min(1.0, alpha * 2.5), vPulseIntensity);
        float distanceFade = smoothstep(100.0, 15.0, vDistanceFromCamera);
        gl_FragColor = vec4(finalColor, alpha * distanceFade);
    }`
};

// --- DATA STRUCTURES ---
const colorPalettes = [
    [
        new THREE.Color(0x667eea),
        new THREE.Color(0x764ba2),
        new THREE.Color(0xf093fb),
        new THREE.Color(0x9d50bb),
        new THREE.Color(0x6e48aa)
    ],
    [
        new THREE.Color(0xf857a6),
        new THREE.Color(0xff5858),
        new THREE.Color(0xfeca57),
        new THREE.Color(0xff6348),
        new THREE.Color(0xff9068)
    ],
    [
        new THREE.Color(0x4facfe),
        new THREE.Color(0x00f2fe),
        new THREE.Color(0x43e97b),
        new THREE.Color(0x38f9d7),
        new THREE.Color(0x4484ce)
    ]
];

class Node {
    position: THREE.Vector3;
    connections: { node: Node; strength: number }[];
    level: number;
    type: number;
    size: number;
    distanceFromRoot: number;
    helixIndex?: number;
    helixT?: number;

    constructor(position: THREE.Vector3, level = 0, type = 0) {
        this.position = position;
        this.connections = [];
        this.level = level;
        this.type = type;
        this.size = type === 0 ? THREE.MathUtils.randFloat(0.8, 1.4) : THREE.MathUtils.randFloat(0.5, 1.0);
        this.distanceFromRoot = 0;
    }
    addConnection(node: Node, strength = 1.0) {
        if (!this.isConnectedTo(node)) {
            this.connections.push({ node, strength });
            node.connections.push({ node: this, strength });
        }
    }
    isConnectedTo(node: Node) {
        return this.connections.some(conn => conn.node === node);
    }
}

export const NeuralNetworkSection = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    
    // Camera / Motion Refs
    const videoRef = useRef<HTMLVideoElement>(null);
    const motionCanvasRef = useRef<HTMLCanvasElement>(null);
    const lastFrameDataRef = useRef<Uint8ClampedArray | null>(null);
    
    // States for UI controls
    const [activePaletteIndex, setActivePaletteIndex] = useState(0);
    const [densityFactor, setDensityFactor] = useState(1);
    const [isPaused, setIsPaused] = useState(false);
    const [isCameraActive, setIsCameraActive] = useState(false);
    
    // Refs for Three.js objects to access inside callbacks/useEffect
    const sceneRef = useRef<THREE.Scene | null>(null);
    const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
    const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
    const composerRef = useRef<EffectComposer | null>(null);
    const controlsRef = useRef<OrbitControls | null>(null);
    const nodesMeshRef = useRef<THREE.Points | null>(null);
    const connectionsMeshRef = useRef<THREE.LineSegments | null>(null);
    const clockRef = useRef(new THREE.Clock());
    const neuralNetworkRef = useRef<{ nodes: Node[]; rootNode: Node } | null>(null);
    const formationIndexRef = useRef(0);
    const pulseUniformsRef = useRef({
        uTime: { value: 0.0 },
        uPulsePositions: { value: [
            new THREE.Vector3(1e3, 1e3, 1e3),
            new THREE.Vector3(1e3, 1e3, 1e3),
            new THREE.Vector3(1e3, 1e3, 1e3)
        ]},
        uPulseTimes: { value: [-1e3, -1e3, -1e3] },
        uPulseColors: { value: [
            new THREE.Color(1, 1, 1),
            new THREE.Color(1, 1, 1),
            new THREE.Color(1, 1, 1)
        ]},
        uPulseSpeed: { value: 18.0 },
        uBaseNodeSize: { value: 0.6 }
    });
    const lastPulseIndexRef = useRef(0);

    // Camera handling
    const startCamera = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ video: { width: 320, height: 240 } });
            if (videoRef.current) {
                videoRef.current.srcObject = stream;
                videoRef.current.play();
                setIsCameraActive(true);
            }
        } catch (err) {
            console.error("Error accessing camera:", err);
            alert("Não foi possível acessar a câmera para interação.");
        }
    };

    const stopCamera = () => {
        if (videoRef.current && videoRef.current.srcObject) {
            const stream = videoRef.current.srcObject as MediaStream;
            stream.getTracks().forEach(track => track.stop());
            videoRef.current.srcObject = null;
            setIsCameraActive(false);
        }
    };

    // Process video frame for motion
    const processMotion = () => {
        if (!videoRef.current || !motionCanvasRef.current || !isCameraActive) return null;
        
        const video = videoRef.current;
        const canvas = motionCanvasRef.current;
        const ctx = canvas.getContext('2d', { willReadFrequently: true });
        
        if (!ctx || video.readyState !== 4) return null;

        // Draw current video frame (flipped horizontally)
        ctx.save();
        ctx.scale(-1, 1);
        ctx.drawImage(video, 0, 0, -64, 48); // Small resolution for performance
        ctx.restore();

        const imageData = ctx.getImageData(0, 0, 64, 48);
        const data = imageData.data;
        const length = data.length;
        
        let diffSum = 0;
        let xSum = 0;
        let ySum = 0;
        let pixelCount = 0;

        if (lastFrameDataRef.current) {
            const lastData = lastFrameDataRef.current;
            for (let i = 0; i < length; i += 4) {
                // Simple difference in RGB
                const rDiff = Math.abs(data[i] - lastData[i]);
                const gDiff = Math.abs(data[i+1] - lastData[i+1]);
                const bDiff = Math.abs(data[i+2] - lastData[i+2]);
                const avgDiff = (rDiff + gDiff + bDiff) / 3;

                if (avgDiff > 30) { // Threshold for "movement"
                    diffSum += avgDiff;
                    const index = i / 4;
                    const x = index % 64;
                    const y = Math.floor(index / 64);
                    
                    xSum += x;
                    ySum += y;
                    pixelCount++;
                }
            }
        }

        lastFrameDataRef.current = new Uint8ClampedArray(data);

        if (pixelCount > 5) { // Minimum pixels changed
            return {
                x: (xSum / pixelCount) / 64, // Normalized 0-1
                y: (ySum / pixelCount) / 48, // Normalized 0-1
                intensity: pixelCount / (64 * 48) // Percent of screen changed
            };
        }
        return null;
    };

    // Helper to trigger pulse at screen coordinate
    const triggerPulseAt = (normalizedX: number, normalizedY: number) => {
        if (!cameraRef.current || !nodesMeshRef.current) return;
        
        // Convert 0-1 (from top left) to NDC -1 to 1 (Y is up)
        const x = normalizedX * 2 - 1;
        const y = -(normalizedY * 2 - 1);

        const raycaster = new THREE.Raycaster();
        raycaster.setFromCamera(new THREE.Vector2(x, y), cameraRef.current);
        
        const interactionPlane = new THREE.Plane(new THREE.Vector3(0, 0, 1), 0);
        interactionPlane.normal.copy(cameraRef.current.position).normalize();
        interactionPlane.constant = -interactionPlane.normal.dot(cameraRef.current.position) + cameraRef.current.position.length() * 0.5;
        
        const target = new THREE.Vector3();
        if (raycaster.ray.intersectPlane(interactionPlane, target)) {
            const t = clockRef.current.getElapsedTime();
            const idx = (lastPulseIndexRef.current + 1) % 3;
            lastPulseIndexRef.current = idx;
            
            const matNodes = nodesMeshRef.current.material as THREE.ShaderMaterial;
            const matConns = connectionsMeshRef.current.material as THREE.ShaderMaterial;
            
            matNodes.uniforms.uPulsePositions.value[idx].copy(target);
            matNodes.uniforms.uPulseTimes.value[idx] = t;
            matConns.uniforms.uPulsePositions.value[idx].copy(target);
            matConns.uniforms.uPulseTimes.value[idx] = t;
        }
    }

    // Generation Logic
    const generateNetworkData = (formationIndex: number, density: number) => {
        let nodes: Node[] = [];
        let rootNode: Node;

        const generateCrystallineSphere = () => {
            rootNode = new Node(new THREE.Vector3(0, 0, 0), 0, 0);
            rootNode.size = 2.0;
            nodes.push(rootNode);
            const layers = 5;
            const goldenRatio = (1 + Math.sqrt(5)) / 2;
            for (let layer = 1; layer <= layers; layer++) {
                const radius = layer * 4;
                const numPoints = Math.floor(layer * 12 * density);
                for (let i = 0; i < numPoints; i++) {
                    const phi = Math.acos(1 - 2 * (i + 0.5) / numPoints);
                    const theta = 2 * Math.PI * i / goldenRatio;
                    const pos = new THREE.Vector3(
                        radius * Math.sin(phi) * Math.cos(theta),
                        radius * Math.sin(phi) * Math.sin(theta),
                        radius * Math.cos(phi)
                    );
                    const isLeaf = layer === layers || Math.random() < 0.3;
                    const node = new Node(pos, layer, isLeaf ? 1 : 0);
                    node.distanceFromRoot = radius;
                    nodes.push(node);
                    if (layer > 1) {
                        const prevLayerNodes = nodes.filter(n => n.level === layer - 1 && n !== rootNode);
                        prevLayerNodes.sort((a, b) =>
                            pos.distanceTo(a.position) - pos.distanceTo(b.position)
                        );
                        for (let j = 0; j < Math.min(3, prevLayerNodes.length); j++) {
                            const dist = pos.distanceTo(prevLayerNodes[j].position);
                            const strength = 1.0 - (dist / (radius * 2));
                            node.addConnection(prevLayerNodes[j], Math.max(0.3, strength));
                        }
                    } else {
                        rootNode.addConnection(node, 0.9);
                    }
                }
                const layerNodes = nodes.filter(n => n.level === layer && n !== rootNode);
                for (let i = 0; i < layerNodes.length; i++) {
                    const node = layerNodes[i];
                    const nearby = layerNodes.filter(n => n !== node)
                        .sort((a, b) =>
                            node.position.distanceTo(a.position) - node.position.distanceTo(b.position)
                        ).slice(0, 5);
                    for (const nearNode of nearby) {
                        const dist = node.position.distanceTo(nearNode.position);
                        if (dist < radius * 0.8 && !node.isConnectedTo(nearNode)) {
                            node.addConnection(nearNode, 0.6);
                        }
                    }
                }
            }
            // Add some outer randomness
            const outerNodes = nodes.filter(n => n.level >= 3);
            for (let i = 0; i < Math.min(20, outerNodes.length); i++) {
                const n1 = outerNodes[Math.floor(Math.random() * outerNodes.length)];
                const n2 = outerNodes[Math.floor(Math.random() * outerNodes.length)];
                if (n1 !== n2 && !n1.isConnectedTo(n2) && Math.abs(n1.level - n2.level) > 1) {
                    n1.addConnection(n2, 0.4);
                }
            }
        };

        const generateHelixLattice = () => {
            rootNode = new Node(new THREE.Vector3(0, 0, 0), 0, 0);
            rootNode.size = 1.8;
            nodes.push(rootNode);
            const numHelices = 4;
            const height = 30;
            const maxRadius = 12;
            const nodesPerHelix = Math.floor(50 * density);
            const helixArrays: Node[][] = [];
            for (let h = 0; h < numHelices; h++) {
                const helixPhase = (h / numHelices) * Math.PI * 2;
                const helixNodes: Node[] = [];
                for (let i = 0; i < nodesPerHelix; i++) {
                    const t = i / (nodesPerHelix - 1);
                    const y = (t - 0.5) * height;
                    const radiusScale = Math.sin(t * Math.PI) * 0.7 + 0.3;
                    const radius = maxRadius * radiusScale;
                    const angle = helixPhase + t * Math.PI * 6;
                    const pos = new THREE.Vector3(
                        radius * Math.cos(angle),
                        y,
                        radius * Math.sin(angle)
                    );
                    const level = Math.ceil(t * 5);
                    const isLeaf = i > nodesPerHelix - 5 || Math.random() < 0.25;
                    const node = new Node(pos, level, isLeaf ? 1 : 0);
                    node.distanceFromRoot = Math.sqrt(radius * radius + y * y);
                    node.helixIndex = h;
                    node.helixT = t;
                    nodes.push(node);
                    helixNodes.push(node);
                }
                helixArrays.push(helixNodes);
                rootNode.addConnection(helixNodes[0], 1.0);
                for (let i = 0; i < helixNodes.length - 1; i++) {
                    helixNodes[i].addConnection(helixNodes[i + 1], 0.85);
                }
            }
            // Cross connections
            for (let h = 0; h < numHelices; h++) {
                const currentHelix = helixArrays[h];
                const nextHelix = helixArrays[(h + 1) % numHelices];
                for (let i = 0; i < currentHelix.length; i += 5) {
                    const t = currentHelix[i].helixT!;
                    const targetIdx = Math.round(t * (nextHelix.length - 1));
                    if (targetIdx < nextHelix.length) {
                        currentHelix[i].addConnection(nextHelix[targetIdx], 0.7);
                    }
                }
            }
        };

        const generateFractalWeb = () => {
            rootNode = new Node(new THREE.Vector3(0, 0, 0), 0, 0);
            rootNode.size = 1.6;
            nodes.push(rootNode);
            const branches = 6;
            const maxDepth = 4;
            function createBranch(startNode: Node, direction: THREE.Vector3, depth: number, strength: number, scale: number) {
                if (depth > maxDepth) return;
                const branchLength = 5 * scale;
                const endPos = new THREE.Vector3().copy(startNode.position).add(direction.clone().multiplyScalar(branchLength));
                const isLeaf = depth === maxDepth || Math.random() < 0.3;
                const newNode = new Node(endPos, depth, isLeaf ? 1 : 0);
                newNode.distanceFromRoot = rootNode.position.distanceTo(endPos);
                nodes.push(newNode);
                startNode.addConnection(newNode, strength);
                if (depth < maxDepth) {
                    const subBranches = 3;
                    for (let i = 0; i < subBranches; i++) {
                        const angle = (i / subBranches) * Math.PI * 2;
                        const perpDir1 = new THREE.Vector3(-direction.y, direction.x, 0).normalize();
                        const perpDir2 = direction.clone().cross(perpDir1).normalize();
                        const newDir = new THREE.Vector3()
                            .copy(direction)
                            .add(perpDir1.clone().multiplyScalar(Math.cos(angle) * 0.7))
                            .add(perpDir2.clone().multiplyScalar(Math.sin(angle) * 0.7))
                            .normalize();
                        createBranch(newNode, newDir, depth + 1, strength * 0.7, scale * 0.75);
                    }
                }
            }
            for (let i = 0; i < branches; i++) {
                const phi = Math.acos(1 - 2 * (i + 0.5) / branches);
                const theta = Math.PI * (1 + Math.sqrt(5)) * i;
                const direction = new THREE.Vector3(
                    Math.sin(phi) * Math.cos(theta),
                    Math.sin(phi) * Math.sin(theta),
                    Math.cos(phi)
                ).normalize();
                createBranch(rootNode, direction, 1, 0.9, 1.0);
            }
        };

        switch (formationIndex % 3) {
            case 0: generateCrystallineSphere(); break;
            case 1: generateHelixLattice(); break;
            case 2: generateFractalWeb(); break;
        }

        // Density culling
        if (density < 1.0) {
            const targetCount = Math.ceil(nodes.length * Math.max(0.3, density));
            const toKeep = new Set([rootNode]);
            const sortedNodes = nodes.filter(n => n !== rootNode)
                .sort((a, b) => {
                    const scoreA = a.connections.length * (1 / (a.distanceFromRoot + 1));
                    const scoreB = b.connections.length * (1 / (b.distanceFromRoot + 1));
                    return scoreB - scoreA;
                });
            for (let i = 0; i < Math.min(targetCount - 1, sortedNodes.length); i++) {
                toKeep.add(sortedNodes[i]);
            }
            nodes = nodes.filter(n => toKeep.has(n));
            nodes.forEach(node => {
                node.connections = node.connections.filter(conn => toKeep.has(conn.node));
            });
        }
        
        neuralNetworkRef.current = { nodes, rootNode };
        return { nodes, rootNode };
    };

    const updateTheme = (paletteIndex: number) => {
        if (!nodesMeshRef.current || !connectionsMeshRef.current || !neuralNetworkRef.current) return;
        const palette = colorPalettes[paletteIndex];
        const nodeColorsAttr = nodesMeshRef.current.geometry.attributes.nodeColor;
        const nodes = neuralNetworkRef.current.nodes;

        for (let i = 0; i < nodeColorsAttr.count; i++) {
            const node = nodes[i];
            if (!node) continue;
            const colorIndex = Math.min(node.level, palette.length - 1);
            const baseColor = palette[colorIndex % palette.length].clone();
            baseColor.offsetHSL(
                THREE.MathUtils.randFloatSpread(0.03),
                THREE.MathUtils.randFloatSpread(0.08),
                THREE.MathUtils.randFloatSpread(0.08)
            );
            nodeColorsAttr.setXYZ(i, baseColor.r, baseColor.g, baseColor.b);
        }
        nodeColorsAttr.needsUpdate = true;

        // Rebuild connection colors (simplified approach: just update shader uniforms mostly, but we set attributes too)
        const connectionColors: number[] = [];
        const processedConnections = new Set<string>();
        const paletteUniforms = colorPalettes[paletteIndex];
        
        // Update uniforms for pulse colors
        const matNodes = nodesMeshRef.current.material as THREE.ShaderMaterial;
        const matConns = connectionsMeshRef.current.material as THREE.ShaderMaterial;
        
        paletteUniforms.forEach((color, i) => {
            if (i < 3) {
                matNodes.uniforms.uPulseColors.value[i].copy(color);
                matConns.uniforms.uPulseColors.value[i].copy(color);
            }
        });
    };

    const createVisualization = (formationIdx: number, density: number) => {
        if (!sceneRef.current) return;
        const scene = sceneRef.current;

        if (nodesMeshRef.current) {
            scene.remove(nodesMeshRef.current);
            nodesMeshRef.current.geometry.dispose();
            (nodesMeshRef.current.material as THREE.Material).dispose();
        }
        if (connectionsMeshRef.current) {
            scene.remove(connectionsMeshRef.current);
            connectionsMeshRef.current.geometry.dispose();
            (connectionsMeshRef.current.material as THREE.Material).dispose();
        }

        const { nodes } = generateNetworkData(formationIdx, density);
        const palette = colorPalettes[activePaletteIndex];

        // Create Nodes
        const nodesGeometry = new THREE.BufferGeometry();
        const nodePositions: number[] = [];
        const nodeTypes: number[] = [];
        const nodeSizes: number[] = [];
        const nodeColors: number[] = [];
        const distancesFromRoot: number[] = [];

        nodes.forEach((node) => {
            nodePositions.push(node.position.x, node.position.y, node.position.z);
            nodeTypes.push(node.type);
            nodeSizes.push(node.size);
            distancesFromRoot.push(node.distanceFromRoot);
            const colorIndex = Math.min(node.level, palette.length - 1);
            const baseColor = palette[colorIndex % palette.length].clone();
            baseColor.offsetHSL(0.03, 0.08, 0.08); // simple spread
            nodeColors.push(baseColor.r, baseColor.g, baseColor.b);
        });

        nodesGeometry.setAttribute('position', new THREE.Float32BufferAttribute(nodePositions, 3));
        nodesGeometry.setAttribute('nodeType', new THREE.Float32BufferAttribute(nodeTypes, 1));
        nodesGeometry.setAttribute('nodeSize', new THREE.Float32BufferAttribute(nodeSizes, 1));
        nodesGeometry.setAttribute('nodeColor', new THREE.Float32BufferAttribute(nodeColors, 3));
        nodesGeometry.setAttribute('distanceFromRoot', new THREE.Float32BufferAttribute(distancesFromRoot, 1));

        const nodesMaterial = new THREE.ShaderMaterial({
            uniforms: THREE.UniformsUtils.clone(pulseUniformsRef.current),
            vertexShader: nodeShader.vertexShader,
            fragmentShader: nodeShader.fragmentShader,
            transparent: true,
            depthWrite: false,
            blending: THREE.AdditiveBlending
        });

        nodesMeshRef.current = new THREE.Points(nodesGeometry, nodesMaterial);
        scene.add(nodesMeshRef.current);

        // Create Connections
        const connectionsGeometry = new THREE.BufferGeometry();
        const connectionColors: number[] = [];
        const connectionStrengths: number[] = [];
        const connectionPositions: number[] = [];
        const startPoints: number[] = [];
        const endPoints: number[] = [];
        const pathIndices: number[] = [];
        const processedConnections = new Set<string>();
        let pathIndex = 0;

        nodes.forEach((node, nodeIndex) => {
            node.connections.forEach(connection => {
                const connectedNode = connection.node;
                const connectedIndex = nodes.indexOf(connectedNode);
                if (connectedIndex === -1) return;
                const key = [Math.min(nodeIndex, connectedIndex), Math.max(nodeIndex, connectedIndex)].join('-');
                
                if (!processedConnections.has(key)) {
                    processedConnections.add(key);
                    const startPoint = node.position;
                    const endPoint = connectedNode.position;
                    const numSegments = 20;
                    
                    for (let i = 0; i < numSegments; i++) {
                        const t = i / (numSegments - 1);
                        connectionPositions.push(t, 0, 0);
                        startPoints.push(startPoint.x, startPoint.y, startPoint.z);
                        endPoints.push(endPoint.x, endPoint.y, endPoint.z);
                        pathIndices.push(pathIndex);
                        connectionStrengths.push(connection.strength);
                        
                        const avgLevel = Math.min(Math.floor((node.level + connectedNode.level) / 2), palette.length - 1);
                        const baseColor = palette[avgLevel % palette.length].clone();
                        connectionColors.push(baseColor.r, baseColor.g, baseColor.b);
                    }
                    pathIndex++;
                }
            });
        });

        connectionsGeometry.setAttribute('position', new THREE.Float32BufferAttribute(connectionPositions, 3));
        connectionsGeometry.setAttribute('startPoint', new THREE.Float32BufferAttribute(startPoints, 3));
        connectionsGeometry.setAttribute('endPoint', new THREE.Float32BufferAttribute(endPoints, 3));
        connectionsGeometry.setAttribute('connectionStrength', new THREE.Float32BufferAttribute(connectionStrengths, 1));
        connectionsGeometry.setAttribute('connectionColor', new THREE.Float32BufferAttribute(connectionColors, 3));
        connectionsGeometry.setAttribute('pathIndex', new THREE.Float32BufferAttribute(pathIndices, 1));

        const connectionsMaterial = new THREE.ShaderMaterial({
            uniforms: THREE.UniformsUtils.clone(pulseUniformsRef.current),
            vertexShader: connectionShader.vertexShader,
            fragmentShader: connectionShader.fragmentShader,
            transparent: true,
            depthWrite: false,
            blending: THREE.AdditiveBlending
        });

        connectionsMeshRef.current = new THREE.LineSegments(connectionsGeometry, connectionsMaterial);
        scene.add(connectionsMeshRef.current);
        
        // Initial Theme Apply
        updateTheme(activePaletteIndex);
    };

    // --- EFFECT: INIT THREE JS ---
    useEffect(() => {
        if (!containerRef.current || !canvasRef.current) return;

        const width = containerRef.current.clientWidth;
        const height = containerRef.current.clientHeight;

        // Scene
        const scene = new THREE.Scene();
        scene.fog = new THREE.FogExp2(0x000000, 0.002);
        sceneRef.current = scene;

        // Camera
        const camera = new THREE.PerspectiveCamera(65, width / height, 0.1, 1000);
        camera.position.set(0, 8, 28);
        cameraRef.current = camera;

        // Renderer
        const renderer = new THREE.WebGLRenderer({
            canvas: canvasRef.current,
            antialias: true,
            powerPreference: "high-performance",
            alpha: true
        });
        renderer.setSize(width, height);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        renderer.setClearColor(0x000000, 1);
        renderer.outputColorSpace = THREE.SRGBColorSpace;
        rendererRef.current = renderer;

        // Stars
        const createStarfield = () => {
            const count = 3000;
            const positions = [];
            const colors = [];
            const sizes = [];
            for (let i = 0; i < count; i++) {
                const r = THREE.MathUtils.randFloat(50, 150);
                const phi = Math.acos(THREE.MathUtils.randFloatSpread(2));
                const theta = THREE.MathUtils.randFloat(0, Math.PI * 2);
                positions.push(r * Math.sin(phi) * Math.cos(theta), r * Math.sin(phi) * Math.sin(theta), r * Math.cos(phi));
                colors.push(1, 1, 1);
                sizes.push(THREE.MathUtils.randFloat(0.1, 0.3));
            }
            const geo = new THREE.BufferGeometry();
            geo.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
            geo.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));
            geo.setAttribute('size', new THREE.Float32BufferAttribute(sizes, 1));
            const mat = new THREE.ShaderMaterial({
                uniforms: { uTime: { value: 0 } },
                vertexShader: `
                    attribute float size; attribute vec3 color; varying vec3 vColor; uniform float uTime;
                    void main() { vColor = color; vec4 mv = modelViewMatrix * vec4(position, 1.0);
                    gl_PointSize = size * (sin(uTime * 2.0 + position.x * 100.0) * 0.3 + 0.7) * (300.0 / -mv.z);
                    gl_Position = projectionMatrix * mv; }`,
                fragmentShader: `
                    varying vec3 vColor; void main() { vec2 c = gl_PointCoord - 0.5; if(length(c)>0.5) discard;
                    gl_FragColor = vec4(vColor, 0.8); }`,
                transparent: true, blending: THREE.AdditiveBlending, depthWrite: false
            });
            return new THREE.Points(geo, mat);
        };
        const stars = createStarfield();
        scene.add(stars);

        // Composer
        const composer = new EffectComposer(renderer);
        composer.addPass(new RenderPass(scene, camera));
        
        // ADJUSTED BLOOM
        const bloomPass = new UnrealBloomPass(new THREE.Vector2(width, height), 1.2, 0.4, 0.9);
        composer.addPass(bloomPass);
        composer.addPass(new OutputPass());
        composerRef.current = composer;

        // Controls
        const controls = new OrbitControls(camera, canvasRef.current);
        controls.enableDamping = true;
        controls.dampingFactor = 0.05;
        controls.rotateSpeed = 0.6;
        controls.minDistance = 8;
        controls.maxDistance = 80;
        controls.autoRotate = true;
        controls.autoRotateSpeed = 0.5;
        controls.enablePan = false;
        controls.enableZoom = false; 
        controlsRef.current = controls;

        // Initial Viz
        createVisualization(0, 1);

        // Animation Loop
        const animate = () => {
            if (!rendererRef.current) return;
            const t = clockRef.current.getElapsedTime();
            
            // Motion Detection Loop
            if (isCameraActive) {
                const motion = processMotion();
                if (motion) {
                    // Smoothly rotate camera based on motion X centroid
                    // Motion.x is 0..1 (0=left, 1=right).
                    // We want to rotate OrbitControls azimuth.
                    // Center is 0.5.
                    const targetAngle = (motion.x - 0.5) * 4; // -2 to +2 radians range roughly
                    
                    // Simple easing
                    if (controlsRef.current) {
                        const currentAngle = controlsRef.current.getAzimuthalAngle();
                        // Lerp towards target
                        controlsRef.current.minAzimuthAngle = -Infinity; // Unlock
                        controlsRef.current.maxAzimuthAngle = Infinity;
                        
                        // Manually rotate a bit towards target
                        // This is tricky with OrbitControls internal state, simpler to just autoRotateSpeed or small delta
                        // Let's just influence the autoRotate speed or push it
                        controlsRef.current.autoRotate = false; // Disable auto when tracking
                        
                        // Rotate camera azimuth slightly towards motion
                        // This effectively "turns" the camera to look at where the motion is
                        const delta = (targetAngle - currentAngle) * 0.02;
                        // Avoid gimbal lock or infinite spin by just modifying azimuth
                        // OrbitControls doesn't expose a direct setter easily without update(), so we move camera
                        // A safer way for visual effect:
                        controlsRef.current.rotateLeft( (motion.x - 0.5) * 0.05 );
                    }

                    // Trigger pulse if intensity is high
                    if (motion.intensity > 0.1) {
                        // 0.1 is arbitrary threshold for "fast movement"
                        // Trigger pulse at the motion location
                        triggerPulseAt(motion.x, motion.y);
                    }
                }
            } else {
                if (controlsRef.current && !isPaused) {
                    controlsRef.current.autoRotate = true;
                }
            }

            if (nodesMeshRef.current) {
                (nodesMeshRef.current.material as THREE.ShaderMaterial).uniforms.uTime.value = t;
                nodesMeshRef.current.rotation.y = Math.sin(t * 0.04) * 0.05;
            }
            if (connectionsMeshRef.current) {
                (connectionsMeshRef.current.material as THREE.ShaderMaterial).uniforms.uTime.value = t;
                connectionsMeshRef.current.rotation.y = Math.sin(t * 0.04) * 0.05;
            }
            
            stars.rotation.y += 0.0002;
            (stars.material as THREE.ShaderMaterial).uniforms.uTime.value = t;

            controls.update();
            composer.render();
            requestAnimationFrame(animate);
        };
        animate();

        // Resize
        const handleResize = () => {
            if (!containerRef.current) return;
            const w = containerRef.current.clientWidth;
            const h = containerRef.current.clientHeight;
            camera.aspect = w / h;
            camera.updateProjectionMatrix();
            renderer.setSize(w, h);
            composer.setSize(w, h);
            bloomPass.resolution.set(w, h);
        };
        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
            renderer.dispose();
            stopCamera();
        };
    }, [isCameraActive]); // Re-bind animate if camera state changes, or handle inside ref

    // Effect to handle density changes
    useEffect(() => {
        createVisualization(formationIndexRef.current, densityFactor);
    }, [densityFactor]);

    // Effect to handle Theme changes
    useEffect(() => {
        updateTheme(activePaletteIndex);
    }, [activePaletteIndex]);

    // Interactions
    const handleMorph = () => {
        formationIndexRef.current = (formationIndexRef.current + 1) % 3;
        createVisualization(formationIndexRef.current, densityFactor);
        if (controlsRef.current) {
            controlsRef.current.autoRotate = false;
            setTimeout(() => { if (!isPaused && !isCameraActive && controlsRef.current) controlsRef.current.autoRotate = true; }, 2500);
        }
    };

    const handleCanvasClick = (e: React.MouseEvent) => {
        if (!cameraRef.current || !nodesMeshRef.current) return;
        const rect = canvasRef.current!.getBoundingClientRect();
        const x = ((e.clientX - rect.left) / rect.width); // 0-1
        const y = ((e.clientY - rect.top) / rect.height); // 0-1
        triggerPulseAt(x, y);
    };

    return (
        <div ref={containerRef} className="relative w-full h-[600px] bg-black rounded-3xl overflow-hidden shadow-2xl border border-white/10 group mt-8">
            <canvas 
                ref={canvasRef} 
                onClick={handleCanvasClick}
                className="w-full h-full cursor-crosshair block"
            />
            
            {/* Hidden Elements for Motion Detection */}
            <video ref={videoRef} className="hidden" width="64" height="48" muted playsInline />
            <canvas ref={motionCanvasRef} className="hidden" width="64" height="48" />

            {/* UI: Instructions */}
            <div className="absolute top-6 left-6 p-6 rounded-3xl border border-white/10 backdrop-blur-xl bg-gradient-to-br from-white/5 to-white/0 shadow-2xl pointer-events-none select-none max-w-xs transition-opacity duration-300 opacity-80 group-hover:opacity-100">
                <div className="font-display font-medium text-lg mb-2 bg-gradient-to-br from-white to-indigo-300 bg-clip-text text-transparent drop-shadow-sm">
                    Quantum Neural Network
                </div>
                <div className="text-sm font-light text-white/60 leading-relaxed">
                    {isCameraActive 
                        ? "Modo de Câmera Ativo. Mova-se para rotacionar e 'empurre' o ar para criar pulsos." 
                        : "Clique para enviar pulsos de energia. Arraste para explorar a estrutura."}
                </div>
            </div>

            {/* UI: Controls */}
            <div className="absolute top-6 right-6 p-6 w-64 rounded-3xl border border-white/10 backdrop-blur-xl bg-gradient-to-br from-white/5 to-white/0 shadow-2xl flex flex-col gap-4 transition-opacity duration-300 opacity-90 group-hover:opacity-100">
                {/* Theme Selector */}
                <div>
                    <div className="text-xs uppercase tracking-widest text-white/50 font-bold mb-3">Crystal Theme</div>
                    <div className="grid grid-cols-3 gap-3 justify-items-center">
                        {[0, 1, 2].map((idx) => (
                            <button
                                key={idx}
                                onClick={() => setActivePaletteIndex(idx)}
                                className={`w-10 h-10 rounded-full transition-all duration-300 relative shadow-lg
                                    ${idx === 0 ? 'bg-gradient-radial from-violet-400 to-violet-900' : ''}
                                    ${idx === 1 ? 'bg-gradient-radial from-rose-400 to-rose-900' : ''}
                                    ${idx === 2 ? 'bg-gradient-radial from-sky-400 to-sky-900' : ''}
                                    ${activePaletteIndex === idx ? 'ring-2 ring-white scale-110' : 'hover:scale-110 hover:-translate-y-1'}
                                `}
                            />
                        ))}
                    </div>
                </div>

                {/* Density Control */}
                <div>
                    <div className="flex justify-between text-xs text-white/50 font-light mb-2">
                        <span>Densidade</span>
                        <span className="text-white font-medium">{Math.round(densityFactor * 100)}%</span>
                    </div>
                    <input 
                        type="range" 
                        min="30" 
                        max="100" 
                        value={densityFactor * 100}
                        onChange={(e) => setDensityFactor(parseInt(e.target.value) / 100)}
                        className="w-full h-1.5 bg-white/10 rounded-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:shadow-[0_0_10px_rgba(255,255,255,0.5)]"
                    />
                </div>
            </div>

            {/* Bottom Actions */}
            <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-4 p-2 bg-black/20 backdrop-blur-md rounded-full border border-white/5">
                <button 
                    onClick={handleMorph}
                    className="px-6 py-2 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/30 text-white/80 hover:text-white text-xs font-bold uppercase tracking-wider transition-all hover:-translate-y-1 shadow-lg"
                >
                    Transformar
                </button>
                <button 
                    onClick={() => {
                        if (isCameraActive) {
                            stopCamera();
                        } else {
                            startCamera();
                        }
                    }}
                    className={`px-6 py-2 rounded-full border text-xs font-bold uppercase tracking-wider transition-all hover:-translate-y-1 shadow-lg flex items-center gap-2 ${
                        isCameraActive 
                        ? 'bg-red-500/20 hover:bg-red-500/30 border-red-500/50 text-red-200' 
                        : 'bg-white/5 hover:bg-white/10 border-white/10 hover:border-white/30 text-white/80 hover:text-white'
                    }`}
                >
                    {isCameraActive ? (
                        <>
                            <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>
                            Parar Câmera
                        </>
                    ) : (
                        'Interação Visual'
                    )}
                </button>
                <button 
                    onClick={() => setIsPaused(!isPaused)}
                    className="px-6 py-2 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/30 text-white/80 hover:text-white text-xs font-bold uppercase tracking-wider transition-all hover:-translate-y-1 shadow-lg"
                >
                    {isPaused ? 'Resumir' : 'Pausar'}
                </button>
            </div>
        </div>
    );
};

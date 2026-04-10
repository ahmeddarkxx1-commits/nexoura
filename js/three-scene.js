import * as THREE from 'https://unpkg.com/three@0.163.0/build/three.module.js';

export class AntigravityScene {
    constructor(containerId) {
        this.container = document.getElementById(containerId);
        if (!this.container) return;

        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
        
        this.mouse = { x: 0, y: 0 };
        this.targetRotation = { x: 0, y: 0 };
        
        console.log('Antigravity Scene: Optimized for eye-comfort');
        this.init();
    }

    init() {
        // Renderer setup
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        this.container.appendChild(this.renderer.domElement);

        this.camera.position.z = 5;

        // Particle System
        this.createParticles();

        // Listeners
        window.addEventListener('resize', () => this.onWindowResize());
        window.addEventListener('mousemove', (e) => this.onMouseMove(e));

        // Start Animation
        this.animate();
    }

    createParticles() {
        const count = 4000;
        const geometry = new THREE.BufferGeometry();
        const positions = new Float32Array(count * 3);
        const colors = new Float32Array(count * 3);
        const sizes = new Float32Array(count);

        // Google Prism Palette
        const prismColors = [
            '#4285F4', // Blue
            '#9b72f3', // Purple
            '#ea4335', // Red
            '#fbbc04', // Yellow
            '#34a853', // Green
            '#c026d3', // Fuchsia
        ];
        const colorPalette = prismColors.map(c => new THREE.Color(c));

        for (let i = 0; i < count; i++) {
            // Spherical volume distribution (not just shell)
            const radius = 6;
            const r = radius * Math.pow(Math.random(), 0.5); // Better volume density
            const theta = Math.random() * Math.PI * 2;
            const phi = Math.acos((Math.random() * 2) - 1);

            positions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
            positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
            positions[i * 3 + 2] = r * Math.cos(phi);

            // Color selection
            const color = colorPalette[Math.floor(Math.random() * colorPalette.length)];
            colors[i * 3] = color.r;
            colors[i * 3 + 1] = color.g;
            colors[i * 3 + 2] = color.b;

            sizes[i] = Math.random() * 2;
        }

        geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

        // Create a circular texture dynamically
        const canvas = document.createElement('canvas');
        canvas.width = 64;
        canvas.height = 64;
        const ctx = canvas.getContext('2d');
        const gradient = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
        gradient.addColorStop(0, 'rgba(255,255,255,1)');
        gradient.addColorStop(0.5, 'rgba(255,255,255,0.8)');
        gradient.addColorStop(1, 'rgba(255,255,255,0)');
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, 64, 64);
        const texture = new THREE.CanvasTexture(canvas);
        
        const material = new THREE.PointsMaterial({
            size: 0.04,
            vertexColors: true,
            transparent: true,
            opacity: 0.6,
            map: texture,
            alphaTest: 0.01, // Low alpha test for smooth disks
            sizeAttenuation: true,
            depthWrite: false, 
            blending: THREE.NormalBlending
        });

        this.particles = new THREE.Points(geometry, material);
        this.scene.add(this.particles);
        
        // Background layer (slower, larger, more subtle)
        const geometry2 = geometry.clone();
        const material2 = material.clone();
        material2.size = 0.03;
        material2.opacity = 0.15;
        this.particles2 = new THREE.Points(geometry2, material2);
        this.scene.add(this.particles2);
    }

    onMouseMove(event) {
        // Normalized coordinates (-1 to 1)
        this.mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
        this.mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
    }

    onWindowResize() {
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
    }

    animate() {
        requestAnimationFrame(() => this.animate());

        // Smoothly update target rotation based on mouse
        this.targetRotation.x += (this.mouse.y * 0.5 - this.targetRotation.x) * 0.05;
        this.targetRotation.y += (this.mouse.x * 0.5 - this.targetRotation.y) * 0.05;

        // Apply rotation to both systems with slightly different speeds for parallax
        this.particles.rotation.x = this.targetRotation.x;
        this.particles.rotation.y = this.targetRotation.y;
        
        this.particles2.rotation.x = -this.targetRotation.x * 0.5;
        this.particles2.rotation.y = -this.targetRotation.y * 0.5;

        // Constant slow idle rotation
        this.particles.rotation.y += 0.001;
        this.particles2.rotation.y -= 0.0005;

        this.renderer.render(this.scene, this.camera);
    }
}

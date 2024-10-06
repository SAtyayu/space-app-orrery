// Set up the scene, camera, renderer, and controls
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setClearColor(0x222222); // Brighter background color
document.getElementById('solar-system').appendChild(renderer.domElement);

const controls = new THREE.OrbitControls(camera, renderer.domElement);
controls.enableZoom = true;

// Create light for the scene (Sunlight)
const light = new THREE.PointLight(0xffffff, 5, 100); // Increased intensity for brightness
light.position.set(0, 0, 0);
scene.add(light);

// Ambient light to ensure visibility in the scene
const ambientLight = new THREE.AmbientLight(0x404040, 0.8); // Increased intensity for ambient light
scene.add(ambientLight);

// Function to show the quiz modal
function showQuizModal(planetName, quizQuestion) {
    document.getElementById('quiz-title').innerText = planetName;
    document.getElementById('quiz-question').innerText = quizQuestion;
    document.getElementById('quiz-modal').style.display = 'block';
}

// Function to hide the quiz modal
function hideQuizModal() {
    document.getElementById('quiz-modal').style.display = 'none';
}

// Create a planet with a texture and hover events for the modal
function createPlanet(radius, textureURL, positionX, name, quizQuestion) {
    const geometry = new THREE.SphereGeometry(radius, 32, 32);
    
    // Load texture
    const textureLoader = new THREE.TextureLoader();
    const texture = textureLoader.load(textureURL);
    
    const material = new THREE.MeshPhongMaterial({
        map: texture,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 1
    });
    
    const planet = new THREE.Mesh(geometry, material);
    planet.position.x = positionX;

    // Add user data to the planet for later use
    planet.userData = { name: name, quizQuestion: quizQuestion };

    scene.add(planet);
    return planet;
}

// Adjust the mouse handling for hover effect
window.addEventListener('mousemove', (event) => {
    // Convert mouse position to normalized device coordinates
    const mouse = new THREE.Vector2();
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

    // Use raycaster to detect intersections
    const raycaster = new THREE.Raycaster();
    raycaster.setFromCamera(mouse, camera);
    
    const intersects = raycaster.intersectObjects(scene.children);
    
    // Hide the modal if not hovering over any planet
    if (intersects.length > 0) {
        const hoveredObject = intersects[0].object;
        if (hoveredObject.userData.name) {
            showQuizModal(hoveredObject.userData.name, hoveredObject.userData.quizQuestion);
        }
    } else {
        hideQuizModal();
    }
});

// Close quiz modal on button click
document.getElementById('close-quiz').onclick = hideQuizModal;

// Create the Sun and planets with updated textures
const sun = createPlanet(2, 
    'https://upload.wikimedia.org/wikipedia/commons/c/cf/Christmas_Eve_Sun_%2831460091150%29.png', 
    0, 'Sun', 'What is the main component of the Sun?');

const mercury = createPlanet(0.4, 
    'https://upload.wikimedia.org/wikipedia/commons/3/3f/Mercury_Globe-MESSENGER_mosaic_centered_at_0degN-0degE.jpg', 
    5, 'Mercury', 'What is the closest planet to the Sun?');  

const venus = createPlanet(0.9, 
    'https://upload.wikimedia.org/wikipedia/commons/4/4b/Ultraviolet-light-Venus-spacecraft-Pioneer-Orbiter-bands-Feb-26-1979.webp', 
    8, 'Venus', 'What is the hottest planet in our solar system?');      

const earth = createPlanet(1, 
    'https://upload.wikimedia.org/wikipedia/commons/5/5b/The_Blue_Marble_%285052124705%29.jpg', 
    12, 'Earth', 'What is the only planet known to support life?');       

const mars = createPlanet(0.7, 
    'https://upload.wikimedia.org/wikipedia/commons/0/02/OSIRIS_Mars_true_color.jpg', 
    16, 'Mars', 'What is the red planet?');       

const jupiter = createPlanet(1.8, 
    'https://upload.wikimedia.org/wikipedia/commons/e/e2/Jupiter.jpg', 
    22, 'Jupiter', 'Which planet is the largest in our solar system?'); 

const saturn = createPlanet(1.6, 
    'https://upload.wikimedia.org/wikipedia/commons/d/d4/Saturn_in_natural_colors_%28captured_by_the_Hubble_Space_Telescope%29.jpg', 
    28, 'Saturn', 'What planet is famous for its rings?');   

const uranus = createPlanet(1.2, 
    'https://upload.wikimedia.org/wikipedia/commons/2/2c/Uranus_-_Voyager_2.jpg', 
    34, 'Uranus', 'Which planet rotates on its side?');   

const neptune = createPlanet(1.2, 
    'https://upload.wikimedia.org/wikipedia/commons/5/56/Neptune_Full.jpg', 
    40, 'Neptune', 'What is the furthest planet from the Sun?'); 

// Create orbits for the planets
function createOrbit(radius) {
    const geometry = new THREE.RingGeometry(radius, radius + 0.05, 64); // Increased thickness
    const material = new THREE.MeshBasicMaterial({ color: 0xFFFFFF, side: THREE.DoubleSide, opacity: 0.5, transparent: true });
    const orbit = new THREE.Mesh(geometry, material);
    orbit.rotation.x = Math.PI / 2; // Rotate ring to be horizontal
    scene.add(orbit);
    return orbit;
}

// Create orbits for each planet
createOrbit(5);
createOrbit(8);
createOrbit(12);
createOrbit(16);
createOrbit(22);
createOrbit(28);
createOrbit(34);
createOrbit(40);

// Set the camera position
camera.position.z = 50;
camera.position.y = 20;

// Planet orbital and rotational speeds
const orbitSpeeds = {
    mercury: 0.001,
    venus: 0.0008,
    earth: 0.0006,
    mars: 0.0005,
    jupiter: 0.0004,
    saturn: 0.0003,
    uranus: 0.0002,
    neptune: 0.00015,
};

const rotationSpeed = 0.005;

// Animation loop for rotation and orbit
function animate() {
    requestAnimationFrame(animate);

    // Update rotation and orbit for each planet
    mercury.rotation.y += rotationSpeed;
    mercury.position.x = 5 * Math.cos(Date.now() * orbitSpeeds.mercury);
    mercury.position.z = 5 * Math.sin(Date.now() * orbitSpeeds.mercury);

    venus.rotation.y += rotationSpeed;
    venus.position.x = 8 * Math.cos(Date.now() * orbitSpeeds.venus);
    venus.position.z = 8 * Math.sin(Date.now() * orbitSpeeds.venus);

    earth.rotation.y += rotationSpeed;
    earth.position.x = 12 * Math.cos(Date.now() * orbitSpeeds.earth);
    earth.position.z = 12 * Math.sin(Date.now() * orbitSpeeds.earth);

    mars.rotation.y += rotationSpeed;
    mars.position.x = 16 * Math.cos(Date.now() * orbitSpeeds.mars);
    mars.position.z = 16 * Math.sin(Date.now() * orbitSpeeds.mars);

    jupiter.rotation.y += rotationSpeed;
    jupiter.position.x = 22 * Math.cos(Date.now() * orbitSpeeds.jupiter);
    jupiter.position.z = 22 * Math.sin(Date.now() * orbitSpeeds.jupiter);

    saturn.rotation.y += rotationSpeed;
    saturn.position.x = 28 * Math.cos(Date.now() * orbitSpeeds.saturn);
    saturn.position.z = 28 * Math.sin(Date.now() * orbitSpeeds.saturn);

    uranus.rotation.y += rotationSpeed;
    uranus.position.x = 34 * Math.cos(Date.now() * orbitSpeeds.uranus);
    uranus.position.z = 34 * Math.sin(Date.now() * orbitSpeeds.uranus);

    neptune.rotation.y += rotationSpeed;
    neptune.position.x = 40 * Math.cos(Date.now() * orbitSpeeds.neptune);
    neptune.position.z = 40 * Math.sin(Date.now() * orbitSpeeds.neptune);

    // Render the scene
    renderer.render(scene, camera);
}

animate();

// Handle window resize
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});


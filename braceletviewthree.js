// declare constants
const BEAD_RADIUS = 0.1;
const ISOMET_ANGLE = (Math.PI/8)*1.75;
const ISOMET_X = 0;
const ISOMET_Y = -1.75;
const ISOMET_Z = 2;

// declare variables used by three.js
let camera, scene, renderer, loader;

// declare variables for interaction
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();
let selectedMesh;
let displayBead;

// Width and height are currently dependent on window size.
// This should not be the case in the future.
const WIDTH = window.innerWidth - 50;
const HEIGHT = window.innerHeight - 50;

// angle offset for rotation animation
let angleOffset = 0;


loader = new THREE.TextureLoader()

// load ui textures
const rightArrowTexture = loader.load("Assets/selectorArrowRight.png");
const leftArrowTexture = loader.load("Assets/selectorArrowLeft.png");

const BEADS = [
  //stone
  function (){
    mat = new THREE.MeshStandardMaterial( { 
      color: 0xE0E0E0, 
      roughness: 0.35,
      metalness: 0.25 } );
      
    mat.userData.num = 1;
    
    return mat;    
  },
  //obsidian
  function (){
    
    mat = new THREE.MeshStandardMaterial( { 
      color: 0x000000, 
      roughness: 0.35, 
      metalness: 0.25 } )
    
    mat.userData.name = "obsidian";
    return mat;
  },
  //marble
  function(){
    let tex
    switch(Math.floor(Math.random() * Math.floor(3))){
      case 0:
      tex = loader.load("textures/marble1.png");
      break;
      case 1:
      tex = loader.load("textures/marble2.png");
      break;
      case 2:
      tex = loader.load("textures/marble3.png");
      break;
    }
    
    mat = new THREE.MeshStandardMaterial( { map:tex, roughness: 0, metalness: 0.15})
    
    mat.userData.num = 3;
    
    return mat; 
    },
  //tigerseye
  function (){
    let tex
    switch(Math.floor(Math.random() * Math.floor(3))){
      case 0:
      tex = loader.load("textures/catseye1.png");
      break;
      case 1:
      tex = loader.load("textures/catseye2.png");
      break;
      case 2:
      tex = loader.load("textures/catseye3.png");
      break;
    }
    
    mat = new THREE.MeshStandardMaterial( { map:tex, roughness: 0.2, metalness: 0.1})
    mat.userData.num = 4;
    return mat;
    },
]

// set up bead 
const MAX_BEADS = 24

function getTestBeads() {
  beads = []
  for (i=0; i<6; i++) {
    beads.push(BEADS[0]());
    beads.push(BEADS[1]());
    beads.push(BEADS[2]());
    beads.push(BEADS[3]());
  }
  return beads;
}


init();
animate();

function init() {

	const ASPECT_RATIO = WIDTH/HEIGHT;

  // create bead meshes
  beadMeshes = []
  beadData = getTestBeads()
  const geometrySphere = new THREE.SphereBufferGeometry( BEAD_RADIUS, 32, 32 );
  for (i=0; i<beadData.length; i++) {
          mesh = new THREE.Mesh(geometrySphere, beadData[i]);

          mesh.rotation.x = Math.random()*Math.PI*2
          mesh.rotation.y = Math.random()*Math.PI*2
          mesh.rotation.z = Math.random()*Math.PI*2
          mesh.position.z = 0;
          mesh.castShadow = true;
          mesh.receiveShadow = true;
          beadMeshes.push(mesh)
  }

	camera = new THREE.PerspectiveCamera( 45, ASPECT_RATIO, 1, 100 )

  camera.position.z = ISOMET_Z;
  camera.position.y = ISOMET_Y;
  camera.rotation.x = ISOMET_ANGLE;

	scene = new THREE.Scene();

	scene.add( new THREE.AmbientLight( 0x222244 ) );


	const light = new THREE.DirectionalLight();
	light.position.set( 0.5, 0.5 ,10 );
	light.castShadow = true;
  light.shadow.mapSize.width = 3000
  light.shadow.mapSize.height = 3000
	light.shadow.camera.zoom = 4; // tighter shadow map
	scene.add( light );

	const geometryBackground = new THREE.PlaneBufferGeometry( 200, 200 );
	const materialBackground = new THREE.MeshPhongMaterial( { color: 0xFFFFFF } );

	const background = new THREE.Mesh( geometryBackground, materialBackground );
  background.receiveShadow = true;
  background.frustumCulled = false;
	background.position.set( 0, 0, -0.2 );
  background.name = "bg"
	scene.add( background );


  for (mesh of beadMeshes) scene.add(mesh);

	renderer = new THREE.WebGLRenderer( {antialias: true} );
	renderer.setPixelRatio( window.devicePixelRatio );
	renderer.setSize( WIDTH, HEIGHT );
	renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap
	document.body.appendChild( renderer.domElement );
}

function draw_selector_ui() {

  // Arrows for selector buttons
  const rightArrowPlaneGeometry = new THREE.PlaneGeometry(0.2, 0.2);
  const rightArrowPlaneMaterial = new THREE.MeshBasicMaterial({ map: rightArrowTexture });
  const rightArrowPlane = new THREE.Mesh(rightArrowPlaneGeometry, rightArrowPlaneMaterial);
  rightArrowPlane.rotation.x = Math.PI/3;
  rightArrowPlane.position.x += .2;
  rightArrowPlane.name = "rightArrow";

  const leftArrowPlaneGeometry = new THREE.PlaneGeometry(0.2, 0.2);
  const leftArrowPlaneMaterial = new THREE.MeshBasicMaterial({ map: leftArrowTexture });
  const leftArrowPlane = new THREE.Mesh(leftArrowPlaneGeometry, leftArrowPlaneMaterial);
  leftArrowPlane.rotation.x = Math.PI/3;
  leftArrowPlane.position.x -= .2;
  leftArrowPlane.name = "leftArrow";

  scene.add(rightArrowPlane);
  scene.add(leftArrowPlane);

  const geometrySphere = new THREE.SphereBufferGeometry( BEAD_RADIUS, 32, 32 );
  displayBead = new THREE.Mesh(geometrySphere, BEADS[0]());
  displayBead.name = "displayBead";
  scene.add(displayBead);


}

function animate() {


  angleOffset += 0.0005;
  if(angleOffset >= 2*Math.PI) angleOffset-=Math.PI*2;

  for (i=0; i<beadMeshes.length; i++) {
    let circleRadius = (beadData.length*BEAD_RADIUS*2)/(2*Math.PI);
    let angle = (i/beadData.length)*(Math.PI*2)+angleOffset;

    beadMeshes[i].position.x = circleRadius*Math.cos(angle);
    beadMeshes[i].position.y = circleRadius*Math.sin(angle);
    // uncomment to enable bouncing beads
    //beadMeshes[i].position.z = 0.1*Math.sin(angle*81)+0.05;
  }
  
  camera.rotation.y = (mouse.x/40);
  // below looks like shit, just try uncommenting it
  // camera.rotation.x = ISOMET_ANGLE - (mouse.y/40);
  camera.position.x = ISOMET_X + (mouse.x/10)
  camera.position.y = ISOMET_Y + (mouse.y/40)

	renderer.render( scene, camera );

	requestAnimationFrame( animate );

}

function onMouseMove(event) {
  mouse.x = (event.clientX/WIDTH)*2-1;
  mouse.y = -(event.clientY/HEIGHT)*2+1;
}

function onMouseClick(event) {

  raycaster.setFromCamera(mouse, camera);
  const intersects = raycaster.intersectObjects(scene.children);
  if ( intersects.length > 0 ) {
    
    switch (intersects[ 0 ].object.name) {
      case 'leftArrow':
        break;

      case 'rightArrow':
        break;

      case 'bg':
        break;

      case 'displayBead':
        break;

      default:
        if ( selectedMesh != undefined ) {
          selectedMesh.object.material.emissive.setHex( selectedMesh.previousHex );
        } else {
          
          draw_selector_ui();
        }

        selectedMesh = intersects[ 0 ];
        selectedMesh.previousHex = selectedMesh.object.material.emissive.getHex();

			  selectedMesh.object.material.emissive.setHex( 0x451245 );

        break;
    }
	}
}

window.addEventListener('mousemove', onMouseMove, false);
window.addEventListener('click', onMouseClick, false);
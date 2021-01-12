let camera, scene, renderer;
let mesh;
const BEADS = {
  stone: 0xE0E0E0,
  obsidian: 0x000000,
  marble: 0xFAFAFA,
  tigerseye: 0xFF0000
}
const MAX_BEADS = 24

let angle = 0;

function getTestBeads() {
  beads = []
  for (i=0; i<8; i++) {
    beads.push(BEADS.stone)
    beads.push(BEADS.obsidian)
    beads.push(BEADS.tigerseye)
  }
  return beads
}

beadMeshes = []
beadData = getTestBeads()
const geometrySphere = new THREE.SphereBufferGeometry( 2.5, 32, 32 );
const materialSphere = new THREE.MeshBasicMaterial( { color: 0xE0E0E0 } );
for (i=0; i<beadData.length; i++) {
        mesh = new THREE.Mesh(geometrySphere, new THREE.MeshBasicMaterial( { color: beadData[i] }));

        let circleRadius = (beadData.length*5)/(2*Math.PI);
        let angleInRads = (i/beadData.length)*(Math.PI*2);
        let partialX = Math.round((Math.cos(angleInRads) + Number.EPSILON)*100)/100;
        let partialY = Math.round((Math.sin(angleInRads) + Number.EPSILON)*100)/100;
        mesh.position.x = circleRadius*partialX;
        mesh.position.y = circleRadius*partialY;
        mesh.position.z = -70;
        mesh.castShadow = true;
        mesh.receiveShadow = true;
        beadMeshes.push(mesh)
}

init();
animate();

function init() {

	const ASPECT_RATIO = window.innerWidth / window.innerHeight;

	camera = new THREE.PerspectiveCamera( 45, ASPECT_RATIO, 1, 100 )

  camera.position.z = 0;
  camera.position.y = -35;
  camera.rotation.x = (Math.PI/8)*1.25;

	scene = new THREE.Scene();

	scene.add( new THREE.AmbientLight( 0x222244 ) );

	const light = new THREE.DirectionalLight();
	light.position.set( 1, 1, 1 );
	light.castShadow = true;
	light.shadow.camera.zoom = 4; // tighter shadow map
	scene.add( light );

	const geometryBackground = new THREE.PlaneBufferGeometry( 200000000, 200000000 );
	const materialBackground = new THREE.MeshBasicMaterial( { color: 0xFFFFFF } );

	const background = new THREE.Mesh( geometryBackground, materialBackground );
  background.receiveShadow = true;
	background.position.set( 0, 0, -75 );
	scene.add( background );


  for (i=0; i<beadMeshes.length; i++) {
        scene.add(beadMeshes[i])
  }

	renderer = new THREE.WebGLRenderer();
	renderer.setPixelRatio( window.devicePixelRatio );
	renderer.setSize( window.innerWidth, window.innerHeight );
	renderer.shadowMap.enabled = true;
	document.body.appendChild( renderer.domElement );

	window.addEventListener( 'resize', onWindowResize, false );

  //const interaction = new Interaction(renderer, scene, camera);

}

function onWindowResize() {

	const ASPECT_RATIO = window.innerWidth / window.innerHeight;
	const WIDTH = ( window.innerWidth / AMOUNT ) * window.devicePixelRatio;
	const HEIGHT = ( window.innerHeight / AMOUNT ) * window.devicePixelRatio;

	camera.aspect = ASPECT_RATIO;
	camera.updateProjectionMatrix();

	for ( let y = 0; y < AMOUNT; y ++ ) {

		for ( let x = 0; x < AMOUNT; x ++ ) {

			const subcamera = camera.cameras[ AMOUNT * y + x ];

			subcamera.viewport.set(
				Math.floor( x * WIDTH ),
				Math.floor( y * HEIGHT ),
				Math.ceil( WIDTH ),
				Math.ceil( HEIGHT ) );

			subcamera.aspect = ASPECT_RATIO;
			subcamera.updateProjectionMatrix();

		}

	}

	renderer.setSize( window.innerWidth, window.innerHeight );

}

function animate() {

  angle += 0.0002;
  if(angle >= 2*Math.PI) angle-=Math.PI*2;

  for (i=0; i<beadMeshes.length; i++) {
    let circleRadius = (beadData.length*5)/(2*Math.PI);
    let angleInRads = (i/beadData.length)*(Math.PI*2)+angle;
    let partialX = Math.cos(angleInRads);
    let partialY = Math.sin(angleInRads);
    beadMeshes[i].position.x = circleRadius*partialX;
    beadMeshes[i].position.y = circleRadius*partialY;
    beadMeshes[i].position.z = -70;
  }

	renderer.render( scene, camera );

	requestAnimationFrame( animate );

}
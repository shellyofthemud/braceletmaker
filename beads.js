class Bead {
  geometrySphere = new THREE.SphereBufferGeometry( 2.5, 32, 32 );
  materialSphere = new THREE.MeshBasicMaterial( { color: 0xE0E0E0 } );

  constructor(material) {
    this.material = material;
    this.selected = false;

    this.mesh = new THREE.Mesh(geometrySphere, new THREE.MeshPhongMaterial( { color: material] }));
    
    mesh.castShadow = true;
    mesh.receiveShadow = true;
  }

  setPosition(numBeads, angle) {
    let circleRadius = (numBeads*5)/(2*Math.PI)
    let angleInRads = angle*Math.PI*2;
    let partialX = Math.cos(angleInRads);
    let partialY = Math.sin(angleInRads);
    this.mesh.position.x = circleRadius*partialX;
    this.mesh.position.y = circleRadius*partialY
    this.mesh.position.z = -70;
  }

  get mesh() {
    return this.mesh;
  } 

}
class Bead {
  geometrySphere = new THREE.SphereBufferGeometry( 0.1, 32, 32 );

  constructor(materialIndex) {
    let mesh = new THREE.Mesh(this.geometrySphere, BEADS[materialIndex]());
    
    mesh.rotation.x = Math.random()*Math.PI*2
    mesh.rotation.y = Math.random()*Math.PI*2
    mesh.rotation.z = Math.random()*Math.PI*2
    mesh.castShadow = true;
    mesh.receiveShadow = true;

    this.mesh = mesh;
  }

  setPosition(posX, posY) {
    this.mesh.position.x = posX;
    this.mesh.position.y = posY;
    this.mesh.position.z = 0;
  }

}

const BEADS = [
  //stone
  function (){
    mat = new THREE.MeshStandardMaterial( { 
      color: 0xE0E0E0, 
      roughness: 0.35,
      metalness: 0.25,
      });

    mat.userData = {
      num: 1,
      name: "stone"
    }

    return mat;    
  },
  //obsidian
  function (){
    
    mat = new THREE.MeshStandardMaterial( { 
      color: 0x000000, 
      roughness: 0.35, 
      metalness: 0.25,
      });
    
    mat.userData = {
      num: 2,
      name: "obsidian"
    }
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
    
    mat = new THREE.MeshStandardMaterial( { 
      map: tex,
      roughness: 0,
      metalness: 0.15,
      });
    
    mat.userData = {
      num: 3,
      name: "marble"
    }

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
    
    mat = new THREE.MeshStandardMaterial({
      map: tex,
      roughness: 0.2,
      metalness: 0.1});
      
    mat.userData = {
      num: 4,
      name: "tigerseye"
    }
    return mat;
    },
]


//Make global vars
let scene, camera, renderer, sphere, raycaster, intersects, INTERSECTED, normal;

let origin = new THREE.Vector3(10,0,0) //Ray origin
let origin2 = new THREE.Vector3(10,0,0); //testin
let dir = new THREE.Vector3(-1,0,0).normalize(); //Ray direction
let uVect = new THREE.Vector3().normalize(); //Ray direction unit vector
let axis = new THREE.Vector3(0,0,1).normalize(); //Rotating around z

// Pixel array
let startNo = -1.5;
let endNo = 1.5;
let step = 0.5;
let zRange = range(startNo, endNo, step);
let yRange = range(startNo, endNo, step);
let angle = 0; //Deg
let a = angle*Math.PI/180; // Angle from degree to rads
let centre = new THREE.Vector3(0,0,0);

//Define cannonball properties
let radIn = 1; //m - rad for cannonball
let m = 1; //kg - mass of cannonball
let v = 0.7; // Reflectivity
let u = 0.4; //Specularity

// initialise data aquisition arrays
let hitPointZ = [];
let hitPointX = [];
let hitPointy = [];
let fMag = []; //Force magnitude
let fDir = new THREE.Vector3(); //Force direction



init();
animate();

function init() {
    container = document.createElement( 'div' );
    document.body.appendChild( container );

    // Go on three docs to find how 2 use func
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

    scene = new THREE.Scene();
    scene.background = new THREE.Color( 0xf0f0f0 );

    //Add light
    const light = new THREE.DirectionalLight( 0xffffff, 1 );
    light.position.set( 100, 100, 100 ).normalize();
    scene.add( light );

    const geometry = new THREE.SphereGeometry( radIn, 32, 32 );

    const material = new THREE.MeshPhongMaterial({
        color: 0xFFC300 ,    // Ball colour - orangy/yellow
        flatShading: false,
      });
    sphere = new THREE.Mesh( geometry, material );
    sphere.updateMatrixWorld();
    scene.add( sphere );

    raycaster = new THREE.Raycaster();

    renderer = new THREE.WebGLRenderer({ antialias: true});
    renderer.setPixelRatio( window.devicePixelRatio );
    renderer.setSize(window.innerWidth, window.innerHeight);
    container.appendChild( renderer.domElement );

    // Camera originates at same point as box geo - have to move add x change to stop intercepting
    camera.position.z = 15;


    // axis red-x, green-Y, blue-z
    // const axesHelper = new THREE.AxesHelper( 5 );
    // scene.add( axesHelper );

    window.addEventListener('resize', onWindowResize, false);

    Raycast();
}

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    
    renderer.setSize(window.innerWidth, window.innerHeight);
}


function animate() {

    requestAnimationFrame( animate );

    render();

}

function range(start, end, step) {
    const len = Math.floor((end - start) / step) + 1
    return Array(len).fill().map((_, idx) => start + (idx * step))
}

function render() {

    renderer.render( scene, camera );

}

// function rotate(deg) {
//     _initTranslation = new THREE.Vector3();
//     _initRotation = new THREE.Quaternion();
//     _initScale = new THREE.Vector3();
    
//     let x_axis = new THREE.Vector3(1, 0, 0);
//     let axis = new THREE.Vector3(0.4, 0, 0.9);

//     // cube

//     cube.matrix.decompose(_initTranslation, _initRotation, _initScale);
    
//     let q_align = new THREE.Quaternion().setFromUnitVectors(x_axis, axis.normalize());
//     let q_rotate = new THREE.Quaternion().setFromAxisAngle(x_axis, THREE.Math.degToRad(deg));
//     let q_final = q_align.clone().multiply(q_rotate);
    
//     cube.matrix.compose(_initTranslation, q_final, _initScale);
//     cube.matrixAutoUpdate = false;
//     cube.matrixWorldNeedsUpdate = true;

//     // cube2

//     cube2.matrix.decompose(_initTranslation, _initRotation, _initScale);
    
//     q = new THREE.Quaternion().setFromAxisAngle(axis.normalize(), THREE.Math.degToRad(deg));
    
//     cube2.matrix.compose(_initTranslation, q, _initScale);
//     cube2.matrixAutoUpdate = false;
//     cube2.matrixWorldNeedsUpdate = true;
// }

function Raycast() {

    let 

    n=0;

    for (zRange[n]; n < zRange.length ; n++) {

        m=0;
        origin.z = zRange[n];

        for(yRange[m]; m < yRange.length ; m++) {
            origin.y = yRange[m];

            origin.applyAxisAngle(centre.normalize(), a);
            console.log(origin);

            rad = Math.PI;
            origin2.rotateOnAxis(axis,rad);

            raycaster.ray.set( origin2, dir.normalize() );
            scene.add( new THREE.ArrowHelper(raycaster.ray.direction, raycaster.ray.origin,3,0xff0000));

            const intersects = raycaster.intersectObjects(scene.children, true);
            // console.log(intersects[0]

            if ( intersects.length > 0 && intersects[0].face !== null) {

                console.log('array length', intersects);

                INTERSECTED = intersects[ 0 ].object;          
                INTERSECTED.currentHex = INTERSECTED.material.color.getHex();
                INTERSECTED.material.color.setHex( 0xff00070 );
                
                if ( INTERSECTED ) sphere.material.color.setHex( INTERSECTED.currentHex );

                console.log(intersects);

                // SRP calculation
                const {0: {distance}} = intersects;
                let W = 1368; //W/m2 - solar const 
                let c = 2.998*Math.pow(10,8); //Speed of light - UPDATE TO MORE ACCURATE
                const Area = step*step; //array spacing

                // console.log(radIn);

                let fSRP = ((W*Area)/c)*((1+(4/9)*v)-((4/9)*v*u)); //Force ignoring reflection and direction - UPDATEmen

                fMag.push(fSRP); //Add force magnitude to an array

                const norm = intersects[0].face.normal;

                currentForceDir = new THREE.Vector3(norm.x, norm.y, norm.z);

                // console.log(fSRP);
                console.log(fSRP);
                console.log('We have contact');
                console.log(origin);

                hitPointX.push(origin.y);
                hitPointZ.push(origin.z);

                fDir = fDir.add(currentForceDir);
                console.log(fDir);

            } else {

                if ( INTERSECTED ) INTERSECTED.material.color.setHex( INTERSECTED.currentHex );

                INTERSECTED = null;

                console.log('Oh no - i cant hit that!')
            }
        
        }
    }

    console.log(
        fMag.reduce((a, b) => a + b, 0)
    )
      console.log(
        [].reduce((a, b) => a + b, 0)
    )

    fDir2 = fDir.multiplyScalar(-1);
    console.log(fDir,fDir2);

    scene.add( new THREE.ArrowHelper(fDir, new THREE.Vector3(0,0,0),3,0x0330e7));
    
    window.alert(hitPointX);
    window.alert(hitPointZ);
}

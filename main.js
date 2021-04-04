//Make global vars
let scene, camera, renderer, sphere, raycaster, intersects, INTERSECTED, normal, plane;

let origin = new THREE.Vector3(0,0,0); //Ray origin
let dir = new THREE.Vector3(0,0,-1).normalize(); //Ray direction
let axis = new THREE.Vector3(1,0,0).normalize(); //Rotating around z

// Pixel array
let startNo = -1.5;
let endNo = 1.5;
let step = 0.03;
let xRange = range(startNo, endNo, step);
let yRange = range(startNo, endNo, step);
let angle = 45; //Deg
let a = angle*(Math.PI)/180; // Angle from degree to rads

//Define cannonball properties
let radIn = 1; //m - rad for cannonball
let m = 1; //kg - mass of cannonball
let v = 0.7; // Reflectivity
let u = 0.4; //Specularity

// initialise data aquisition arrays
let hitPointZ = [];
let hitPointX = [];
let hitPointY = [];
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

    plane = new THREE.Plane( new THREE.Vector3( 0, 0, -1 ), 10 );
    const rotation = new THREE.Matrix4().makeRotationAxis(axis, a);
    const optionalNormalMatrix = new THREE.Matrix3().getNormalMatrix( rotation );
    plane.applyMatrix4(rotation);
    const helper = new THREE.PlaneHelper( plane, 1, 0xffff00 );
    scene.add( helper );


    console.log('Normal', plane.normal.normalize())

    plane2 = new THREE.Plane(new THREE.Vector3(0,0))
    plane2.applyMatrix4(rotation);

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
    // camera.position.y = -5;


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


function Raycast() {

    let 

    n=0;

    for (xRange[n]; n < xRange.length ; n++) {

        m=0;
        origin.x = xRange[n];

        for(yRange[m]; m < yRange.length ; m++) {
            origin.y = yRange[m];

            origin2 = plane.projectPoint(origin, axis);

            dir2 = plane.normal

            console.log(origin2);

            console.log(dir2)

            raycaster.ray.set( origin2, dir2);
            scene.add( new THREE.ArrowHelper(raycaster.ray.direction, raycaster.ray.origin,3,0xff0000));

            const intersects = raycaster.intersectObject(sphere, true);


            if ( intersects.length > 0 && intersects[0].face !== null) {

                console.log('array length', intersects);

                INTERSECTED = intersects[ 0 ].object;          
                INTERSECTED.currentHex = INTERSECTED.material.color.getHex();
                INTERSECTED.material.color.setHex( 0xff00070 );
                
                if ( INTERSECTED ) sphere.material.color.setHex( INTERSECTED.currentHex );

                console.log(intersects);

                // SRP calculation
                let W = 1368; //W/m2 - solar const 
                let c = 2.998*Math.pow(10,8); //Speed of light - UPDATE TO MORE ACCURATE
                const Area = step*step; //array spacing

                let fSRP = ((W*Area)/c)*((1+(4/9)*v)-((4/9)*v*u)); //Force ignoring reflection and direction - UPDATEmen

                fMag.push(fSRP); //Add force magnitude to an array

                const norm = intersects[0].face.normal;

                const currentForceDir = new THREE.Vector3(norm.x, norm.y, norm.z);

                console.log(fSRP);
                console.log('We have contact');
                console.log(origin2);

                hitPointX.push(origin2.x);
                hitPointY.push(origin2.y);
                hitPointZ.push(origin2.z);
            

                fDir = fDir.add(currentForceDir);
                console.log(fDir);

            } else {

                if ( INTERSECTED ) INTERSECTED.material.color.setHex( INTERSECTED.currentHex );

                INTERSECTED = null;

                console.log('Oh no - i cant hit that!')
            }
        
        }
    }


    const fSRP = fMag.reduce((partial_sum, b) => partial_sum + b,0); 
    console.log(fSRP); // 6

    // console.log(
    //     fMag.reduce((a, b) => a + b, 0)
    // )
    //   console.log(
    //     [].reduce((a, b) => a + b, 0)
    // )

    aMag = (fSRP)/1; // Acceleration (m2/s), F=ma

    fDir.multiplyScalar(-1).normalize();
    console.log(fDir,aMag);

    //Angles between force vector and x, y and z axis
    angleX = fDir.angleTo(new THREE.Vector3(1,0,0));
    angleY = fDir.angleTo(new THREE.Vector3(0,1,0));
    angleZ = fDir.angleTo(new THREE.Vector3(0,0,1));

    console.log(angleX, angleY, angleZ);

    //Resulting force acting in the x, y, z axis
    aMagX = aMag*Math.cos(angleX);
    aMagY = aMag*Math.cos(angleY);
    aMagZ = aMag*Math.cos(angleZ);

    console.log('Accel: ',aMagX,aMagY,aMagZ);

    scene.add(new THREE.ArrowHelper(fDir, new THREE.Vector3(0,0,0),3,0x0330e7));

    // Split the fDir into x,y,z components

    
    // window.alert(hitPointX);
    // window.alert(hitPointY);
    // window.alert(hitPointZ);

    console.log('Angle: ', angle);

    window.alert(aMagX);
    window.alert(aMagY);
    window.alert(aMagZ);

}

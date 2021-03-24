//Make global vars
let scene, camera, renderer, sphere, raycaster, intersects, INTERSECTED, distance;

let origin = new THREE.Vector3(10,0,0); //Ray origin
let dir = new THREE.Vector3(-150,0,0); //Ray direction
let u = new THREE.Vector3(); //Ray direction unit vector

// Pixel array
let startNo = -3;
let endNo = 3;
let step = 0.1;
let zRange = range(startNo, endNo, step);
let yRange = range(startNo, endNo, step);
let radIn = 1.1; //m - rad for cannonball
let hitPointY = [];
let hitPointZ = [];



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
        color: 0xFFFF00,    // red (can also use a CSS color string here)
        flatShading: false,
      });
    sphere = new THREE.Mesh( geometry, material );
    sphere.position.z = 0.5;
    sphere.position.y = 0.5;
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

function transform( yaw,  ) {
    // Rotates frame round the z axis (yaw)

}

// function extractValue(arr, prop) {

//     // extract value from property
//     let extractedValue = arr.map(item => item[prop]);

//     return extractedValue;

// }

// function exportToCsv(Results) {
//     var CsvString = "";
//     Results.forEach(function(RowItem, RowIndex) {
//       RowItem.forEach(function(ColItem, ColIndex) {
//         CsvString += ColItem + ',';
//       });
//       CsvString += "\r\n";
//     });
//     CsvString = "data:application/csv," + encodeURIComponent(CsvString);
//    var x = document.createElement("A");
//    x.setAttribute("href", CsvString );
//    x.setAttribute("download","somedata.csv");
//    document.body.appendChild(x);
//   }
  

function Raycast() {

    let 

    n=0;

    for (zRange[n]; n < zRange.length ; n++) {

        m=0;
        origin.z = zRange[n];

        for(yRange[m]; m < yRange.length ; m++) {
            origin.y = yRange[m];

            raycaster.ray.set( origin, dir.normalize() );
            scene.add( new THREE.ArrowHelper(raycaster.ray.direction, raycaster.ray.origin,3,0xff0000));

            const intersects = raycaster.intersectObjects(scene.children, true);
            // console.log(intersects[0]

            if ( intersects.length > 0 && intersects[0].face !== null) {

                console.log('array length', intersects);

                INTERSECTED = intersects[ 0 ].object;          
                INTERSECTED.currentHex = INTERSECTED.material.color.getHex();
                INTERSECTED.material.color.setHex( 0xff00070 );
                
                if ( INTERSECTED ) sphere.material.color.setHex( INTERSECTED.currentHex );

                // SRP calculation
                const {0: {distance}} = intersects;
                let W = 1368; //W/m2 - solar const
                let v = 0.7; // Reflectivity
                let m = 1; //kg - area to mass ratio
                let u = 0.4; //Specularity
                let c = Math.pow(3,8); //Speed of light - UPDATE TO MORE ACCURATE

                // console.log(radIn);

                let fSRP = ((W*Math.PI*Math.pow(radIn,2))/c)*(1+(4/9)*v-(4/9)*v*u); //Force ignoring reflection and direction - UPDATEmen

                console.log(fSRP);
                console.log('We have contact');
                console.log(origin);

                hitPointY.push(origin.y);
                hitPointZ.push(origin.z);

            } else {

                if ( INTERSECTED ) INTERSECTED.material.color.setHex( INTERSECTED.currentHex );

                INTERSECTED = null;

                console.log('Oh no - i cant hit that!')
            }
        
        }
    }

    console.log(hitPointY,hitPointZ);

}


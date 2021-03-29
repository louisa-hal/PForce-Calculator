//Make global vars
let scene, camera, renderer, sphere, raycaster, intersects, INTERSECTED, distance;

let origin = new THREE.Vector3(0,10,0); //Ray origin
let dir = new THREE.Vector3(0,-150,0); //Ray direction
let u = new THREE.Vector3(); //Ray direction unit vector

// Pixel array
let startNo = -1.5;
let endNo = 1.5;
let step = 0.01;
let zRange = range(startNo, endNo, step);
let xRange = range(startNo, endNo, step);
let radIn = 1.1; //m - rad for cannonball
let hitPointZ = [];
let hitPointX = [];
let hitPointY = [];
let fMag = []; //Force magnitude
let fDir = []; //Force direction



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

// function convertArrayOfObjectsToCSV(args) {
//     var result, ctr, keys, columnDelimiter, lineDelimiter, data;
    
//     data = args.data || null;
//     if (data == null || !data.length) {
//     return null;
//     }
    
//     columnDelimiter = args.columnDelimiter || ',';
//     lineDelimiter = args.lineDelimiter || '\n';
    
//     keys = Object.keys(data[0]);
    
//     result = '';
//     result += keys.join(columnDelimiter);
//     result += lineDelimiter;
    
//     data.forEach(function(item) {
//     ctr = 0;
//     keys.forEach(function(key) {
//     if (ctr > 0) result += columnDelimiter;
    
//     result += item[key];
//     ctr++;
//     });
//     result += lineDelimiter;
//     });
// }

// function downloadCSV(args) {
//     let data, filename, link;
//     const csv = convertArrayOfObjectsToCSV({
//     data
//     });
//     if (csv == null) return;
    
//     filename = args.filename || 'export.csv';
    
//     if (!csv.match(/^data:text\/csv/i)) {
//     csv = 'data:text/csv;charset=utf-8,' + csv;
//     }
//     data = encodeURI(csv);
    
//     link = document.createElement('a');
//     link.setAttribute('href', data);
//     link.download(filename);
//     link.click();
// }

// function arrayToCSV (twoDiArray) {
//     //  Modified from: http://stackoverflow.com/questions/17836273/
//     //  export-javascript-data-to-csv-file-without-server-interaction
//     const csvRows = [];
//     for (const i = 0; i < twoDiArray.length; ++i) {
//         for (const j = 0; j < twoDiArray[i].length; ++j) {
//             twoDiArray[i][j] = '\"' + twoDiArray[i][j] + '\"';  // Handle elements that contain commas
//         }
//         csvRows.push(twoDiArray[i].join(','));
//     }

//     const csvString = csvRows.join('\r\n');
//     const a         = document.createElement('a');
//     a.href        = 'data:attachment/csv,' + csvString;
//     a.target      = '_blank';
//     a.download    = 'myFile.csv';

//     document.body.appendChild(a);
//     a.click();
//     // Optional: Remove <a> from <body> after done
// }



function Raycast() {

    let 

    n=0;

    for (zRange[n]; n < zRange.length ; n++) {

        m=0;
        origin.z = zRange[n];

        for(xRange[m]; m < xRange.length ; m++) {
            origin.x = xRange[m];

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

                console.log(intersects);

                // SRP calculation
                const {0: {distance}} = intersects;
                let W = 1368; //W/m2 - solar const 
                let v = 0.7; // Reflectivity
                let m = 1; //kg - area to mass ratio
                let u = 0.4; //Specularity
                let c = 2.998*Math.pow(10,8); //Speed of light - UPDATE TO MORE ACCURATE
                const Area = step*step; //array spacing

                // console.log(radIn);

                let fSRP = ((W*Area)/c)*((1+(4/9)*v)-((4/9)*v*u)); //Force ignoring reflection and direction - UPDATEmen

                fMag.push(fSRP); //Add force magnitude to an array

                // console.log(fSRP);
                console.log(fSRP);
                console.log('We have contact');
                console.log(origin);

                hitPointX.push(origin.x);
                hitPointZ.push(origin.z);

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
    
    window.alert(hitPointX);
    window.alert(hitPointZ);

    // exportToCsv(hitPointY);
}

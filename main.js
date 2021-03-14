//Make global vars
let scene, camera, renderer, sphere, raycaster, intersects, INTERSECTED, distance;

const mouse = new THREE.Vector3();
const origin = new THREE.Vector3(-10,0,0);
const dir = new THREE.Vector3(30,0,0);
let zRange = [-5,-4,-3,-2,-1,0,1,2,3,4,5];
let yRange = [-5,-4,-3,-2,-1,0,1,2,3,4,5];


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
    light.position.set( 1, 1, 1 ).normalize();
    scene.add( light );

    const geometry = new THREE.SphereGeometry( 2, 32, 32 );

    const material = new THREE.MeshPhongMaterial({
        color: 0xFFFF00,    // red (can also use a CSS color string here)
        flatShading: false,
      });
    sphere = new THREE.Mesh( geometry, material );
    //sphere.translateX(10); //remove from origin
    sphere.updateMatrixWorld();
    scene.add( sphere );

    raycaster = new THREE.Raycaster();

    renderer = new THREE.WebGLRenderer({ antialias: true});
    renderer.setPixelRatio( window.devicePixelRatio );
    renderer.setSize(window.innerWidth, window.innerHeight);
    container.appendChild( renderer.domElement );

    // Camera originates at same point as box geo - have to move add x change to stop intercepting
    camera.position.z = 15;
    // camera.position.x = 5;

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


function render() {

    renderer.render( scene, camera );

}

function Raycast() {

    let n=0;

    for (zRange[n]; n < 11; n++) {

        let m=0;
        origin.z = zRange[n];

        for(yRange[m]; m < 11; m++) {
            console.log(origin);
            origin.y = yRange[m];

            raycaster.ray.set( origin, dir.normalize() );
            scene.add( new THREE.ArrowHelper(raycaster.ray.direction, raycaster.ray.origin,3,0xff0000));

            const intersects = raycaster.intersectObjects(scene.children, true);
            console.log(intersects[0]);

            if ( intersects.length > 0 ) {

                if ( INTERSECTED ) sphere.material.color.setHex( INTERSECTED.currentHex );

                INTERSECTED = intersects[ 0 ].object;
                INTERSECTED.currentHex = INTERSECTED.material.color.getHex();
                INTERSECTED.material.color.setHex( 0xff00070 );

                // SRP calculation
                const {0: {distance}} = intersects;
                let G1 = Math.pow(10,14); //kg km/s^2 - soler rad const
                let Cr = 1.12; // Reflectivity
                let areaMass = 0.0055; //m^2/kg - area to mass ratio

                let aSRP = -Cr*(G1/(distance**2)*areaMass);

                console.log(aSRP);
                console.log('We have contact');

            } else {

                if ( INTERSECTED ) INTERSECTED.material.color.setHex( INTERSECTED.currentHex );

                INTERSECTED = null;

                console.log('Oh no - i cant hit that!')
            }
        
        }
    }

}


require({
    baseUrl: 'js',
    // three.js should have UMD support soon, but it currently does not
    shim: { 'vendor/three': { exports: 'THREE' } }
}, [
    'vendor/three'
], function(THREE) {

    var camera, scene, renderer, mesh, loader;

    init();
    animate();

    function init() {

        camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 1, 10000 );
        camera.position.z = 300;

        scene = new THREE.Scene();

        loader = new THREE.JSONLoader();

        loader.load( "object/sculpt.js", function( geometry ) {

                //var geometry = new THREE.CubeGeometry(5,10,5);


            wireMaterial = new THREE.MeshBasicMaterial({
                color: 0xff0000,
                wireframe: true
            });

            var phong = new THREE.MeshNormalMaterial();

            mesh = new THREE.Mesh( geometry, wireMaterial );
            mesh.scale.set( 10, 10, 10 );
            mesh.position.y = 0;
            mesh.position.x = 0;
            scene.add( mesh );
                        

        });

        renderer = new THREE.CanvasRenderer();
        renderer.setClearColor( 0xffffff, 1 );
        renderer.setSize(window.innerWidth, window.innerHeight);

        document.body.appendChild(renderer.domElement);
    }
    function animate() {

        // note: three.js includes requestAnimationFrame shim
        requestAnimationFrame(animate);


        renderer.render(scene, camera);

    }

});

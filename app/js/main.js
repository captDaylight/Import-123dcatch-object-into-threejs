require({
    baseUrl: 'js',
    // three.js should have UMD support soon, but it currently does not
    shim: { 'vendor/three': { exports: 'THREE' } }
}, [
    'vendor/three'
], function(THREE) {

    var SCREEN_WIDTH = window.innerWidth;
    var SCREEN_HEIGHT = window.innerHeight;
    var FLOOR = -250;

    var container;

    var camera, scene;
    var canvasRenderer, webglRenderer;

    var mesh, zmesh, geometry;

    var mouseX = 0, mouseY = 0;

    var windowHalfX = window.innerWidth / 2;
    var windowHalfY = window.innerHeight / 2;

    var render_canvas = 1, render_gl = 1;
    var has_gl = 0;

    var bcanvas = document.getElementById( "rcanvas" );
    var bwebgl = document.getElementById( "rwebgl" );

    document.addEventListener( 'mousemove', onDocumentMouseMove, false );

    init();
    animate();

    render_canvas = !has_gl;
    bwebgl.style.display = has_gl ? "inline" : "none";
    bcanvas.className = render_canvas ? "button" : "button inactive";

    function init() {

        container = document.getElementById( 'container' );

        camera = new THREE.PerspectiveCamera( 75, SCREEN_WIDTH / SCREEN_HEIGHT, 1, 100000 );
        camera.position.z = 500;

        scene = new THREE.Scene();


        // LIGHTS

        var ambient = new THREE.AmbientLight( 0x221100 );
        scene.add( ambient );

        var directionalLight = new THREE.DirectionalLight( 0xffeedd, 1.5 );
        directionalLight.position.set( 0, 70, 100 ).normalize();
        scene.add( directionalLight );

        // RENDERER

        if ( render_gl ) {

            try {

                webglRenderer = new THREE.WebGLRenderer();
                webglRenderer.setClearColor( 0xffffff );
                webglRenderer.setSize( SCREEN_WIDTH, SCREEN_HEIGHT );
                webglRenderer.domElement.style.position = "relative";

                container.appendChild( webglRenderer.domElement );

                has_gl = 1;

            }
            catch (e) {
            }

        }

        if ( render_canvas ) {

            canvasRenderer = new THREE.CanvasRenderer();
            canvasRenderer.setClearColor( 0xffffff );
            canvasRenderer.setSize( SCREEN_WIDTH, SCREEN_HEIGHT );
            container.appendChild( canvasRenderer.domElement );

        }

        var loader = new THREE.JSONLoader();
        var callbackMale = function ( geometry, materials ) { createScene( geometry, materials, 0, 0, 0, 105 ) };

        loader.load( "object/sculpt.js", callbackMale );

        //

        window.addEventListener( 'resize', onWindowResize, false );

    }

    function onWindowResize() {

        windowHalfX = window.innerWidth / 2;
        windowHalfY = window.innerHeight / 2;

        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();

        if ( webglRenderer ) webglRenderer.setSize( window.innerWidth, window.innerHeight );
        if ( canvasRenderer ) canvasRenderer.setSize( window.innerWidth, window.innerHeight );

    }

    function createScene( geometry, materials, x, y, z, b ) {

        zmesh = new THREE.Mesh( geometry, new THREE.MeshFaceMaterial( materials ) );
        zmesh.position.set( x, y, z );
        zmesh.scale.set( 10, 10, 10 );
        scene.add( zmesh );

        // createMaterialsPalette( materials, 100, b );

    }

    function onDocumentMouseMove(event) {

        mouseX = ( event.clientX - windowHalfX );
        mouseY = ( event.clientY - windowHalfY );

    }

    function animate() {

        requestAnimationFrame( animate );

        render();

    }

    function render() {

        camera.position.x += ( mouseX - camera.position.x ) * .05;
        camera.position.y += ( - mouseY - camera.position.y ) * .05;

        camera.lookAt( scene.position );

        if ( render_gl && has_gl ) webglRenderer.render( scene, camera );
        if ( render_canvas ) canvasRenderer.render( scene, camera );

    }


});

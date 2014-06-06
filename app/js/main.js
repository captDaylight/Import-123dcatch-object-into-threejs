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

            var container, stats;

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

                // GROUND

                var x = document.createElement( "canvas" );
                var xc = x.getContext("2d");
                x.width = x.height = 128;
                xc.fillStyle = "#fff";
                xc.fillRect(0, 0, 128, 128);
                xc.fillStyle = "#000";
                xc.fillRect(0, 0, 64, 64);
                xc.fillStyle = "#999";
                xc.fillRect(32, 32, 32, 32);
                xc.fillStyle = "#000";
                xc.fillRect(64, 64, 64, 64);
                xc.fillStyle = "#555";
                xc.fillRect(96, 96, 32, 32);

                var xm = new THREE.MeshBasicMaterial( { map: new THREE.Texture( x, new THREE.UVMapping(), THREE.RepeatWrapping, THREE.RepeatWrapping ) } );
                xm.map.needsUpdate = true;
                xm.map.repeat.set( 10, 10 );

                geometry = new THREE.PlaneGeometry( 100, 100, 15, 10 );

                mesh = new THREE.Mesh( geometry, xm );
                mesh.position.set( 0, FLOOR, 0 );
                mesh.rotation.x = - Math.PI / 2;
                mesh.scale.set( 10, 10, 10 );
                scene.add( mesh );

                // SPHERES

                var material_spheres = new THREE.MeshLambertMaterial( { color: 0xdddddd } ),
                    sphere = new THREE.SphereGeometry( 100, 16, 8 );

                for ( var i = 0; i < 10; i ++ ) {

                    mesh = new THREE.Mesh( sphere, material_spheres );

                    mesh.position.x = 500 * ( Math.random() - 0.5 );
                    mesh.position.y = 300 * ( Math.random() - 0 ) + FLOOR;
                    mesh.position.z = 100 * ( Math.random() - 1 );

                    mesh.scale.x = mesh.scale.y = mesh.scale.z = 0.25 * ( Math.random() + 0.5 );

                    scene.add( mesh );

                }


                // LIGHTS

                var ambient = new THREE.AmbientLight( 0x221100 );
                scene.add( ambient );

                var directionalLight = new THREE.DirectionalLight( 0xffeedd, 1.5 );
                directionalLight.position.set( 0, -70, 100 ).normalize();
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

                // STATS

                stats = new Stats();
                stats.domElement.style.position = 'absolute';
                stats.domElement.style.top = '0px';
                stats.domElement.style.zIndex = 100;
                container.appendChild( stats.domElement );

                //

                bcanvas.addEventListener("click", toggleCanvas, false);
                bwebgl.addEventListener("click", toggleWebGL, false);

                var loader = new THREE.JSONLoader();
                var callbackMale = function ( geometry, materials ) { createScene( geometry, materials, 90, FLOOR, 50, 105 ) };
                var callbackFemale = function ( geometry, materials ) { createScene( geometry, materials, -80, FLOOR, 50, 0 ) };

                loader.load( "object/sculpt.js", callbackMale );
                loader.load( "obj/female02/Female02_slim.js", callbackFemale );

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
                zmesh.scale.set( 3, 3, 3 );
                scene.add( zmesh );

                createMaterialsPalette( materials, 100, b );

            }

            function createMaterialsPalette( materials, size, bottom ) {

                for ( var i = 0; i < materials.length; i ++ ) {

                    // material

                    mesh = new THREE.Mesh( new THREE.PlaneGeometry( size, size ), materials[i] );
                    mesh.position.x = i * (size + 5) - ( ( materials.length - 1 )* ( size + 5 )/2);
                    mesh.position.y = FLOOR + size/2 + bottom;
                    mesh.position.z = -100;
                    scene.add( mesh );

                    // number

                    var x = document.createElement( "canvas" );
                    var xc = x.getContext( "2d" );
                    x.width = x.height = 128;
                    xc.shadowColor = "#000";
                    xc.shadowBlur = 7;
                    xc.fillStyle = "orange";
                    xc.font = "50pt arial bold";
                    xc.fillText( i, 10, 64 );

                    var xm = new THREE.MeshBasicMaterial( { map: new THREE.Texture( x ), transparent: true } );
                    xm.map.needsUpdate = true;

                    mesh = new THREE.Mesh( new THREE.PlaneGeometry( size, size ), xm );
                    mesh.position.x = i * ( size + 5 ) - ( ( materials.length - 1 )* ( size + 5 )/2);
                    mesh.position.y = FLOOR + size/2 + bottom;
                    mesh.position.z = -99;
                    scene.add( mesh );

                }

            }

            function onDocumentMouseMove(event) {

                mouseX = ( event.clientX - windowHalfX );
                mouseY = ( event.clientY - windowHalfY );

            }

            //

            function animate() {

                requestAnimationFrame( animate );

                render();
                stats.update();

            }

            function render() {

                camera.position.x += ( mouseX - camera.position.x ) * .05;
                camera.position.y += ( - mouseY - camera.position.y ) * .05;

                camera.lookAt( scene.position );

                if ( render_gl && has_gl ) webglRenderer.render( scene, camera );
                if ( render_canvas ) canvasRenderer.render( scene, camera );

            }

            function toggleCanvas() {

                render_canvas = !render_canvas;
                bcanvas.className = render_canvas ? "button" : "button inactive";

                render_gl = !render_canvas;
                bwebgl.className = render_gl ? "button" : "button inactive";

                if( has_gl )
                    webglRenderer.domElement.style.display = render_gl ? "block" : "none";

                canvasRenderer.domElement.style.display = render_canvas ? "block" : "none";

            }

            function toggleWebGL() {

                render_gl = !render_gl;
                bwebgl.className = render_gl ? "button" : "button inactive";

                render_canvas = !render_gl;
                bcanvas.className = render_canvas ? "button" : "button inactive";

                if( has_gl )
                    webglRenderer.domElement.style.display = render_gl ? "block" : "none";

                canvasRenderer.domElement.style.display = render_canvas ? "block" : "none";

            }

});

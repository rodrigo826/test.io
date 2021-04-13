/**
 * @author Fernando Gutierrez de piñeres
 * 
 */
 var collisionMesh = [];
			var gravityOnOff = true;
			var worldFloor = -0.768;
			var arrayPos= [];
			var contadorIteraciones;
		

			var scene = new THREE.Scene();
			scene.background = new THREE.Color( 0xecf7f9);
			var camera = new THREE.PerspectiveCamera( 25, window.innerWidth/window.innerHeight, 0.1, 1000 );
			camera.position.set( 1, 1, 12 );

			var renderer = new THREE.WebGLRenderer({ alpha: true });
			container = document.getElementById('canvas2');
			renderer.setSize(container.offsetWidth, container.offsetHeight);
			document.body.appendChild( container );
			container.appendChild(renderer.domElement);
		
				var ambientLight = new THREE.AmbientLight( 0xcccccc );
			scene.add( ambientLight );
							
			var directionalLight = new THREE.DirectionalLight( 0xf5f5f5,0.3 );
			directionalLight.position.set( 50, 20, 200).normalize();
			scene.add( directionalLight );		
			//var helper1 = new THREE.DirectionalLightHelper( directionalLight, 5 );
			//scene.add(helper1);

			var directionalLight2 = new THREE.DirectionalLight( 0xf5f5f5,0.3);
			directionalLight2.position.set( -50, -20, -200).normalize();
			scene.add( directionalLight2 );		
			//var helper2 = new THREE.DirectionalLightHelper( directionalLight2, 5 );
			//scene.add(helper2);

			//object array
			var objetos=[];
			var objetos2=[];

			//CONTROLS
			var controls2 = new THREE.DragControls( objetos2, camera, renderer.domElement );
			var controls = new THREE.OrbitControls( camera, renderer.domElement );	

			// add event listener to highlight dragged objects

			controls2.addEventListener( 'dragstart', function ( event ) {

				
				controls.enabled = false;
				gravityOnOff=false;

			} );

			controls2.addEventListener( 'dragend', function ( event ) {

				controls.enabled = true;
				gravityOnOff=true;

			} );
			//punto
			var sphere ;
			function creationPoint()
			{
			var geometry = new THREE.SphereGeometry( 0.05);
			var material = new THREE.MeshBasicMaterial( {color: 0xff0000} );
			 sphere = new THREE.Mesh( geometry, material );
			 sphere.name="sphere";
			scene.add( sphere );
			objetos2.push(sphere);
			
			}
			creationPoint();



			function createPiece()
			{

						const loaderTexture = new THREE.TextureLoader();
			loaderTexture.load('images/box.jpg', (texture) => {
			  const material = new THREE.MeshBasicMaterial({
			    map: texture,
			  });
              let geometry;
              if(document.getElementsByName("unidades")[0].checked)
              {
			 geometry = new THREE.BoxGeometry(document.getElementsByName("largo")[0].value/100,document.getElementsByName("alto")[0].value/100,document.getElementsByName("ancho")[0].value/100);
			} 
            if(document.getElementsByName("unidades")[1].checked)
              {
             geometry = new THREE.BoxGeometry(document.getElementsByName("largo")[0].value/39.37,document.getElementsByName("alto")[0].value/39.37,document.getElementsByName("ancho")[0].value/39.37);
            } 

             var cube = new THREE.Mesh( geometry, material );
				
			 	cube.position.set(sphere.position.x,sphere.position.y,sphere.position.z);
			 
			 cube.userData = [];
			scene.add( cube );

			objetos.push(cube);	
			objetos2.push(cube);	
			collisionMesh.push(cube);
			
			
		});
		}
				

			//
			

    	function gravity(_mesh)
    	{

    		let anyTarget= new THREE.Vector3();
    		let floorY = distanceToNextObject(_mesh , "y")
    	
    		var box = new THREE.Box3().setFromObject(_mesh);
    		const halfPc = box.getSize(anyTarget).y/2;
    	
    			
    		//if(_mesh.position.y > floorY && -1*floorY-box.min.y>0.001 && gravityOnOff)
    		//{
    		//	_mesh.position.y-=(-1*floorY+box.min.y)/2;
		
		

    			//}
    			if(gravityOnOff)
    			{
    				_mesh.position.y = floorY + halfPc+0.01;
    				
    			}


    	}


    		function createUserData()
    		{
    			for(i=0;i<objetos.length;i++){	

    				objetos[i].userData = [];


    			}


    		}

			    function savePos(_mesh) {
			    	var collisionBool=false;
			    	var collisionBoolAll=false;
			    	var collisionPoint;
			    	let collisionBoolArray=[];
		
        var originPoint = _mesh.position.clone();

        for (var vertexIndex = 0; vertexIndex < _mesh.geometry.vertices.length; vertexIndex++) {
            
        	

            var localVertex = _mesh.geometry.vertices[vertexIndex].clone();
         
            var globalVertex = localVertex.applyMatrix4(_mesh.matrix);
      
            var directionVector = globalVertex.sub(_mesh.position);
      
            var ray = new THREE.Raycaster(originPoint, directionVector.clone().normalize());
            var collisionResults = ray.intersectObjects(collisionMesh);

           
            
            if (collisionResults.length > 0 && collisionResults[0].distance < directionVector.length()) {
          
                collisionBool=true;
                collisionBoolArray.push(collisionBool);
                collisionPoint=collisionResults[0].point;
             
                controls2.enabled=false;
               // reCenter();
               
             
        	}
        	else
        	{
        		controls2.enabled=true;
        		collisionBool=false;
        		collisionBoolArray.push(collisionBool);
        	}
        
        }
        let contadorTrue=0;
    	for (var i = 0; i< collisionBoolArray.length;i++) {
    		if(collisionBoolArray[i]===true)
    		{
    			contadorTrue+=1;
    		}
    	}

    	if(contadorTrue>0)
    	{
    		collisionBoolAll=true;
    	}



             	let posVector = _mesh.position.clone();

            	_mesh.userData.push([posVector,collisionBoolAll,collisionBoolArray]);
            	//console.log([posVector,collisionVar[0]]);
            	if(_mesh.userData.length>50)
            	{
            		_mesh.userData.shift();
            	}
            	
    }

			    function checkCollision2(_mesh) {
			    	var collisionBool=false;
			    	var collisionBoolAll=false;
			    	var collisionPoint;
			    	let collisionBoolArray=[];
		
        var originPoint = _mesh.position.clone();

        for (var vertexIndex = 0; vertexIndex < _mesh.geometry.vertices.length; vertexIndex++) {
            
        	

            var localVertex = _mesh.geometry.vertices[vertexIndex].clone();
         
            var globalVertex = localVertex.applyMatrix4(_mesh.matrix);
      
            var directionVector = globalVertex.sub(_mesh.position);
      
            var ray = new THREE.Raycaster(originPoint, directionVector.clone().normalize());
            var collisionResults = ray.intersectObjects(collisionMesh);

           
            
            if (collisionResults.length > 0 && collisionResults[0].distance < directionVector.length()) {
          
                collisionBool=true;
                collisionBoolArray.push(collisionBool);
                collisionPoint=collisionResults[0].point;
             
                controls2.enabled=false;
                
               // reCenter();
               
             
        	}
        	else
        	{
        		controls2.enabled=true;
        		collisionBool=false;
        		collisionBoolArray.push(collisionBool);

        	}
        
        }
        let contadorTrue=0;
    	for (var i = 0; i< collisionBoolArray.length;i++) {
    		if(collisionBoolArray[i]===true)
    		{
    			contadorTrue+=1;
    		}
    	}

    	if(contadorTrue>0)
    	{
    		collisionBoolAll=true;
    	}
             	
    	return [collisionBoolAll,collisionPoint];
    }

    		               		

    		function  distanceToNextObject(obj, axis)
    		{
    			let [x,y,z] = [0,0,0]
    			switch(axis)
    			{
    				case "y":
    				y = -1;
    				break;
    				case "x":
    				x = -1;
    				break;
    				case "z":
    				z = -1;
    				break;
    			}

    			let raycaster = new THREE.Raycaster();

    			raycaster.set(obj.position, new THREE.Vector3(x,y,z));
    			let intersects = raycaster.intersectObjects(collisionMesh);
    			let point = intersects[0].point.y
    			
    			//console.log(point);
    			return point;
    		}


			// Instantiate a loader
			var loader = new THREE.GLTFLoader();
				
			// Load a glTF resource
			loader.load('models/alf.gltf', function ( gltf ) {

				scene.add( gltf.scene );

				}, undefined, function ( error ) {

				console.error( error );

				} );
    
        var animate = function (){
				requestAnimationFrame(animate);
				renderer.render(scene,camera);
				controls.update();
				   
				   //if(typeof cube !== 'undefined')
				   var collvar;
				   	for(var i=0;i<objetos.length;i++)
				   		{
				   		gravity(objetos[i]);	
				   		savePos(objetos[i]);
				   		checkCollision2(objetos[i]);
				   		collvar=checkCollision2(objetos[i]);
				   		
				   	
				   		
				   		
				   		_mesh = objetos[i];
				   		if (collvar[0])
				   		{
				   			 contadorIteraciones+=1;
				   			let j= Math.max(objetos[i].userData.length - contadorIteraciones-1,0);	
				   			
				   			

               		_mesh.position.y=_mesh.userData[j][0].y;
               		_mesh.position.x=_mesh.userData[j][0].x;
               		_mesh.position.z=_mesh.userData[j][0].z;

               		
               		//contadorFalse+=1;
               	
               		//console.log(contadorFalse);
				   	};
				   	if(checkCollision2(objetos[i])[0]===false)
				   	{
				   		contadorIteraciones=0;
				   	}

				   		
				   		

				   //console.log(collisionBool);
				   
				
			};

			};

			animate();
    

			

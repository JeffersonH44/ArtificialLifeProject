
		
function treeGenerator( xPos, yPos, zPos, iterateN, s) {


		//construction Parameters
		this.xPos = xPos;
		this.yPos = yPos;
		this.zPos = zPos;
		this.iterateN = iterateN;

		var scene = s;
		//Cylinder
		//Used when the tree is joined
		var materialC = new THREE.MeshPhongMaterial( {
			map: THREE.ImageUtils.loadTexture('images/tree_texture.jpg')
		} );
		//Used for the branches
		var materialBranch = new THREE.MeshBasicMaterial({color: 0x996600});
		
		//material = new THREE.MeshBasicMaterial({map: texture})
//Tree	
		var materialB  = new THREE.MeshBasicMaterial({color: 0x0000ff}); 
		var materialR  = new THREE.MeshBasicMaterial({color: 0xff0000}); 
		
		//turtle as a cube
		var geometry = new THREE.BoxGeometry(1,1,1);
		var material  = new THREE.MeshBasicMaterial({color: 0x00ff00}); 
		var tCube = new THREE.Mesh(geometry,material);
		tCube.position.x = this.xPos;
		tCube.position.y = this.yPos;
		tCube.position.z = this.zPos;
		tCube.rotation.x = tCube.rotation.x + (Math.PI/4);
		//scene.add(tCube);
		
		//Cubo de Inicialización
		var tCubeInit = new THREE.Mesh(geometry,material);
		tCubeInit.position.x = xPos;
		tCubeInit.position.y = yPos;
		tCubeInit.position.z = zPos;
		tCubeInit.rotation.x = tCube.rotation.x + (Math.PI/4);

		//Randomization - Stocastic
		var randomGrad = 0.15 - Math.random()/4 ; //angulo random (0° a 14°)
		var randomRule = Math.random(); 
		
		
		//Initital tree size
		var size_factor = 0.8;
		
		//Parameters
		this.angle=.5;
		this.wBranchT = 4;  //Radius of the Top of the Cylinder
		this.wBranchB = 6;  //Radius of the Buttom of the Cylinder
		this.axiom = "A";
		this.sentence = this.axiom;
		this.l = 2*size_factor + ((Math.random()/10));
		this.w = 0.08*size_factor + (Math.random()/100);

		//L-System
		
		//Parameters -Factors
		this.r1 = 0.8 + (Math.random()/10);				//Contraction Ratio 1
		this.r2 = 0.7 + (Math.random()/10) ;				//Contraction Ratio 2 //0.7
		this.a1 = 0.6109 + randomGrad; 		//(35°)	//0.3491; //(20°)	//branching angle 1   //0.1745; //(10°)
		this.a2 = 0.6109 + randomGrad; 		//(35°)	//0.8727; //(50°)	//1.0472; //(60°)	//branching angle 2
		this.m = 0.75 + (Math.random()/10); 	//(wr)			//width decrease rate 
		

		//Rules
		this.rules = [];
		
		//Production P1 for A
		this.rules[0] = {
			p: "A",											//premise
			c: "!(w)F(l)[&B(l*r1,w*m)]/[%B(l*r2,w*m)]"		//conclusion
		}
		
		//Stocastic for the rules
		if(randomRule<0.5){
			//Production P2 for B
			this.rules[1] = {
				p: "B",				
				c: "!(w)F(l)[+$B(l*r1,w*m)H][-$B(l*r2,w*m)H]"
			}
		}else{
			//Production P2 for B
			this.rules[1] = {
				p: "B",				
				c: "!(w)F(l)[-$B(l*r2,w*m)H%][+$B(l*r1,w*m)H%&]"
			}
		}
		
/*		
		//Production P3 for F growing function
		rules[2] = {
			p: "F",				
			c: "!(w)F(l)[+$B(l*r1,w*m)][-$B(l*r2,w*m)]"
		}	
*/		
		//patron2D
		//"FF+[+F-F-F]-[-F+F+F]"
		
		//Patron3D
		//
		
		//var geometryC1 = new THREE.CylinderGeometry(wBranchT,wBranchB,l);
		//var treeBranches = new THREE.Mesh(geometryC1,material);
		
		this.treeBranches = [];
		this.obj = {};
		this.factorR = [];
		
		this.tClone_px = [];
		this.tClone_py = [];
		this.tClone_pz = [];
		this.tClone_rx = [];
		this.tClone_ry = [];
		this.tClone_rz = [];
		
		this.count= 0;
		this.indFinal = []; // indicator to finish clear the tree
		
		this.Arguments = [];  // Para interpretar lo que hay en parentesis

		this.operations = [];   //Para operar los argumentos
		
		this.variables = [this.l,this.w];  //Argumentos operados
		
		this.ind1; 
		this.ind2; //two indices for the parentesis
		
		this.iterationNumber = this.iterateN; //Número de iteraciones
		
		var vectorL = new THREE.Vector3(0,0,1); //inicialmente en Z
		
		//world Vectors
		var vX = new THREE.Vector3(1,0,0); //vector X
		var vY = new THREE.Vector3(0,1,0); //vector Y
		var vZ = new THREE.Vector3(0,0,1); //vector Z
		//turtle();
		
		
		this.growR = 1; //growing Factor
		this.growRRate = 0.005 + (Math.random()/1500);
		//
		//
		//Joining the tree
		this.combined1;
		this.combined2;
		this.joined_tree;
		this.joined_leafs;
		
		//Leafs
		var leafs_color = 0x00cc00;
		
		var leafs_material = new THREE.MeshBasicMaterial( { color: leafs_color, side: THREE.DoubleSide } );
		
		var leaf_size = 2;
		
		
		// Heart
		this.treeLeafs = [];
		//var group;
		
		this.x = 0; 
		this.y = 0;

		var heartShape = new THREE.Shape(); //

		heartShape.moveTo( this.x + 25, this.y + 25 );
		heartShape.bezierCurveTo( this.x + 25, this.y + 25, this.x + 20, this.y, this.x, this.y );
		heartShape.bezierCurveTo( this.x - 30, this.y, this.x - 30, this.y + 35,this.x - 30,this.y + 35 );
		heartShape.bezierCurveTo( this.x - 30, this.y + 55, this.x - 10, this.y + 77, this.x + 25, this.y + 95 );
		heartShape.bezierCurveTo( this.x + 60, this.y + 77, this.x + 80, this.y + 55, this.x + 80, this.y + 35 );
		heartShape.bezierCurveTo( this.x + 80, this.y + 35, this.x + 80, this.y, this.x + 50, this.y );
		heartShape.bezierCurveTo( this.x + 35, this.y, this.x + 25, this.y + 25, this.x + 25, this.y + 25 );
		
		var extrudeSettings = { amount: 8, bevelEnabled: true, bevelSegments: 2, steps: 2, bevelSize: 1, bevelThickness: 1 };
		
		
		this.output_obj = [];
		
		//
		//group = new THREE.Group();
		//group.position.y = 5;  //Position of the heart
		
		//scene.add( group );

		//
		//
		
		this.generate = function () {  //productions, interpretation and generation
		  
		  var nextSentence = "";
		  for (var i = 0; i < this.sentence.length; i++) {
				var current = this.sentence.charAt(i);
				var found = false;
				for (var j = 0; j < this.rules.length; j++) {
				  if (current == this.rules[j].p) {
					found = true;					//Extra-work with r2
					
					if(current == "A"){
						nextSentence += this.rules[j].c;
						
					}
					if(current == "B"){
						
						//leer argumentos de nextSentence anterior
						this.replaceArg(i);
						
						//Reemplazarlos en rules[1].c
						var toReplace1 = "l";
						var str1 = this.rules[1].c; 
						var regex1 = new RegExp(toReplace1, "g");
						var res1 = str1.replace(regex1, this.Arguments[0]);
						
						var toReplace2 = "w";
						var str2 = res1; 
						var regex2 = new RegExp(toReplace2, "g");
						var res2 = str2.replace(regex2, this.Arguments[1]); // regla entrante con argumentos reemplazados
						
						//Reemplazar B en nextSentence la produccion entrante " la regla entrante rules.[1].c"
						//
						nextSentence += res2;
						
						i = this.ind2; 
					}
					break;
				  }
				}
				if (!found) {
				  nextSentence += current;
				}
			}
			this.sentence = nextSentence;
			
			//turtle();
		}



	
		this.replaceArg = function (i){
			i += 1;		//Empieza el parentesis
			
			this.ind1 = i+1;
			this.Arguments = ["",""];  //clear arguments
			
			while (this.sentence.charAt(i) != ","){
				i+= 1;
				if(this.sentence.charAt(i) != ",")
				this.Arguments[0] += this.sentence.charAt(i);
			}
			i+= 1;
			while (this.sentence.charAt(i) != ")"){
				if(this.sentence.charAt(i) != ")")
				this.Arguments[1] += this.sentence.charAt(i);
				i+= 1;
			}
			
			this.ind2 = i;
		}

		
		this.readParentesis = function (letter,i) {
			i += 1;		//Empieza el parentesis
			
			this.ind1 = i;
			
			if(letter == "B"){	//when the letter is B
			
				this.variables=[1,1];
				this.operations = [];  //clear operations array for the next argument
				while (this.sentence.charAt(i) != ","){ //first Argument
					if(this.sentence.charAt(i) != ","){
						if(this.sentence.charAt(i) != "*"){
							i = this.evaluateString(i);
						}
					}
					i+= 1;
				}
				//operate the first arguments
				for (var j = 0; j < this.operations.length; j++) {
					this.variables[0] *= this.operations[j];
				}
				
				this.operations = [];  //clear operations array for the next argument

				while (this.sentence.charAt(i) != ")"){ //second Argument
					if(this.sentence.charAt(i) != ")"){
						if(this.sentence.charAt(i) != "*"){
							i = this.evaluateString(i);
						}
					}
					i+= 1;
				}

				this.ind2 = i;
				//operate the second arguments
				for (var k = 0; k < this.operations.length; k++) {
				this.variables[1] *= this.operations[k];
				}
				
			}
			if(letter=="F"){	//when the letter is F
				//if(i<18){
				//document.getElementById("checkPoint").innerText = i;
				//}
				this.variables[0]=1;
				
				this.operations = [];  //clear operations array for the next argument

				while (this.sentence.charAt(i) != ")"){ //second Argument
					if(this.sentence.charAt(i) != ")"){
						if(this.sentence.charAt(i) != "*"){
							i = this.evaluateString(i);
						}
					}
					i+= 1;
				}

				this.ind2 = i;
				//operando los argumentos
				for (var k = 0; k < this.operations.length; k++) {
				this.variables[0] *= this.operations[k];
				}
				
			}
			if(letter=="!"){		//when the letter is !
				this.variables[1]=1;
				
				this.operations = [];  //clear operations array for the next argument
				
				while (this.sentence.charAt(i) != ")"){ //second Argument
					if(this.sentence.charAt(i) != ")"){
						if(this.sentence.charAt(i) != "*"){
							i = this.evaluateString(i);
						}
					}
					i+= 1;
				}
				
				this.ind2 = i;
				//operando los argumentos
				for (var k = 0; k < this.operations.length; k++) {	
				this.variables[1] *= this.operations[k];
				}
			}
		}
		
		
		this.evaluateString = function (k) {				//identifying the operators
			//!F[&B(l*r1,w*wr)]/[%B(l*r2,w*wr)
			
			if(this.sentence.charAt(k)=="l"){
				this.operations.push(this.l);
			}
			if(this.sentence.charAt(k)=="w"){
					this.operations.push(this.w);
			}
			if(this.sentence.charAt(k)=="m"){
					this.operations.push(this.m);
			}
			if(this.sentence.charAt(k)=="r"){
				if(this.sentence.charAt(k+1)=="1"){
					this.operations.push(this.r1);
				}
				if(this.sentence.charAt(k+1)=="2"){
					this.operations.push(this.r2);
				}
				k +=1;
			}

			return k;
		} 
		
		
		 

		this.turtle = function (step, iterations) {
			//!F[&B(l*r1,w*wr)]/[%B(l*r2,w*wr)
			
			for (var j = 0; j <= step; j++) {
				var current = this.sentence.charAt(j);
				
				
				if (current == "F") {
					
					this.readParentesis("F",j);
					
					
				  //Cylinder painting
				  var geometryC = new THREE.CylinderGeometry(this.variables[1]*this.wBranchT*this.growR,this.variables[1]*this.wBranchB*this.growR,this.variables[0]*this.growR); //variables[1]
				  var branch = new THREE.Mesh(geometryC,materialBranch);  
				  
				  branch.position.x = tCube.position.x;
				  
				  branch.position.y = tCube.position.y; 
					
				  branch.position.z = tCube.position.z;
				  branch.rotation.x = tCube.rotation.x;
				  branch.rotation.y = tCube.rotation.y;
				  branch.rotation.z = tCube.rotation.z;
				  if(this.count>0){
					branch.translateY((this.variables[0]*this.growR) - (this.variables[0]*this.growR)/2); //
				  }
				  
				  //scene.add(branch);
				  this.treeBranches.push(branch);  // saving the branch in the array
				  //Turtle Translation
				  tCube.translateY(this.variables[0]*this.growR); // - variables[0]/2
				  
				  j = this.ind2;
				  
				  this.growR += this.growRRate;
				  
				} else if (current == "+") {
				  tCube.rotateX(this.a1);  		//
				} else if (current == "-") {
				  tCube.rotateX(-this.a2);		//
				}else if (current == "&") {
				  tCube.rotateZ(this.a1);
				} else if (current == "%") {
				  tCube.rotateZ(this.a2);
				}else if (current == "/") {
				  tCube.rotateY(3.1416 + randomGrad);
				}else if (current == "!") {
				  this.readParentesis("!",j);      			//!(w) -> sets the line width w
				  j = this.ind2;
				}else if (current == "$") {	// $ -> rolls the turtle around its own axis so that vector L is brought to a horizontal pos
				  //allowing the branches to grow upward
					
				  vectorL.applyAxisAngle ( vX, tCube.rotation.x ); //adjusting vector L
				  vectorL.applyAxisAngle ( vY, tCube.rotation.y );
				  vectorL.applyAxisAngle ( vZ, tCube.rotation.z );
				
				  tCube.rotateY(this.a1);
				  
				}else if (current == "A") {
					
					var geometryC = new THREE.CylinderGeometry(this.variables[1]*this.wBranchT*this.growR,this.variables[1]*this.wBranchB*this.growR,this.variables[0]*this.growR);
					var branch = new THREE.Mesh(geometryC,materialBranch);
					branch.position.x = tCube.position.x;
					if(this.sentence == axiom){
						branch.position.y = tCube.position.y + (this.variables[0]*this.growR)/2;
					}else{
						branch.position.y = tCube.position.y; //branch.position.y = posY + len/2;
					}
					branch.position.z = tCube.position.z;
					branch.rotation.x = tCube.rotation.x;
					branch.rotation.y = tCube.rotation.y;
					branch.rotation.z = tCube.rotation.z;
					
					
					//scene.add(branch);
					this.treeBranches.push(branch);  // saving the branch in the array
					//Turtle Translation
					tCube.translateY(this.variables[0]*this.growR);
					
					j = this.ind2;
					
					this.growR += this.growRRate;
					
				}else if (current == "B") {
					
					this.readParentesis("B",j);
					
					var geometryC = new THREE.CylinderGeometry(this.variables[1]*this.wBranchT*this.growR,this.variables[1]*this.wBranchB*this.growR,this.variables[0]*this.growR);
					var branch = new THREE.Mesh(geometryC,materialBranch);
					branch.position.x = tCube.position.x;
					branch.position.y = tCube.position.y; //branch.position.y = posY + len/2;
					branch.position.z = tCube.position.z;
					branch.rotation.x = tCube.rotation.x;
					branch.rotation.y = tCube.rotation.y;
					branch.rotation.z = tCube.rotation.z;

					branch.translateY((this.variables[0]*this.growR)- (this.variables[0]*this.growR)/2);
					
					//scene.add(branch);
					this.treeBranches.push(branch);  // saving the branch in the array
					//Turtle Translation
					tCube.translateY(this.variables[0]*this.growR); // - variables[0]/2
					
					j = this.ind2;
					
					this.growR += this.growRRate;
					
				}else if (current == "H") {
					this.addShape( heartShape, extrudeSettings, leafs_color,   tCube.position.x,  tCube.position.y, tCube.position.z, tCube.rotation.x, tCube.rotation.y, tCube.rotation.z, 0.005*this.growR*leaf_size );
					this.growR += this.growRRate;
				}else if (current == "[") {
				  this.pushCube();
				} else if (current == "]") {
				  this.popCube();
				}
				
			}	
			
			//var variables = [1,1];  //clear Argumentos operados 
		}

		

		this.pushCube = function () {
			this.tClone_px.push(tCube.position.x);
			this.tClone_py.push(tCube.position.y);
			this.tClone_pz.push(tCube.position.z);
			this.tClone_rx.push(tCube.rotation.x);
			this.tClone_ry.push(tCube.rotation.y);
			this.tClone_rz.push(tCube.rotation.z);
		}
		
		this.popCube = function () {
			tCube.position.x = this.tClone_px.pop();
			tCube.position.y = this.tClone_py.pop();
			tCube.position.z = this.tClone_pz.pop();
			tCube.rotation.x = this.tClone_rx.pop();
			tCube.rotation.y = this.tClone_ry.pop();
			tCube.rotation.z = this.tClone_rz.pop();	
		}

//tree********************

		//"FF+[+F-F-F]-[-F+F+F]"
		
		
		this.growing = function (times) { //función de crecimiento
			
			if(1 <= times && times < (this.indFinal.length) ){
				this.clearTree();
			
			
				//Inicializando de nuevo el cubo tCube
				tCube.position.x = tCubeInit.position.x;
				tCube.position.y = tCubeInit.position.y;
				tCube.position.z = tCubeInit.position.z;
				tCube.rotation.x = tCubeInit.rotation.x;
				tCube.rotation.y = tCubeInit.rotation.y;
				tCube.rotation.z = tCubeInit.rotation.z;
				
				//scene.add( group );
				
				if(times < this.indFinal.length){
					this.turtle(this.indFinal[times], times);
				}
				
				//document.getElementById("checkPoint3").innerText="go indFinal" + " --> " + this.indFinal;
				//document.getElementById("checkPoint").innerText="start to grow";
				
				//Combine the branch and leaves objects
				this.joint();
				
				this.output_obj[0] = this.joined_tree;
				this.output_obj[1] = this.joined_leafs;
			}
			//scene.add(this.joined_tree);
			//scene.add(this.joined_leafs);
		}

		this.go = function () {
			
			this.count += 1;
			if(this.count==1){
				//generates the patron ( e.g. "FF+[+F-F-F]-[-F+F+F]" )
				for (var i = 0; i < this.iterationNumber; i++) {
					this.generate();
					/*
					var cube = new THREE.Mesh(geometry,materialB);
					cube.position.x += -2;
					cube.position.y += 0.5;
					scene.add(cube);
					*/
					//document.getElementById("patron").innerText = this.sentence;
					//document.getElementById("checkPoint2").innerText = tCube.up.angleTo(vectorL);
				}
			}
			
			//search for the last letter
			var fLetter = "";
			var j = 0;
			for (var j = 0; j < this.sentence.length; j++) {
			
				fLetter = this.sentence.charAt(j);
				
				if(fLetter == "F" || fLetter =="B" || fLetter =="H"){
					this.indFinal.push(j);			//Arreglo de indicadores para cada rama a pintar
				}
			}
		}

		this.joint = function (){
			
			//Tree
			this.combined1 = new THREE.Geometry;
			
			for(var i=0; i < this.treeBranches.length; i++){	// clear the scene
				this.treeBranches[i].updateMatrix();
				this.combined1.merge( this.treeBranches[i].geometry, this.treeBranches[i].matrix );
			}
			this.joined_tree = new THREE.Mesh( this.combined1, materialC );
			
			//Leaves
			this.combined2 = new THREE.Geometry;
			
			for(var i=0; i < this.treeLeafs.length; i++){	// clear the scene
				this.treeLeafs[i].updateMatrix();
				this.combined2.merge( this.treeLeafs[i].geometry, this.treeLeafs[i].matrix );
			}
			this.joined_leafs = new THREE.Mesh( this.combined2, leafs_material );
		}
		
		
		this.clearTree = function () {
			
			//for(var i=0; i < this.treeBranches.length; i++){	// clear the scene
				//this.obj = this.treeBranches[i];
				//scene.remove(this.obj);
			//}
			scene.remove(this.joined_tree);
			
			var vlen = this.treeBranches.length;
			
			this.treeBranches = [];	//se borran las ramas de la escena para el efecto de crecimiento
			//
			//
			/*
			for(var j=0; j < this.treeLeafs.length; j++){	// clear the scene
				this.obj2 = this.treeLeafs[j];
				//scene.remove(this.obj2);
				group.remove(this.obj2);
			}
			*/
			scene.remove(this.joined_leafs);
			
			var vlen2 = this.treeLeafs.length;
			
			this.treeLeafs = [];	//se borran las hojas de la escena para el efecto de crecimiento
			
		}
		
		
		this.addShape = function ( shape, extrudeSettings, color, x, y, z, rx, ry, rz, s ) {

			// flat shape

			var geometry = new THREE.ShapeGeometry( shape );

			var mesh = new THREE.Mesh( geometry, new THREE.MeshBasicMaterial( { color: color, side: THREE.DoubleSide } ) );
			mesh.position.set( x, y, z );
			mesh.rotation.set( rx, ry, rz );
			mesh.scale.set( s, s, s );
			//group.add( mesh );

			this.treeLeafs.push(mesh);
		}
		
		
		
		/*
		var geometryC = new THREE.CylinderGeometry(2,2,6);
		
		var branch = new THREE.Mesh(geometryC,materialC);
			
		branch.position.x = yPos;
			
		this.go = function () {
			//scene.add(tCube);
			scene.add(branch);
		}	
		*/
		
//***Start to grow***// 
		/* 	*/
		
		this.go();	//go se ejecuta automáticamente para generar el patron según la iteración
		
		
		// addShape( shape, extrudeSettings, color, x, y, z, rx, ry,rz, s );
		
		//this.addShape( heartShape, extrudeSettings, 0x00cc00,   -5,  5, 0, 0, 0, Math.PI, 0.02 );
		
		//this.growing();		
//***--- -- ---***//		
				
}


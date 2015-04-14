effect.utils.createTestEl = function(){
	var el = document.createElement('div');
	el.style.visibility='hidden';
	document.body.appendChild(el);
	effect.elToTest = el;
	effect.elToTest.style.transform = "translateY(0px)";
};

effect.utils.convert2dTo3dMatrix = function(matrix){
	var new3dMatrix = [], transitionalMatrix = [];
	
	matrix.map(function(el,i){
		transitionalMatrix.push(el);
		if(i === 1 || i === 3){
			transitionalMatrix.push(0);
		}
		else if(i===5){
			transitionalMatrix.push(1);
		}
	});
	transitionalMatrix.map(function(el,i){
		if(i === 2 || i === 5 || i === 8){
			new3dMatrix.push(0);
		}
		else if(i === 6){
			new3dMatrix.push(0);
			new3dMatrix.push(0);
			new3dMatrix.push(1)
			new3dMatrix.push(0);
		}
		new3dMatrix.push(el);
	},this);
	return new3dMatrix;
};

effect.utils.rgbToHex = function(num){
	var hex,
		num = parseInt(num);
	hex = num.toString(16);
	if(hex.length === 1) {
		hex = "0" + hex;
	}
	return hex;
};
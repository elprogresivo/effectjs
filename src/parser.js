effect.parser.parseColor = function(color){
	var res;
	if(color.indexOf("#") !==-1){
		return color;
	}
	res = color.match(/(\d+)/g);
	color = "#" + effect.utils.rgbToHex(res[0]) + effect.utils.rgbToHex(res[1]) + effect.utils.rgbToHex(res[2]);
    return color;
};

effect.parser.parseUnitValue = function(propValue){
	return propValue.replace(/(\d+)/, '');
};

effect.parser.parseNumericValue = function(propValue){
	if(propValue==="auto") propValue = '0px';
	return parseInt(propValue.match(/(\d+)/)[0]);
};

effect.parser.parseMatrix = function(init,modified){
	var initMatrix, modifiedMatrix;
	if(!effect.elToTest){
		effect.utils.createTestEl();
	}
	
	if(init==="none"){
		init = ("matrix(1,0,0,1,0,0)");
	}
	
	var initMatrix = init.match(/(\d+)/g).map(function(el){return parseInt(el);});
	effect.elToTest.style.transform = modified;
	var modifiedMatrix = window.getComputedStyle(effect.elToTest,null).getPropertyValue('transform');
	modifiedMatrix = modifiedMatrix.match(/(\d+)[^d]/g).map(function(el){return parseInt(el);});
	
	if(initMatrix.length===modifiedMatrix.length){
		return {initial:initMatrix, modified:modifiedMatrix};
	}
	else if(initMatrix.length < modifiedMatrix.length){
		
		initMatrix = effect.utils.convert2dTo3dMatrix(initMatrix);
		//console.log(modifiedMatrix);
		return {initial:initMatrix, modified:modifiedMatrix};
	}
};
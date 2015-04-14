var effect = function(el){
	if(el){
		effect.el = el;
	}
	return effect;
};


effect.main = function(){};
effect.tween = function(){};
effect.utils = {};
effect.parser = {};
effect.animations ={};

effect.animationCounter=0;
effect.currentTime = 0;
effect.elToTest=false;
effect.odd = 0;

effect.parseStyle = function(el,props){
	el = el[0];
	//el.style['transform'] = 'translate3d(0px,0px,2px)';
	var modifiedStyles = {}, willChange = '', unit, propValue, fn, transformLength;
	for(i in props){
		propValue = el.style[i] || window.getComputedStyle(el,null).getPropertyValue(i);
		if(propValue){
			willChange += i +', ';
			if(i.indexOf("color")!=-1){
				var initialObject,
					modifiedObject;
				unit = "color";
				propValue = effect.parser.parseColor(propValue);
				modifiedColor = effect.parser.parseColor(props[i]);
				initialObject = {0:parseInt(propValue.substr(1,2),16),1:parseInt(propValue.substr(3,2),16),2:parseInt(propValue.substr(5,2),16),hex: propValue};
				modifiedObject = {0:parseInt(modifiedColor.substr(1,2),16),1:parseInt(modifiedColor.substr(3,2),16),2:parseInt(modifiedColor.substr(5,2),16),hex: modifiedColor};
				modifiedStyles[i] = {initial: initialObject, modified: modifiedObject, measureUnit:unit};
			}
			else if(i.indexOf("transform")!=-1){
				unit = "transform";
				transformObject = effect.parser.parseMatrix(propValue,props[i]);
				modifiedStyles[i] = {initial: transformObject.initial, modified: transformObject.modified, measureUnit:unit};
				
			}
			else{
				unit = effect.parser.parseUnitValue(props[i]);
				modifiedStyles[i] = {initial: effect.parser.parseNumericValue(propValue), modified: effect.parser.parseNumericValue(props[i]), measureUnit:unit};
			}
		}
	}
	el.style['will-change'] = willChange;
	return modifiedStyles;
};


effect.animate = function(el,props, callback){
var i = 0,
j = 0, 
cnt = ++effect.animationCounter,
stamp = Date.now();

if(!(el instanceof HTMLElement) && !(el[0] instanceof HTMLElement)){
	props = arguments[0];
	callback = arguments[1];
	el = this.el;
}

effect.animations[cnt] = {};
effect.animations[cnt].el = el[0];
effect.animations[cnt].startTime =0;
effect.animations[cnt].endTime =0;
effect.animations[cnt].durration =0;
effect.animations[cnt].frames = [];
effect.animations[cnt].currentFrame =0;
effect.animations[cnt].lastFrame = 0;
effect.animations[cnt].step =0;
effect.animations[cnt].fps = 60;
effect.animations[cnt].counter = 0;
effect.animations[cnt].timeoutId = null;
effect.animations[cnt].requestAnimationId =0;
effect.animations[cnt].step = Math.round(1000 / effect.animations[cnt].fps);
effect.animations[cnt].lastFrame = Math.round(((props&&props.duration) ? props.duration : 1) *effect.animations[cnt].fps);
effect.animations[cnt].styles = effect.parseStyle(el,props);
effect.animations[cnt].startTime = Date.now();
effect.currentTime = effect.animations[cnt].startTime;
//effect.animations[cnt].requestAnimationId = requestAnimationFrame(go);

if(Object.keys(effect.animations).length==1){
effect.requestAnimationId = requestAnimationFrame(go);
}

function go(ts){
	
	var animationsArray = Object.keys(effect.animations);
	var stamp = Date.now();
	var lag = stamp - effect.currentTime;
	effect.currentTime = stamp;
	effect.odd = (effect.odd == 0)? 1 : 0;
	for(var i=0;i<animationsArray.length;i++){
		cnt = animationsArray[i];
		//console.log(cnt);
		//TODO: implement skipframe
		effect.animations[cnt].counter++;
		/*if(lag > 16) {
			//effect.animations[cnt].timeoutId = effect.animations[cnt].requestAnimationId = requestAnimationFrame(go);
			//effect.requestAnimationId = requestAnimationFrame(go);
			continue;
		}*/
	
		updateStyle(effect.animations[cnt].el,effect.animations[cnt].styles,cnt);
		
		if(effect.animations[cnt].counter>=effect.animations[cnt].lastFrame) {
			effect.animations[cnt].el.style['will-change'] = null;
			delete effect.animations[cnt];
			//console.log(Date.now()-stamp);
			callback && callback();
		}
		
	}
		//effect.animations[cnt].timeoutId = effect.animations[cnt].requestAnimationId = requestAnimationFrame(go);
		effect.requestAnimationId = requestAnimationFrame(go);
		if(animationsArray.length==0){
			cancelAnimationFrame(effect.requestAnimationId);
		}
		
};
	
	function updateStyle(el, styles, cnt){
		var newStyle, i, progress;
		//can turn on easing transition
		progress = effect.animations[cnt].counter/effect.animations[cnt].lastFrame;
		//progress = trans(progress);
		for(i in styles){
			if(styles[i].measureUnit === 'color'){
				updateColor(el, styles, i, progress);
			}
			else if(styles[i].measureUnit==='transform'){
				updateTransform(el, styles, i, progress);
			}
			else if(styles[i].measureUnit!==''){
				updateNumeric(el, styles, i, progress);
			}
			
		}
	}
	
	function updateNumeric(el, styles, i, progress){
		el.style[i] = parseFloat(styles[i].initial + (styles[i].modified - styles[i].initial) * progress).toFixed(2) + styles[i].measureUnit; 
	}
	
	function updateColor(el, styles, i, progress){
		var j = 0, newColor='';
		for(j;j<=2;j++){
		 newColor += effect.utils.rgbToHex(Math.round(styles[i].initial[j] + (styles[i].modified[j]-styles[i].initial[j])*progress)); 
		}
		el.style[i] = "#" + newColor;
	}
	
	function updateTransform(el, styles, i, progress){
		var text, j = 0, newMatrix = [];
		for(j;j<styles[i].initial.length;j++){
			newMatrix[j] = Math.round(styles[i].initial[j] + (styles[i].modified[j]-styles[i].initial[j]) * progress);
		}
		text = (newMatrix.length===6)?'matrix':'matrix3d';
		el.style[i] = text+"(" + newMatrix.join(",") + ")";
	}
};
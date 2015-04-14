effect.easing = {
	test1: function (pos) {
		//could be list of predefined or custom function
		return (-Math.cos(pos*Math.PI)/2) + .5;
		
	},
	
	test2: function(pos) {
		return 1 - (Math.cos(pos * 4.5 * Math.PI) * Math.exp(-pos * 6));
	}
	
}

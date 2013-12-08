(function(window)
{
	function ParticlesEngineEnvironment(params)
	{
		this.params = 
		{
			container: false,				// container where particules are appended
			friction: 0.1,					// amount of air friction applied (from 0 to 1)
	        gravity: new Vector(0,300,0) 	// gravity vector
	    };

	    for(var i in params)
		{
			this.params[i] = params[i];
		}

		this.emitters = new Array();
		this.init();
	}

	var p = ParticlesEngineEnvironment.prototype;

	p.init = function()
	{
		
	}

	p.startEmitters = function()
	{
		for(var i in this.emitters)
		{
			this.emitters[i].start();
		}
	}

	p.stopEmitters = function()
	{
		for(var i in this.emitters)
		{
			this.emitters[i].stop();
		}
	}

	p.refreshEmitters = function()
	{
		for(var i in this.emitters)
		{
			if(!this.emitters[i].params.fixed)
				this.emitters[i].refreshPos();
		}
	}

	p.createEmitter = function(parent, params)
	{
		var e = new ParticlesEngineEmitter(parent, params);
		this.emitters.push(e);
		return e;
	}

	window.ParticlesEngineEnvironment = ParticlesEngineEnvironment;
	
})(window);
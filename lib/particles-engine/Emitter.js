(function(window)
{
	function ParticlesEngineEmitter(parent, params)
	{
		this.params = 
		{
			relative: false,	// if particules are appended inside a parent container or not
			fixed: false,		// if emitter never moves, set this to true to disable emitter velocity calculation
			pps: 5,				// Particles Per Seconds
			limit: 0,			// particles emitted limit
			particles: {},		// particles params
			autoStart: false,	// if emitter start automatically when created
			from: "center",		// from where particles appears (right, left, top, bottom, center, random or a number)
			spread: 500			// starting velocity spread outside emitter
		};

		for(var i in params)
		{
			this.params[i] = params[i];
		}

		this.lastPosRefreshTime = false;
		this.parent = parent ? jQuery(parent)[0] : document.body;
		this.container = this.params.relative ? jQuery(this.parent)[0] : ParticlesEngine.view;
		this.pos = new Vector(0,0,0);
		this.vel = new Vector(0,0,0);
		this.width = 0;
		this.height = 0;
		this.counter = 0;
		this.loopInterval;
		this.particles = new Array();
		this.init();
	}

	var p = ParticlesEngineEmitter.prototype;

	p.init = function()
	{
		jQuery(this.container).css({transformStyle: "preserve-3d"});

		this.refreshPos();

		if(!this.parent.emitters)
		{
			this.parent.emitters = new Array();
		}

		this.parent.emitters.push(this);

		if(this.params.autoStart)
		{
			this.start();
		}
	}

	p.start = function()
	{
		this.stop();
		this.loopInterval = setInterval(jQuery.proxy(this.createParticle, this), 1000 / this.params.pps);
		jQuery(this.parent).addClass("emitting");

		return this;
	}

	p.stop = function()
	{
		if(this.loopInterval)
		{
			clearInterval(this.loopInterval);
			this.loopInterval = false;
			jQuery(this.parent).removeClass("emitting");
		}

		return this;
	}

	p.reset = function()
	{
		this.counter = 0;

		return this;
	}

	p.burst = function(amount)
	{
		if(!this.params.fixed && !this.params.relative)
			this.refreshPos();

		for(var i = 0; i < amount; i++)
		{
			this.createParticle(true);
		}

		return this;
	}

	p.toogle = function()
	{
		if(this.loopInterval)
		{
			this.stop();
		}
		else
		{
			this.start();
		}

		return this;
	}

	p.refreshPos = function()
	{
		var p = jQuery(this.parent);
		this.width = p.width();
		this.height = p.height();

		// update position
		if(!this.params.relative)
		{
			var o = p.offset();

			this.pos.x = o.left + (this.width * 0.5);
			this.pos.y = o.top + (this.height * 0.5);
			this.pos.z = 0; //TODO: get the translateZ position
		}
		else
		{
			//var o = p.position();
			this.pos.x = (this.width * 0.5);
			this.pos.y = (this.height * 0.5);
			this.pos.z = 0; //TODO: get the translateZ position
		}
		

		// update velocity
		var now = (new Date()).getTime();

		if(this.lastPosRefreshTime)
		{
			var deltaTime = now - this.lastPosRefreshTime;
			var pos = new Vector(this.pos);
			pos.substractVector(this.lastPosRefreshPos);

			if(deltaTime)
				pos.multiply(1000 / deltaTime);

			this.vel = pos;
		}

		this.lastPosRefreshTime = now;
		this.lastPosRefreshPos = new Vector(this.pos);
	}

	p.createParticle = function(ommitPosRefresh)
	{
		if(this.params.limit && ++this.counter >= this.params.limit)
		{
			this.stop();

			return false;
		}
		else
		{
			if(!ommitPosRefresh && !this.params.fixed && !this.params.relative)
				this.refreshPos();

			var p = new ParticlesEngineParticle(this.params.particles);
			p.emitterRef = this;

			// positioning
			p.pos.apply(this.pos);

			var values = this.params.from.split(" ");

			if(values.length < 2)
			{
				switch(values[0])
				{
					case "top" : case "bottom" :
						values.push(values[0]);
						values[0] = "random";
					break;

					case "left" : case "right" :
						values.push("random");
					break;

					default :
						values.push(values[0]);
					break;
				}
			}

			if(values[0] == "left")
			{
				values[0] = 0;
			}
			else if(values[0] == "right")
			{
				values[0] = 1;
			}
			else if(values[0] == "center")
			{
				values[0] = 0.5;
			}
			else if(values[0] == "random")
			{
				values[0] = Math.random();
			}
			else
			{
				values[0] = Number(values[0]);
			}

			if(values[1] == "top")
			{
				values[1] = 0;
			}
			else if(values[1] == "bottom")
			{
				values[1] = 1;
			}
			else if(values[1] == "center")
			{
				values[1] = 0.5;
			}
			else if(values[1] == "random")
			{
				values[1] = Math.random();
			}
			else
			{
				values[1] = Number(values[1]);
			}

			var newPos = new Vector((this.width) * (values[0] - 0.5), (this.height) * (values[1] - 0.5), 0);
			p.pos.apply(newPos);

			// inherited velocity
			if(p.params.inheritVelocity)
			{
				var v = new Vector(this.vel);
				v.multiply(p.params.inheritVelocity)
				p.vel.apply(v);
			}

			//p.resize((Math.random() * (this.params.particles.size -5)) + 5);

			if(this.params.spread)
			{
				var m = this.params.spread;
				var x = (Math.random() * m) - (m / 2);
				var y = (Math.random() * m) - (m / 2);
				var z = (Math.random() * m) - (m / 2);
				p.vel.apply(new Vector(x, y, z));
			}

			p.place(p.pos.x, p.pos.y, p.pos.z);

			if(!ParticlesEngine.params.canvas || this.params.relative)
				p.inject(this.container);

			this.particles.push(p);

			return p;
		}
	}

	window.ParticlesEngineEmitter = ParticlesEngineEmitter;

})(window);
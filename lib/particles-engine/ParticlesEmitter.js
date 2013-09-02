function ParticlesEmitter(container, parent, params)
{
	this.params = 
	{
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

	this.container = container ? jQuery(container)[0] : document.body;
	this.parent = parent ? jQuery(parent)[0] : document.body;
	this.pos = new Vector(0,0,0);
	this.vel = new Vector(0,0,0);
	this.width = 0;
	this.height = 0;
	this.counter = 0;
	this.loopInterval;
	this.particles = new Array();
	this.init();
}

ParticlesEmitter.prototype.init = function()
{
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

ParticlesEmitter.prototype.start = function()
{
	this.stop();
	this.loopInterval = setInterval(jQuery.proxy(this.createParticle, this), 1000 / this.params.pps);
	jQuery(this.parent).addClass("emitting");
}

ParticlesEmitter.prototype.stop = function()
{
	if(this.loopInterval)
	{
		clearInterval(this.loopInterval);
		this.loopInterval = false;
		jQuery(this.parent).removeClass("emitting");
	}
}

ParticlesEmitter.prototype.toogle = function()
{
	if(this.loopInterval)
	{
		this.stop();
	}
	else
	{
		this.start();
	}
}

ParticlesEmitter.prototype.refreshPos = function()
{
	// update position
	var p = jQuery(this.parent);
	var o = p.offset();
	this.width = p.width();
	this.height = p.height();

	this.pos.x = o.left + (this.width * 0.5);
	this.pos.y = o.top + (this.height * 0.5);
	this.pos.z = 0; //TODO: get the translateZ position

	// update velocity
	var now = (new Date()).getTime();

	if(this.lastPosRefreshTime)
	{
		var deltaTime = now - this.lastPosRefreshTime;
		var pos = new Vector(this.pos);
		pos.substract(this.lastPosRefreshPos).multiply(1000 / deltaTime);
		this.vel = pos;
	}

	this.lastPosRefreshTime = now;
	this.lastPosRefreshPos = new Vector(this.pos);
}

ParticlesEmitter.prototype.createParticle = function()
{
	this.refreshPos();
	var p = new Particle(this.params.particles);

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
		p.vel.apply(this.vel);
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
	p.inject(this.container);

	this.particles.push(p);

	if(this.params.limit && ++this.counter >= this.params.limit)
	{
		this.stop();
	}

	return p;
}
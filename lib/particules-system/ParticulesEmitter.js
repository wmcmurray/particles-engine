function ParticulesEmitter(parent, params)
{
	this.params = 
	{
		pps: 10,			// Particules Per Seconds
		limit: 0,			// particules emitted limit
		particules: {},		// particules params
		spread: 500			// starting velocity spread outside emitter
	};

	for(var i in params)
	{
		this.params[i] = params[i];
	}

	this.parent = parent ? parent : document.body;
	this.pos = new Vector(jQuery(this.parent).width() * 0.5, jQuery(this.parent).height() * 0.5, 0);
	this.vel = new Vector(0,0,0);
	this.counter = 0;
	this.loopInterval;
	this.particules = new Array();
	this.init();
}

ParticulesEmitter.prototype.init = function()
{
	TweenMax.to(this.parent, 0, {perspective: 500});
	this.start();
}

ParticulesEmitter.prototype.start = function()
{
	this.stop();
	this.loopInterval = setInterval(jQuery.proxy(this.createParticule, this), 1000 / this.params.pps);
}

ParticulesEmitter.prototype.stop = function()
{
	if(this.loopInterval)
	{
		clearInterval(this.loopInterval);
	}
}

ParticulesEmitter.prototype.createParticule = function()
{
	var p = new Particule(this.params.particules);
	p.pos.apply(this.pos);
	p.vel.apply(this.vel);

	//p.resize((Math.random() * 20) + 5);

	if(this.params.spread)
	{
		var m = this.params.spread;
		var x = (Math.random() * m) - (m / 2);
		var y = (Math.random() * m) - (m / 2);
		var z = (Math.random() * m);
		p.vel.apply(new Vector(x, y, z));
	}

	p.place(this.pos.x, this.pos.y, this.pos.z);
	p.inject(this.parent);

	this.particules.push(p);

	if(this.params.limit && ++this.counter >= this.params.limit)
	{
		this.stop();
	}

	return p;
}
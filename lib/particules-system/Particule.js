function Particule(params)
{
	this.params =
	{
		type: "default",	// type of particule (this will be added to className)
		size: 10,			// size (width and height) of particule
		lifetime: 4,		// amount of seconds before particule is deleted
		round: true,		// if particule got round corners or not
		solid: false,		// if particule is affected by collisions
	};

	for(var i in params)
	{
		this.params[i] = params[i];
	}

	this.parent;
	this.view;
	this.pos = new Vector(0,0,0);
	this.vel = new Vector(0,0,0);
	this.init();
}

Particule.prototype.init = function()
{
	this.view = document.createElement("div");
	this.view.className = "particule " + this.params.type;
	this.resize(this.params.size);

	if(this.params.lifetime)
	{
		setTimeout(jQuery.proxy(this.kill, this), this.params.lifetime * 1000);
	}
}

Particule.prototype.inject = function(parent)
{
	this.parent = parent;
	this.parent.appendChild(this.view);

	return this;
}

Particule.prototype.place = function(x, y, z)
{
	TweenMax.to(this.view, 0,
	{
		x: (-(jQuery(this.view).outerWidth() * 0.5) + x),
		y: (-(jQuery(this.view).outerHeight() * 0.5) + y),
		z: z
	});

	return this;
}

Particule.prototype.resize = function(size)
{
	this.params.size = size;
	this.view.style.width = size + "px";
	this.view.style.height = size + "px";

	if(this.params.round)
	{
		jQuery(this.view).css({borderRadius: (this.params.size * 0.5) + "px"});
	}

	return this;
}

Particule.prototype.applyForce = function(vector, deltatime)
{
	this.vel.apply(vector, deltatime);

	return this;
}

Particule.prototype.update = function(deltatime)
{
	// apply collisions
	if(this.params.solid)
	{
		// fake collision with ground
		if(this.pos.z < 0 && this.vel.z < 0)
		{
			this.vel.z = -this.vel.z * 0.75;
		}
	}

	// apply air friction
	this.vel.multiply(0.95);

	// apply velocity
	this.pos.apply(this.vel, deltatime);

	// place the particule
	this.place(this.pos.x, this.pos.y, this.pos.z);

	return this;
}

Particule.prototype.kill = function()
{
	this.parent.removeChild(this.view);
	this.killed = true;

	return this;
}
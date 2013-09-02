function Particle(params)
{
	this.params =
	{
		type: "default",		// type of particle (this will be added to className)
		src: "",				// if specified, particle will be rendered as image
		style: {},				// additionnal style added to particules
		size: 5,				// size (width and height) of particle
		mass: 1,				// multiplier of how gravity affect the particle
		lifetime: 4,			// amount of seconds before particle is deleted
		fade: true,				// fade particle opacity allong with it's lifetime spent
		inheritVelocity: true,	// if the particle inherit emitter velocity or not
		sticky: false,			// if particle tend to stick to the emitter
		round: false,			// if particle got round corners or not
		solid: true			// if particle is affected by collisions
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

Particle.prototype.init = function()
{
	this.view = document.createElement(this.params.src ? "img" : "div");
	this.view.className = "particle " + this.params.type;
	this.resize(this.params.size);

	// random rotation
	TweenMax.to(this.view, 0, {rotation: (Math.random() * 720) - 360});
	//TweenMax.to(this.view, this.params.lifetime, {rotation: (Math.random() * 180) - 90});

	if(this.params.src)
	{
		this.view.src = this.params.src;
	}

	if(this.params.style)
	{
		jQuery(this.view).css(this.params.style);
	}

	if(this.params.lifetime)
	{
		this.bornOn = (new Date()).getTime();
		setTimeout(jQuery.proxy(this.kill, this), this.params.lifetime * 1000);
	}
}

Particle.prototype.getLifeSpent = function()
{
	if(this.params.lifetime)
	{
		var now = (new Date()).getTime();
		var timeSpent = now - this.bornOn;
		var max = this.params.lifetime * 1000;

		return timeSpent / max;
	}

	return false;
}

Particle.prototype.inject = function(parent)
{
	this.parent = parent;
	this.parent.appendChild(this.view);

	return this;
}

Particle.prototype.place = function(x, y, z)
{
	TweenMax.to(this.view, 0,
	{
		x: (-(jQuery(this.view).outerWidth() * 0.5) + x),
		y: (-(jQuery(this.view).outerHeight() * 0.5) + y),
		z: z
	});

	jQuery(this.view).css({zIndex: z});

	return this;
}

Particle.prototype.resize = function(size)
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

Particle.prototype.applyForce = function(vector, deltatime, multiplier)
{
	this.vel.apply(vector, deltatime, multiplier ? multiplier : 1);

	return this;
}

Particle.prototype.update = function(deltatime)
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
	this.vel.multiply(0.9);

	// apply velocity
	this.pos.apply(this.vel, deltatime);

	// place the particule
	this.place(this.pos.x, this.pos.y, this.pos.z);

	if(this.params.lifetime && this.params.fade)
	{
		jQuery(this.view).css({opacity: 1 - this.getLifeSpent()});
	}

	return this;
}

Particle.prototype.kill = function()
{
	this.parent.removeChild(this.view);
	this.killed = true;

	return this;
}
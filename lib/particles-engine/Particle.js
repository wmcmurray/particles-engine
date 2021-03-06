(function(window)
{
	function ParticlesEngineParticle(params)
	{
		this.params =
		{
			type: "default",		// type of particle (this will be added to className)
			src: "",				// if specified, particle will be rendered as image
			style: {},				// additionnal style added to particules
			size: 5,				// size (width and height) of particle, may be an integer or an array of 2 keys (minSize, maxSize)
			mass: 1,				// multiplier of how gravity affect the particle
			lifetime: 2,			// amount of seconds before particle is deleted
			fade: true,				// fade particle opacity allong with it's lifetime spent
			rotate: new Vector(0,0,1),// rotation vector, will generate random rotations
			inheritVelocity: 1,		// multiplier for the amount of emitter velocity transmited to this particle
			sticky: false,			// if particle tend to stick to the emitter
			round: false,			// if particle got round corners or not
			solid: false			// if particle is affected by collisions
		};

		for(var i in params)
		{
			this.params[i] = params[i];
		}

		this.emitterRef;
		this.parent;
		this.view;
		this.pos = new Vector(0,0,0);
		this.vel = new Vector(0,0,0);
		this.rot = new Vector(0,0,0);
		this.init();
	}

	var p = ParticlesEngineParticle.prototype;

	p.init = function()
	{
		this.view = document.createElement(this.params.src ? "img" : "div");
		this.view.className = "particle " + this.params.type;
		this.resize(this.params.size);

		// random rotation
		if(this.params.rotate)
		{
			var o = {};

			if(this.params.rotate.x)
			{
				o.rotationX = this.rot.x = Math.random() * (360 * this.params.rotate.x);
			}
			if(this.params.rotate.y)
			{
				o.rotationY = this.rot.y = Math.random() * (360 * this.params.rotate.y);
			}
			if(this.params.rotate.z)
			{
				o.rotationZ = this.rot.z = Math.random() * (360 * this.params.rotate.z);
			}

			TweenMax.to(this.view, 0, o);
			//TweenMax.to(this.view, this.params.lifetime, {rotation: (Math.random() * 180) - 90});
		}

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

	p.getLifeSpent = function()
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

	p.inject = function(parent)
	{
		this.parent = parent;
		this.parent.appendChild(this.view);

		return this;
	}

	p.place = function(x, y, z)
	{
		TweenMax.to(this.view, 0,
		{
			x: (-(jQuery(this.view).outerWidth() * 0.5) + x),
			y: (-(jQuery(this.view).outerHeight() * 0.5) + y),
			z: z
		});

		//jQuery(this.view).css({zIndex: z});
		this.view.style.zIndex = z;

		return this;
	}

	p.resize = function(size)
	{
		if(Object.prototype.toString.call(size) === '[object Array]' && size[0] && size[1])
			size = size[0] + (Math.random() * (size[1] - size[0]));

		this.params.size = size;
		this.view.style.width = size + "px";
		this.view.style.height = size + "px";

		if(this.params.round)
		{
			jQuery(this.view).css({borderRadius: (this.params.size * 0.5) + "px"});
		}

		return this;
	}

	p.applyForce = function(vector, deltatime, multiplier)
	{
		this.vel.apply(vector, deltatime, multiplier ? multiplier : 1);

		return this;
	}

	p.update = function(deltatime)
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

		// apply velocity
		this.pos.apply(this.vel, deltatime);

		// place the particule
		if(!ParticlesEngine.params.canvas || this.emitterRef.params.relative)
			this.place(this.pos.x, this.pos.y, this.pos.z);

		if(this.params.lifetime && this.params.fade)
		{
			var o = 1 - this.getLifeSpent();
			jQuery(this.view).css({opacity: o > 0 ? o : 0 });
		}

		return this;
	}

	p.kill = function()
	{
		if(this.parent)
			this.parent.removeChild(this.view);
		this.killed = true;

		return this;
	}

	window.ParticlesEngineParticle = ParticlesEngineParticle;
	
})(window);
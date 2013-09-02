function ParticlesEngine(parent, params)
{
	this.params = 
	{
		fps: 24, 						// frames per seconds
        gravity: new Vector(0,200,0), 	// gravity vector
        perspective: 300				// amount of perspective in field of view
    };

    for(var i in params)
	{
		this.params[i] = params[i];
	}

	this.parent = parent ? jQuery(parent)[0] : document.body;
	this.loopInterval;
	this.lastFrame;
	this.emitters = new Array();
	this.init();
}

ParticlesEngine.prototype.init = function()
{
	TweenMax.to(this.parent, 0, {perspective: this.params.perspective});
	this.resizeScene();
	this.start();

	jQuery(window).resize(jQuery.proxy(this.resizeScene, this));

	//TODO: move scene perspective origin on scroll
}

ParticlesEngine.prototype.resizeScene = function()
{
	jQuery(this.parent).css({height: jQuery("html").height()});
}

ParticlesEngine.prototype.getTime = function()
{
	var d = new Date();
	return d.getTime();
}

ParticlesEngine.prototype.start = function()
{
	this.stop();
	this.lastFrame = this.getTime();
	this.loopInterval = setInterval(jQuery.proxy(this.render, this), 1000 / this.params.fps);

	this.startEmitters();
}

ParticlesEngine.prototype.stop = function()
{
	if(this.loopInterval)
	{
		clearInterval(this.loopInterval);
	}

	this.stopEmitters();
}

ParticlesEngine.prototype.startEmitters = function()
{
	for(var i in this.emitters)
	{
		this.emitters[i].start();
	}
}

ParticlesEngine.prototype.stopEmitters = function()
{
	for(var i in this.emitters)
	{
		this.emitters[i].stop();
	}
}

ParticlesEngine.prototype.render = function()
{
	var now = this.getTime();
	var deltaTime = now - this.lastFrame;

	for(var i in this.emitters)
	{
		for(var j in this.emitters[i].particles)
		{
			var p = this.emitters[i].particles[j];

			if(p.killed)
			{
				delete this.emitters[i].particles[j];
			}
			else
			{
				if(p.params.mass != 0)
				{
					p.applyForce(this.params.gravity, deltaTime, p.params.mass);
				}

				if(p.params.sticky)
				{
					var stickyVel = new Vector(this.emitters[i].pos);
					stickyVel.substract(p.pos).multiply(p.params.sticky);

					p.applyForce(stickyVel, deltaTime, 1);
				}

				//p.view.innerHTML = Math.round(p.pos.z);
				p.update(deltaTime);
			}
		}
	}

	this.lastFrame = now;
}

ParticlesEngine.prototype.createEmitter = function(parent, params)
{
	var e = new ParticlesEmitter(this.parent, parent, params);
	this.emitters.push(e);
	return e;
}
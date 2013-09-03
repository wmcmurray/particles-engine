function ParticlesEngine(params)
{
	this.params = 
	{
		fps: 30, 						// frames per seconds
		container: false,				// container where particules are appended
        gravity: new Vector(0,300,0), 	// gravity vector
        perspective: 600				// amount of perspective in field of view
    };

    for(var i in params)
	{
		this.params[i] = params[i];
	}

	this.loopInterval;
	this.lastFrame;
	this.emitters = new Array();
	this.init();
}

ParticlesEngine.prototype.init = function()
{
	var particlesContainer = jQuery(".particles-engine-display");

	// TODO: add this stuff in a DisplayManager
	// create the display container if don't exist
	if(!particlesContainer.length)
	{
		this.parent = document.createElement("div");
		this.parent.className = "particles-engine-display";
		document.body.appendChild(this.parent);

		TweenMax.to(this.parent, 0, {perspective: this.params.perspective});
		this.resizeScene();
		this.scrollScene();

		jQuery(window).resize(jQuery.proxy(this.resizeScene, this));
		jQuery(window).scroll(jQuery.proxy(this.scrollScene, this));
	}

	// if exist (created by an other ParticlesEngine instance), reuse the same
	else
	{
		this.parent = particlesContainer[0];
	}

	this.start();
}

ParticlesEngine.prototype.resizeScene = function()
{
	jQuery(this.parent).css({height: jQuery("html").height()});
}

ParticlesEngine.prototype.scrollScene = function()
{
	var win = jQuery(window);
	var p = jQuery(this.parent);

	var scrollTop = win.scrollTop() + (win.height() * 0.5);
	var scrollLeft = win.scrollLeft() + (win.width() * 0.5);

	var w = p.width();
	var h = p.height();

	var perctTop = Math.round((scrollTop * 100) / h);
	var perctLeft = Math.round((scrollLeft * 100) / w);

	TweenMax.to(this.parent, 0, {perspectiveOrigin: perctLeft + "% " + perctTop + "%"});
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
					stickyVel.substractVector(p.pos).multiply(p.params.sticky);

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
	var e = new ParticlesEmitter(parent, params);
	this.emitters.push(e);
	return e;
}
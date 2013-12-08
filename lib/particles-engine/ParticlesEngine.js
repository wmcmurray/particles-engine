(function(window)
{
	function ParticlesEngineDisplayer()
	{
		this.params = 
		{
			fps: 30, 						// frames per seconds (have no effect if RAF is true)
	        RAF: true,						// use browser RequestAnimationFrame or normal setInterval
	        perspective: 600,				// amount of perspective in field of view
	        canvas: false					// THIS FEATURE IS EXPERIMENTAL AND MAY NOT WORK
	    };

		this.loopInterval;
		this.lastFrame;
		this.environments = new Array();
		this.scrollTop = 0;
		this.scrollLeft = 0;
	}

	var p = ParticlesEngineDisplayer.prototype;

	p.init = function(params)
	{
		this.setParams(params);

		this.view = document.createElement(this.params.canvas ? "canvas" : "div");
		this.view.className = "particles-engine-display" + (this.params.canvas ? "-canvas" : "");
		document.body.appendChild(this.view);

		if(this.params.canvas)
		{
			this.ctx = this.view.getContext("2d");
		}
		else
		{
			TweenMax.to(this.view, 0, {perspective: this.params.perspective});
		}

		jQuery(window).resize(jQuery.proxy(this.resizeScene, this));
		jQuery(window).scroll(jQuery.proxy(this.scrollScene, this));
		this.resizeScene();
		this.scrollScene();
		this.start();
	}

	p.setParams = function(params)
	{
		for(var i in params)
		{
			this.params[i] = params[i];
		}
	}

	p.resizeScene = function()
	{
		if(this.params.canvas)
		{
			var win = jQuery(window);
			this.view.width = win.width();
			this.view.height = win.height();
			//jQuery(this.view).css({height: this.view.height, width: this.view.width});
		}
		else
		{
			jQuery(this.view).css({height: jQuery("html").height()});
		}
	}

	p.scrollScene = function()
	{
		var win = jQuery(window);
		var p = jQuery(this.view);

		this.scrollTop = win.scrollTop();
		this.scrollLeft = win.scrollLeft();

		if(this.params.canvas)
		{
			this.view.style.top = this.scrollTop + "px";
			this.view.style.left = this.scrollLeft + "px";
		}
		else
		{
			var w = p.width();
			var h = p.height();

			var perctTop = Math.round(((this.scrollTop + (win.height() * 0.5)) * 100) / h);
			var perctLeft = Math.round(((this.scrollLeft + (win.width() * 0.5)) * 100) / w);

			TweenMax.to(this.view, 0, {perspectiveOrigin: perctLeft + "% " + perctTop + "%"});
		}
	}

	p.start = function()
	{
		this.stop();
		this.lastFrame = getTime();

		if(this.params.RAF)
			this.loopRequest = window.requestAnimationFrame(jQuery.proxy(this.update, this));
		else
			this.loopInterval = setInterval(jQuery.proxy(this.update, this), 1000 / this.params.fps);
		
		//this.refreshInterval = setInterval(jQuery.proxy(this.refreshEmitters, this), 100);
	}

	p.stop = function()
	{
		if(this.loopRequest)
			window.cancelAnimationFrame(this.loopRequest);

		if(this.loopInterval)
			clearInterval(this.loopInterval);
		
		//if(this.refreshInterval)
		//	clearInterval(this.refreshInterval);
	}

	// p.refreshEmitters = function()
	// {
	// 	for(var i in this.emitters)
	// 	{
	// 		if(!this.emitters[i].params.fixed)
	// 			this.emitters[i].refreshPos();
	// 	}
	// }

	p.update = function()
	{
		var now = getTime();
		var deltaTime = now - this.lastFrame;

		if(this.params.canvas)
		{
			this.ctx.setTransform(1,0,0,1,0,0);
			this.ctx.clearRect(0, 0, this.view.width, this.view.height);
		}

		// environments
		for(var i in this.environments)
		{
			var environment = this.environments[i];

			// emitters
			for(var j in environment.emitters)
			{
				var emitter = environment.emitters[j];

				// particles
				for(var k in emitter.particles)
				{
					var p = emitter.particles[k];

					if(p.killed)
					{
						delete emitter.particles[k];
					}
					else
					{
						// apply gravity
						if(p.params.mass != 0)
						{
							p.applyForce(environment.params.gravity, deltaTime, p.params.mass);
						}

						// apply air friction
						if(environment.params.friction)
						{
							// TODO: find a way to make this depends on deltatime
							p.vel.multiply(1 - environment.params.friction);
						}

						// apply "sticky" param
						if(p.params.sticky)
						{
							var stickyVel = new Vector(emitter.pos);
							stickyVel.substractVector(p.pos).multiply(p.params.sticky);

							p.applyForce(stickyVel, deltaTime, 1);
						}

						p.update(deltaTime);


						// canvas render
						if(this.params.canvas && !emitter.params.relative)
						{
							var x = p.pos.x;
							var y = p.pos.y;
							var z = p.pos.z;
							var size = p.params.size;
							var scale = 1 + (z / 50); // TODO: do a real 3D scale...
							var rot = p.rot.z * (Math.PI/180);
							var midSize = size * 0.5;

							x -= this.scrollLeft;
							y -= this.scrollTop;

							this.ctx.globalAlpha = p.view.style.opacity;
							this.ctx.globalCompositeOperation = "lighter";
							// this.ctx.shadowBlur = 50;
							// this.ctx.shadowColor = "white";
							// this.ctx.shadowOffsetX = 50;
							// this.ctx.shadowOffsetY = 50;
							this.ctx.setTransform(scale,0,0,scale,x,y);
							this.ctx.rotate(rot);

							if(p.params.src)
							{
								this.ctx.drawImage(p.view,-midSize,-midSize,size,size);
							}
							else
							{
								this.ctx.fillStyle = jQuery(p.view).css("background-color");

								if(p.params.round)
								{
									this.ctx.beginPath();
									this.ctx.arc(0,0,size,0,2*Math.PI);
									this.ctx.fill();
								}
								else
								{
									this.ctx.fillRect(0,0,size,size);
								}
							}
						}
					}
				}
			}
		}

		this.lastFrame = now;

		if(this.params.RAF)
			this.loopRequest = requestAnimationFrame(jQuery.proxy(this.update, this));
	}

	p.createEnvironment = function(params)
	{
		var e = new ParticlesEngineEnvironment(params);
		this.environments.push(e);
		return e;
	}

	function getTime()
	{
		var d = new Date();
		return d.getTime();
	}

	window.ParticlesEngine = new ParticlesEngineDisplayer();

})(window);
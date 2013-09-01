function ParticulesSystem(params)
{
	this.params = 
	{
		fps: 30, 						// frames per seconds
        gravity: new Vector(0,150,0) 	// gravity vector
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

ParticulesSystem.prototype.init = function()
{
	this.start();
}

ParticulesSystem.prototype.getTime = function()
{
	var d = new Date();
	return d.getTime();
}

ParticulesSystem.prototype.start = function()
{
	this.stop();
	this.lastFrame = this.getTime();
	this.loopInterval = setInterval(jQuery.proxy(this.render, this), 1000 / this.params.fps);

	for(var i in this.emitters)
	{
		this.emitters[i].start();
	}
}

ParticulesSystem.prototype.stop = function()
{
	if(this.loopInterval)
	{
		clearInterval(this.loopInterval);
	}

	for(var i in this.emitters)
	{
		this.emitters[i].stop();
	}
}

ParticulesSystem.prototype.render = function()
{
	var now = this.getTime();
	var deltaTime = now - this.lastFrame;

	for(var i in this.emitters)
	{
		for(var j in this.emitters[i].particules)
		{
			var p = this.emitters[i].particules[j];

			if(p.killed)
			{
				delete this.emitters[i].particules[j];
			}
			else
			{
				p.applyForce(this.params.gravity, deltaTime);
				p.update(deltaTime);

				//p.view.innerHTML = Math.round(p.pos.z);
			}
		}
	}

	this.lastFrame = now;
}

ParticulesSystem.prototype.createEmitter = function(parent, params)
{
	var e = new ParticulesEmitter(jQuery(parent)[0], params);
	this.emitters.push(e);
	return e;
}
(function(window)
{
	function Vector(x, y, z)
	{
		if(x instanceof Vector)
		{
			y = x.y;
			z = x.z;
			x = x.x;
		}

		this.x = x;
		this.y = y;
		this.z = z;
	}

	var p = Vector.prototype;

	p.apply = function(vector, deltaTime, multiplier)
	{
		var m = typeof deltaTime != "undefined" ? deltaTime / 1000 : 1;
		var m2 = multiplier ? multiplier : 1;
		this.x += (vector.x * m) * m2;
		this.y += (vector.y * m) * m2;
		this.z += (vector.z * m) * m2;

		return this;
	}

	p.multiply = function(amount)
	{
		this.x *= amount;
		this.y *= amount;
		this.z *= amount;

		return this;
	}

	p.divide = function(amount)
	{
		this.x /= amount;
		this.y /= amount;
		this.z /= amount;

		return this;
	}

	p.substract = function(amount)
	{
		this.x -= amount;
		this.y -= amount;
		this.z -= amount;

		return this;
	}

	p.substractVector = function(vector)
	{
		this.x -= vector.x;
		this.y -= vector.y;
		this.z -= vector.z;

		return this;
	}

	p.toString = function()
	{
		return "[" + Math.round(this.x) + "," + Math.round(this.y) + "," + Math.round(this.z) + "]";
	}

	window.Vector = Vector;

})(window);
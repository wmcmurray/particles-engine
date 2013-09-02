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

Vector.prototype.apply = function(vector, deltaTime, multiplier)
{
	var m = typeof deltaTime != "undefined" ? deltaTime / 1000 : 1;
	var m2 = multiplier ? multiplier : 1;
	this.x += (vector.x * m) * m2;
	this.y += (vector.y * m) * m2;
	this.z += (vector.z * m) * m2;

	return this;
}

Vector.prototype.multiply = function(amount)
{
	this.x *= amount;
	this.y *= amount;
	this.z *= amount;

	return this;
}

Vector.prototype.substract = function(vector)
{
	this.x -= vector.x;
	this.y -= vector.y;
	this.z -= vector.z;

	return this;
}

Vector.prototype.toString = function()
{
	return "[" + Math.round(this.x) + "," + Math.round(this.y) + "," + Math.round(this.z) + "]";
}
function Vector(x, y, z)
{
	this.x = x ? x : 0;
	this.y = y ? y : 0;
	this.z = z ? z : 0;
}

Vector.prototype.apply = function(vector, deltaTime)
{
	var m = typeof deltaTime != "undefined" ? deltaTime / 1000 : 1;
	this.x += (vector.x * m);
	this.y += (vector.y * m);
	this.z += (vector.z * m);
}

Vector.prototype.multiply = function(amount)
{
	this.x *= amount;
	this.y *= amount;
	this.z *= amount;
}

Vector.prototype.toString = function()
{
	return "[" + Math.round(this.x) + "," + Math.round(this.y) + "," + Math.round(this.z) + "]";
}
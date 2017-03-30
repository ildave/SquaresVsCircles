function Bullet(row, id) {
	this.row = row;
	this.r = 5;
	this.x = 50 + 5 + 40; //TODO: remove magic numbers;
	this.y = row * 50 + 25; //TODO: remove magic numbers;
	this.color = "red";
	this.speed = 2;
	this.id = id;

	this.update = function() {
		this.x = this.x + this.speed;
	}
}
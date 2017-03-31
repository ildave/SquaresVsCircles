function Bullet(row, turret) {
	this.row = row;
	this.r = 3;
	this.x = turret.col * 50 + 5 + 40; //TODO: remove magic numbers;
	this.y = row * 50 + 25; //TODO: remove magic numbers;
	this.color = "blue";
	this.speed = 2;
	this.id = -1;
	this.turret = turret;

	this.update = function() {
		this.x = this.x + this.speed;
	}
}
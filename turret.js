function Turret(row, col, field, currentTime) {
	this.row = row;
    this.col = col;
	this.field = field;
	this.color = "black";
	this.previousTime = currentTime;
	this.currentTime = currentTime;
	this.elapsed = 0;

	this.shoot = function(t, critters) {
        var shoot = false;
        for (var i = 0; i < critters.length; i++) {
            if (critters[i].row == this.row) {
                shoot = true;
                break;
            }
        }
        if (shoot) {
            this.previousTime = this.currentTime;
            this.currentTime = t;
            this.elapsed += this.currentTime - this.previousTime;
            if (this.elapsed >= 1000) {
                this.elapsed = 0;
                return this.spawnBullet();
            }
        }
	}

	this.spawnBullet = function() {
		var bullet = new Bullet(this.row, this);
		return bullet;
	}
}
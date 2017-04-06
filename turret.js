function Turret(row, col, field, currentTime) {
	this.row = row;
    this.col = col;
	this.field = field;
	this.color = "black";
	this.previousTime = currentTime;
	this.currentTime = currentTime;
	this.elapsed = 0;
    this.id = 0;
    this.life = 5000;
    this.cost = 10;
    this.width = 40;

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
            if (this.elapsed >= 1500) {
                this.elapsed = 0;
                return this.spawnBullet();
            }
        }
	}

	this.spawnBullet = function() {
		var bullet = new Bullet(this.row, this);
		return bullet;
	}

    this.isDead = function() {
        return this.life <= 0;
    }
}
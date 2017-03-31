function Critter(row, field, id, t) {
	this.row = row;
	this.field = field;
	this.y = row * field.rowHeight + (field.rowHeight / 2);
	this.color = "red";
	this.speed = random(3, 7) / 10;
	this.previousSpeed = this.speed;
	this.life = random(3, 12);
	this.r = this.life * 2;
	this.x = field.width - this.r - 5;
	this.id = id;
	this.currentTime = t;
	this.previousTime = t;
	this.elapsed = 0;
	this.attacking = false;

	this.update = function(t, turrets) {
		this.x = this.x - this.speed;
		this.previousTime = this.currentTime;
		this.currentTime = t;

		var touching = false;
		var target;
		
		if (turrets.length == 0) {
			this.attacking = false;
			this.speed = this.previousSpeed;
		}

		for (var i = 0; i < turrets.length; i++) {
			var t = turrets[i];
			if (t.row != this.row) {
				continue;
			}
			if ((t.col * 50 + 45) >= this.x - this.r && (t.col * 50) < this.x + this.r) {
				touching = true;
				target = t;
				break;
			}
		}
		if (touching) {
			this.elapsed = this.currentTime - this.previousTime;
			if (!this.attacking) {
				this.attacking = true;
				this.speed = 0;
			}
			else {
				target.life = target.life - this.elapsed;
			}
		}
		else {
			this.attacking = false;
			this.speed = this.previousSpeed;
		}
		
	}

	this.checkEnd = function() {
		return (this.x <= 0 + (this.field.rowHeight - this.r));
	}

	this.hit = function(bullets) {
		var hitters = new Array();
		for (var i = 0; i < bullets.length; i++) {
			var b = bullets[i];
			if (this.row != b.row) {
				continue;
			}
			if (b.x + b.r >= this.x - this.r && (b.x - b.r) < this.x + this.r) {
				this.life--;
				this.color = "green";
				hitters.push(b);
			}
		}
		return hitters;
	}

	this.attackTurret = function(turrets) {
		var deadTurrets = new Array();
		for (var i = 0; i < turrets.length; i++) {
			var t = turrets[i];
			if (t.row != this.row) {
				continue;
			}
			if ((t.col * 50 + 45) >= this.x - this.r) {
				console.log("touched a turret");
				deadTurrets.push(t);
			}
		}
		return deadTurrets;
	}

	this.isDead = function() {
		return this.life <= 0;
	}
}
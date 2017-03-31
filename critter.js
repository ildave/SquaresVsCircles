function Critter(row, r, field, id, t) {
	this.row = row;
	this.x = field.width - r - 5;
	this.field = field;
	this.y = row * field.rowHeight + (field.rowHeight / 2);
	this.r = r;
	this.color = "red";
	this.speed = random(3, 7) / 10;
	this.previousSpeed = this.speed;
	this.life = 5;
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
		
		console.log("turrets ", turrets.length)
		if (turrets.length == 0) {
			console.log("don't touch", this.id, t.id);
			this.attacking = false;
			this.speed = this.previousSpeed;
		}

		for (var i = 0; i < turrets.length; i++) {
			var t = turrets[i];
			if (t.row != this.row) {
				continue;
			}
			if ((t.col * 50 + 45) >= this.x - this.r) {
				touching = true;
				target = t;
				break;
			}
		}
		if (touching) {
			this.elapsed = this.currentTime - this.previousTime;
			if (!this.attacking) {
				console.log("touched a turret", this.id, t.id);
				this.attacking = true;
				this.speed = 0;
			}
			else {
				console.log("touching a turret", this.id, t.id);
				t.life = t.life - this.elapsed;
			}
		}
		else {
			console.log("don't touch", this.id, t.id);
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
			if (b.x + b.r >= this.x - this.r) {
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
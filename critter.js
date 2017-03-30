function Critter(row, r, field, id) {
	this.row = row;
	this.x = field.width - r - 5;
	this.field = field;
	this.y = row * field.rowHeight + (field.rowHeight / 2);
	this.r = r;
	this.color = "red";
	this.speed = random(1, 2);
	this.life = 2;
	this.id = id;

	this.update = function() {
		this.x = this.x - this.speed;
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

	this.isDead = function() {
		return this.life <= 0;
	}
}
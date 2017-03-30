function Game(field, scene) {
	this.field = field;
	this.scene = scene
	this.critters = new Array();
	this.running = 0;
    this.started = 0;
    this.ended = 0;
	this.currentTime = 0;
	this.previousTime = 0;
	this.elapsed = 0;
	this.critterID = 0;
	this.bulletID = 0;
	this.turrets = new Array(this.field.height / this.field.rowHeight);
	this.bullets = new Array();

	this.setup = function() {
		
	}

	this.draw = function() {
		scene.drawField(this.field);
		scene.drawCritters(this.critters);
		scene.drawTurrets(this.turrets);
		scene.drawBullets(this.bullets);
	}

	this.spawnCritter = function() {
		var critter = new Critter(random(0, 7), random(15, 23), this.field, this.critterID);
		this.critters.push(critter);
		this.critterID++;
	}

	this.spawnTurret = function(y) {
        if (this.running == 0) {
            return;
        }
		var row = Math.floor(y / this.field.rowHeight);
		if (this.turrets[row]) {
			return;
		}
		var turret = new Turret(row, this.field, this.currentTime);
		this.turrets[row] = turret;
	}

	this.run = function(t) {
        if (this.started == 0 || this.ended == 1) {
            return;
        }
		this.previousTime = this.currentTime;
		this.currentTime = t;
		this.elapsed += this.currentTime - this.previousTime;
		var n = random(2, 4);
		if (this.elapsed >= n * 1000) {
			this.elapsed = 0;
			this.spawnCritter();
		}
		for (var i = 0; i < this.bullets.length; i++) {
			this.bullets[i].update();
			if (this.bullets[i].x + this.bullets[i].r > this.field.width) {
				this.removeBullet(this.bullets[i]);
			}
		}
		for (var i = 0; i < this.critters.length; i++) {
			this.critters[i].update();
			var hitters = this.critters[i].hit(this.bullets);
			for (var j = 0; j < hitters.length; j++) {
				this.removeBullet(hitters[j]);
			}
			if (this.critters[i].isDead()) {
				this.removeCritter(this.critters[i]);
			}
		}
		for (var i = 0; i < this.turrets.length; i++) {
			if (!this.turrets[i]) {
				continue;
			}
			var b = this.turrets[i].shoot(t, this.critters);
			if (b) {
				this.bulletID++;
				b.id = this.bulletID;
				this.bullets.push(b);
			}
		}
		this.draw();
		var end = false;
		for (var i = 0; i < this.critters.length; i++) {
			if (this.critters[i].checkEnd()) {
				end = true;
				break;
			}
		}
		if (end) {
            this.ended = 1;
			cancelAnimationFrame(this.running);
		}
		else {
			var that = this;
			this.running = requestAnimationFrame(function(t) {
				that.run(t);
			});
		}
	}

	this.click = function(x, y) {
		var toRemove = new Array();
		for (var i = 0; i < this.critters.length; i++) {
			this.critters[i].hit(x, y);
			if (this.critters[i].life == 0) {
				toRemove.push(this.critters[i]);
			}
		}
		if (toRemove.length > 0) {
			 for(var i = 0; i < toRemove.length; i++) {
			 	this.removeCritter(toRemove[i]);
			 }
		}
	}

	this.removeCritter = function(critter) {
		var index = -1;
		for (var i = 0; i < this.critters.length; i++) {
			if (this.critters[i].id == critter.id) { 
				index = i;
				break;
			}
		}
		if (index > -1) {
			this.critters.splice(index, 1);
		}
	}

	this.removeBullet = function(bullet) {
		var index = -1;
		for (var i = 0; i < this.bullets.length; i++) {
			if (this.bullets[i].id == bullet.id) {
				index = i;
				break; 
			}
		}
		if (index > -1) {
			this.bullets.splice(index, 1);
		}
	}
}
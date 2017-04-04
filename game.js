function Game(field, scene, DOMObjects) {
	this.DOMObjects = DOMObjects;
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
	this.turretID = 0;
	this.turrets = new Array();
	this.bullets = new Array();
	this.deadCritters = 0;
	this.deadTurrets = 0;
	this.waveNumber = 1;
	this.waveCount = Math.round(4*Math.log(this.waveNumber) + 2 * this.waveNumber);
	this.waveSpawned = 0;
	this.waveAlive = this.waveCount;
	this.waveOnScreen = 0;
	this.elapsedBetweenWaves = 0;
	this.coins = 21;

	this.setup = function() {
		console.log("Setup");
		console.log("current wave: ", this.waveNumber);
		console.log("wave count: ", this.waveCount);
		console.log("wave spawned: ", this.waveSpawned);
		console.log("wave alive: ", this.waveAlive);
		console.log("wave onscreen", this.waveOnScreen);
		console.log("Fine setup");
	}

	this.draw = function() {
		scene.drawField(this.field, this.deadCritters, this.deadTurrets, this.waveNumber, this.waveOnScreen, this.coins);
		scene.drawCritters(this.critters);
		scene.drawTurrets(this.turrets);
		scene.drawBullets(this.bullets);
	}

	this.spawnCritter = function(t) {
		var critter = new Critter(random(0, 7), this.field, this.critterID, t);
		this.critters.push(critter);
		this.critterID++;
	}

	this.spawnTurret = function(x, y) {
        if (this.running == 0) {
            return;
        }
		if (this.coins <= 0) {
			return;
		}
		var row = Math.floor(y / this.field.rowHeight);
		var col = Math.floor(x / this.field.rowHeight);
		for (var i = 0; i < this.turrets.length; i++) {
			if (this.turrets[i].row == row && this.turrets[i].col == col) {
				return;
			}
		}
		var turret = new Turret(row, col, this.field, this.currentTime);
		this.turretID++;
		turret.id = this.turretID;
		this.turrets.push(turret);
		this.coins = this.coins - turret.cost;
	}

	this.run = function(t) {
        if (this.started == 0 || this.ended == 1) {
            return;
        }
		this.previousTime = this.currentTime;
		this.currentTime = t;
		this.elapsed += this.currentTime - this.previousTime;
		if (this.waveSpawned <  this.waveCount) { //middle of a wave, spawn until max
			var n = random(1, 3);
			if (this.elapsed >= n * 1000) {
				this.elapsed = 0;
				this.spawnCritter(t);
				this.waveSpawned = this.waveSpawned + 1;
				this.waveOnScreen++;
			}
		}
		if (this.waveSpawned == this.waveCount && this.waveAlive == 0) {//end of wave, start next 
			this.elapsedBetweenWaves += this.currentTime - this.previousTime;
			if (this.elapsedBetweenWaves >= 5000) { //but wait 5 seconds
				this.waveNumber = this.waveNumber + 1;
				this.waveCount = Math.round(4*Math.log(this.waveNumber) + 2 * this.waveNumber);
				this.waveSpawned = 0;
				this.waveAlive = this.waveCount;
				this.waveOnScreen = 0;
				this.elapsedBetweenWaves = 0;
			}
		}
		
		
		for (var i = 0; i < this.bullets.length; i++) {
			this.bullets[i].update();
			if (this.bullets[i].x + this.bullets[i].r > this.field.width) {
				this.removeBullet(this.bullets[i]);
			}
		}
		for (var i = 0; i < this.critters.length; i++) {
			this.critters[i].update(t, this.turrets);
			var hitters = this.critters[i].hit(this.bullets);
			for (var j = 0; j < hitters.length; j++) {
				this.removeBullet(hitters[j]);
			}
			if (this.critters[i].isDead()) {
				this.deadCritters++;
				this.waveAlive = this.waveAlive - 1;
				this.waveOnScreen--;
				this.coins = this.coins + this.critters[i].startingLife;
				this.removeCritter(this.critters[i]);
			}

		}
		for (var i = 0; i < this.turrets.length; i++) {
			if (!this.turrets[i]) {
				continue;
			}
			if (this.turrets[i].isDead()) {
				this.deadTurrets++;
				this.removeTurret(this.turrets[i]);
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
			this.scene.drawEnd();
			cancelAnimationFrame(this.running);
			this.DOMObjects.startButton.disabled = false; //ugly ugly ugly
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

	this.removeTurret = function(turret) {
		if (!turret) {
			return; //but why??
		}
		var index = -1;
		for (var i = 0; i < this.turrets.length; i++) {
			if (this.turrets[i].id == turret.id) {
				index = i;
				break; 
			}
		}
		if (index > -1) {
			this.turrets.splice(index, 1);
		}
	}
}
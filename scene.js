function Scene(ctx) {
	this.ctx = ctx;

	this.drawField = function(field) {
		ctx.clearRect(0, 0, field.width, field.height);
		for (var i = 0; i < field.height; i = i + field.rowHeight) {
			ctx.beginPath();
			ctx.moveTo(0, i);
			ctx.lineTo(field.width, i);
			ctx.stroke();
			ctx.closePath();
		}
		ctx.beginPath();
		ctx.moveTo(field.rowHeight, 0);
		ctx.lineTo(field.rowHeight, field.height);
		ctx.stroke();
		ctx.closePath();
	}

	this.drawCritters = function(critters) {
		for (var i = 0; i < critters.length; i++) {
			var c = critters[i];
			ctx.save();
			ctx.beginPath();
			ctx.fillStyle = c.color;
			ctx.arc(c.x, c.y, c.r, 0, 2*Math.PI);
			ctx.fill();
			ctx.closePath();
			ctx.restore();
		}
	}

	this.drawBullets = function(bullets) {
		for (var i = 0; i < bullets.length; i++) {
			var b = bullets[i];
			ctx.save();
			ctx.beginPath();
			ctx.fillStyle = b.color;
			ctx.arc(b.x, b.y, b.r, 0, 2*Math.PI);
			ctx.fill();
			ctx.closePath();
			ctx.restore();
		}
	}

	this.drawTurrets = function(turrets) {
		for (var i = 0; i < turrets.length; i++) {
			var t = turrets[i];
			if (!t) {
				continue;
			}
			var x = t.field.rowHeight + 5;
			var y = t.row * t.field.rowHeight + 5;
			ctx.save();
			ctx.beginPath();
			ctx.fillStyle = t.color;
			ctx.rect(x, y, 40, 40);
			ctx.fill();
			ctx.closePath();
			ctx.restore();
		}
	}	
}
function Field(width, height, rowHeight) {
	this.width = width;
	this.height = height;
	this.rowHeight = rowHeight;

	this.draw = function(ctx) {
		for (var i = 0; i < this.height; i = i + this.rowHeight) {
			ctx.beginPath();
			ctx.moveTo(0, i);
			ctx.lineTo(this.width, i);
			ctx.stroke();
		}
	}
}
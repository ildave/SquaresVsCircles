function Blocker(row, col, field, currentTime) {
	this.row = row;
    this.col = col;
	this.field = field;
	this.color = "black";
	this.previousTime = currentTime;
	this.currentTime = currentTime;
	this.elapsed = 0;
    this.id = 0;
    this.life = 10000;
    this.cost = 25;
    this.width = 20;
    this.height = 40;
}
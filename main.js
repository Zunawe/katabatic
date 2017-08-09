var phi = (1 + Math.sqrt(5)) / 2;
var dt = 0.02;
var windSpeed = 5;

function App(){
	var _this = this;

	_this.start = function (){
		_this.canvas = document.getElementById('my-canvas');
		_this.ctx = _this.canvas.getContext('2d');

		_this.trees = [];
		for(var i = 0; i < 20; ++i){
			let depth = Math.random() * 100;
			_this.trees.push(new Tree(_this.ctx, {x: 100 + (30 * (i + Math.random())), y: 200 - depth, scale: 60 * (1 - (depth / 100)) + 10}));			
		}

		_this.wind = new Wind(windSpeed);

		_this.ctx.canvas.width = window.innerWidth;
		_this.ctx.canvas.height = window.innerHeight;
		setInterval(_this.update, 20);
	};

	_this.clear = function (){
		_this.ctx.clearRect(0, 0, _this.ctx.canvas.width, _this.ctx.canvas.height);
	};

	_this.update = function (){
		_this.clear();
		_this.ctx.fillStyle = '#4B5';

		var d = new Date();
		_this.trees.forEach((tree) => tree.update(_this.wind.getForce(d.getTime() + ((tree.x / _this.ctx.canvas.width) * 100) + ((tree.y / _this.ctx.canvas.height) * 60))));
	}
}

function Tree(ctx, options){
	var _this = this;

	_this.salt = Math.random();

	_this.kappa = 30;
	_this.omega = 0;
	_this.theta = ((_this.salt * 10)) * Math.PI / 180;

	options = options === undefined ? {} : options;

	_this.ctx = ctx;

	_this.x = options.x === undefined ? 0 : options.x;
	_this.y = options.y === undefined ? 0 : options.y;
	_this.r = options.r === undefined ? phi + (_this.salt * 0.3) - 0.15 : options.r;
	_this.scale = options.scale === undefined ? 1 : options.scale;

	_this.draw = function (){
		_this.ctx.save();
		_this.ctx.translate(_this.x, _this.y);
		_this.ctx.rotate(_this.theta / 2);
		_this.ctx.scale(_this.scale, _this.scale);

		_this.ctx.beginPath();
		_this.ctx.moveTo(-0.5, _this.r * 0.25);
		_this.ctx.lineTo(0.5, _this.r * 0.25);

		_this.ctx.rotate(_this.theta);
		_this.ctx.lineTo(0, -_this.r * 0.75);

		_this.ctx.closePath();
		_this.ctx.fill();
		_this.ctx.restore();
	};

	_this.update = function (Fw){
		var tao = (_this.r * Fw * Math.sin(_this.theta + (Math.PI / 2))) - (_this.kappa * _this.theta) - (2 * _this.omega);
		var alpha = tao / _this.r / _this.r;

		_this.theta = _this.theta + (_this.omega * dt) + (0.5 * alpha * dt * dt);
		_this.omega = _this.omega + (alpha * dt);

		_this.draw();
	}
}

function Wind(speed){
	var _this = this;

	_this.speed = speed ? speed : 5;

	_this.getForce = function (t){
		var speed = Math.sqrt(_this.speed / 3);
		return (speed * Math.sin(t / Math.PI)) * ((speed * Math.sin(t / 100))) + (speed * 0.7);
		// return (((Math.sin(_this.speed * t / (3 * Math.PI))) * (Math.sin(_this.speed * t / 100))) * (_this.speed / 15) + (_this.speed / 15)) * (_this.speed / 10) + 10;
	}
}

var app = new App();

document.addEventListener('DOMContentLoaded', function (){
	app.start();
});

window.addEventListener('resize', function (){
	app.ctx.canvas.width = window.innerWidth;
	app.ctx.canvas.height = window.innerHeight;
	app.update();
});
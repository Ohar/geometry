const defaultColor = 'black'
const defaultLineWidth = 1

/*
* Geometry is small render library to work with geometric shapes
* */
function Geometry (canvasId) {
	const canvas = document.getElementById(canvasId),
		ctx = canvas.getContext('2d'),
		shapesList = []

	ctx.strokeStyle = defaultColor
	ctx.fillStyle = defaultColor

	/*
	* "ShapeList" and "redraw" are necessary.
	* It allows geometry to clear canvas from outdated shapes and draw fresh ones in the right order.
	* There is no any optimizations and that`s why even correct old shapes clears and draw again.
	* If "geometry" suppose to be a real production draw library (e. g. for game engine),
	* then, for sure, it needs a lot of optimizations.
	* */
	function redraw () {
		ctx.clearRect(0, 0, canvas.width, canvas.height)

		forEach(shapesList, function (shape) {
			shape.draw()
		})
	}

	return {
		Circle : Circle(ctx, shapesList, redraw),
		Point  : Point(ctx, shapesList, redraw),
		Polygon: Polygon(ctx, shapesList, redraw),
	}
}


function Circle (ctx, shapesList, redraw) {
	return function (x, y, radius, color) {
		const self = this

		self.x = x
		self.y = y
		self.radius = radius
		self.color = color

		self.draw = function () {
			ctx.beginPath()
			ctx.arc(self.x, self.y, self.radius, 0, 2 * Math.PI)
			ctx.strokeStyle = self.color || defaultColor
			ctx.stroke()
			ctx.strokeStyle = defaultColor
		}

		self.scale = function (zoom) {
			self.radius *= zoom
			redraw()
		}

		self.translate = function (x, y) {
			self.x += x
			self.y += y
			redraw()
		}

		self.draw()
		shapesList.push(self)

		return self
	}
}

function Point (ctx, shapesList, redraw) {
	return function (x, y, color) {
		const self = this

		self.x = x
		self.y = y
		self.color = color

		self.draw = function () {
			ctx.beginPath()
			ctx.moveTo(self.x, self.y)
			ctx.lineTo(self.x + 1, self.y + 1)
			ctx.closePath()
			ctx.strokeStyle = self.color || defaultColor
			ctx.stroke()
			ctx.strokeStyle = defaultColor
		}

		self.translate = function (x, y) {
			self.x += x
			self.y += y
			redraw()
		}

		self.scale = function () {
			console.error('I have no any idea how to scale the point.');
		}

		self.draw()
		shapesList.push(self)

		return self
	}
}

function Polygon (ctx, shapesList, redraw) {
	return function (pointList, color) {
		const self = this

		self.pointList = pointList
		self.color = color || defaultColor

		self.draw = function () {
			ctx.beginPath()
			ctx.moveTo(self.pointList[0].x, self.pointList[0].y)

			forEach(self.pointList, function (point) {
				ctx.lineTo(point.x, point.y)
			})

			ctx.lineTo(self.pointList[0].x, self.pointList[0].y)

			ctx.closePath()
			ctx.strokeStyle = self.color || defaultColor
			ctx.stroke()
			ctx.strokeStyle = defaultColor
		}

		self.translate = function (x, y) {
			forEach(self.pointList, function (point) {
				point.x += x
				point.y += y
			})

			redraw()
		}


		/*
		* Scaling is simple here. It scale polygon accordingly its corner.
		* In real library it should calculate polygon center
		* and change points coordinates accordingly to it, not corner.
		* But it needs a lot of math and I just didn`t code it.
		* */
		self.scale = function (zoom) {
			let minX = self.pointList[0].x
			let minY = self.pointList[0].y

			forEach(self.pointList, function (point) {
				minX = Math.abs(point.x) > Math.abs(minX) ? minX : point.x
				minY = Math.abs(point.y) > Math.abs(minY) ? minY : point.y
			})

			forEach(self.pointList, function (point) {
				point.x = (point.x - minX) * zoom + minX
				point.y = (point.y - minY) * zoom + minY
			})

			redraw()
		}

		self.draw()
		shapesList.push(self)

		return self
	}
}

/*
* Just to simplify work with arrays
* */
function forEach (arr, func) {
	const len = arr.length
	let i

	for (i = 0; i < len; i++) {
		func(arr[i], i, arr)
	}
}
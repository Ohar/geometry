const geo = new Geometry('canvas')

const circle1 = new geo.Circle(100, 100, 50, 'red')
const circle2 = new geo.Circle(200, 200, 120, 'green')
const point1 = new geo.Point(300, 300)
const polygon1 = new geo.Polygon(
	[
		{x: 100, y: 100},
		{x: 200, y: 300},
		{x: 700, y: 100},
	],
	'gold'
)
const polygon2 = new geo.Polygon(
	[
		{x: 500, y: 0},
		{x: 100, y: 300},
		{x: 350, y: 180},
		{x: 450, y: 220},
		{x: 450, y: 70},
	],
	'blue'
)

const demoActions = [
	function () {point1.translate(100, 100)},
	function () {circle1.scale(1.2)},
	function () {circle1.translate(100, 20)},
	function () {circle2.scale(.34)},
	function () {circle2.translate(-70, 10)},
	function () {polygon1.translate(100, 20)},
	function () {polygon1.scale(1.25)},
	function () {polygon2.translate(-100, 270)},
	function () {polygon2.scale(.5)},
]

const shower = setInterval(function () {
	if (demoActions.length) {
		demoActions.shift()()
	} else {
		clearInterval(shower)
	}
}, 750)

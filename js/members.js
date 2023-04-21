const cardStatusMap = {}

const cardPerRow = 4
const columnGap = 96
const rowGap = 48
let camera;
let scene;
let renderer;
let cardWidth = 0;
let cardHeight = 0;

function checkAllCardStatus() {
	for(const key in cardStatusMap) {
		if(cardStatusMap.hasOwnProperty(key) &&cardStatusMap[key].active) {
			return key
		}
	}
}

function cardOnClick(event,target, id) {
	console.log(event, target ,id, 'onclick')
	console.log(cardStatusMap)
	const activeCardID = checkAllCardStatus()
	if(activeCardID) {
		console.log('cardStatusMap[activeCardID].originalPosition', cardStatusMap[activeCardID].originalPosition)
		let tween = new TWEEN.Tween(cardStatusMap[activeCardID].css3Object.position)
		.to(cardStatusMap[activeCardID].originalPosition,1500)
		.easing( TWEEN.Easing.Exponential.InOut )
		tween.start()
		cardStatusMap[activeCardID].active = false
	} else {
		cardStatusMap[id].active = true
		let tween=new TWEEN.Tween( target.position )
		.to( { x:0, y:0, z:300 },1000)
		.easing( TWEEN.Easing.Exponential.InOut )
		tween.start()
	}
}

function onWindowResize() {

	camera.aspect = document.body.clientWidth / window.innerHeight;
	camera.updateProjectionMatrix();
	renderer.setSize( document.body.clientWidth, window.innerHeight );
}

function animate() {
	requestAnimationFrame(animate)
	TWEEN.update()
	render()
}

function render() {
	camera.lookAt( scene.position );
	renderer.render( scene, camera );
}

function initilize() {
	camera = new THREE.PerspectiveCamera( 40, document.body.clientWidth / window.innerHeight, 1, 10000 );
	camera.position.z = 1000;
	scene = new THREE.Scene();
	renderer = new THREE.CSS3DRenderer();
	renderer.setSize( document.body.clientWidth, window.innerHeight );
	document.getElementById( 'metamind-members-section' ).appendChild( renderer.domElement );
	window.addEventListener( 'resize', onWindowResize, false );

	const memberCards = Array.from(document.getElementsByClassName('mmv-member-card-container'));
	var i = 0
	const rowNumber = Math.ceil(memberCards.length / cardPerRow)
	for (const card of memberCards) {
		cardWidth = card.clientWidth
		cardHeight = card.clientHeight
		cardStatusMap[card.id] = {
			active: false
		}
		const object = new THREE.CSS3DObject( card );
		const rowWidth = cardWidth * (cardPerRow-1) + columnGap * (cardPerRow-1)
		const totalHeight = cardHeight * rowNumber + rowGap * (rowNumber -1)
		const rowPlace = i % cardPerRow
		card.addEventListener("click", function(event) {
			cardOnClick(event, object, card.id)
		})
		object.position.x = rowPlace * (cardWidth + columnGap) - rowWidth / 2;
		object.position.y =  - Math.floor(i / 4) * (cardHeight + rowGap) + totalHeight / 2 - cardHeight / 2;
		console.log(object)
		scene.add( object );
		cardStatusMap[card.id].originalPosition = {...object.position}
		cardStatusMap[card.id].css3Object = object
		// scene.add
		i++
	}
	console.log(memberCards);

	animate()
}

document.addEventListener("DOMContentLoaded", initilize)



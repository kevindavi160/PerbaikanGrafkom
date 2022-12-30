
//* Initialize webGL with camera and lights
const canvas = document.getElementById("mycanvas");
const renderer = new THREE.WebGLRenderer({ canvas: canvas });
renderer.setClearColor('rgb(255,255,255)');
// create scene and camera
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(90, canvas.width / canvas.height,
  0.1, 1000);
camera.position.z = 10;


const ambientLight = new THREE.AmbientLight(0x909090);
scene.add(ambientLight);
const light = new THREE.DirectionalLight(0x444444);
light.position.set(-1, 1, 1.5);
scene.add(light);

const variables = {
  clockRadius: 5,
  clockWidth: 0.5,
  tickDepth: 0.55,
  tickWidth: 0.1,
  tickHeight: 0.4,
  secondHandDepth: 0.1,
  secondHandHeight: 5 - 1,
  secondHandWidth: 0.1
}

const timer = new THREE.Clock();

const date = new Date();
let hours = date.getHours();
const minutes = date.getMinutes();
const seconds = date.getSeconds();

let hoursVilnius = date.toLocaleString('de-DE', { hour: '2-digit', hour12: false, timeZone: 'Europe/Vilnius' }); //returns string "xx Uhr"

hoursVilnius = hoursVilnius.replace(/[^0-9]/g, '');

if (hours > 11) {
  hours = hours - 12;
}
if (hoursVilnius > 11) {
  hoursVilnius = hoursVilnius - 12;
}

//create the clock body 
const clock = createBody();

createTwelveTick(); //create a tick for twelve
createTicks(); //create small ticks for minutes and bigger ones for 5 minutes
createBlob(); //create blob in the middle
createOuterRing();// create outer ring

const secondHand = createSecondHand(0x000000);
secondHand.position.y = variables.clockWidth / 2;
const secondHand2 = createSecondHand(0xbd460f);
secondHand2.position.y = - (variables.clockWidth / 2);

const hourHand = createHourHand();
hourHand.position.y = variables.clockWidth / 2;
const hourHand2 = createHourHand();
hourHand2.position.y = - (variables.clockWidth / 2);

const minuteHand = createMinuteHand();
minuteHand.position.y = variables.clockWidth / 2;
const minuteHand2 = createMinuteHand();
minuteHand2.position.y = - (variables.clockWidth / 2);

let t = 0;
let t1 = 0;
let t2 = 0;

const controls = new THREE.TrackballControls(camera, canvas);

render();

function render() {
  requestAnimationFrame(render);

  t = timer.getElapsedTime(); //get seconds
  t1 = timer.getElapsedTime() / 60 / 60; // get hours
  t2 = timer.getElapsedTime() / 60; //get minutes

  secondHand.position.x = (Math.sin(Math.PI * 2 / 60 * (seconds + t)) * (variables.secondHandHeight / 2));
  secondHand.position.z = -(Math.cos(Math.PI * 2 / 60 * (seconds + t)) * (variables.secondHandHeight / 2));
  secondHand.rotation.y = -Math.PI * 2 / 60 * (seconds + t);

  // move minute hand
  minuteHand.position.x = (Math.sin(Math.PI * 2 / 60 * (minutes + seconds / 60 + t2)) * 2.2);
  minuteHand.position.z = -(Math.cos(Math.PI * 2 / 60 * (minutes + seconds / 60 + t2)) * 2.2);
  minuteHand.rotation.y = -Math.atan((-(Math.cos(Math.PI * 2 / 60 * (minutes + seconds / 60 + t2)) * 2.2) / (Math.sin(Math.PI * 2 / 60 * (minutes + seconds / 60 + t2)) * 2.2)));

  // move hour hand
  hourHand.position.x = (Math.sin(Math.PI * 2 / 12 * (hours + minutes / 60 + t1)) * 1.5);
  hourHand.position.z = -(Math.cos(Math.PI * 2 / 12 * (hours + minutes / 60 + t1)) * 1.5);
  hourHand.rotation.y = -Math.atan((-(Math.cos(Math.PI * 2 / 12 * (hours + minutes / 60 + t1)) * 1.5) / (Math.sin(Math.PI * 2 / 12 * (hours + minutes / 60 + t1)) * 1.5)));

  secondHand2.position.x = -(Math.sin(Math.PI * 2 / 60 * (seconds + t)) * (variables.secondHandHeight / 2));
  secondHand2.position.z = -(Math.cos(Math.PI * 2 / 60 * (seconds + t)) * (variables.secondHandHeight / 2));
  secondHand2.rotation.y = Math.PI * 2 / 60 * (seconds + t);

  // move minute hand
  minuteHand2.position.x = -(Math.sin(Math.PI * 2 / 60 * (minutes + seconds / 60 + t2)) * 2.2);
  minuteHand2.position.z = -(Math.cos(Math.PI * 2 / 60 * (minutes + seconds / 60 + t2)) * 2.2);
  minuteHand2.rotation.y = Math.atan((-(Math.cos(Math.PI * 2 / 60 * (minutes + seconds / 60 + t2)) * 2.2) / (Math.sin(Math.PI * 2 / 60 * (minutes + seconds / 60 + t2)) * 2.2)));

  // move hour hand
  hourHand2.position.x = -(Math.sin(Math.PI * 2 / 12 * (hoursVilnius + minutes / 60 + t1)) * 1.5);
  hourHand2.position.z = -(Math.cos(Math.PI * 2 / 12 * (hoursVilnius + minutes / 60 + t1)) * 1.5);
  hourHand2.rotation.y = Math.atan((-(Math.cos(Math.PI * 2 / 12 * (hoursVilnius + minutes / 60 + t1)) * 1.5) / (Math.sin(Math.PI * 2 / 12 * (hoursVilnius + minutes / 60 + t1)) * 1.5)));

  controls.update();
  renderer.render(scene, camera);
}

function createBody() {
  const geometry = new THREE.CylinderGeometry(variables.clockRadius, variables.clockRadius, variables.clockWidth, 50);
  const material = new THREE.MeshBasicMaterial({ color: 0xcdd4d3 });
  const clock = new THREE.Mesh(geometry, material);
  clock.rotation.x = Math.PI / 2;
  scene.add(clock);

  return clock;
}

function createTwelveTick() {
  const geometry = new THREE.BoxGeometry(variables.tickWidth * 1.5, variables.tickDepth, variables.tickHeight * 2);
  const material = new THREE.MeshBasicMaterial({ color: 0x23786c });
  const twelveTick = new THREE.Mesh(geometry, material);
  twelveTick.position.z = - (variables.clockRadius - variables.tickHeight);
  clock.add(twelveTick);
}

function createTicks() {
  for (let i = 1; i < 60; i++) {

    if (i % 5 == 0) {
      const geometry = new THREE.BoxGeometry(variables.tickWidth, variables.tickDepth, variables.tickHeight * 2);
      const material = new THREE.MeshBasicMaterial({ color: 0x000000 });
      const fiveTick = new THREE.Mesh(geometry, material);
      clock.add(fiveTick);

      fiveTick.position.x = (Math.sin(Math.PI * 2 / 60 * i) * (variables.clockRadius - variables.tickHeight));
      fiveTick.position.z = -(Math.cos(Math.PI * 2 / 60 * i) * (variables.clockRadius - variables.tickHeight));
      fiveTick.rotation.y = -(Math.PI * 2 / 60 * i);

    } else {

      const geometry = new THREE.BoxGeometry(variables.tickWidth, variables.tickDepth, variables.tickHeight);
      const material = new THREE.MeshBasicMaterial({ color: 0x000000 });
      const tick = new THREE.Mesh(geometry, material);
      clock.add(tick);

      tick.position.x = (Math.sin(Math.PI * 2 / 60 * i) * (variables.clockRadius - variables.tickHeight / 2));
      tick.position.z = -(Math.cos(Math.PI * 2 / 60 * i) * (variables.clockRadius - variables.tickHeight / 2));
      tick.rotation.y = -Math.PI * 2 / 60 * i;
    }
  }
}

function createBlob() {
  const geometry = new THREE.CylinderGeometry(variables.clockRadius / 15, variables.clockRadius / 15, variables.clockWidth * 1.5, 50);
  const material = new THREE.MeshBasicMaterial({ color: 0x4f0903 });
  const blob = new THREE.Mesh(geometry, material);
  clock.add(blob);
}

function createSecondHand(color) {
  const geometry = new THREE.BoxGeometry(variables.secondHandWidth, variables.secondHandDepth, variables.secondHandHeight);
  const material = new THREE.MeshBasicMaterial({ color: color });
  const secondHand = new THREE.Mesh(geometry, material);
  clock.add(secondHand)

  return secondHand;
}

function createHourHand() {
  const geometry = new THREE.SphereGeometry(0.15, 32, 32);
  const material = new THREE.MeshBasicMaterial({ color: 0x121a3d });
  const hourHand = new THREE.Mesh(geometry, material);
  hourHand.scale.x = 10;
  clock.add(hourHand);

  return hourHand;
}

function createMinuteHand() {
  const geometry = new THREE.SphereGeometry(0.15, 32, 32);
  const material = new THREE.MeshBasicMaterial({ color: 0x121a3d });
  const minuteHand = new THREE.Mesh(geometry, material);
  minuteHand.scale.x = 15;
  clock.add(minuteHand);

  return minuteHand;
}

function createOuterRing() {
  var shape = new THREE.Shape();
  shape.moveTo(variables.clockRadius, 0);
  shape.lineTo(variables.clockRadius + 0.2, 1);
  shape.lineTo(variables.clockRadius + 0.2, 0);
  shape.lineTo(variables.clockRadius, 0.8);
  shape.lineTo(variables.clockRadius, 0);

  const geometry = new THREE.LatheGeometry(shape.getPoints(), 50, 0, 6.3);
  const material = new THREE.MeshPhysicalMaterial({ color: 0xeffe2, side: THREE.DoubleSide }, 0.35, 0, 0.6, 0.8, 0)
  const lathe = new THREE.Mesh(geometry, material);
  lathe.position.y = - variables.clockWidth;
  clock.add(lathe);
}

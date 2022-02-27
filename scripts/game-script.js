const canvas = document.querySelector('canvas');
const context = canvas.getContext('2d');
const projectiles = [];
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
const x = canvas.width / 2;
const y = canvas.height / 2;

class Player {
    constructor(x, y, radius, color) {
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.color = color;
        this.moveUp = false;
        this.moveDown = false;
        this.moveRight = false;
        this.moveLeft = false;
    }

    draw() {
        context.beginPath();
        context.arc(this.x, this.y, this.radius, 0, 360, false);//Math.PI * 2
        context.fillStyle = this.color;
        context.fill();
    }

    update() {
        this.draw();
        if(this.moveUp) {
            this.y = this.y - 1;
        }
        if(this.moveDown) {
            this.y = this.y + 1;
        }
        if(this.moveRight) {
            this.x = this.x + 1;
        }
        if(this.moveLeft) {
            this.x = this.x - 1;
        }
    }

    getX() {
        return this.x;
    }

    getY() {
        return this.y;
    }
}
class Projectile {
    constructor(x, y, radius, color, velocity) {
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.color = color;
        this.velocity = velocity;
    }

    draw() {
        context.beginPath();
        context.arc(this.x, this.y, this.radius, 0, 360, false);//Math.PI * 2
        context.fillStyle = this.color;
        context.fill();
    }

    update() {
        this.draw();
        this.x = this.x + this.velocity.x;
        this.y = this.y + this.velocity.y;
    }
}

const player = new Player(x, y, 30, 'green');
// const projectile = new Projectile(player.getX(), player.getY(), 7, 'red', { x: 1, y: 1 });

function clearTrail() {
    context.clearRect(0, 0, canvas.width, canvas.height);
}

function animate() {
    requestAnimationFrame(animate);
    clearTrail();
    //player.draw();
    player.update();
    projectiles.forEach(p => {
        p.update();
    });
}

function pressedUp() {
    player.moveUp = true;
    console.log('Pressed UP');
}

function pressedDown() {
    player.moveDown = true;
    console.log('Pressed DOWN');
}

function pressedRight() {
    player.moveRight = true;
    console.log('Pressed RIGHT');
}

function pressedLeft() {
    player.moveLeft = true;
    console.log('Pressed LEFT');
}

function releasedUp() {
    player.moveUp = false;
    console.log('Released UP');
}

function releasedDown() {
    player.moveDown = false;
    console.log('Released DOWN');
}

function releasedRight() {
    player.moveRight = false;
    console.log('Released RIGHT');
}

function releasedLeft() {
    player.moveLeft = false;
    console.log('Released LEFT');
}

window.addEventListener('click', (e) => {
    const angleRad = Math.atan2(e.clientY - player.getY(), e.clientX - player.getX());
    console.log(angleRad);
    const velocity = { x: Math.cos(angleRad), y: Math.sin(angleRad) };
    projectiles.push(new Projectile(player.getX(), player.getY(), 7, 'red', velocity));
});

document.addEventListener('keydown', function(event) {
    const key = event.key; // "ArrowRight", "ArrowLeft", "ArrowUp", or "ArrowDown"
    const { code } = event;
    if (code === "KeyW") { // KeyA, KeyS, KeyD
        pressedUp();
    }
    if (code === "KeyS") { // KeyA, KeyS, KeyD
        pressedDown();
    }
    if (code === "KeyD") { // KeyA, KeyS, KeyD
        pressedRight();
    }
    if (code === "KeyA") { // KeyA, KeyS, KeyD
        pressedLeft();
    }

    switch (key) {
        case "ArrowLeft":
            pressedLeft();
            break;
        case "ArrowRight":
            pressedRight();
            break;
        case "ArrowUp":
            pressedUp();
            break;
        case "ArrowDown":
            pressedDown();
            break;
    }
});

document.addEventListener('keyup', function(event) {
    const key = event.key; // "ArrowRight", "ArrowLeft", "ArrowUp", or "ArrowDown"
    const { code } = event;
    if (code === "KeyW") { // KeyA, KeyS, KeyD
        releasedUp();
    }
    if (code === "KeyS") { // KeyA, KeyS, KeyD
        releasedDown();
    }
    if (code === "KeyD") { // KeyA, KeyS, KeyD
        releasedRight();
    }
    if (code === "KeyA") { // KeyA, KeyS, KeyD
        releasedLeft();
    }

    switch (key) {
        case "ArrowLeft":
            pressedLeft();
            break;
        case "ArrowRight":
            pressedRight();
            break;
        case "ArrowUp":
            pressedUp();
            break;
        case "ArrowDown":
            pressedDown();
            break;
    }
});

animate();
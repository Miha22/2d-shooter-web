const { gsap } = require('gsap');

const canvas = document.querySelector('canvas');
const context = canvas.getContext('2d');
const projectiles = [];
const enemies = [];
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
            this.y = this.y - 2;
        }
        if(this.moveDown) {
            this.y = this.y + 2;
        }
        if(this.moveRight) {
            this.x = this.x + 2;
        }
        if(this.moveLeft) {
            this.x = this.x - 2;
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
        this.x = this.x + this.velocity.x * 5;
        this.y = this.y + this.velocity.y * 5;
    }
}

class Enemy {
    constructor(x, y, radius, color, velocity, distance) {
        this.x = x;//current pos on X
        this.y = y;//current pos on Y
        this.radius = radius;
        this.strength = radius / 10;
        this.color = color;
        this.distance = distance;
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
        const angleRad = Math.atan2(player.y - this.y, player.x - this.x);
        const velocity = { x: Math.cos(angleRad), y: Math.sin(angleRad) };

        //const newDist = Math.hypot(player.x - this.x, player.y - this.y);

        this.x = this.x + velocity.x * 4;
        this.y = this.y + velocity.y * 4;
        // if(newDist < this.distance) {
        //     this.x = this.x + this.velocity.x;
        //     this.y = this.y + this.velocity.y;
        // }
        // else {   
        //     this.distance = newDist;
        //     this.x = this.x + velocity.x;
        //     this.y = this.y + velocity.y;
        // }
    }
}

const player = new Player(x, y, 30, 'green');
// const projectile = new Projectile(player.getX(), player.getY(), 7, 'red', { x: 1, y: 1 });

function endGame(animationId) {
    cancelAnimationFrame(animationId);
}

function spawnEnemies() {
    setInterval(() => {
        const radius = Math.random() < 0.5 ? 10 : Math.random < 0.5 ? 20 : 30;// Can be random also, but it seems fine for me
        let x, y; //spawn coords.

        if(Math.random() < 0.5) {
            x = Math.random() * canvas.width;
            y = Math.random() < 0.5 ? 0 - radius : canvas.height + radius;
        }
        else {
            x = Math.random() < 0.5 ? 0 - radius : canvas.width + radius;
            y = Math.random() * canvas.height;
        }
        //const color = radius == 10 ? 'yellow' : radius == 20 ? 'orange' : 'rose';
        const color = 'yellow';
        //const color = `hsl(${Math.random() * 360}, 50%, 50)`; // {1: 0-360 red green or blue} {2: saturation in % how deep is this color} {3: lightness, how bright or dull this color is}. Hue saturation lightness
        const angleRad = Math.atan2(player.y - y, player.x - x);
        const velocity = { x: Math.cos(angleRad), y: Math.sin(angleRad) };
        console.log('Spawned enemy');
        const dist = Math.hypot(player.x - velocity.x, player.y - velocity.y);
        enemies.push(new Enemy(x, y, radius, color, velocity, dist));
        //enemies.push(new Enemy(x, y, radius, color, velocity));    
    }, 1000);
}

function clearTrail() {
    //context.fillStyle = 'rgba(0, 0, 0, 0.1)';//fade effect
    context.clearRect(0, 0, canvas.width, canvas.height);
    context.fillStyle = 'rgba(0, 0, 0, 0.1)';
    //context.fillRect(0, 0, canvas.width, canvas.height);
    //context.fillRect(...Enemy);
}

function animate() {
    const animationId = requestAnimationFrame(animate);
    clearTrail();
    //player.draw();
    player.update();
    projectiles.forEach((p, indexP) => {
        p.update();

        //remove projectiles that went beyond the screen
        if(p.x + p.radius < 0 || p.x - p.radius > canvas.width || 
            p.y + p.radius < 0 || p.y - p.radius > canvas.height) {
                setTimeout(() => {
                    projectiles.splice(indexP, 1);
                }, 0);
        }
    });
    enemies.forEach((e, indexE) => {
        e.update();
        const distToPlayer = Math.hypot(player.x - e.x, player.y - e.y);
        if(distToPlayer - e.radius - player.radius < 0.1) {
            setTimeout(() => {
                enemies.splice(indexE, 1);
            }, 0);

            context.beginPath();
            player.radius = player.radius / (1 + e.radius / 100);//change player radius because he got hit by enemy
            context.arc(player.x, player.y, player.radius, 0, 360, false);//Math.PI * 2
            context.fillStyle = player.color;
            context.fill();

            console.log('Player got hit');
            return;
        }

        projectiles.forEach((p, indexP) => {
            const dist = Math.hypot(p.x - e.x, p.y - e.y);

            //when bullet/projectile hits enemy
            if(dist - p.radius - e.radius < 0.1) {
                if(e.radius > 10) {
                    //e.radius /= 2; Gonna make smooth resize
                    gsap.to(e, { radius: e.radius / 2 });
                    setTimeout(() => {
                        projectiles.splice(indexP, 1); 
                    }, 0);
                }
                else {
                    setTimeout(() => {
                        enemies.splice(indexE, 1);
                        projectiles.splice(indexP, 1); 
                        player.radius = player.radius * 1.1;//change player radius because he killed enemy
                    }, 0);
                }

                //Increasing player size if he hit the enemy
                context.beginPath();
                //player.radius = player.radius * 1.1;
                context.arc(player.x, player.y, player.radius, 0, 360, false);//Math.PI * 2
                context.fillStyle = player.color;
                context.fill();
            }
        });
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
    if (code === "KeyW" || key === "ArrowUp") { // KeyA, KeyS, KeyD
        releasedUp();
    }
    if (code === "KeyS" || key === "ArrowDown") { // KeyA, KeyS, KeyD
        releasedDown();
    }
    if (code === "KeyD" || key === "ArrowRight") { // KeyA, KeyS, KeyD
        releasedRight();
    }
    if (code === "KeyA" || key === "ArrowLeft") { // KeyA, KeyS, KeyD
        releasedLeft();
    }

    // switch (key) {
    //     case "ArrowLeft":
    //         pressedLeft();
    //         break;
    //     case "ArrowRight":
    //         pressedRight();
    //         break;
    //     case "ArrowUp":
    //         pressedUp();
    //         break;
    //     case "ArrowDown":
    //         pressedDown();
    //         break;
    // }
});

animate();
spawnEnemies();
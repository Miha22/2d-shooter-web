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
    }

    draw() {
        context.beginPath();
        context.arc(this.x, this.y, this.radius, 0, 360, false);//Math.PI * 2
        context.fillStyle = this.color;
        context.fill();
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
player.draw();
// const projectile = new Projectile(player.getX(), player.getY(), 7, 'red', { x: 1, y: 1 });

function animate() {
    requestAnimationFrame(animate);
    projectiles.forEach(p => {
        p.update();
    });
    // projectile.draw();
    // projectile.update();
}

window.addEventListener('click', (e) => {
    const angleRad = Math.atan2(e.clientY - player.getY(), e.clientX - player.getX());
    console.log(angleRad);
    const velocity = { x: Math.cos(angleRad), y: Math.sin(angleRad) };
    projectiles.push(new Projectile(player.getX(), player.getY(), 7, 'red', velocity));
});

animate();
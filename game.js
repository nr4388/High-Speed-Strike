const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");
const progressBar = document.querySelector("progress");
let policeEvaded = document.getElementById("result");
let currentLevel = document.getElementById("level");
let i = 1;
let seconds = 0;
let moneyPickedUp = 0;
let levels = 0;

//currently a button. change to click
function pause() {
    let pause = confirm("Game paused. Click OK to continue.");
    document.getElementById("canvas").addEventListener("click", pause);

    if (options) {
        ReDopause();
        return;
    }
}

var ReDopause = function() {
    pause();
};

function haveCollided(sprite1, sprite2) {
    return (
        sprite1.x + sprite1.width > sprite2.x &&
        sprite1.y + sprite1.height > sprite2.y &&
        sprite2.x + sprite2.width > sprite1.x &&
        sprite2.y + sprite2.height > sprite1.y
    );
}

class Sprite {
    draw() {
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.rect(this.x, this.y, this.width, this.height);
        ctx.fill();
        ctx.stroke();
    }
}

class Background {
    constructor(x, y) {
        //super();
        this.image = new Image();
        this.image.src = "https://opengameart.org/sites/default/files/background-1_0.png";
        Object.assign(this, { x, y });
    }
    draw() {
        ctx.drawImage(this.image, this.x, this.y);
    }
    static updateBackground() {
        ++topBackground.y;
        ++normalBackground.y;
        moveBackground();
    }
}

function moveBackground() {
    if (normalBackground.y >= 500) {
        topBackground.y = -500;
        normalBackground.y = 0;
    }
}

let topBackground = (new Background(0, -500));
let normalBackground = (new Background(0, 0));

class Hero extends Sprite {
    constructor(x, y, width, height, speed) {
        super();
        this.image = new Image();
        this.image.src = "https://image.ibb.co/e62ZSw/Black_viper.png";
        Object.assign(this, { x, y, width, height, speed });
    }
    draw() {
        ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
    }
}

let hero = new Hero(250, 250, 100, 100, 0.5);

class Police extends Sprite {
    constructor(x, y, width, height, speed) {
        super();
        this.image = new Image();
        this.image.src = "https://image.ibb.co/bOcUub/Police.png";
        Object.assign(this, { x, y, width, height, speed });
    }
    draw() {
        ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
    }
}

let policeCars = [
    new Police(500, 500, 40, 80, 0.007),
    new Police(400, 450, 40, 80, 0.009),
    new Police(300, 475, 40, 80, 0.011)
];

class Heart extends Sprite {
    constructor(x, y, width, height, speed) {
        super();
        this.image = new Image();
        this.image.src = "http://www.freeiconspng.com/uploads/heart-png-15.png";
        Object.assign(this, {x, y, width, height, speed});
    }
    draw() {
        ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
    }
}

let heartsOnStreet = [];

class Money extends Sprite {
    constructor(x, y, width, height, speed) {
        super();
        this.image = new Image();
        this.image.src = "https://vignette.wikia.nocookie.net/clubpenguin/images/2/2b/Money_Bag_Emote.png/revision/latest?cb=20130426014904";
        Object.assign(this, { x, y, width, height, speed });
    }
    draw() {
        ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
    }
}

let moneyBagsOnStreet = [];

function spawnPoliceCars() {
    if (i % 400 === 0) {
        policeCars.push(
            (new Police(Math.random() * 250, Math.random() * 250, 40, 80, 0.007)), (new Police(Math.random() * 250, Math.random() * 250, 40, 80, 0.005))
        );
    }
}

function spawnHeartsOnStreet() {
    if (i % 600 === 0) {
        heartsOnStreet.push(new Heart(Math.random() * 250, Math.random() * 250, 40, 40, 0));
    }
}

function spawnMoneyBagsOnStreet() {
    if (i % 400 === 0) {
        moneyBagsOnStreet.push(new Money(Math.random() * 250, Math.random() * 250, 30, 30, 0));
    }
}

let mouse = { x: 0, y: 0 };
document.body.addEventListener("mousemove", updateMouse);
function updateMouse(event) {
    const { left, top } = canvas.getBoundingClientRect();
    mouse.x = event.clientX - left;
    mouse.y = event.clientY - top;
}

function policeChase(leader, follower, speed) {
    follower.x += (leader.x - follower.x) * speed;
    follower.y += (leader.y - follower.y) * speed;
}

function levelUp() {
    if (i % 1000 === 0) {
        ++levels;
        currentLevel.innerHTML = levels;
    }
}

function updateScene() {
    Background.updateBackground();
    policeChase(mouse, hero, hero.speed);
    policeCars.forEach(police => policeChase(hero, police, police.speed));
    policeCars.forEach(police => {
        if (haveCollided(police, hero)) {
            progressBar.value -= 0.5;
        }
    });
    moneyBagsOnStreet.forEach(money => {
        if (haveCollided(hero, money)) {
            moneyBagsOnStreet.pop();
            policeCars.pop();
            moneyPickedUp += 100;
            policeEvaded.innerHTML = moneyPickedUp;
        }
    });
    heartsOnStreet.forEach(heart => {
        if (haveCollided(hero, heart)) {
            heartsOnStreet.pop();
            ++progressBar.value;
        }
    });
    i++;
    spawnPoliceCars();
    spawnMoneyBagsOnStreet();
    spawnHeartsOnStreet();
    levelUp();
}

function drawScene() {
    topBackground.draw();
    normalBackground.draw();
    hero.draw();
    moneyBagsOnStreet.forEach(money => money.draw());
    heartsOnStreet.forEach(heart => heart.draw());
    policeCars.forEach(police => police.draw());
    updateScene();
    if (progressBar.value <= 0) {
        ctx.font = "35px Arial";
        ctx.fillText("Game over.", 15, canvas.height / 2);
    } else {
        requestAnimationFrame(drawScene);
    }
}

requestAnimationFrame(drawScene);

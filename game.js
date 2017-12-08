const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");
const progressBar = document.querySelector("progress");
let policeEvaded = document.getElementById("result");
let currentLevel = document.getElementById("level");
let i = 1;
let moneyPickedUp = 0;
let levels = 1;


function haveCollided(sprite1, sprite2) {
    return (
        sprite1.x + sprite1.width > sprite2.x &&
        sprite1.y + sprite1.height > sprite2.y &&
        sprite2.x + sprite2.width > sprite1.x &&
        sprite2.y + sprite2.height > sprite1.y
    );
}

function pushOff(c1, c2) {
    if (haveCollided(c1,c2)) {
        if (c1.x + c1.width > c2.x) {
            c1.x -= 5;
            c2.x += 5;
        } else if (c1.y + c1.height > c2.y) {
            c1.y -= 5;
            c2.y += 5;
        } else if (c2.x + c2.width > c1.x) {
            c1.x += 5;
            c2.x -= 5;
        } else {
            c1.y += 5;
            c2.y -= 5;
        }
    }
}

function collisionDetection() {
    for (let i=0; i < policeCars.length; ++i) {
        for (let j=i+1; j < policeCars.length; ++j) {
            pushOff(policeCars[i], policeCars[j]);
        }
    }
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
        this.image = new Image();
        this.image.src =
        "https://opengameart.org/sites/default/files/background-1_0.png";
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

class Hero extends Sprite {
    constructor(x, y, width, height, speed) {
        super();
        this.image = new Image();
        this.image.src = "https://image.ibb.co/kzAd5G/Black_viper.png";
        Object.assign(this, { x, y, width, height, speed });
    }
    draw() {
        ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
    }
}

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

class Heart extends Sprite {
    constructor(x, y, width, height, speed) {
        super();
        this.image = new Image();
        this.image.src = "http://www.freeiconspng.com/uploads/heart-png-15.png";
        Object.assign(this, { x, y, width, height, speed });
    }
    draw() {
        ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
    }
}

class Money extends Sprite {
    constructor(x, y, width, height, speed) {
        super();
        this.image = new Image();
        this.image.src =
        "https://vignette.wikia.nocookie.net/clubpenguin/images/2/2b/Money_Bag_Emote.png/revision/latest?cb=20130426014904";
        Object.assign(this, { x, y, width, height, speed });
    }
    draw() {
        ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
    }
}

let topBackground = new Background(0, -500);
let normalBackground = new Background(0, 0);

let hero = new Hero(250, 250, 40, 80, 0.5);

let policeCars = [
    new Police(500, 500, 40, 80, 0.007),
    new Police(250, 500, 40, 80, 0.009)
];

let moneyBagsOnStreet = [];

let heartsOnStreet = [];

function moveBackground() {
    if (normalBackground.y >= 500) {
        topBackground.y = -500;
        normalBackground.y = 0;
    }
}

function spawnPoliceCars() {
    if (i % 300 === 0) {
        policeCars.push(
            new Police(345, 500, 40, 80, 0.005),
            new Police(225, 500, 40, 80, 0.007)
        );
        if (levels === 1) {
            policeCars.push(
                new Police(345, 0, 40, 80, 0.005),
                new Police(225, 0, 40, 80, 0.007)
            );
        }
    }

    Background.updateBackground();
}

function spawnHeartsOnStreet() {
    if (i % 150 === 0) {
        heartsOnStreet.push(
            new Heart(Math.random() * (470-150) + 150, Math.random() * (470-100) + 100, 40, 40, 0)
        );
    }
}

function spawnMoneyBagsOnStreet() {
    if (i % 150 === 0) {
        moneyBagsOnStreet.push(
            new Money(Math.random() * (470-150) + 150, Math.random() * (470-100) + 100, 30, 30, 0)
        );
    }
}

let mouse = { x: 0, y: 0, width: 0, height: 0 };
document.body.addEventListener("mousemove", updateMouse);
function updateMouse(event) {
    const { left, top } = canvas.getBoundingClientRect();
    mouse.x = event.clientX - left;
    mouse.y = event.clientY - top;
}

function policeChase(leader, follower, speed) {
    follower.x +=
    (leader.x + leader.width / 2 - (follower.x + follower.width / 2)) * speed;
    follower.y +=
    (leader.y + leader.height / 2 - (follower.y + follower.height / 2)) * speed;
}

function levelUp() {
    if (moneyPickedUp % 500 === 0) {
        ++levels;
        currentLevel.innerHTML = levels;
    }
}

function stayOnTheRoad() {
    if (hero.x < 250) {
        hero.x = 250;
    }
}

function startGameScreen() {
    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.font = "27px Arial";
    ctx.fillStyle = "white";
    ctx.align = "center";
    ctx.fillText(
        "It's a high speed chase! Lose the cops!",
        canvas.width / 2 - 230,
        canvas.height / 2 - 20
    );
    ctx.fillText("Click to Go!", canvas.width / 2 - 80, canvas.height / 2 + 60);
    canvas.addEventListener("click", restartGame);
}

function gameOverScreen() {
    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.font = "27px Arial";
    ctx.fillStyle = "white";
    ctx.align = "center";
    ctx.fillText(
        "Welcome to Los Angeles County Jail.",
        canvas.width / 2 - 220,
        canvas.height / 2 - 20
    );
    ctx.font = "20px";
    ctx.fillText(
        "Click to Restart",
        canvas.width / 2 - 95,
        canvas.height / 2 + 60
    );
    canvas.addEventListener("click", restartGame);
}

function restartGame() {
    canvas.removeEventListener("click", restartGame);
    progressBar.value = 100;
    levels = 0;
    currentLevel.innerHTML = levels;
    moneyPickedUp = 0;
    moneyBagsOnStreet.length = 0;
    heartsOnStreet.length = 0;
    policeEvaded.innerHTML = moneyPickedUp;
    Object.assign(hero, { x: canvas.width / 2, y: canvas.height / 2 });
    policeCars = [
        new Police(500, 500, 40, 80, 0.007),
        new Police(250, 500, 40, 80, 0.009)
    ];
    requestAnimationFrame(drawScene);
}

function updateScene() {
    i++;
    spawnPoliceCars();
    Background.updateBackground();
    spawnHeartsOnStreet();
    spawnMoneyBagsOnStreet();
    stayOnTheRoad();
    collisionDetection();
    policeChase(mouse, hero, hero.speed);
    policeCars.forEach(police => policeChase(hero, police, police.speed));
    policeCars.forEach(police => {
        if (haveCollided(police, hero)) {
            progressBar.value -= 1;
        }
    });
    moneyBagsOnStreet.forEach(money => {
        if (haveCollided(hero, money)) {
            let i = moneyBagsOnStreet.indexOf(money);
            moneyBagsOnStreet.splice(i, 1);
            policeCars.shift();
            moneyPickedUp += 100;
            levelUp();
            policeEvaded.innerHTML = moneyPickedUp;
        }
    });
    heartsOnStreet.forEach(heart => {
        if (haveCollided(hero, heart)) {
            let i = heartsOnStreet.indexOf(heart);
            heartsOnStreet.splice(i, 1);
            progressBar.value += 1;
        }
    });
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
        gameOverScreen();
    } else {
        requestAnimationFrame(drawScene);
    }
}

requestAnimationFrame(startGameScreen());
requestAnimationFrame(drawScene);

class Direction {
    constructor() {
        this.x = 0;
        this.y = 0;
    }
}

class Fruit {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
}

class SnakeSegment {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
}

class Snake {
    constructor() {
        this.segments = [];
        this.segments.push(new SnakeSegment(0, 0));
        this.direction = new Direction();
        document.addEventListener("keypress", (keypress) => { this.changeDirection(keypress) });
    }

    getTakenSquares(width, height) {
        let takenSquares = [];
        for (let i = 0; i < this.segments.length; i++) {
            let segment = this.segments[i];
            takenSquares.push(width * segment.y + segment.x);
        }

        return takenSquares;
    }

    changeDirection(keypress) {
        // TODO
        // create a FIFO queue with moves?
        // but only store 2 moves
        switch (keypress["charCode"]) {
            // a
            case 97:
            case 65:
                if (this.direction.x != 1) {
                    this.direction.y = 0;
                    this.direction.x = -1;
                }
                break;
            // d
            case 100:
            case 68:
                if (this.direction.x != -1) {
                    this.direction.y = 0;
                    this.direction.x = 1;
                }
                break;
            // s
            case 115:
            case 83:
                if (this.direction.y != -1) {
                    this.direction.y = 1;
                    this.direction.x = 0;
                }
                break;
            // w
            case 119:
            case 87:
                if (this.direction.y != 1) {
                    this.direction.y = -1;
                    this.direction.x = 0;
                }
                break;
        }
    }

    addSegment() {
        let last = this.segments[this.segments.length - 1];
        this.segments.push(new SnakeSegment(last.x, last.y));
    }

    move() {
        for (let i = this.segments.length - 1; i > 0; i--) {
            this.segments[i].x = this.segments[i - 1].x;
            this.segments[i].y = this.segments[i - 1].y;
        }
        this.segments[0].x += this.direction.x;
        this.segments[0].y += this.direction.y;
    }
}

class Game {
    constructor(canvas) {
        this.score = 0;
        this.scoreDisplay = document.getElementById("score");
        this.canvas = canvas;
        this.ctx = this.canvas.getContext("2d");
        this.snake = new Snake();
        this.fruit = null;
        this.isRunning = true;
        this.width = 20;
        this.height = 20;
        this.segmentWidth = this.canvas.width / this.width;
        this.segmentHeight = this.canvas.height / this.height;
    }

    addFruit() {
        let takenSquares = this.snake.getTakenSquares(this.width, this.height);
        let freeSquares = [];
        for (let i = 0; i < this.width * this.height; i++) {
            if (!takenSquares.includes(i)) {
                freeSquares.push(i);
            }
        }
        console.log(freeSquares.length);
        if (freeSquares.length > 0) {
            let randomIdx = randomInteger(0, freeSquares.length - 1);
            let x = randomIdx % this.width;
            let y = Math.floor(randomIdx / this.width);
            this.fruit = new Fruit(x, y);
            return true;
        }

        return false;
    }

    // draw the game on this.canvas
    draw() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        // draw snake
        for (let i = this.snake.segments.length - 1; i >= 0; i--) {
            if (i == 0) {
                this.ctx.fillStyle = "green";
            } else {
                this.ctx.fillStyle = "gray";
            }
            this.ctx.beginPath();
            this.ctx.fillRect(this.snake.segments[i].x * this.segmentWidth, this.snake.segments[i].y * this.segmentHeight, this.segmentWidth, this.segmentHeight);
            this.ctx.rect(this.snake.segments[i].x * this.segmentWidth, this.snake.segments[i].y * this.segmentHeight, this.segmentWidth, this.segmentHeight);
            this.ctx.stroke();
        }
        // draw fruit
        if (this.fruit != null) {
            this.ctx.fillStyle = "red";
            this.ctx.beginPath();
            this.ctx.fillRect(this.fruit.x * this.segmentWidth, this.fruit.y * this.segmentHeight, this.segmentWidth, this.segmentHeight);
            this.ctx.rect(this.fruit.x * this.segmentWidth, this.fruit.y * this.segmentHeight, this.segmentWidth, this.segmentHeight);
            this.ctx.stroke();
        }
    }

    // progress the game one tick forward
    tick() {
        this.snake.move()
        if (this.fruit != null) {
            if (this.fruit.x == this.snake.segments[0].x && this.fruit.y == this.snake.segments[0].y) {
                this.fruit = null;
                this.snake.addSegment();
                this.score++;
            }
        }
        if (this.fruit == null) {
            this.addFruit();
        }
        this.scoreDisplay.innerText = this.score;
    }

    checkForCollisions() {
        // check if out of the map
        const head = this.snake.segments[0];
        if (head.x < 0 || head.x >= this.width) {
            return false;
        }
        if (head.y < 0 || head.y >= this.height) {
            return false;
        }
        // check for body collision
        for (let i = 2; i < this.snake.segments.length; i++) {
            const segment = this.snake.segments[i];
            if (head.x == segment.x && head.y == segment.y) {
                return false;
            }
        }

        return true;
    }

    // contains the main loop
    async start() {
        while (this.isRunning) {
            this.tick();
            this.draw();
            if (!this.checkForCollisions()) {
                this.isRunning = false;
                alert("Game over!");
            }
            // wait to slow down the loop
            await new Promise(r => setTimeout(r, 250));
        }
        console.log("game over!");
    }
}

function randomInteger(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function main() {
    const canvas = document.getElementById("canvas");
    const game = new Game(canvas);
    game.start();
}

main();

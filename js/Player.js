import { c, cHeight } from "./app.js";
import attack from "./Attack.js";

class Sprite {
    #playerNumber
    #position;
    #size;
    #moveSpeed;
    #velocity;
    #gravity;
    #inAir;
    #isFastFalling;
    keybinds;
    #attacks;
    #color;
    #enemy;

    constructor({playerNumber, position, size, moveSpeed, gravity, color}){
        this.#playerNumber = playerNumber;
        this.#position = position;
        this.#size = size;
        this.#velocity = {x: 0, y: 0};
        this.#moveSpeed = moveSpeed;
        this.#gravity = gravity;
        this.#color = color;
        this.#inAir = false;
        this.#isFastFalling = false;
        this.keybinds = [
            {key: 'w', pressed: false}, //Move up
            {key: 's', pressed: false}, //Move down
            {key: 'a', pressed: false}, //Move left
            {key: 'd', pressed: false}, //Move right
            {key: 'p', pressed: false} //Main attack
        ]
        this.#attacks = [
            new attack.Attack({
                id: 'Main Attack',
                position: { x: 0, y: 0},
                size: { x: 100, y: 50}
            })
        ]
    }

    getPosition(){
        return this.#position;
    }

    getSize(){
        return this.#size;
    }

    setKeybinds(index, key){
        this.keybinds[index].key = key;
    }

    setEnemy(enemy){
        this.#enemy = enemy;
    }

    draw(){
        c.fillStyle = this.#color;
        c.fillRect(this.#position.x, this.#position.y, this.#size.x, this.#size.y);
    }

    update() {
        this.#position.x += this.#velocity.x;
        this.#position.y += this.#velocity.y;
        this.draw(c)

        if (this.#position.y + this.#size.y + this.#velocity.y >= cHeight){
            this.#velocity.y = 0;
            this.#inAir = false;
            if (this.#isFastFalling){
                this.#isFastFalling = false;
                this.#gravity -= this.#moveSpeed.fastFall;
            }    
        } else{
            this.#velocity.y += this.#gravity;
        }
    }

    moveLeft(){
        this.#velocity.x -= this.#moveSpeed.x;
    }

    moveRight(){
        this.#velocity.x += this.#moveSpeed.x;
    }

    resetXMovement(){
        this.#velocity.x = 0;
    }

    jump(){
        if (!this.#inAir) {
            this.#velocity.y -= this.#moveSpeed.y;
            this.#inAir = true;
        }
    }

    fastFall(){
        if (!this.#isFastFalling && this.#inAir){
            this.#gravity += this.#moveSpeed.fastFall;
            this.#isFastFalling = true;
        }
    }

    attack(index){
        c.fillStyle = 'green'
        c.fillRect(
            this.#position.x + this.#attacks[index].getPosition().x,
            this.#position.y + this.#attacks[index].getPosition().y,
            this.#attacks[index].getSize().x,
            this.#attacks[index].getSize().y,  
        )
        if(this.#position.x + this.#attacks[index].getPosition().x + this.#attacks[index].getSize().x >= this.#enemy.getPosition().x){
            console.log('hit');
        }
    }
}

export default {Sprite};
import { c, cHeight } from "./game.js";
import attack from "./Attack.js";

class Sprite {
    #playerNumber
    #health;
    #position;
    #size;
    #moveSpeed;
    #velocity;
    #gravity;

    #inAir;
    #isFastFalling;
    #isFlipped;

    keybinds;
    #attacks;
    #color;

    #enemy;

    constructor({playerNumber, position, size, moveSpeed, gravity, color, healthBar}){
        this.#playerNumber = playerNumber;
        this.#health = { hp: 100, healthBar: healthBar};
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
                size: { x: 100, y: 50},
                damage: 20,
                frameData: {
                    startup: 8,
                    active: 30,
                    endlag: 10
                }
            })
        ]
    }

    //--------------------------------------------------------
    //GETTERS
    getPosition(){
        return this.#position;
    }

    getSize(){
        return this.#size;
    }

    getVelocity(){
        return this.#size;
    }

    getMoveSpeed(){
        return this.#moveSpeed;
    }
    //--------------------------------------------------------
    //SETTERS

    setKeybinds(index, key){
        this.keybinds[index].key = key;
    }

    flip(){
        this.#isFlipped = true;
    }

    unflip(){
        this.#isFlipped = false;
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

        if (this.#enemy.getPosition().x < this.getPosition().x){
            this.flip();
        } else{
            this.unflip();
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

        if (this.#attack[index].getState() == 0){
            setTimeout(() => {
                
            }, timeout);
        }

        c.fillStyle = 'green'
        let attackSize = { x: this.#attacks[index].getSize().x, y: this.#attacks[index].getSize().y};
        this.#isFlipped ? attackSize.x *= -1: attackSize.x *=1; 

        c.fillRect(
            this.#position.x + this.#attacks[index].getPosition().x,
            this.#position.y + this.#attacks[index].getPosition().y,
            attackSize.x,
            attackSize.y,  
        )
        if (!this.#isFlipped){
            if(this.#position.x + this.#attacks[index].getPosition().x + attackSize.x >= this.#enemy.getPosition().x && 
            this.#position.x + this.#attacks[index].getPosition().x  <= this.#enemy.getPosition().x + this.#enemy.getSize().x &&
            this.#position.y + this.#attacks[index].getPosition().y + attackSize.y >= this.#enemy.getPosition().y &&
            this.#position.y + this.#attacks[index].getPosition().y <= this.#enemy.getPosition().y + this.#enemy.getSize().y){
                this.hit(this.#attacks[index].getDamage());
            }
        } else{
            if(this.#position.x + this.#attacks[index].getPosition().x + attackSize.x <= this.#enemy.getPosition().x + this.#enemy.getSize().x && 
            this.#position.x + this.#attacks[index].getPosition().x  >= this.#enemy.getPosition().x  &&
            this.#position.y + this.#attacks[index].getPosition().y + attackSize.y >= this.#enemy.getPosition().y &&
            this.#position.y + this.#attacks[index].getPosition().y <= this.#enemy.getPosition().y + this.#enemy.getSize().y){
                this.hit(this.#attacks[index].getDamage());
            }
        }
    }

    hit(dmg){
        this.#health.hp -= dmg;
        this.#health.healthBar.style.width = this.#health.hp;
    }
}

export default {Sprite};
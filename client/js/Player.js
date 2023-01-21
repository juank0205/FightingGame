import { c, cHeight } from "./game.js";
import attack from "./Attack.js";

class Sprite {
    #health;
    #position;
    #size;
    #moveSpeed;
    #velocity;
    #gravity;

    #frameCounter;
    #activeAttackIndex;

    #inAir;
    #isFastFalling;
    #isFlipped;
    #isAttacking;


    #attacks;
    #color;

    #enemy;

    constructor({ position, size, moveSpeed, gravity, color, healthBar}){
        this.#health = { hp: 100, healthBar: healthBar};
        this.#position = position;
        this.#size = size;
        this.#velocity = {x: 0, y: 0};
        this.#moveSpeed = moveSpeed;
        this.#gravity = gravity;

        this.#color = color;
        this.#frameCounter = 0;
        this.#activeAttackIndex = null;

        this.#inAir = false;
        this.#isFastFalling = false;
        this.#isAttacking = 0;
        this.#attacks = [
            new attack.Attack({
                id: 'Main Attack',
                position: { x: 0, y: 0},
                size: { x: 100, y: 50},
                damage: 20,
                frameData: {
                    startup: 6,
                    active: 15,
                    endlag: 6
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

    getAttackingState(){
        return this.#isAttacking;
    }

    getFrameCounter(){
        return this.#frameCounter;
    }

    getActiveAttack(){
        return this.#activeAttackIndex;
    }
    //--------------------------------------------------------
    //SETTERS

    setFrameCounter(state, index){
        this.#frameCounter = this.#attacks[index].getFrameData(state);
    }

    updateFrameCounter(){
        this.#frameCounter--;
    }
        
    setAtackState(number){
        this.#isAttacking = number;
    }
    
    setEnemy(enemy){
        this.#enemy = enemy;
    }

    setActiveAttack(index){
        this.#activeAttackIndex = index;
    }

    setPosition(x, y){
        this.#position.x = x;
        this.#position.y = y;
    }

    //--------------------------------------------------------
    //FUNCTIONS

    startAttack(index){
        if (this.getAttackingState()  == 0){
            this.setActiveAttack(index);
            this.setAtackState(1);
            this.setFrameCounter('startup', index);
            this.manageFrameData();
        }
    }

    manageFrameData(){
        if(this.getActiveAttack() == null) return;
        if(this.getAttackingState()== 0) return;
        if(this.getAttackingState() == 1){
            if (this.getFrameCounter() == 0){
                this.setAtackState(2);
                this.setFrameCounter('active', this.getActiveAttack());
            }
        }
        if(this.getAttackingState() == 2){
            if(this.getFrameCounter() != 0){
                this.attack(this.getActiveAttack());
            } else{
                this.setAtackState(3);
                this.setFrameCounter('endlag', this.getActiveAttack());
            }
        }
        if(this.getAttackingState() == 3){
            if (this.getFrameCounter() == 0){
                this.setAtackState(0);
                this.#attacks[this.getActiveAttack()].setHitState(false);
                this.setActiveAttack(null)
            }
        }
        this.updateFrameCounter();
    }

    flip(){
        this.#isFlipped = true;
    }

    unflip(){
        this.#isFlipped = false;
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
        c.fillStyle = 'green'
        let attackSize = { x: this.#attacks[index].getSize().x, y: this.#attacks[index].getSize().y};
        this.#isFlipped ? attackSize.x *= -1: attackSize.x *=1; 

        c.fillRect(
            this.#position.x + this.#attacks[index].getPosition().x,
            this.#position.y + this.#attacks[index].getPosition().y,
            attackSize.x,
            attackSize.y,  
        )
        if (this.#attacks[this.getActiveAttack()].getHitState()) return;
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
        this.#attacks[this.getActiveAttack()].setHitState(true);
        this.#health.hp -= dmg;
        console.log(this.#health.healthBar.style.width);
        this.#health.healthBar.style.width = this.#health.hp +'%';
    }
}

export default {Sprite};
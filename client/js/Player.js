import { c, cHeight } from "./game.js";
import attack from "./Attack.js";

class Sprite {
    #health;
    #position;
    #size;
    #moveSpeed;
    #velocity;
    #gravity;
    #color;

    #activeAttackIndex = null;

    #inAir = false;
    #isFastFalling = false;
    #isFlipped;
    #canAttack = true;
    #isAttacking = false;

    #attacks;
    #enemy;

    constructor({ position, size, moveSpeed, gravity, color, healthBar}){
        this.#health = { hp: 100, healthBar: healthBar};
        this.#position = position;
        this.#size = size;
        this.#velocity = {x: 0, y: 0};
        this.#moveSpeed = moveSpeed;
        this.#gravity = gravity;
        this.#color = color;

        this.#attacks = [
            new attack.Attack({
                id: 0,
                position: { x: 0, y: 0},
                size: { x: 100, y: 50},
                damage: 20,
                frameData: {
                    startup: 6,
                    active: 15,
                    endlag: 6
                },
                moveSpeed: 2,
                parent: this
            })
            // new attack.Attack({
            //     id: 'Proyectile',
            //     position: { x: 0, y: 0},
            //     size: { x:100, y:50 },
            //     damage: 10,
            //     isProyectile: true,
            //     frameData: {
            //         startup: 12,
            //         active: 60,
            //         endlag: 0
            //     }
            // })
        ]
    }

    //--------------------------------------------------------
    //GETTERS
    getPosition =() => this.#position;
    getSize = () => this.#size;
    getVelocity = () => this.#size;
    getMoveSpeed = () => this.#moveSpeed;
    getAttackingState = () => this.#isAttacking;
    getActiveAttack = () => this.#activeAttackIndex;
    getCanAttack = () => this.#canAttack;
    getFlip = () => this.#isFlipped;
    getEnemy = () => this.#enemy;

    //--------------------------------------------------------
    //SETTERS        
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

    setCanAttack(value){
        this.#canAttack = value;
    }

    //--------------------------------------------------------
    //FUNCTIONS

    startAttack(index){
        if (this.getCanAttack()){
            this.setActiveAttack(index);
            this.setCanAttack(false);
            this.#attacks[index].startAttack();
        }
    }

    manageAttack(){
        if (this.getActiveAttack() == null) return;
        this.#attacks[this.getActiveAttack()].manageFrameData();
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

    hit(dmg){
        this.#health.hp -= dmg;
        console.log(this.#health.healthBar.style.width);
        this.#health.healthBar.style.width = this.#health.hp +'%';
    }
}

export default {Sprite};
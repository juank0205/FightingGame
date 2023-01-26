import { c } from "./game.js";

class Attack {
    #position;
    #size;
    #damage;
    #frameData;

    #frameCounter;
    #hasHit = false;
    #state = 0;

    parent;

    constructor({ position, size, damage, frameData, parent }){
        this.#position = position;
        this.#size = size;
        this.#damage = damage;
        this.#frameData = frameData;
        this.parent = parent;
    }

    //GETTERS-------------------------
    getPosition = () => this.#position;
    getSize = () => this.#size;
    getDamage = () => this.#damage;
    getHitState = () => this.#hasHit;
    getState = () => this.#state;
    getFrameCounter = () => this.#frameCounter;

    getFrameData(type){
        switch (type) {
            case undefined:
                return this.#frameData;
            case 'startup':
                return this.#frameData.startup;
            case 'active':
                return this.#frameData.active;
            case 'endlag':
                return this.#frameData.endlag;
        }
    }

    //SETTERS--------------------------
    setHitState(state){
        this.#hasHit = state;
    }

    setState(state){
        this.#state = state;
    }

    setFrameCounter(frames){
        this.#frameCounter = frames;
    }

    updateFrameCounter(){
        this.#frameCounter--;
    }

    //FUNCTIONS------------------------
    // move(flipped){
    //     if (flipped){
    //         this.#position -= this.#moveSpeed;
    //     }
    //     this.#position += this.#moveSpeed;
    // }

    startAttack(){
        this.setFrameCounter(this.getFrameData('startup'));
        this.setState(1);
    }

    manageFrameData(){
        if(this.getState() == 0) return;
        if(this.getState() == 1){
            if (this.getFrameCounter() == 0){
                this.setState(2);
                this.setFrameCounter(this.getFrameData('active'));
            }
        }
        if(this.getState() == 2){
            if(this.getFrameCounter() != 0){
                this.attack();
            } else{
                this.setState(3);
                this.setFrameCounter(this.getFrameData('endlag'));
            }
        }
        if(this.getState() == 3){
            if (this.getFrameCounter() == 0){
                this.setState(0);
                this.parent.setCanAttack(true);
                this.setHitState(false);
                this.parent.setActiveAttack(null)
            }
        }
        this.updateFrameCounter();
    }

    attack(){
        c.fillStyle = 'green'
        let attackSize = { x: this.getSize().x, y: this.getSize().y};
        if (this.parent.getFlip()){
            attackSize.x *= -1
            c.fillRect(
                this.parent.getPosition().x + this.getPosition().x,
                this.parent.getPosition().y + this.getPosition().y,
                attackSize.x,
                attackSize.y,  
            )
        } else{
            attackSize.x *=1
            c.fillRect(
                this.parent.getPosition().x + this.parent.getSize().x + this.getPosition().x,
                this.parent.getPosition().y + this.getPosition().y,
                attackSize.x,
                attackSize.y,  
            )
        }
        if (this.getHitState()) return;
        if (!this.parent.getFlip()){
            if(this.parent.getPosition().x + this.parent.getSize().x + this.getPosition().x + attackSize.x >= this.parent.getEnemy().getPosition().x && 
            this.parent.getPosition().x + this.parent.getSize().x + this.getPosition().x  <= this.parent.getEnemy().getPosition().x + this.parent.getEnemy().getSize().x &&
            this.parent.getPosition().y + this.getPosition().y + attackSize.y >= this.parent.getEnemy().getPosition().y &&
            this.parent.getPosition().y + this.getPosition().y <= this.parent.getEnemy().getPosition().y + this.parent.getEnemy().getSize().y){
                this.setHitState(true);
                this.parent.getEnemy().hit(this.getDamage());
            }
        } else{
            if(this.parent.getPosition().x + this.getPosition().x + attackSize.x <= this.parent.getEnemy().getPosition().x + this.parent.getEnemy().getSize().x && 
            this.parent.getPosition().x + this.getPosition().x  >= this.parent.getEnemy().getPosition().x  &&
            this.parent.getPosition().y + this.getPosition().y + attackSize.y >= this.parent.getEnemy().getPosition().y &&
            this.parent.getPosition().y + this.getPosition().y <= this.parent.getEnemy().getPosition().y + this.parent.getEnemy().getSize().y){
                this.setHitState(true);
                this.parent.getEnemy().hit(this.getDamage());
            }
        }
    }

}

export default {Attack};
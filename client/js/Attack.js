class Attack {
    #id;
    #position;
    #size;
    #damage;
    #frameData;

    #hasHit;
    #moveSpeed;
    #isProyectile;

    constructor({ id, position, size, damage, frameData, moveSpeed, isProyectile }){
        this.#id = id;
        this.#position = position;
        this.#size = size;
        this.#damage = damage;
        this.#frameData = frameData;
        this.isProyectile = isProyectile;
        this.#moveSpeed = moveSpeed;
        this.#hasHit = false;
    }

    //GETTERS-------------------------
    getPosition(){
        return this.#position;
    }

    getSize(){
        return this.#size;
    }

    getDamage(){
        return this.#damage;
    }

    getHitState(){
        return this.#hasHit;
    }

    getIsProyectile(){
        return this.#isProyectile;
    }


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

    //FUNCTIONS------------------------
    move(flipped){
        if (flipped){
            this.#position -= this.#moveSpeed;
        }
        this.#position += this.#moveSpeed;
    }

}

export default {Attack};
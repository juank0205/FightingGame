class Attack {
    #id;
    #position;
    #size;
    #damage;
    #frameData;

    #hasHit;

    constructor({id, position, size, damage, frameData}){
        this.#id = id;
        this.#position = position;
        this.#size = size;
        this.#damage = damage;
        this.#frameData = frameData;
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

    //SETTER
    setHitState(state){
        this.#hasHit = state;
    }

}

export default {Attack};
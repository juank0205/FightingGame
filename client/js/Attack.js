class Attack {
    #id;
    #position;
    #size;
    #damage;
    #frameData;
    #state;

    constructor({id, position, size, damage, frameData}){
        this.#state = 0;
        this.#id = id;
        this.#position = position;
        this.#size = size;
        this.#damage = damage;
        this.#frameData = frameData;
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

    getState(){
        return this.#state;
    }

    getFrameData(type){
        switch (type) {
            case undefined:
                return this.#frameData;
                break;
            case 'startup':
                return this.#frameData.startup;
            default:
                break;
        }
    }

    //SETTERS
    setState(newState){
        this.#state = newState;
    }
}

export default {Attack};
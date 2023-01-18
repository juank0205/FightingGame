class Attack {
    #id;
    #position;
    #size;
    #damage;
    #frameData;

    constructor({id, position, size, damage, frameData}){
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


    getFrameData(type){
        switch (type) {
            case undefined:
                return this.#frameData;
                break;
            case 'startup':
                return this.#frameData.startup;
            case 'active':
                return this.#frameData.active;
            case 'endlag':
                return this.#frameData.endlag;
            default:
                break;
        }
    }

}

export default {Attack};
class Attack {
    #id;
    #position;
    #size;
    #damage;

    constructor({id, position, size, damage}){
        this.#id = id;
        this.#position = position;
        this.#size = size;
        this.#damage = damage;
    }

    getPosition(){
        return this.#position;
    }

    getSize(){
        return this.#size;
    }

    getDamage(){
        return this.#damage;
    }
}

export default {Attack};
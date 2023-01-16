class Attack {
    #id;
    #position;
    #size;

    constructor({id, position, size}){
        this.#id = id;
        this.#position = position;
        this.#size = size;
    }

    getPosition(){
        return this.#position;
    }

    getSize(){
        return this.#size;
    }
}

export default {Attack};
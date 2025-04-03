class Broker{
    constructor(){
        this.topics = {}
    }

    subscribe(topic, fn){
        if(!this.topics[topic]){
            this.topics[topic] = []
        }
        this.topics[topic].push(fn)
    }

    publish(topic, data){
        if(!this.topics[topic]) return
        this.topics[topic].forEach(fn => {
            fn(data)
        })

    }

    unsubscribe(topic, fn){
        if(!this.topics[topic]) return
        this.topics[topic] =  this.topics[topic].filter(item => item !== fn)
    }
}

export default new Broker()
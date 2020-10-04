### Storage interface

```

const set = (namespace, key, value) => {
    return new Promise( (resolve, reject) => {
        resolve({ namespace, key })
    })
}

const get = (namespace, key) => {
    return new Promise( (resolve, reject) => {
        resolve({ namespace, key, value })
    })
}

const del = (namespace, key) => {
    return new Promise( (resolve, reject) => {
        resolve({})
    })
}

const init = (...args) => {
    
    return {
        set,
        get,
        del
    }
}

module.exports = { 
    init
};
```
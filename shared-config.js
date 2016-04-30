module.exports = {
    api:{
        port:13337,
        host:'127.0.0.1'
    },
    sessions:{
        sharedSecret:'mysharedsecret',
        tokenTtl:60,
        collectionInterval:1000,
        
    },
    logging:{
      regular:true,
      debug:true
    }
}

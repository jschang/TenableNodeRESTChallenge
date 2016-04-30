module.exports = {  
  methods:{
    POST:require('./create.js'),
    DELETE:require('./delete.js'),
    PATCH:require('./modify.js'),
    GET:require('./fetch.js')
  }
}

//Environments file:
var config = {
    test:
    {
        'DB_CONN_STRING': 'mongodb+srv://cloudy:cloudy1234@cloudy.ktr5m.mongodb.net/<dbname>?retryWrites=true&w=majority'
    }
}

exports.get = function get(env) {
    return config[env] || config.test;
}
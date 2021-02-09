//MODULES:
const	mongoose = require('mongoose');

//CONFIG
const config   = require('../config/config').get(process.env.NODE_ENV);

mongoose
.connect(
  'mongodb+srv://cloudy:cloudy1234@cloudy.ktr5m.mongodb.net/bahoa?retryWrites=true&w=majority',
  {
    useUnifiedTopology: true,
    useNewUrlParser: true,
  }
)
.then(() => console.log(`bahoadb ready to gather data!`))
.catch(err => {
  console.log(`bahoadb connection error: ${err.message}`);
  console.log(err);
});

module.exports = mongoose;
require('../src/db/mongoose');
const User = require('../src/models/user');


// User.findByIdAndUpdate('5ca5494212b07a1960002549', { age: 1 })
//   .then(user => {
//     return User.countDocuments({ age: 1 })
//   })
//   .then(count => {
//     console.log(count);
//   })
//   .catch(error => {
//     console.log(error);
//   });

const updateAgeAndCount = async (id, age) => {
  const user = await User.findByIdAndUpdate(id, { age });
  const count = User.countDocuments({ age });
  return count;
};

updateAgeAndCount('5ca5494212b07a1960002549', 2).then(count => {
  console.log(count);
}).catch(error => {
  console.log(error);
});
require('../src/db/mongoose');
const Task = require('../src/models/task');

// Task.findByIdAndDelete('5ca2baf5209ad01c7478a821')
//   .then(deleteResult => {
//     console.log('deleteResult', deleteResult);
//     return Task.countDocuments({ complete: false });
//   })
//   .then(count => {
//     console.log('count', count);
//     console.log(count);
//   })
//   .catch(error => {
//     console.log(error);
//   });

const deleteTaskAndCount = async (id) => {
  await Task.findByIdAndDelete(id);
  const count = await Task.countDocuments({ complete: false });
  console.log(count);
  return count;
}

deleteTaskAndCount('5ca2a7097871013154cb2aea')
  .then(result => {
    console.log(result);
  })
  .catch(error => {
    console.log(error);
  });
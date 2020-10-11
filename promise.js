// const timeoutPromise = new Promise((resolve, reject) => {
//     setTimeout(() => {
//         reject('Failure!');
//     }, 1000);
// });

// const timeoutPromise = new Promise((resolve, reject) => {
//     setTimeout(() => {
//         resolve('Great!');
//     }, 1000);
// });

// timeoutPromise
//     .then(msg => {
//         console.log(msg);
//         return 'Value from first .then()';
//     })
//     .then(result => {
//         console.log(result);
//     })
//     .catch(err => {
//         console.log(err);
//     });

/*
If you comment out the successful version of "timeoutPromise" and comment in the erroneous version,
you will see that the promise chain never makes it to the .then().
Instead it goes straight to the .catch() which accepts the error which we manually set up to be ‘Failure’.
 */
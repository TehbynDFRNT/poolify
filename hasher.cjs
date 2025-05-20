const bcrypt = require('bcryptjs');
const password = 'mfp112233!!'; // Replace with your actual password
const saltRounds = 10; // Standard salt rounds

bcrypt.hash(password, saltRounds, function (err, hash) {
    if (err) {
        console.error("Error hashing password:", err);
        return;
    }
    console.log("Your BCrypt Hash:", hash);
    // Example output: $2a$10$abcdefghijklmnopqrstuv.wxyzabcdefghijklmnopqrstuv.wxyz...
});
// Script untuk generate hashed password
// Jalankan dengan: node script/generate-hashed-password.js

const bcrypt = require('bcryptjs');

async function generateHashedPassword(plainPassword) {
  try {
    const saltRounds = 12;
    const hashedPassword = await bcrypt.hash(plainPassword, saltRounds);
    
    console.log('=====================================');
    console.log('Password Hashing Utility');
    console.log('=====================================');
    console.log(`Plain Password: ${plainPassword}`);
    console.log(`Hashed Password: ${hashedPassword}`);
    console.log('=====================================');
    console.log('Copy hashed password above to your database');
    console.log('=====================================');
    
    return hashedPassword;
  } catch (error) {
    console.error('Error generating hashed password:', error);
  }
}

// Generate hashed password untuk password default
const defaultPassword = 'RVLT01';
generateHashedPassword(defaultPassword);

// Jika ingin generate untuk password lain, uncomment baris di bawah:
// generateHashedPassword('your-password-here');

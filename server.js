require('dotenv').config();

const { app } = require('./app');
const { DB_HOST, SERVER_PORT: PORT = 8080 } = process.env;

async function connectMongoose() {
  const mongoose = require('mongoose');

  if (!DB_HOST) throw new Error('DB_HOST not defined!');

  await mongoose.connect(DB_HOST);
  console.log(`Connected to MongoDB`);
}

function connectMail() {
  const { mailInterface } = require('./utils');

  mailInterface.verify();
}

async function main() {
  try {
    connectMail();
    connectMongoose();

    app.listen(PORT, () => {
      console.log(`Server is listening on port ${PORT}`);
    });
  } catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
  }
}

main();

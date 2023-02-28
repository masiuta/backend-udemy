const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const userSchema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, index: true },
  password: { type: String, required: true, minlength: 8 },
  image: { type: String, required: true },
  places: { type: String, required: true },
});

userSchema.set('toJSON', { getters: true });

module.exports = mongoose.model('User', userSchema);

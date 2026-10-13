const User = require('../models/userModel');
const Article = require('../models/articleModel');

// 1. Create a new user
const createUser = async (req, res) => {
  try {
    const { name, email, age, role, bio, phone } = req.body || {};

    if (!name || !email) {
      return res.status(400).json({
        message: 'Name and email are required'
      });
    }

    const exists = await User.findOne({ email });

    if (exists) {
      return res.status(409).json({
        message: 'Email already in use'
      });
    }

    const user = await User.create({
      name, email, age, role, bio, phone
    });

    res.status(201).json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// 2. Retrieve all users
const getUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// 3. Retrieve user by ID

    
const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        message: 'User not found'
      });
    }

    res.status(200).json(user);
  } catch (err) {
    if (err.name === 'CastError') {
      return res.status(400).json({
        message: 'Invalid resource identifier (ObjectId expected)'
      });
    }

    res.status(500).json({ message: err.message });
  }
};


// 4. Delete a user securely
const deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        message: 'User not found'
      });
    }

    // Check whether the user has a published article
    const article = await Article.findOne({
      author: req.params.id,
      status: 'published'
    });

    if (article) {
      return res.status(400).json({
        message: 'Impossible to delete an author with published articles'
      });
    }

    await User.findByIdAndDelete(req.params.id);

    res.status(200).json({
      message: 'User deleted'
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = {
  createUser,
  getUsers,
  getUserById,
  deleteUser
};

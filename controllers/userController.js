const userService = require('../models/userService');
const uuidValidate = require('uuid-validate');

async function getAllUsers(req, res) {
  try {
    const users = await userService.getAllUsers();
    res.status(200).json({
      status:"success",
      users});
  } catch (error) {
    console.error('Error getting users:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}

async function getUserById(req, res) {
  const userId = req.params.userId;
  
  // Check if userId is a valid UUID
  if (!uuidValidate(userId)) {
    res.status(400).json({ message: 'Invalid id' });
    return;
  }

  try {
    const user = await userService.getUserById(userId);
    if (!user) {
      res.status(404).json({ message: 'User not found' });
    } else {
      res.status(200).json(user);
    }
  } catch (error) {
    console.error('Error getting user:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}

async function createUser(req, res) {
  const { username, age, isAdmin, hobbies } = req.body;
  
  if (!username || !age || !isAdmin || !hobbies) {
    res.status(400).json({ message: 'Missing required fields' });
    return;
  }

  const newUser = await userService.createUser({ username, age, isAdmin, hobbies });
  res.status(201).json({
    status:"success",
    message:"user created successfully",
    newUser});
}


async function updateUser(req, res) {
  const userId = req.params.userId;
  const userData = req.body;

  if (!uuidValidate(userId)) {
    res.status(400).json({ message: 'Invalid id' });
    return;
  }
  try {
    await userService.updateUser(userId, userData);
    res.status(200).json({
      status:"success",
      message:"user updated successfully",
      userData});
  } catch (error) {
    console.error('Error updating user:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}


async function toggleAdminStatus(req, res) {
  const userId = req.params.userId;
  try {
    const updatedUser = await userService.toggleAdminStatus(userId);
    res.status(200).json({ 
      status: "success",
      user: updatedUser,
      message: 'Admin status toggled' 
    });
  } catch (error) {
    if (error.message === 'Invalid user ID') {
      res.status(400).json({ message: 'Invalid user ID' });
    } else if (error.message === 'User not found') {
      res.status(404).json({ message: 'User not found' });
    } else {
      console.error('Error toggling isAdmin status:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  }
}


async function deleteUser(req, res) {
  const userId = req.params.userId;
  try {
    const message = await userService.deleteUser(userId);
    res.status(204).json({
      status: "success",
      message: message // Return the message from the deleteUser function
    });
  } catch (error) {
    if (error.message === 'Invalid user ID') {
      res.status(400).json({ message: 'Invalid user ID' });
    } else if (error.message === 'User not found') {
      res.status(404).json({ message: 'User not found' });
    } else {
      console.error('Error deleting user:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  }
}


module.exports = {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  toggleAdminStatus,
  deleteUser
};

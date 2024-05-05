const db = require('../database/db');
const uuid = require('uuid');
const uuidValidate = require('uuid-validate');

async function createUser(user) {
  user.id = uuid.v4();
  await db.collection('users').doc(user.id).set(user);
  return user;
}

async function updateUser(userId, userData) {
  await db.collection('users').doc(userId).set(userData, { merge: true });
}


async function toggleAdminStatus(userId) {
  if (!uuidValidate(userId)) {
    throw new Error('Invalid user ID');
  }

  const userRef = db.collection('users').doc(userId);
  const userDoc = await userRef.get();
  if (userDoc.exists) {
    const { isAdmin } = userDoc.data();
    const updatedIsAdmin = !isAdmin;
    await userRef.update({ isAdmin: updatedIsAdmin });

    // After updating, fetch and return the updated user document
    const updatedUserDoc = await userRef.get();
    return { id: userId, ...updatedUserDoc.data() };
  } else {
    throw new Error('User not found');
  }
}



async function getUserById(userId) {
  if (!uuidValidate(userId)) {
    throw new Error('Invalid user ID');
  }

  const userDoc = await db.collection('users').doc(userId).get();
  if (userDoc.exists) {
    return userDoc.data();
  } else {
    throw new Error('User not found');
  }
}

async function deleteUser(userId) {
  if (!uuidValidate(userId)) {
    throw new Error('Invalid user ID');
  }

  await db.collection('users').doc(userId).delete();
  return 'User deleted successfully';
}




async function getUserById(userId) {
  const userDoc = await db.collection('users').doc(userId).get();
  if (userDoc.exists) {
    return userDoc.data();
  }
  return null;
}

async function getAllUsers() {
  const usersSnapshot = await db.collection('users').get();
  const users = [];
  usersSnapshot.forEach((doc) => {
    users.push(doc.data());
  });
  return users;
}

module.exports = {
  createUser,
  updateUser,
  toggleAdminStatus,
  deleteUser,
  getUserById,
  getAllUsers
};

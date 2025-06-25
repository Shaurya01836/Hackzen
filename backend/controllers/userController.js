const User = require('../model/UserModel');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Organization = require('../model/OrganizationModel');

// ✅ Generate JWT token
const generateToken = (user) => {
  return jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, {
    expiresIn: '7d'
  });
};

// ✅ Invite user to organization
const inviteToOrganization = async (req, res) => {
  const { email, role } = req.body;
  const inviter = req.user;

  try {
    if (!inviter.organization) {
      return res.status(403).json({ message: "Inviter must belong to an organization." });
    }

    const domain = email.split("@")[1];
    const inviterDomain = inviter.email.split("@")[1];
    const isSameDomain = domain === inviterDomain;

    if (inviter.role !== "admin" && !isSameDomain) {
      return res.status(403).json({ message: "Only same-domain invitations are allowed." });
    }

    let user = await User.findOne({ email });

    if (!user) {
      user = new User({
        email,
        role,
        organization: inviter.organization,
        applicationStatus: "pending"
      });
    } else {
      user.role = role;
      user.organization = inviter.organization;
      user.applicationStatus = "pending";
    }

    await user.save();
    res.status(200).json({ message: "User invited successfully.", user });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ✅ Register a new user (email only)
const registerUser = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      if (existingUser.applicationStatus === "pending" && !existingUser.passwordHash) {
        existingUser.name = name;
        existingUser.passwordHash = await bcrypt.hash(password, 10);
        existingUser.authProvider = "email";
        await existingUser.save();

        return res.status(200).json({
          user: {
            _id: existingUser._id,
            name: existingUser.name,
            email: existingUser.email,
            role: existingUser.role
          },
          token: generateToken(existingUser)
        });
      }

      return res.status(400).json({ message: 'User already exists' });
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const isAdminEmail = email === 'admin@rr.dev';

    const newUser = await User.create({
      name,
      email,
      passwordHash,
      authProvider: 'email',
      role: isAdminEmail ? 'admin' : undefined,
      bannerImage: "/assets/default-banner.png"
    });

    res.status(201).json({
      user: {
        _id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role
      },
      token: generateToken(newUser)
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ✅ Login
const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user || !(await bcrypt.compare(password, user.passwordHash))) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    res.json({
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      },
      token: generateToken(user)
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ✅ Get all users
const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select('-passwordHash');
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ✅ Get single user by ID
const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
      .populate('badges hackathonsJoined projects organization')
      .select('-passwordHash');

    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ✅ Update user
const updateUser = async (req, res) => {
  try {
    const allowedFields = [
      "name", "phone", "location", "bio", "website", "github",
      "githubUsername", "linkedin", "profileImage", "bannerImage"
    ];

    if (req.user.role === "admin") {
      allowedFields.push("applicationStatus", "organization");
    }

    const updates = Object.fromEntries(
      Object.entries(req.body).filter(([key]) => allowedFields.includes(key))
    );

    const user = await User.findByIdAndUpdate(req.params.id, updates, { new: true });
    if (!user) return res.status(404).json({ message: "User not found" });

    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ✅ Delete user
const deleteUser = async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.json({ message: 'User deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ✅ Change user role
const changeUserRole = async (req, res) => {
  try {
    const { newRole } = req.body;
    const validRoles = ['participant', 'organizer', 'mentor', 'judge', 'admin'];
    if (!validRoles.includes(newRole)) {
      return res.status(400).json({ message: 'Invalid role specified' });
    }
    
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    user.role = newRole;
    await user.save();
    res.json({ message: `User role updated to ${newRole}`, user });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ✅ Change password
const changePassword = async (req, res) => {
  const { currentPassword, newPassword } = req.body;
  const userId = req.params.id;

  try {
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    if (user.authProvider === "email") {
      if (!currentPassword || !(await bcrypt.compare(currentPassword, user.passwordHash))) {
        return res.status(401).json({ message: "Incorrect current password" });
      }
    }

    const newHash = await bcrypt.hash(newPassword, 10);
    user.passwordHash = newHash;
    await user.save();

    res.json({ message: "Password updated successfully" });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

// ✅ My org status (dashboard)
const getMyOrganizationStatus = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).populate("organization");
    if (!user) return res.status(404).json({ message: "User not found" });

    res.json({
      organization: user.organization,
      status: user.applicationStatus,
      role: user.role,
    });
  } catch (err) {
    res.status(500).json({ message: "Unable to fetch organization info" });
  }
};

const getUserStreakData = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    const sortedLog = user.activityLog.sort((a, b) => new Date(a) - new Date(b));
    let maxStreak = 0, currentStreak = 0, prevDate = null;

    sortedLog.forEach(date => {
      const currentDate = new Date(date);
      if (prevDate) {
        const diff = (currentDate - prevDate) / (1000 * 60 * 60 * 24);
        currentStreak = diff === 1 ? currentStreak + 1 : 1;
      } else {
        currentStreak = 1;
      }
      maxStreak = Math.max(maxStreak, currentStreak);
      prevDate = currentDate;
    });

    res.status(200).json({
      streaks: user.activityLog,
      current: currentStreak,
      max: maxStreak,
    });
  } catch (err) {
    console.error("Get streak error:", err);
    res.status(500).json({ message: "Failed to fetch streaks" });
  }
};

module.exports = {
  inviteToOrganization,
  registerUser,
  loginUser,
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
  changeUserRole,
  changePassword,
  getMyOrganizationStatus,
  getUserStreakData,
};



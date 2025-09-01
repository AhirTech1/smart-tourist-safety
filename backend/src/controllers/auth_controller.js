const Tourist = require('../models/tourist');
const bcrypt = require('bcryptjs');
const { randomUUID } = require('crypto');

// Register a new tourist
exports.register = async (req, res) => {
  try {
    const {
      name,
      email,
      phoneNumber,
      password,
      tripDuration, // in days
      tripItinerary,
      passportNumber,
      aadharNumber,
      emergencyContacts,
    } = req.body;

    // Check if user already exists
    let tourist = await Tourist.findOne({ email });
    if (tourist) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const idValidUntil = new Date();
    idValidUntil.setDate(idValidUntil.getDate() + tripDuration);

    // This is a placeholder for a blockchain ID generation call
    const digitalId = `STS-${randomUUID()}`;

    tourist = new Tourist({
      name,
      email,
      phoneNumber,
      password: hashedPassword,
      tripDuration,
      tripItinerary,
      passportNumber,
      aadharNumber,
      emergencyContacts,
      digitalId,
      idValidUntil,
      kycStatus: 'verified', // Assume KYC is verified upon registration for now
    });

    await tourist.save();

    res.status(201).json({
      message: 'Tourist registered successfully',
      tourist: {
        id: tourist._id,
        name: tourist.name,
        email: tourist.email,
        digitalId: tourist.digitalId,
        idValidUntil: tourist.idValidUntil,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error during registration' });
  }
};

// Login a tourist
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const tourist = await Tourist.findOne({ email });

    if (!tourist) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, tourist.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }
    
    // Check if the digital ID is expired
    if (new Date() > new Date(tourist.idValidUntil)) {
        tourist.kycStatus = 'expired';
        tourist.digitalId = null; // Destroy the ID
        await tourist.save();
    }


    res.status(200).json({
      message: 'Login successful',
      tourist: {
        id: tourist._id,
        name: tourist.name,
        email: tourist.email,
        digitalId: tourist.digitalId,
        idValidUntil: tourist.idValidUntil,
        kycStatus: tourist.kycStatus,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error during login' });
  }
};

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

    const expiryDate = new Date();
    expiryDate.setDate(expiryDate.getDate() + tripDuration);

    // This is a placeholder for a blockchain ID generation call
    const digitalIdString = `STS-${randomUUID()}`;

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
      idNumber: req.body.idNumber || '', // Get from request body
      digitalId: {
        issuedDate: new Date(),
        expiryDate: expiryDate,
        status: 'active',
        idString: digitalIdString
      },
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
        phoneNumber: tourist.phoneNumber,
        digitalId: tourist.digitalId,
        idValidUntil: tourist.idValidUntil,
        kycStatus: tourist.kycStatus,
        emergencyContacts: tourist.emergencyContacts,
        tripDuration: tourist.tripDuration,
        tripItinerary: tourist.tripItinerary,
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
    
    // Check if the digital ID is expired (handle both old and new format)
    let currentKycStatus = tourist.kycStatus;
    
    // Handle backward compatibility for old digitalId format (string) vs new format (object)
    if (tourist.digitalId) {
      let expiryDate = null;
      
      // If digitalId is a string (old format), use idValidUntil
      if (typeof tourist.digitalId === 'string') {
        expiryDate = tourist.idValidUntil;
      } 
      // If digitalId is an object (new format), use digitalId.expiryDate
      else if (tourist.digitalId.expiryDate) {
        expiryDate = tourist.digitalId.expiryDate;
      }
      
      if (expiryDate && new Date() > new Date(expiryDate)) {
        currentKycStatus = 'expired';
        tourist.kycStatus = 'expired';
        
        // Update digitalId status if it's the new format
        if (typeof tourist.digitalId === 'object' && tourist.digitalId !== null) {
          tourist.digitalId.status = 'expired';
        }
        await tourist.save();
      }
    }

    res.status(200).json({
      message: 'Login successful',
      tourist: {
        _id: tourist._id,
        id: tourist._id,
        name: tourist.name,
        email: tourist.email,
        phoneNumber: tourist.phoneNumber,
        digitalId: tourist.digitalId,
        idValidUntil: tourist.idValidUntil,
        kycStatus: currentKycStatus,
        emergencyContacts: tourist.emergencyContacts,
        tripDuration: tourist.tripDuration,
        tripItinerary: tourist.tripItinerary,
        idNumber: tourist.idNumber,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error during login' });
  }
};

const Hackathon = require('../model/HackathonModel');

exports.createHackathon = async (req, res) => {
  try {
    const { title, description, startDate, endDate } = req.body;

    // ✅ Check for required fields
    if (!title || !description || !startDate || !endDate) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // ✅ Create the document (remove `new`)
    const newHackathon = await Hackathon.create({
      title,
      description,
      startDate,
      endDate,
      organizer: req.user.id
    });

    res.status(201).json(newHackathon);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error creating hackathon' });
  }
};

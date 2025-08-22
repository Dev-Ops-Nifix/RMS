const Event = require('../models/Event');

const createEvent = async (req, res) => {
  try {
    const { title, description, date, time, type, class: className, section } = req.body;
    const teacherId = req.user.id;

    const event = new Event({
      title,
      description,
      date: new Date(date),
      time,
      type,
      class: className,
      section,
      teacherId
    });

    await event.save();
    res.status(201).json({ message: 'Event created successfully', event });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getTeacherEvents = async (req, res) => {
  try {
    const teacherId = req.user.id;
    const events = await Event.find({ teacherId }).sort({ date: 1 });
    res.json(events);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const updateEvent = async (req, res) => {
  try {
    const { id } = req.params;
    const teacherId = req.user.id;
    
    const event = await Event.findOneAndUpdate(
      { _id: id, teacherId },
      req.body,
      { new: true }
    );
    
    if (!event) {
      return res.status(404).json({ error: 'Event not found' });
    }
    
    res.json({ message: 'Event updated successfully', event });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const deleteEvent = async (req, res) => {
  try {
    const { id } = req.params;
    const teacherId = req.user.id;
    
    const event = await Event.findOneAndDelete({ _id: id, teacherId });
    
    if (!event) {
      return res.status(404).json({ error: 'Event not found' });
    }
    
    res.json({ message: 'Event deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  createEvent,
  getTeacherEvents,
  updateEvent,
  deleteEvent
};
const Item = require('../models/Item')

const GetItems = async (req, res) => {
  try {
    const { status, category, location } = req.query
    const query = {}

    if (status) query.status = status
    if (category) query.category = category
    if (location) query.location = location

    const items = await Item.find(query).populate('userId', 'name email')
    res.send(items)
  } catch (err) {
    res.status(500).send({ error: 'Failed to fetch items' })
  }
}

const GetItemById = async (req, res) => {
  try {
    const { id } = req.params
    const item = await Item.findById(id).populate('userId', 'name email')
    if (!item) return res.status(404).send({ error: 'Item not found' })
    res.send(item)
  } catch (err) {
    res.status(500).send({ error: 'Error fetching item' })
  }
}

const mongoose = require('mongoose');

const GetItemsByUserId = async (req, res) => {
  try {
    const { userId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ error: 'Invalid userId format' });
    }

    const objectId = new mongoose.Types.ObjectId(userId);

    const items = await Item.find({ userId: objectId }).populate('userId', 'name email');

    if (!items.length) {
      return res.status(404).json({ error: 'No items found for this user' });
    }

    res.json(items);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch user items' });
  }
};




const CreateItem = async (req, res) => {
  try {
    const { location } = req.body

    if (
      !location ||
      location.type !== 'Point' ||
      !Array.isArray(location.coordinates) ||
      location.coordinates.length !== 2
    ) {
      return res.status(400).send({ error: 'Invalid or missing location coordinates' })
    }

    const item = await Item.create({
      ...req.body,
      userId: req.user._id
    })

    res.status(201).send(item)
  } catch (err) {
    res.status(400).send({ error: 'Error creating item' })
  }
}


const UpdateItem = async (req, res) => {
  try {
    const { id } = req.params
    const item = await Item.findById(id)
    if (!item) return res.status(404).send({ error: 'Item not found' })

    if (item.userId.toString() !== req.user._id) {
      return res.status(403).send({ error: 'Not authorized to edit this item' })
    }

    const updated = await Item.findByIdAndUpdate(id, req.body, { new: true })
    res.send(updated)
  } catch (err) {
    res.status(400).send({ error: 'Error updating item' })
  }
}

const DeleteItem = async (req, res) => {
  try {
    const { id } = req.params
    const item = await Item.findById(id)
    if (!item) return res.status(404).send({ error: 'Item not found' })

    if (item.userId.toString() !== req.user._id) {
      return res.status(403).send({ error: 'Not authorized to delete this item' })
    }

    await item.deleteOne()
    res.send({ msg: 'Item deleted' })
  } catch (err) {
    res.status(400).send({ error: 'Error deleting item' })
  }
}

module.exports = {
  GetItems,
  GetItemById,
  CreateItem,
  UpdateItem,
  DeleteItem,
  GetItemsByUserId
}

const ClaimRequest = require('../models/ClaimRequest')
const Item = require('../models/Item')

const CreateClaimRequest = async (req, res) => {
  try {
    const { itemId, message } = req.body

    const item = await Item.findById(itemId)
    if (!item) return res.status(404).send({ error: 'Item not found' })

    const existingClaim = await ClaimRequest.findOne({
      item: itemId,
      requester: req.user._id
    })
    if (existingClaim) {
      console.error("Error in CreateClaimRequest:", existingClaim)
      return res.status(400).send({ error: 'You already submitted a claim for this item' })
    }

    const claim = await ClaimRequest.create({
      item: itemId,
      requester: req.user._id,
      message,
      status: 'pending',
      picture: req.body.picture
    })

    res.status(201).send(claim)
  } catch (err) {
    console.error("Error in CreateClaimRequest:", err)
    res.status(500).send({ error: 'Error submitting claim' })
  }
}

const GetClaimsForItem = async (req, res) => {
  try {
    const { itemId } = req.params
    const item = await Item.findById(itemId)

    if (!item) {
      return res.status(404).send({ msg: 'Item not found' })
    }

    if (item.userId.toString() !== req.user._id.toString()) {
      return res.status(403).send({ msg: 'Forbidden: You are not the owner' })
    }

    const claims = await ClaimRequest.find({ item: itemId }).populate('requester')
    res.status(200).send(claims)
  } catch (err) {
    console.error(err)
    res.status(500).send({ msg: 'Server error' })
  }
}

const GetClaimsByUserId = async (req, res) => {
  try {
    const userId = req.user._id
    const claims = await ClaimRequest.find({ requester: userId }).populate('item')
    res.status(200).send(claims)
  } catch (err) {
    console.error("Error in GetClaimsByUserId:", err)
    res.status(500).send({ error: 'Error fetching claims by user' })
  }
}

const UpdateClaimStatus = async (req, res) => {
  try {
    const { claimId } = req.params
    const { status } = req.body

    if (!['approved', 'rejected'].includes(status)) {
      return res.status(400).send({ error: 'Invalid status value' })
    }

    const claim = await ClaimRequest.findById(claimId).populate('item')
    if (!claim) return res.status(404).send({ error: 'Claim not found' })

    if (claim.item.userId.toString() !== req.user._id) {
      return res.status(403).send({ error: 'Not authorized to update this claim' })
    }

    claim.status = status
    await claim.save()

    if (status === 'approved') {
      claim.item.isClaimed = true
      await claim.item.save()
    } 

    res.send(claim)
  } catch (err) {
    res.status(500).send({ error: 'Error updating claim status' })
  }
}


const DeleteClaimRequest = async (req, res) => {
  try {
    const { claimId } = req.params

    const claim = await ClaimRequest.findById(claimId).populate('requester')
    if (!claim) return res.status(404).send({ error: 'Claim not found' })

    if (claim.requester._id.toString() !== req.user._id.toString()) {
      return res.status(403).send({ error: 'Not authorized to delete this claim' })
    }

    await claim.deleteOne()
    res.send({ msg: 'Claim request deleted successfully' })
  } catch (err) {
    console.error('Error in DeleteClaimRequest:', err)
    res.status(500).send({ error: 'Error deleting claim request' })
  }
}

const EditClaimRequest = async (req, res) => {
  try {
    const { claimId } = req.params
    const { message, picture } = req.body

    const claim = await ClaimRequest.findById(claimId)
    if (!claim) {
      return res.status(404).send({ error: 'Claim not found' })
    }

    // Only the person who created the claim can edit it
    if (claim.requester.toString() !== req.user._id.toString()) {
      return res.status(403).send({ error: 'Not authorized to edit this claim' })
    }

    if (message) claim.message = message
    if (picture) claim.picture = picture

    await claim.save()
    res.send(claim)
  } catch (err) {
    console.error('Error in EditClaimRequest:', err)
    res.status(500).send({ error: 'Error editing claim request' })
  }
}

const GetClaimById = async (req, res) => {
  try {
    const { claimId } = req.params
    const claim = await ClaimRequest.findById(claimId).populate('item requester')

    if (!claim) {
      return res.status(404).send({ error: 'Claim not found' })
    }

    if (
      claim.requester._id.toString() !== req.user._id.toString() &&
      claim.item.userId.toString() !== req.user._id.toString()
    ) {
      return res.status(403).send({ error: 'Not authorized to view this claim' })
    }

    res.status(200).send(claim)
  } catch (err) {
    console.error('Error in GetClaimById:', err)
    res.status(500).send({ error: 'Error fetching claim' })
  }
}


module.exports = {
  CreateClaimRequest,
  GetClaimsForItem,
  GetClaimsByUserId,
  UpdateClaimStatus,
  DeleteClaimRequest,
  EditClaimRequest,
  GetClaimById
}

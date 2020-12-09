module.exports = class Donation {
  constructor (name, description, image, isPublic, userId, pointId, donationId) {
    this.name = name
    this.description = description
    this.image = image
    this.isPublic = isPublic
    this.userId = userId
    this.pointId = pointId
    this.donationId = donationId
  }
}

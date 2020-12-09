module.exports = class Point {
  constructor (name, latitude, longitude, description, userId, image, pointId, disable) {
    this.name = name
    this.latitude = latitude
    this.longitude = longitude
    this.description = description
    this.userId = userId
    this.image = image
    this.pointId = pointId
    this.disable = disable
  }
}

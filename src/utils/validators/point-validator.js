const InvalidParamError = require('../errors/invalid-param-error')
const Validate = require('validator')

module.exports = class PointValidator {
  CreatePointValidator (point) {
    const { name, latitude, longitude, description, image } = point
    if (
      Validate.isEmpty(name) ||
        !Validate.matches(name, /^[A-Za-z0-9\s]+[A-Za-z0-9\s]+$(\.0-9+)?/g) ||
        !Validate.isByteLength(name, { min: 5, max: 50 })) {
      console.log('opa nome')
      throw new InvalidParamError('name')
    } else if (
      !Validate.matches(latitude, /([-+]?(([1-8]?\d(\.\d+))+|90))/g)) {
      console.log('opa latitude')
      throw new InvalidParamError('latitude')
    } else if (
      !Validate.matches(longitude, /([-+]?(([1-8]?\d(\.\d+))+|90))/g)) {
      console.log('opa longitude')
      throw new InvalidParamError('longitude')
    } else if (
      Validate.isEmpty(description) ||
      !Validate.matches(description, /^[A-Za-z0-9\s]+[A-Za-z0-9\s]+$(\.0-9+)?/g) ||
        !Validate.isByteLength(description, { min: 5, max: 50 })) {
      console.log('opa description')
      throw new InvalidParamError('description')
    } else if (
      !Validate.matches(image, /data:([^"]+)*/gm)
    ) {
      throw new InvalidParamError('image')
    }
  }

  UpdatePointValidator (point) {
    const { name, latitude, longitude, description, userId, image } = point
    console.log(point)
    if (
      Validate.isEmpty(name) ||
        !Validate.matches(name, /^[A-Za-z0-9\s]+[A-Za-z0-9\s]+$(\.0-9+)?/g) ||
        !Validate.isByteLength(name, { min: 5, max: 50 })) {
      throw new InvalidParamError('name')
    } else if (
      !Validate.matches(latitude, /([-+]?(([1-8]?\d(\.\d+))+|90))/g)) {
      throw new InvalidParamError('latitude')
    } else if (
      !Validate.matches(longitude, /([-+]?(([1-8]?\d(\.\d+))+|90))/g)) {
      throw new InvalidParamError('longitude')
    } else if (
      Validate.isEmpty(description) ||
      !Validate.matches(description, /^[A-Za-z0-9\s]+[A-Za-z0-9\s]+$(\.0-9+)?/g) ||
        !Validate.isByteLength(description, { min: 5, max: 50 })) {
      throw new InvalidParamError('description')
    } else if (
      !Validate.matches(image, /data:([^"]+)*/gm)
    ) {
      throw new InvalidParamError('image')
    }
  }
}

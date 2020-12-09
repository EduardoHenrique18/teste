const InvalidParamError = require('../errors/invalid-param-error')
const Validate = require('validator')

module.exports = class DonationValidator {
  CreateDonationValidator (donation) {
    const { name, description, userId, image, pointId, isPublic } = donation
    if (
      name === undefined ||
      Validate.isEmpty(name) ||
        !Validate.isByteLength(name, { min: 5, max: 50 })) {
      throw new InvalidParamError('name')
    } else if (
      description === undefined ||
      Validate.isEmpty(description) ||
        !Validate.isByteLength(description, { min: 5, max: 100 })) {
      throw new InvalidParamError('description')
    } else if (
      image === undefined
    ) {
      throw new InvalidParamError('image')
    } else if (
      userId === undefined ||
      Validate.default.isEmpty(userId.toString()) ||
      !Validate.isNumeric(userId.toString())) {
      throw new InvalidParamError('userId')
    } else if (
      isPublic === undefined ||
      Validate.isEmpty(isPublic) ||
      !Validate.isBoolean(isPublic.toString())
    ) {
      throw new InvalidParamError('isPublic')
    } else if (
      pointId === undefined ||
      Validate.default.isEmpty(pointId.toString()) ||
      !Validate.isNumeric(pointId.toString())) {
      throw new InvalidParamError('pointId')
    }
  }

  UpdateDonationValidator (donation) {
    const { name, description, image, userId, pointId, isPublic, donationId } = donation
    if (
      name === undefined ||
      Validate.isEmpty(name) ||
        !Validate.matches(name, /^[A-Za-z0-9\s]+[A-Za-z0-9\s]+$(\.0-9+)?/g) ||
        !Validate.isByteLength(name, { min: 5, max: 50 })) {
      throw new InvalidParamError('name')
    } else if (
      description === undefined ||
      Validate.isEmpty(description) ||
      !Validate.matches(description, /^[A-Za-z0-9\s]+[A-Za-z0-9\s]+$(\.0-9+)?/g) ||
        !Validate.isByteLength(description, { min: 5, max: 50 })) {
      throw new InvalidParamError('description')
    } else if (
      userId === undefined ||
      Validate.isEmpty(userId.toString()) ||
      !Validate.isNumeric(userId.toString())) {
      throw new InvalidParamError('userId')
    } else if (
      image === undefined ||
      !Validate.matches(image, /data:([^"]+)*/gm)
    ) {
      throw new InvalidParamError('image')
    } else if (
      isPublic === undefined ||
      Validate.isEmpty(isPublic) ||
      !Validate.isBoolean(isPublic.toString())
    ) {
      throw new InvalidParamError('isPublic')
    } else if (
      pointId === undefined ||
      Validate.default.isEmpty(pointId.toString()) ||
      !Validate.isNumeric(pointId.toString())) {
      throw new InvalidParamError('pointId')
    } else if (
      donationId === undefined ||
      Validate.default.isEmpty(donationId.toString()) ||
      !Validate.isNumeric(donationId.toString())) {
      throw new InvalidParamError('donationId')
    }
  }

  ReadByPointIdDonationValidator (pointId) {
    if (pointId === undefined ||
      Validate.isEmpty(pointId.toString()) ||
    !Validate.isNumeric(pointId.toString())) {
      throw new InvalidParamError('donationId')
    }
  }

  DeleteDonationValidator (donationId) {
    if (donationId === undefined ||
      Validate.isEmpty(donationId.toString()) ||
    !Validate.isNumeric(donationId.toString())) {
      throw new InvalidParamError('donationId')
    }
  }
}

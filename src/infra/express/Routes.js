const { Router } = require('express')
const CreateUserController = require('../../controllers/User/create-user-controller')
const CreatePointController = require('../../controllers/Point/create-point-controller')
const UpdatePointController = require('../../controllers/Point/update-point-controller')
const ReadAllPointController = require('../../controllers/Point/readAll-point-controller')
const DeletePointController = require('../../controllers/Point/delete-point-controller')
const CreateDonationController = require('../../controllers/donation/create-donation-controller')
const UpdateDonationController = require('../../controllers/donation/update-donation-controller')
const ReadAllDonationController = require('../../controllers/donation/readByPointId-donation-controller')
const DeleteDonationController = require('../../controllers/donation/delete-donation-controller')
const LoginController = require('../../controllers/user/Login-controller')
const auth = require('../../utils/auth/auth')
const routes = Router()

routes.route('/user')
  .post((request, response) => {
    new CreateUserController().CreateUser(request, response)
  })

routes.route('/login')
  .post((request, response) => {
    new LoginController().Login(request, response)
  })

routes.route('/point')
  .post(auth, (request, response) => {
    new CreatePointController().CreatePoint(request, response)
  })
  .put(auth, (request, response) => {
    new UpdatePointController().UpdatePoint(request, response)
  })
  .get(auth, (request, response) => {
    new ReadAllPointController().ReadAllPoint(request, response)
  })

routes.route('/point/:pointId')
  .delete(auth, (request, response) => {
    new DeletePointController().DeletePoint(request, response)
  })

routes.route('/donation')
  .post(auth, (request, response) => {
    new CreateDonationController().CreateDonation(request, response)
  })
  .put(auth, (request, response) => {
    new UpdateDonationController().UpdateDonation(request, response)
  })

routes.route('/donation/:pointId')
  .get(auth, (request, response) => {
    new ReadAllDonationController().ReadByPointIdDonation(request, response)
  })

routes.route('/donation/:donationId')
  .delete(auth, (request, response) => {
    new DeleteDonationController().DeleteDonation(request, response)
  })

module.exports = routes

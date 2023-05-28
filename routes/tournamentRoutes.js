const express = require('express');
const tournamentController = require('../controllers/tournamentController');
const authController = require('../controllers/authController');

const router = express.Router();

// router.param('id', tourController.checkID);

router
  .route('/top-5-cheap')
  .get(
    tournamentController.aliasTopTournaments,
    tournamentController.getAllTournaments
  );

router
  .route('/')
  .get(tournamentController.getAllTournaments)
  .post(
    authController.protect,
    authController.restrictTo('admin'),
    tournamentController.createTournament
  );

router
  .route('/:id')
  .get(tournamentController.getTournament)
  .patch(
    authController.protect,
    authController.restrictTo('admin'),
    tournamentController.updateTournament
  )
  .delete(
    authController.protect,
    authController.restrictTo('admin'),
    tournamentController.deleteTournament
  );

module.exports = router;

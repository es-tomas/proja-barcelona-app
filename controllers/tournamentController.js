const Tournament = require('../models/tournamentModel');
const factory = require('./handlerFactory');

exports.aliasTopTournaments = (req, res, next) => {
  req.query.limit = '5';
  req.query.sort = '-ratingsAverage,price';
  req.query.fields = 'name,price,ratingsAverage,summary,difficulty';
  next();
};

exports.getAllTournaments = factory.getAll(Tournament);

exports.getTournament = factory.getOne(Tournament);
// factory.getOne(Tournament, { path: 'reviews' });

exports.createTournament = factory.createOne(Tournament);

exports.updateTournament = factory.updateOne(Tournament);

exports.deleteTournament = factory.deleteOne(Tournament);

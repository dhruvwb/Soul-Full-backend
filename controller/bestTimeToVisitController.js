const { getAllDocs, createDoc } = require('../utils/firestoreHelpers');

// BestTimeToVisit
exports.createSeason = async (req, res) => {
  const season = await createDoc('bestTimesToVisit', req.body);
  res.status(201).json(season);
};

exports.getAllSeasons = async (req, res) => {
  const seasons = await getAllDocs('bestTimesToVisit');
  res.json(seasons);
};

// VisitMonth
exports.createMonth = async (req, res) => {
  const month = await createDoc('bestTimeVisitMonths', req.body);
  res.status(201).json(month);
};

exports.getAllMonths = async (req, res) => {
  const months = await getAllDocs('bestTimeVisitMonths');
  res.json(months);
};

// Destination
exports.createDestination = async (req, res) => {
  const destination = await createDoc('bestTimeDestinations', req.body);
  res.status(201).json(destination);
};

exports.getAllDestinations = async (req, res) => {
  const destinations = await getAllDocs('bestTimeDestinations');
  res.json(destinations);
};

// TourPackage
exports.createTourPackage = async (req, res) => {
  const tour = await createDoc('bestTimeTourPackages', req.body);
  res.status(201).json(tour);
};

exports.getAllPackages = async (req, res) => {
  const packages = await getAllDocs('bestTimeTourPackages');
  res.json(packages);
};

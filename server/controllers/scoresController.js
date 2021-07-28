const { ScoresModel } = require('../models');

class ScoresController {

  addUserResults(req, res, next) {
    const { id, score } = req.body;
    ScoresModel.addResults(id, score)
      .then((data) => {
        res.locals.score = score;
        return next();
      })
      .catch((err) => {
        return next(err);
      });
  };

  getAllResultsByGoogleId(req, res, next) {
    const { googleId } = req.body;
    ScoresModel.getResultsByGoogleId(googleId)
      .then((data) => {
        const results = data.rows;
        if(!results.length) return res.locals.newUser = true;
        res.locals.results = results;
        return next();
      })
      .catch((err) => {
        return next({err});
      })
  };

  getRanks(req, res, next) {
    console.log('inside getRanks in scoresController')
    ScoresModel.getAllScores()
      .then((data) => {
        const ranks = {};
        console.log('THIS IS data.rows -> ', data.rows);
        data.rows.forEach(({name, score}) => {
          if (!ranks[name]) ranks[name] = score;
          else ranks[name] = Math.min(ranks[name], Number(score))
          // ranks[name] = Math.min((ranks[name] || null), Number(score));
        });
        console.log('RES.LOCALS.RANKS: ', ranks)
        res.locals.ranks = ranks;
        return next();
      })
      .catch((err) => {
        return next({err});
      })
  };

};

const scoresController = new ScoresController();

module.exports = {
  scoresController
}
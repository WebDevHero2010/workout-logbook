let express = require("express");
let router = express.Router();
let sequelize = require("../db");
let validateSession = require("../middleware/validate-session");
let Log = sequelize.import("../models/log");

//User can create Workout Log
router.post("/", validateSession, (req, res) => {
  Log.create({
    description: req.body.log.description,
    definition: req.body.log.definition,
    result: req.body.log.result,
    owner_id: req.user.id,
  })
    .then((log) => {
      res.status(200).json({
        message: `Log has been added to the DB`,
        log: log,
      });
    })
    .catch((err) => res.status(500).json({ err }));
});

// User can get their entire WOrkout Log list
router.get("/", validateSession, (req, res) => {
  Log.findAll({ where: { owner_id: req.user.id } })
    .then((log) => res.status(200).json(log))
    .catch((err) => res.status(500).json({ error: err }));
});

//User can get one of their individual Logs by searching by its id#
router.get("/:id", validateSession, (req, res) => {
  Log.findOne({ where: { id: req.params.id, owner_id: req.user.id } }).then(
    (log) => {
      if (log) {
        res.status(200).json({
          log: log,
        });
      } else {
        res.status(500).json({
          message: "Data not found.",
        });
      }
    }
  );
});

//User can update their Workout Log via ID
router.put("/:id", validateSession, (req, res) => {
  const updateLogEntry = {
    description: req.body.log.description,
    definition: req.body.log.definition,
    result: req.body.log.result,
  };

  const query = { where: { id: req.params.id, owner_id: req.user.id } };

  Log.update(updateLogEntry, query)
    .then((log) => res.status(200).json(log))
    .catch((err) => res.status(500).json({ error: err }));
});

//User can delete their Workout Log(s) via ID
router.delete("/:id", validateSession, function (req, res) {
  const query = { where: { id: req.params.id, owner_id: req.user.id } };

  Log.destroy(query)
    .then(() => res.status(200).json({ message: "Workout Log Entry Removed" }))
    .catch((err) => res.status(500).json({ error: err }));
});

module.exports = router;

const express = require("express");
const router = express.Router();
const Thing = require("../models/thing");
const multer = require("multer");
const { body, validationResult } = require("express-validator");
const upload = multer(); // aucun `.storage()` ici si tu ne gères pas de fichiers

// list
router.post(
  "/",
  upload.none(),
  [
    body("title").trim().isLength({ min: 1 }).escape(),
    body("description").trim().escape(),
    body("imageUrl").trim().escape(),
    body("userId").trim().isAlphanumeric().escape(),
    body("price").isFloat({ min: 0 }),
  ],
  (req, res) => {
    // object creation
    const thing = new Thing({
      title: req.body.title,
      description: req.body.description,
      imageUrl: req.body.imageUrl,
      userId: req.body.userId,
      price: req.body.price,
    });
    thing
      .save() // save = création a distance
      .then((createdThing) => {
        res.status(201).json({
          message: "Object created !",
          thing: createdThing, // tout l'objet, y compris l'_id
        });
      })
      // it's ok 👍.
      .catch((error) => res.status(400).json({ error: error })); // error management
  }
);

// add
router.get("/", (req, res, next) => {
  Thing.find()
    .select("-__v") // retirer le champ __v
    .then((things) => {
      res.status(200).json(things); // renvoie un tableau avec tous les objets
    })
    .catch((error) => {
      res.status(400).json({ error: error });
    });
});

// update
router.patch(
  "/:id",
  upload.none(),
  [
    body("title").optional().trim().isLength({ min: 1 }).escape(),
    body("description").optional().trim().escape(),
    body("imageUrl").optional().trim().escape(),
    body("userId").optional().trim().isAlphanumeric().escape(),
    body("price").optional().isFloat({ min: 0 }),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const id = req.params.id;

    try {
      // Étape 1 : Récupérer l'objet existant
      const thing = await Thing.findById(id);
      if (!thing) {
        return res.status(404).json({ message: "Object not found" });
      }

      // Étape 2 : Définir les champs interdits
      const protectedFields = ["_id", "__v", "createdAt", "updatedAt"];

      // Étape 3 : Mettre à jour uniquement les champs autorisés
      Object.keys(req.body).forEach((key) => {
        if (!protectedFields.includes(key)) {
          thing[key] = req.body[key];
        }
      });

      // Étape 3 : Enregistrer l'objet modifié
      const updatedThing = await thing.save();

      // Étape 4 : Retourner l'objet complet
      res.status(200).json({
        message: "Object updated successfully",
        thing: updatedThing,
      });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }
);

router.get("/:id", upload.none(), async (req, res) => {
  const id = req.params.id;

  try {
    // Étape 1 : Récupérer l'objet existant
    const thing = await Thing.findById(id);
    if (!thing) {
      return res.status(404).json({ message: "Object not found" });
    }

    // Étape 2 : Retourner l'objet complet
    res.status(200).json({
      thing: thing,
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.delete("/:id", async (req, res) => {
  const id = req.params.id;

  try {
    // Optionnel : retrouver l’objet avant suppression
    const thing = await Thing.findById(id);
    if (!thing) {
      return res.status(404).json({ message: "Object not found" });
    }

    // Supprimer l’objet
    await Thing.deleteOne({ _id: id });

    res.status(200).json({
      message: "Object " + id + " deleted successfully",
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;

const router = require("express").Router();
const adminController = require("../controller/adminController");
const { upload, uploadMultiple } = require("../middleware/multer");

router.get("/dashboard", adminController.viewDashboard);

//crud router bank
router.post("/bank", upload, adminController.addBank);
router.get("/bank", adminController.viewBank);
router.put("/bank", upload, adminController.editBank);
router.delete("/bank/:id", adminController.deleteBank);

//crud router booking
router.get("/booking", adminController.viewBooking);

//crud router category
router.post("/category", adminController.addCategory);
router.get("/category", adminController.viewCategory);
router.put("/category", adminController.editCategory);
router.delete("/category/:id", adminController.deleteCategory);

//crud router item
router.get("/item", adminController.viewItem);
router.post("/item", uploadMultiple, adminController.addItem);
router.get("/item/show_image/:id", adminController.showImageItem);
router.get("/item/:id", adminController.showEditItem);
router.put("/item/:id", uploadMultiple, adminController.editItem);

module.exports = router;

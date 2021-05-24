const modelCategory = require("../models/Category");
const modelBank = require("../models/Bank");
const modelItem = require("../models/Item");
const modelImage = require("../models/Image");
const fs = require("fs-extra");
const path = require("path");

module.exports = {
  viewDashboard: (req, res) => {
    res.render("admin/dashboard/view_dashboard", {
      title: "StayCation | Dashboard",
    });
  },

  /* Start Crud Bank */
  //create bank
  addBank: async (req, res) => {
    try {
      const { name, nomorRekening, nameBank } = req.body;
      await modelBank.create({
        name,
        nomorRekening,
        nameBank,
        imageUrl: `images/${req.file.filename}`,
      });
      req.flash("alertMessage", "Success Add Bank");
      req.flash("alertStatus", "success");
      res.redirect("/admin/bank");
    } catch (error) {
      req.flash("alertMessage", `${error.nessage}`);
      req.flash("alertStatus", "danger");
      res.redirect("/admin/bank");
    }
  },

  //read data bank
  viewBank: async (req, res) => {
    try {
      const bank = await modelBank.find();
      const alertMessage = req.flash("alertMessage");
      const alertStatus = req.flash("alertStatus");
      const alert = { message: alertMessage, status: alertStatus };
      res.render("admin/bank/view_bank", {
        title: "StayCation | Bank",
        alert,
        bank,
      });
    } catch (error) {
      req.flash("alertMessage", `${error.message}`);
      req.flash("alertStatus", "danger");
      res.redirect("/admin/bank/view_bank");
    }
  },

  //update data bank
  editBank: async (req, res) => {
    try {
      const { id, name, nameBank, nomorRekening } = req.body;
      //mencari data berdasarkan id
      const bank = await modelBank.findOne({ _id: id });
      if (req.file == undefined) {
        bank.name = name;
        bank.nameBank = nameBank;
        bank.nomorRekening = nomorRekening;
        await bank.save();
        req.flash("alertMessage", "Success Edit!");
        req.flash("alertStatus", "success");
        res.redirect("/admin/bank");
      } else {
        await fs.unlink(path.join(`public/${bank.imageUrl}`));
        bank.name = name;
        bank.nameBank = nameBank;
        bank.nomorRekening = nomorRekening;
        // bank.imageUrl = `images/${req.file.filename}`;
        bank.imageUrl = `images/${req.file.filename}`;
        await bank.save();
        req.flash("alertMessage", "Success Edit!");
        req.flash("alertStatus", "success");
        res.redirect("/admin/bank");
      }
    } catch (error) {
      req.flash("alertMessage", `${error.message}`);
      req.flash("alertStatus", "danger");
      res.redirect("/admin/bank");
    }
  },

  //delete data bank
  deleteBank: async (req, res) => {
    try {
      const { id } = req.params;
      const bank = await modelBank.findOne({ _id: id }); //mencari data berdasarkan id
      await fs.unlink(path.join(`public/${bank.imageUrl}`));
      req.flash("alertMessage", "Success Delete Data Bank!");
      req.flash("alertStatus", "danger");
      await bank.remove();
      res.redirect("/admin/bank");
    } catch (error) {
      req.flash("alertMessage", `${error.message}`);
      req.flash("alertStatus", "danger");
      res.redirect("/admin/bank");
    }
  },

  /* End Crud Bank */

  viewBooking: (req, res) => {
    res.render("admin/booking/view_booking", { title: "StayCation | Booking" });
  },

  /* Start Crud Category */

  //create data category
  addCategory: async (req, res) => {
    try {
      const { name } = req.body;
      // console.log(name);
      await modelCategory.create({ name });
      req.flash("alertMessage", "Success Add Category!");
      req.flash("alertStatus", "success");
      res.redirect("/admin/category");
    } catch (error) {
      req.flash("alertMessage", `${error.message}`);
      req.flash("alertStatus", "danger");
      res.redirect("/admin/category");
    }
  },

  //read data category
  viewCategory: async (req, res) => {
    const category = await modelCategory.find();
    const alertMessage = req.flash("alertMessage");
    const alertStatus = req.flash("alertStatus");
    const alert = { message: alertMessage, status: alertStatus };
    // console.log(category);
    res.render("admin/category/view_category", {
      category,
      alert,
      title: "StayCation | Category",
    });
  },

  //update data category
  editCategory: async (req, res) => {
    try {
      const { id, name } = req.body;
      //mencari data berdasarkan id
      const category = await modelCategory.findOne({ _id: id });
      req.flash("alertMessage", "Success Edit Category!");
      req.flash("alertStatus", "success");
      // console.log(category)
      category.name = name;
      await category.save();
      res.redirect("/admin/category");
    } catch (error) {
      req.flash("alertMessage", `${error.message}`);
      req.flash("alertStatus", "danger");
      res.redirect("/admin/category");
    }
  },

  //delete data category
  deleteCategory: async (req, res) => {
    try {
      const { id } = req.params;
      const category = await modelCategory.findOne({ _id: id }); //mencari data berdasarkan id
      req.flash("alertMessage", "Success Delete Category!");
      req.flash("alertStatus", "danger");
      await category.remove();
      res.redirect("/admin/category");
    } catch (error) {
      req.flash("alertMessage", `${error.message}`);
      req.flash("alertStatus", "danger");
      res.redirect("/admin/category");
    }
  },
  /* end Crud Category */

  /* Start Crud Item */
  //Create data Item
  addItem: async (req, res) => {
    try {
      const { categoryId, title, price, city, about } = req.body;
      if (req.files.length > 0) {
        const category = await modelCategory.findOne({ _id: categoryId });
        const newItem = {
          categoryId: categoryId,
          title,
          description: about,
          price,
          city,
        };
        const item = await modelItem.create(newItem);
        category.itemId.push({ _id: item._id });
        await category.save();
        for (let i = 0; i < req.files.length; i++) {
          const imageSave = await modelImage.create({
            imageUrl: `images/${req.files[i].filename}`,
          });
          item.imageId.push({ _id: imageSave._id });
          await item.save();
        }
        req.flash("alertMessage", "Success Add item!");
        req.flash("alertStatus", "success");
        res.redirect("/admin/item");
      }
    } catch (error) {
      req.flash("alertMessage", `${error.message}`);
      req.flash("alertStatus", "danger");
      res.redirect("/admin/item");
    }
  },

  //Read data Item
  viewItem: async (req, res) => {
    try {
      const item = await modelItem
        .find()
        .populate({ path: "imageId", select: "id imageUrl" })
        .populate({ path: "categoryId", select: "id name" });
      const category = await modelCategory.find();
      const alertMessage = req.flash("alertMessage");
      const alertStatus = req.flash("alertStatus");
      const alert = { message: alertMessage, status: alertStatus };
      res.render("admin/item/view_item", {
        title: "StayCation | Item",
        category,
        alert,
        item,
        action: "view",
      });
    } catch (error) {
      req.flash("alertMessage", `${error.message}`);
      req.flash("alertStatus", "danger");
      res.redirect("/admin/item");
    }
  },

  //show image item
  showImageItem: async (req, res) => {
    try {
      const { id } = req.params;
      const item = await modelItem
        .findOne({ _id: id })
        .populate({ path: "imageId", select: "id imageUrl" });
      const alertMessage = req.flash("alertMessage");
      const alertStatus = req.flash("alertStatus");
      const alert = { message: alertMessage, status: alertStatus };
      res.render("admin/item/view_item", {
        title: "StayCation | Show Image Item",
        alert,
        item,
        action: "show image",
      });
    } catch (error) {
      req.flash("alertMessage", `${error.message}`);
      req.flash("alertStatus", "danger");
      res.redirect("/admin/item");
    }
  },

  showEditItem: async (req, res) => {
    try {
      const { id } = req.params;
      const item = await modelItem
        .findOne({ _id: id })
        .populate({ path: "imageId", select: "id imageUrl" })
        .populate({ path: "categoryId", select: "id name" });
      const category = await modelCategory.find();
      const alertMessage = req.flash("alertMessage");
      const alertStatus = req.flash("alertStatus");
      const alert = { message: alertMessage, status: alertStatus };
      res.render("admin/item/view_item", {
        title: "StayCation | Edit Item",
        alert,
        item,
        category,
        action: "show edit",
      });
    } catch (error) {
      req.flash("alertMessage", `${error.message}`);
      req.flash("alertStatus", "danger");
      res.redirect("/admin/item");
    }
  },

  editItem: async (req, res) => {
    try {
      const { id } = req.params;
      const { categoryId, title, price, city, about } = req.body;
      const item = await modelItem
        .findOne({ _id: id })
        .populate({ path: "imageId", select: "id imageUrl" })
        .populate({ path: "categoryId", select: "id name" });
      if (req.files.length > 0) {
        for (let i = 0; i < item.imageId.length; i++) {
          const imageUpdate = await modelImage.findOne({
            _id: item.imageId[i]._id,
          });
          console.log(item.imageId._id.imageUrl);
          await fs.unlink(path.join(`public/${imageUpdate.imageUrl}`));
          imageUpdate.imageUrl = `images/${req.files[i].filename}`;
          await imageUpdate.save();
        }
        item.title = title;
        item.price = price;
        item.city = city;
        item.description = about;
        item.categoryId = categoryId;
        await item.save();
        req.flash("alertMessage", "Success Edit Item");
        req.flash("alertStatus", "success");
        res.redirect("/admin/item");
      } else {
        item.title = title;
        item.price = price;
        item.city = city;
        item.description = about;
        item.categoryId = categoryId;
        await item.save();
        req.flash("alertMessage", "Success Edit Item");
        req.flash("alertStatus", "success");
        res.redirect("/admin/item");
      }
    } catch (error) {
      req.flash("alertMessage", `${error.message}`);
      req.flash("alertStatus", "danger");
      res.redirect("/admin/item");
    }
  },
  /* end Crud Item */
};

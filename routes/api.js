/*
 *
 *
 *       Complete the API routing below
 *
 *
 */

"use strict";

const mongoose = require("mongoose");
mongoose.connect(process.env.DB, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
const bookSchema = new mongoose.Schema({
  comments: [String],
  title: String,
  commentcount: Number,
});
const book = mongoose.model("bookModel", bookSchema);

module.exports = function (app) {
  app
    .route("/api/books")
    .get(function (req, res) {
      const _id = req.query._id;
      if (_id == undefined) {
        book
          .find({ title: /.+/g }, (err, doc) => {
            if (err) return console.log(err);
            res.send(doc);
          })
          .select("-__v");
      } else {
        book
          .findById(_id, (err, doc) => {
            if (err) return res.send("no book exists");
            res.send(doc);
          })
          .select("-__v");
      }
    })

    .post(async function (req, res) {
      let title = req.body.title;
      if (title == undefined) return res.send("missing required field title");
      const bookObj = new book({
        title: title,
        commentcount: 0,
      });
      const doc = await bookObj.save();
      res.send({
        _id: doc._id,
        title: doc.title,
      });
    })

    .delete(function (req, res) {
      book.remove({}, (err, n) => {
        if (err) return res.send(err);
        res.send("complete delete successful");
      });
    });

  app
    .route("/api/books/:id")
    .get(function (req, res) {
      let bookid = req.params.id;
      book.findById(bookid, (err, doc) => {
        if (doc == null) return res.send("no book exists");
        res.send(doc);
      });
    })

    .post(async function (req, res) {
      let bookid = req.params.id;
      let comment = req.body.comment;
      if (comment == null) return res.send("missing required field comment");

      book.findById(bookid, (err, doc) => {
        if (doc == null) return res.send("no book exists");
        doc.comments.push(comment);
        doc.commentcount = doc.comments.length;
        doc.save();
        res.send(doc);
      });
    })

    .delete(async function (req, res) {
      let bookid = req.params.id;
      try {
        let n = await book.deleteOne({ _id: bookid });
        if (n.n === 1) {
          return res.send("delete successful");
        } else {
          return res.send("no book exists");
        }
      } catch (e) {
        res.send("no book exists");
      }
    });
};

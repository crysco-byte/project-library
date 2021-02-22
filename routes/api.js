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
  comment: [String],
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
      books.deleteMany({ title: /.+/g }, (err, n) => {
        if (err) return res.send(err);
        res.send("complete delete successful");
      });
    });

  app
    .route("/api/books/:id")
    .get(function (req, res) {
      let bookid = req.params.id;
      book
        .findById(bookid, (err, doc) => {
          if (err) return res.send("no book exists");
          res.send(doc);
        })
        .select("-__v");
    })

    .post(function (req, res) {
      let bookid = req.params.id;
      let comment = req.body.comment;
      if (comment == null) return res.send("missing required field comment");

      book.findById(bookid, (err, doc) => {
        if (err) return res.send("no book exists");
        doc.comment.push(comment);
        doc.commentcount += 1;
        doc.save();
        res.send(doc);
      });
    })

    .delete(function (req, res) {
      let bookid = req.params.id;
      book.deleteOne({ _id: bookid }, (err, n) => {
        if (err) return res.send("no book exists");
        res.send("delete successful");
      });
    });
};

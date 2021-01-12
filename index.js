var express = require('express');
var router = express.Router();
const book = require('../models').Book;

/* GET home page. */
const asyncHandler = (cb)=> { //async handler
  return async(req, res, next) => {
    try{
      await cb(req, res, next)
    } catch(error){
     
      next(error); // forwards to global handler 
    }
  
  
  }
}
router.get('/', asyncHandler(async(req, res, next) => {
  const books = await book.findAll();
   res.redirect('/books');
  
   //res.json({books});

 }));

 router.get("/books", asyncHandler(async(req, res) => {
  const books = await book.findByPk(req.params.id);
  res.render("/books", { books, title: 'Library Books' });
}));

router.get("/books/new", (req, res) => {
  res.render('/books/new', {books: {}, title: "New Book"} )
});
  
router.post("/books/new", asyncHandler(async(req, res) => {
  const books = await book.create(req.body);
  res.redirect("/books/" + books.id, { books, title: 'Library Books' });
}));

router.get("/books/:id", asyncHandler(async(req, res) => {
  const books = await book.findByPk(req.params.id);
  res.render("/books/" + books.id, { books, title: books.title });
}));

router.post("/books/:id", asyncHandler(async(req, res) => {
  const books = await book.findByPk(req.params.id);
  await books.update(req.body);
  res.redirect("/books/" + books.id);
}));

/* Delete book form. */
router.get("/books/:id/delete", asyncHandler(async (req, res) => {
  const books = await book.findByPk(req.param.id);
  res.render("/books/delete", { books, title: "Delete Book" });
}));

/* Delete individual book. */
router.post('/books/:id/delete', asyncHandler(async (req ,res) => {
  const books = await book.findByPk(req.param.id);
  await books.destroy();
  res.redirect("/books");
}));



module.exports = router;

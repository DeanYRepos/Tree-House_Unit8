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
 // Home route
 router.get('/', asyncHandler(async(req, res, next) => {
  const books = await book.findAll();
   res.redirect('/books');

 }));
 // List of Books route
 router.get("/books", asyncHandler(async(req, res) => {
  const books = await book.findByPk(req.params.id);
  res.render("index", { books, title: 'Library Books' });
}));
// New Book form route
router.get("/books/new", (req, res) => {
  res.render('new-book', {books: {}, title: "New Book"} )
});
// Post new Book route  
router.post("/books/new", asyncHandler(async(req, res) => {
  const books = await book.create(req.body);
  res.redirect("/books/" + books.id, { books, title: 'Library Books' });
}));
// Book detail form route
router.get("/books/:id", asyncHandler(async(req, res) => {
  const books = await book.findByPk(req.params.id);
  res.render("update-book" , { books, id: req.params.id });
}));
// Update Book info route
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

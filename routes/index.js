const express = require('express');
const router = express.Router();
const Book = require('../models').Book;

/*Handles asynchronous functions */
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
  const books = await Book.findAll();
   res.redirect(301, '/books');

 }));
 // List of Books route
 router.get("/books", asyncHandler(async(req, res) => {
  const books = await Book.findAll();
  res.render("index", { books, title: 'Library Books' });
}));
// New Book form route
router.get("/books/new", (req, res) => {
  res.render('new-book', {book: {}, title: "New Book"} )
});
// Post new Book route  
router.post("/books/new", asyncHandler(async(req, res) => {
  const book = await Book.create(req.body);
  res.redirect(301,'/books');
}));
// Book detail form route
router.get("/books/:id", asyncHandler(async(req, res) => {
  const book = await Book.findByPk(req.params.id);
  res.render("update-book", { book, id: req.params.id });
}));
// Update Book info route
router.post("/books/:id", asyncHandler(async(req, res) => {
  const book = await Book.findByPk(req.params.id);
  await book.update(req.body);
  res.redirect(301,"/books");
}));



/* Delete individual book. */
router.post('/books/:id/delete', asyncHandler(async (req ,res) => {
  const book = await Book.findByPk(req.param.id);
  await book.destroy();
  res.redirect(301,"/books");
}));



module.exports = router;

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
   res.redirect(301, "/books");

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
  let book;
  try{
   book = await Book.create(req.body);
    res.redirect(301,"/books");
    } catch (error){
      if(error.name === "SequelizeValidationError"){
        book = await Book.build(req.body);
        res.render("new-book", {book, errors:error.errors});
      } else {
        throw error;
    }
  }
}));
// Book detail form route
router.get("/books/:id", asyncHandler(async(req, res) => {
  const book = await Book.findByPk(req.params.id);
  if(book){
   res.render("update-book", { book, id: req.params.id });
    } else {
      res.sendStatus(404);
  }
}));
// Update Book info route
router.post("/books/:id", asyncHandler(async(req, res) => {
  let book;
  try{
    book = await Book.findByPk(req.params.id);
    if(book){ 
      await book.update(req.body);
      res.redirect(301,"/books");
  }  else {
       res.sendStatus(404);
  }
} catch(error){
    if(error.name === "SequelizeValidationError"){
      book = await Book.build(req.body);
      book.id = req.params.id;
      res.render("update-book",{ book, errors:error.errors });
     } else {
         throw error;
    }
   }
  })
);



/* Delete individual book. */
router.post('/books/:id/delete', asyncHandler(async (req ,res) => {
  const book = await Book.findByPk(req.params.id);
  if(book){
    await book.destroy();
    res.redirect(301,"/books");
  } else{
      res.sendStatus(404);
  }

}));



module.exports = router;

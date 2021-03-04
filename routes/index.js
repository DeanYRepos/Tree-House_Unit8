const express = require('express');
const router = express.Router();
const Book = require('../models').Book;
const { Op } = require ("sequelize");


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
//Error handler function
const errHandler = (errStatus, msg) =>{
  const err = new Error(msg);
  err.status = errStatus;
  throw err;

};

 // Home route
 router.get('/', asyncHandler(async(req, res, next) => {
   
   const books = await Book.findAll()
   res.redirect(301, "/books");
}));

router.get('/books/:search', asyncHandler(async(req, res, next) => {
  const search = req.query.search || 1;
  if(search){
  books = await Book.findAndCountAll({
    
    attributes: ['title', 'author', 'genre', 'year'],
 
    where:{
       [Op.or]:  [
         {
           title: {
             [Op.like]: `%${search}%`
           }
         },
         {
           author: {
             [Op.like]: `%${search}%`
           }
         },
         {
           genre:   {
            [Op.like]: `%${search}%`
          }
         },
         {
           year:   {
            [Op.like]: `%${search}%`
          }
         }

       ]

    } ,

   
 })
} else {

  res.redirect(301, "/books")
}
    console.log(search)
  res.render("index", { books: books.rows, search });

}));
 // List of Books route
 router.get("/books/:page?", asyncHandler(async(req, res) => {
  const page = req.params.page || 1;
  let totalPages;
  let bookCount;
  console.log(page);
  const books = await Book.findAll({
    
    limit: 5, 
    offset:( page * 5 )- 5,
    page: page
   
  });
  console.log(books);
  bookCount = await Book.count();
  totalPages = Math.ceil(bookCount / 5) 
  console.log(totalPages);
  console.log(bookCount);
  res.render("index", { books, title: 'Library Books', page: page, totalPages, bookCount });
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
router.get("/books/update/:id", asyncHandler(async(req, res) => {
  const book = await Book.findByPk(req.params.id);

  if(book){
   res.render("update-book", { book, id: req.params.id });
    } else {
     errHandler( 404, 'Page not found! Please try again.');
    
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
    errHandler(404, 'Page not found!');
  }
} catch(error){
    if(error.name === "SequelizeValidationError"){
      book = await Book.build(req.body);
      book.id = req.params.id;
      res.render("update-book",{ book, errors:error.errors});
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
    errHandler(404, 'Page not found! Please try again.');
  }

}));



module.exports = router;

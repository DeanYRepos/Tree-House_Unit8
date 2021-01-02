var express = require('express');
var router = express.Router();
const book = require('../models').Book;

/* GET home page. 12/30/2020 step 6 */
const asyncHandler = (cb)=> { //async handler
  return async(req, res, next) => {
    try{
      await cb(req, res, next)
    } catch(error){
      res.status(500).send(error);
    }
  }
}
router.get('/', asyncHandler(async(req, res, next) => {
  const books = await Book.findAll();
   res.render('index',  books );
  // res.render(books);
   //res.render(json(books));
   //console.log(res.json(book));
 }));

module.exports = router;

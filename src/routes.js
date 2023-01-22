const {
  homePage,
  addBooksHandler,
  getAllBooksHandler,
  getBookByIdHandler,
  editBookByIdHandler,
  deleteBookByIdHandler,
  urlUndefined,
 } = require("./handler.js");
 
 const routes = [
  // route home page
  {
   method: "GET",
   path: "/",
   handler: homePage,
  },
  // route 1
  {
   method: "POST",
   path: "/books",
   handler: addBooksHandler,
  },
  //  route 2
  {
   method: "GET",
   path: "/books",
   handler: getAllBooksHandler,
  },
  //  route 3
  {
   method: "GET",
   path: "/books/{id}",
   handler: getBookByIdHandler,
  },
  //  route 4
  {
   method: "PUT",
   path: "/books/{id}",
   handler: editBookByIdHandler,
  },
  //  route 5
  {
   method: "DELETE",
   path: "/books/{id}",
   handler: deleteBookByIdHandler,
  },
  {
   method: "*",
   path: "/{any*}",
   handler: urlUndefined,
  },
 ];
 
 module.exports = routes;
 
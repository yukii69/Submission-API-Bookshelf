
const { nanoid } = require("nanoid");
const books = require("./books");


const homePage = () => ({
 status: "Book api is ready!",
});

//! Add Books
const addBooksHandler = (req, h) => {
 
 const {
  name,
  year,
  author,
  summary,
  publisher,
  pageCount,
  readPage,
  reading,
 } = req.payload;

 let finished = false;

 if (pageCount === readPage) {
  finished = true;
 }


 if (!name) {
  return h
   .response({
    status: "fail",
    message: "Gagal menambahkan buku. Mohon isi nama buku",
   })
   .code(400);
 } else if (readPage > pageCount) {
  return h
   .response({
    status: "fail",
    message:
     "Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount",
   })
   .code(400);
 }

 const id = nanoid(16);

 
 const insertedAt = new Date().toISOString();
 const updatedAt = new Date().toISOString();


 const newBook = {
  id,
  name,
  year,
  author,
  summary,
  publisher,
  pageCount,
  readPage,
  finished,
  reading,
  insertedAt,
  updatedAt,
 };

 books.push(newBook);

 
 const isSuccess = books.filter((book) => book.id === id).length > 0;

 
 if (isSuccess) {
  const response = h.response({
   status: "success",
   message: "Buku berhasil ditambahkan",
   data: {
    bookId: id,
   },
  });
  response.code(201);
  return response;
 }

 
 const response = h.response({
  status: "error",
  message: "Buku gagal ditambahkan",
 });
 response.code(500);
 return response;
};

//! Get all books
const getAllBooksHandler = (req, h) => {
 const { name, reading, finished } = req.query;

 if (name) {

  const nameBook = books.filter((b) =>
   b.name.toLowerCase().includes(name.toLowerCase())
  );

  if (nameBook.length > 0) {
   return h.response({
    status: "success",
    data: {
     books: nameBook.map((b) => ({
      id: b.id,
      name: b.name,
      publisher: b.publisher,
     })),
    },
   });
  }
  return h
   .response({
    status: "fail",
    message: "nama buku tidak ditemukan",
   })
   .code(404);
 } else if (reading) {
  // mengparse str menjadi int
  let readingSearchNumber = parseInt(reading);

  // Melakukan pengkondisian
  switch (readingSearchNumber) {
   case 0:
    readingSearchNumber = false;
    break;
   case 1:
    readingSearchNumber = true;
    break;
   default:
    readingSearchNumber = undefined;
  }


  const readingBook = books.filter((b) => b.reading === readingSearchNumber);
  if (readingBook.length > 0) {
   return h.response({
    status: "success",
    data: {
     // panggil semua data
     books: readingBook.map((b) => ({
      id: b.id,
      name: b.name,
      publisher: b.publisher,
     })),
    },
   });
  }
  return h
   .response({
    status: "fail",
    message: "buku yang dibaca tidak ditemukan",
   })
   .code(404);
 } else if (finished) {
  let finishedSearchNumber = parseInt(finished);

  switch (finishedSearchNumber) {
   case 0:
    finishedSearchNumber = false;
    break;
   case 1:
    finishedSearchNumber = true;
    break;
   default:
    finishedSearchNumber = undefined;
  }

  
  const finishedBook = books.filter((b) => b.finished === finishedSearchNumber);
  if (finishedBook.length > 0) {
   return h.response({
    status: "success",
    data: {
     books: finishedBook.map((b) => ({
      id: b.id,
      name: b.name,
      publisher: b.publisher,
     })),
    },
   });
  }
  return h
   .response({
    status: "fail",
    message: "buku yang selesai dibaca tidak ditemukan",
   })
   .code(404);
 }

 return h.response({
  status: "success",
  data: {
   books: books.map((b) => ({
    id: b.id,
    name: b.name,
    publisher: b.publisher,
   })),
  },
 });
};

//! Get Book By ID
const getBookByIdHandler = (req, h) => {

 const { id } = req.params;

 //  mengfilter id dari buku
 const book = books.filter((b) => b.id === id)[0];

 if (book !== undefined) {
  return {
   status: "success",
   data: {
    book,
   },
  };
 }

 const response = h.response({
  status: "fail",
  message: "Buku tidak ditemukan",
 });
 response.code(404);
 return response;
};

//! Edit Books by ID
const editBookByIdHandler = (req, h) => {
 // Mengambil data id dari parameter url
 const { id } = req.params;


 const {
  name,
  year,
  author,
  summary,
  publisher,
  pageCount,
  readPage,
  reading,
 } = req.payload;

 if (!name) {
  return h
   .response({
    status: "fail",
    message: "Gagal memperbarui buku. Mohon isi nama buku",
   })
   .code(400);
 } else if (readPage > pageCount) {
  return h
   .response({
    status: "fail",
    message:
     "Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount",
   })
   .code(400);
 }

 //  Meng-set waktu
 const updatedAt = new Date().toISOString();

 let finished = false;
 //  pengaturan finished
 if (pageCount === readPage) {
  finished = true;
 }

 const index = books.findIndex((book) => book.id === id);

 if (index !== -1) {
  books[index] = {
   ...books[index],
   id,
   name,
   year,
   author,
   summary,
   publisher,
   pageCount,
   readPage,
   finished,
   reading,
   updatedAt,
  };
  const response = h.response({
   status: "success",
   message: "Buku berhasil diperbarui",
  });
  response.code(200);
  return response;
 }

 
 const response = h.response({
  status: "fail",
  message: "Gagal memperbarui buku. Id tidak ditemukan",
 });
 response.code(404);
 return response;
};

//! Delete Book by ID
const deleteBookByIdHandler = (req, h) => {
 const { id } = req.params;


 const index = books.findIndex((book) => book.id === id);

 if (index !== -1) {
  books.splice(index, 1);

  //   mengembalikan response success
  const response = h.response({
   status: "success",
   message: "Buku berhasil dihapus",
  });

  response.code(200);
  return response;
 }

 const response = h.response({
  status: "fail",
  message: "Buku gagal dihapus. Id tidak ditemukan",
 });

 response.code(404);
 return response;
};

//! URL Undefined
const urlUndefined = (req, h) => {
 return h
  .response({
   status: "Error",
   message: "Url Not Found",
  })
  .code(404);
};

// mengeskport method yang nantinya akan digunakan
module.exports = {
 homePage,
 addBooksHandler,
 getAllBooksHandler,
 getBookByIdHandler,
 editBookByIdHandler,
 deleteBookByIdHandler,
 urlUndefined,
};

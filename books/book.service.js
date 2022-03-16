const bcrypt = require('bcryptjs');
const db = require('_helpers/db');
const multer = require('multer');


module.exports = {
    getAll,
    getById,
    create,
    update,
    uploadImg,
    delete: _delete
};

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './uploads');
      },
    filename: function (req, file, cb) {
        cb(null, file.originalname);
    }
});

const uploadImg = multer({storage: storage}).single('image');


async function getAll() {
    return await db.Book.findAll();
}

async function getById(id) {
    return await getBook(id);
}

async function create(params) {
    // validate
    if (await db.Book.findOne({ where: { title: params.title } })) {
        throw 'Title "' + params.title + '" is already registered';
    }

    const book = new db.Book(params);
    
    // save book
    await book.save();
}

async function update(id, params) {
    const book = await getBook(id);

    // validate
    const titleChanged = params.title && book.title !== params.title;

    if (titleChanged && await db.Book.findOne({ where: { title: params.title } })) {
        throw 'Title "' + params.title + '" is already registered';
    }

    // copy params to user and save
    Object.assign(book, params);
    await book.save();
}

async function _delete(id) {
    const book = await getBook(id);
    await book.destroy();
}

// helper functions
async function getBook(id) {
    const book = await db.Book.findByPk(id);
    if (!book) throw 'Book not found';
    return book;
}

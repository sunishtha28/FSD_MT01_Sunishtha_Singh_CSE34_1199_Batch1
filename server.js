const express = require("express");

const app = express();

app.use(express.json());

// Initial book records
let books = [
    {
        id: 101,
        title: "Wings of Fire",
        author: "A.P.J. Abdul Kalam",
        genre: "Autobiography",
        publishedYear: 1999,
        available: true
    },
    {
        id: 102,
        title: "The Alchemist",
        author: "Paulo Coelho",
        genre: "Fiction",
        publishedYear: 1988,
        available: true
    },
    {
        id: 103,
        title: "Harry Potter",
        author: "J.K. Rowling",
        genre: "Fantasy",
        publishedYear: 1997,
        available: false
    }
];

// Validate book data
function validateBook(data) {
    return (
        typeof data.title === "string" &&
        data.title.trim() !== "" &&
        typeof data.author === "string" &&
        data.author.trim() !== "" &&
        typeof data.genre === "string" &&
        data.genre.trim() !== "" &&
        Number.isInteger(data.publishedYear) &&
        typeof data.available === "boolean"
    );
}

// 1. GET all books
app.get("/api/books", (req, res) => {
    res.status(200).json(books);
});

// 2. POST a new book
app.post("/api/books", (req, res) => {

    const data = req.body;

    if (!validateBook(data)) {
        return res.status(400).json({
            message: "Invalid book data"
        });
    }

    const newBook = {
        id: Math.max(...books.map(book => book.id), 100) + 1,
        title: data.title,
        author: data.author,
        genre: data.genre,
        publishedYear: data.publishedYear,
        available: data.available
    };

    books.push(newBook);

    res.status(201).json(newBook);
});

// 3. GET book by ID
app.get("/api/books/:id", (req, res) => {

    const id = Number(req.params.id);

    const book = books.find(b => b.id === id);

    if (!book) {
        return res.status(404).json({
            message: "Book not found"
        });
    }

    res.status(200).json(book);
});

// 4. PUT - Update book
app.put("/api/books/:id", (req, res) => {

    const id = Number(req.params.id);

    const index = books.findIndex(b => b.id === id);

    if (index === -1) {
        return res.status(404).json({
            message: "Book not found"
        });
    }

    const data = req.body;

    if (!validateBook(data)) {
        return res.status(400).json({
            message: "Invalid book data"
        });
    }

    books[index] = {
        id: id,
        title: data.title,
        author: data.author,
        genre: data.genre,
        publishedYear: data.publishedYear,
        available: data.available
    };

    res.status(200).json(books[index]);
});

// 5. DELETE a book
app.delete("/api/books/:id", (req, res) => {

    const id = Number(req.params.id);

    const index = books.findIndex(b => b.id === id);

    if (index === -1) {
        return res.status(404).json({
            message: "Book not found"
        });
    }

    books.splice(index, 1);

    res.status(200).json({
        message: "Book deleted successfully"
    });
});

// 6. FILTER books by author
// Keep this route before /api/books/:id
app.get("/api/books/filter", (req, res) => {

    const author = req.query.author;

    if (!author || author.trim() === "") {
        return res.status(400).json({
            message: "Author query is required"
        });
    }

    const result = books.filter(book =>
        book.author.toLowerCase() === author.trim().toLowerCase()
    );

    res.status(200).json(result);
});

// Start server
app.listen(3000, () => {
    console.log("Server is running on port 3000");
});
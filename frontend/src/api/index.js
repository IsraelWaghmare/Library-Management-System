import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000/api",
});

//
// 📚 BOOKS API
//
export const getBooks = () => API.get("/books");

export const getBookById = (id) => API.get(`/books/${id}`);

export const createBook = (data) => API.post("/books", data);

export const updateBook = (id, data) =>
  API.put(`/books/${id}`, data);

export const deleteBook = (id) =>
  API.delete(`/books/${id}`);


//
// 👤 MEMBERS API
//
export const getMembers = () => API.get("/members");

export const createMember = (data) =>
  API.post("/members", data);

export const updateMember = (id, data) =>
  API.put(`/members/${id}`, data);

export const deleteMember = (id) =>
  API.delete(`/members/${id}`);


//
// 🔄 BORROWS API
//
export const getBorrows = () => API.get("/borrows");

export const issueBook = (data) =>
  API.post("/borrows", data);

export const returnBook = (id) =>
  API.put(`/borrows/${id}/return`);

export const getStats = () =>
  API.get("/borrows/stats");


// default export (optional if you still want raw access)
export default API;

import { useEffect, useState } from "react";

function App() {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchBooks() {
      try {
        const res = await fetch(`${process.env.REACT_APP_API_URL}/book`);
        if (!res.ok) throw new Error("Verkkovirhe");
        const data = await res.json();
        setBooks(data);
      } catch (err) {
        console.error("Virhe haettaessa kirjoja:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchBooks();
  }, []);

  if (loading) return <p>Ladataan kirjoja...</p>;

  return (
    <div style={{ maxWidth: 600, margin: "2rem auto", fontFamily: "sans-serif" }}>
      <h1>Minun Kirjat tietokannassa</h1>
      {books.length === 0 ? (
        <p>Ei kirjoja löytynyt.</p>
      ) : (
        <ul>
          {books.map((book) => (
            <li key={book.id}>
              <strong>{book.title}</strong> — {book.author}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default App;

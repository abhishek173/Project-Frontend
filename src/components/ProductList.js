import React, { useEffect, useState } from "react";
import $ from 'jquery';

const ITEMS_PER_PAGE = 2;

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [displayedProducts, setDisplayedProducts] = useState([]);
  const [sortBy, setSortBy] = useState("recent");
  const [currentPage, setCurrentPage] = useState(1);

  const token = sessionStorage.getItem('token'); // get token from sessionStorage

  // Fetch data using jQuery with token
  useEffect(() => {

    $.ajax({
      url: 'http://127.0.0.1:8000/api/projects/',  // API endpoint
      method: 'GET',  
      success: function (data) {
        const sorted = sortData(data, sortBy);
        setProducts(sorted);
        setCurrentPage(1);
      },
      error: function (err) {
        console.error("Failed to fetch:", err);
      },
    });
  }, [sortBy, token]);


  
  // Update paginated data when products or currentPage changes
  useEffect(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    const end = start + ITEMS_PER_PAGE;
    setDisplayedProducts(products.slice(start, end));
  }, [products, currentPage]);

  // Sorting logic
  const sortData = (data, key) => {
    const sorted = [...data];
    switch (key) {
      case "category":
        return sorted.sort((a, b) =>
          a.category_title.localeCompare(b.category_title)
        );
      case "username":
        return sorted.sort((a, b) => a.username.localeCompare(b.username));
      case "project_title":
        return sorted.sort((a, b) =>
          a.project_title.localeCompare(b.project_title)
        );
      case "recent":
      default:
        return sorted.sort(
          (a, b) => new Date(b.date_added) - new Date(a.date_added)
        );
    }
  };

  const totalPages = Math.ceil(products.length / ITEMS_PER_PAGE);

  return (
    <div style={{ padding: "20px", fontFamily: "Arial" }}>
      <h2>Project List</h2>

      {/* Sort Dropdown */}
      <div style={{ marginBottom: "10px" }}>
        <label>Sort By: </label>
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          id="sort-select"
        >
          <option value="recent">Recent Projects</option>
          <option value="category">Category </option>
          <option value="username">Username</option>
          <option value="project_title">Project Title</option>
        </select>
      </div>

      {/* Table */}
      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr>
            <th style={styles.th}>Project Title</th>
            <th style={styles.th}>Username</th>
            <th style={styles.th}>Category Name</th>
          </tr>
        </thead>
        <tbody>
          {displayedProducts.map((item) => (
            <tr key={item.id}>
              <td style={styles.td}>{item.project_title || "N/A"}</td>
              <td style={styles.td}>{item.username}</td>
              <td style={styles.td}>{item.category_title}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Pagination */}
      <div style={{ marginTop: "15px", textAlign: "center" }}>
        <button
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
          style={{
            ...styles.pageButton,
            backgroundColor: currentPage === 1 ? "#ddd" : "#f0f0f0",
            cursor: currentPage === 1 ? "not-allowed" : "pointer",
          }}
        >
          Prev
        </button>

        {Array.from({ length: totalPages }, (_, i) => (
          <button
            key={i + 1}
            onClick={() => setCurrentPage(i + 1)}
            style={{
              ...styles.pageButton,
              backgroundColor: currentPage === i + 1 ? "#007bff" : "#f0f0f0",
              color: currentPage === i + 1 ? "#fff" : "#000",
            }}
          >
            {i + 1}
          </button>
        ))}

        <button
          onClick={() =>
            setCurrentPage((prev) => Math.min(prev + 1, totalPages))
          }
          disabled={currentPage === totalPages}
          style={{
            ...styles.pageButton,
            backgroundColor: currentPage === totalPages ? "#ddd" : "#f0f0f0",
            cursor: currentPage === totalPages ? "not-allowed" : "pointer",
          }}
        >
          Next
        </button>
      </div>
    </div>
  );
};

const styles = {
  th: {
    border: "1px solid #ccc",
    padding: "8px",
    backgroundColor: "#f1f1f1",
  },
  td: {
    border: "1px solid #ccc",
    padding: "8px",
  },
  pageButton: {
    marginRight: "5px",
    padding: "6px 12px",
    border: "1px solid #aaa",
    cursor: "pointer",
  },
};

export default ProductList;

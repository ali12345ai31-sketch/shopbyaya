import { useNavigate } from "react-router-dom";

export default function CategorySection() {
  const navigate = useNavigate();

  const categories = [
    { name: "All", value: "all" },
    { name: "Men", value: "man" },
    { name: "Women", value: "woman" },
    { name: "Kids", value: "kids" }
  ];

  return (
    <div className="category-container">
      {categories.map((c) => (
        <div
          key={c.value}
          className="category-box"
          onClick={() => navigate(`/?category=${c.value}`)}
        >
          {c.name}
        </div>
      ))}
    </div>
  );
}

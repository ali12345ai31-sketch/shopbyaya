export default function Stars({ rating = 0 }) {
  const stars = [1, 2, 3, 4, 5];

  return (
    <div className="stars">
      {stars.map((s) => (
        <span key={s}>
          {rating >= s ? "\u2605" : "\u2606"}
        </span>
      ))}
    </div>
  );
}

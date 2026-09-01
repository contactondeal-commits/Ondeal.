export default function CategoryLoading() {
  return (
    <div className="container" style={{ paddingTop: 24 }}>
      <div style={{ height: 28, width: 200, background: "#f3f4f6", borderRadius: 6, marginBottom: 24, animation: "pulse 1.5s infinite" }} />
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: 20 }}>
        {Array.from({ length: 12 }).map((_, i) => (
          <div key={i} style={{ background: "#f3f4f6", borderRadius: 12, height: 320, animation: "pulse 1.5s infinite" }} />
        ))}
      </div>
    </div>
  );
}

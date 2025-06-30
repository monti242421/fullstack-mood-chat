function LoadingState() {
  return (
    <div className="text-center spinner" style={{ marginTop: "60px" }}>
      <div className="spinner-border" role="status">
        <span className="visually-hidden">Loading...</span>
      </div>
    </div>
  );
}
export default LoadingState;

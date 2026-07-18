function FullScreenLoader() {
  return (
    <div
      className="position-fixed top-0 start-0 w-100 vh-100 d-flex flex-column justify-content-center align-items-center bg-white"
      style={{ zIndex: 9999 }}
    >
      <div
        className="spinner-border text-success"
        style={{ width: "3rem", height: "3rem" }}
        role="status"
      >
        <span className="visually-hidden">Loading...</span>
      </div>

      <p className="mt-3 mb-0 fw-semibold text-secondary">
        Loading...
      </p>
    </div>
  );
}

export default FullScreenLoader;
const Button = ({ children, ...props }: any) => {
  return (
    <button
      {...props}
      style={{
        padding: "8px 16px",
        borderRadius: "4px",
        border: "1px solid #ccc",
        background: "#007bff",
        color: "#fff",
        cursor: "pointer",
        fontSize: "16px",
      }}
    >
      {children}
    </button>
  );
};

export default Button;

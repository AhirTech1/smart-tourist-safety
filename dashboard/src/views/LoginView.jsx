import { useNavigate } from "react-router-dom";

export default function LoginView() {
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    navigate("/dashboard");
  };

  return (
    <div className="container">
      <h1>Tourist Safety Dashboard Login</h1>
      <form onSubmit={handleLogin}>
        <input type="text" placeholder="Username" required />
        <input type="password" placeholder="Password" required />
        <button type="submit">Login</button>
      </form>
    </div>
  );
}

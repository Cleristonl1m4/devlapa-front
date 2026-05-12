import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../contexts/authContext.jsx";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [localError, setLocalError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { login, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/home";

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLocalError("");
    if (!username.trim() || !password.trim()) {
      setLocalError("Preencha todos os campos");
      return;
    }
    setIsSubmitting(true);
    try {
      const result = await login(username, password);
      if (result && result.success) {
        setTimeout(() => navigate(from, { replace: true }), 150);
      } else {
        setLocalError(result.error || "Usuário ou senha inválidos");
      }
    } catch (err) {
      setLocalError("Erro ao conectar com o servidor");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#1a1a2e]">
        <div className="animate-spin rounded-full h-10 w-10 border-4 border-[#E67E22] border-t-transparent mb-4" />
        <p className="text-white font-semibold text-sm tracking-wide">Acessando...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8F9FC] flex items-center justify-center px-4">
      <div className="w-full max-w-sm">

        
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-[#E67E22] rounded-[20px] shadow-lg shadow-orange-200 mb-4">
            <span className="text-white font-black text-2xl">Ó</span>
          </div>
          <p className="text-xs font-black text-gray-400 uppercase tracking-widest mb-1">Bar</p>
          <h1 className="text-3xl font-black text-[#151D48] tracking-tighter">Ó PAI, Ó</h1>
        </div>

        
        <div className="bg-white rounded-[32px] shadow-sm border border-gray-100 p-8">
          <h2 className="text-xl font-black text-[#151D48] mb-6">Entrar</h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-[10px] font-black text-gray-400 uppercase ml-1 mb-1 block">
                Usuário
              </label>
              <input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Digite seu usuário"
                disabled={isSubmitting}
                autoComplete="username"
                autoFocus
                className="w-full p-4 bg-[#F0F3F9] rounded-2xl border-none focus:ring-2 focus:ring-[#E67E22] outline-none font-medium text-[#151D48]"
              />
            </div>

            <div>
              <label className="text-[10px] font-black text-gray-400 uppercase ml-1 mb-1 block">
                Senha
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Digite sua senha"
                disabled={isSubmitting}
                autoComplete="current-password"
                className="w-full p-4 bg-[#F0F3F9] rounded-2xl border-none focus:ring-2 focus:ring-[#E67E22] outline-none font-medium text-[#151D48]"
              />
            </div>

            {localError && (
              <div className="bg-red-50 border border-red-100 rounded-2xl px-4 py-3 text-sm text-red-600 font-medium flex items-center gap-2">
                <span>⚠️</span> {localError}
              </div>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-[#E67E22] hover:bg-[#d35400] text-white font-black py-4 rounded-2xl transition-all shadow-lg shadow-orange-100 disabled:opacity-60 mt-2"
            >
              {isSubmitting ? "Entrando..." : "Entrar"}
            </button>
          </form>
        </div>

        <p className="text-center text-xs text-gray-400 mt-6">
          Não tem acesso? Fale com o administrador.
        </p>
      </div>
    </div>
  );
};

export default Login;
import { useState, useRef, useEffect, useMemo } from "react";
import { X, ChevronDown, AlertTriangle } from "lucide-react";
import { apiRequest } from "../../services/auth";

const ComboBox = ({ label, value, onChange, opcoes, placeholder, campoExibicao = "nome", required = false }) => {
  const [aberto, setAberto] = useState(false);
  const [busca, setBusca] = useState(value || "");
  const ref = useRef(null);

  useEffect(() => { setBusca(value || ""); }, [value]);

  useEffect(() => {
    const fechar = (e) => { if (ref.current && !ref.current.contains(e.target)) setAberto(false); };
    document.addEventListener("mousedown", fechar);
    return () => document.removeEventListener("mousedown", fechar);
  }, []);

  const lista = Array.isArray(opcoes) ? opcoes : [];
  const sugestoes = useMemo(() => {
    const termo = busca?.toLowerCase() || "";
    return lista.filter((op) => {
      const valor = typeof op === "string" ? op : op?.[campoExibicao];
      return valor?.toLowerCase().includes(termo);
    });
  }, [lista, busca, campoExibicao]);

  const selecionar = (op) => {
    setBusca(typeof op === "string" ? op : op?.[campoExibicao] || "");
    onChange(op);
    setAberto(false);
  };

  return (
    <div ref={ref} className="relative text-left">
      <label className="text-[10px] font-black text-gray-400 mb-1 block uppercase ml-1">{label} {required && "*"}</label>
      <div className="relative">
        <input
          type="text"
          value={busca}
          onChange={(e) => { setBusca(e.target.value); onChange(e.target.value); setAberto(true); }}
          onFocus={() => setAberto(true)}
          placeholder={placeholder}
          className="w-full p-4 bg-[#F0F3F9] rounded-2xl border-none outline-none focus:ring-2 focus:ring-[#E67E22] font-medium text-[#151D48]"
          required={required}
        />
        <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
      </div>
      {aberto && sugestoes.length > 0 && (
        <ul className="absolute z-50 w-full bg-white border border-gray-100 rounded-2xl shadow-xl mt-1 max-h-48 overflow-y-auto">
          {sugestoes.map((op, i) => (
            <li key={i} onClick={() => selecionar(op)} className="px-4 py-3 hover:bg-orange-50 hover:text-[#E67E22] cursor-pointer text-sm font-bold text-[#151D48] first:rounded-t-2xl last:rounded-b-2xl">
              {typeof op === "string" ? op : op?.[campoExibicao]}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

const InputField = ({ label, type = "text", required = false, ...props }) => (
  <div className="text-left">
    <label className="text-[10px] font-black text-gray-400 mb-1 block uppercase ml-1">{label} {required && "*"}</label>
    <input type={type} className="w-full p-4 bg-[#F0F3F9] rounded-2xl border-none focus:ring-2 focus:ring-[#E67E22] outline-none font-medium text-[#151D48]" required={required} {...props} />
  </div>
);


const EstoqueModal = ({ opcoes, onClose, onSucesso, itemParaEditar = null }) => {
  const modoEdicao = !!itemParaEditar;

  const [activeTab, setActiveTab] = useState(modoEdicao ? "estoque" : "produto");
  const [form, setForm] = useState(() => ({
    nomeProduto: itemParaEditar?.nomeProduto || "",
    categoriaId: itemParaEditar?.categoriaId || null,
    categoriaNome: itemParaEditar?.categoria || "",
    preco: itemParaEditar?.preco != null ? String(itemParaEditar.preco) : "",
    unidade: itemParaEditar?.unidade || "un",
    quantidade: itemParaEditar?.quantidade != null ? String(itemParaEditar.quantidade) : "",
    minimo: itemParaEditar?.minimo != null ? String(itemParaEditar.minimo) : "",
    fornecedoresId: itemParaEditar?.fornecedorId || null,
    fornecedorNome: itemParaEditar?.fornecedor || "",
    produtoExistenteId: itemParaEditar?.produtoId || null,
    estoqueId: itemParaEditar?.id || null,
  }));

  const [salvando, setSalvando] = useState(false);
  const [erro, setErro] = useState(null);
  const [logs, setLogs] = useState([]);

  const log = (msg) => { console.log(msg); setLogs((p) => [...p, msg]); };
  const set = (campo, valor) => setForm((p) => ({ ...p, [campo]: valor }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (activeTab === "produto" && !modoEdicao) { setActiveTab("estoque"); return; }

    setLogs([]);
    setErro(null);
    setSalvando(true);

    try {
      if (modoEdicao) {
        
        log(`[1] Editando produto ID: ${form.produtoExistenteId}`);
        await apiRequest(`/api/produtos/update/${form.produtoExistenteId}`, "PATCH", {
          nome: form.nomeProduto.trim(),
          preco: parseFloat(String(form.preco).replace(",", ".")) || 0,
          unidade: form.unidade || "un",
          categoriaId: form.categoriaId ?? null,
          fornecedorId: form.fornecedoresId ?? null,
        });

        log(`[2] Editando estoque ID: ${form.estoqueId}`);
        await apiRequest(`/api/estoque/${form.estoqueId}`, "PATCH", {
          quantidade: parseInt(form.quantidade) || 0,
        });

        log(`[3] ✓ Sucesso!`);
      } else {
        // CRIAÇÃO
        let produtoId = form.produtoExistenteId;

        if (!produtoId) {
          const payload = {
            nome: form.nomeProduto.trim(),
            preco: parseFloat(String(form.preco).replace(",", ".")) || 0,
            unidade: form.unidade || "un",
            categoriaId: form.categoriaId ?? null,
            fornecedoresId: form.fornecedoresId ?? null,
          };
          log(`[1] Criando produto: ${JSON.stringify(payload)}`);
          const criado = await apiRequest("/api/produtos", "POST", payload);
          log(`[2] Resposta: ${JSON.stringify(criado)}`);
          produtoId = criado?.id;
          if (!produtoId) throw new Error("Produto criado sem ID.");
        }

        log(`[3] Criando estoque para produtoId: ${produtoId}`);
        await apiRequest("/api/estoque", "POST", {
          produtoId,
          quantidade: parseInt(form.quantidade) || 0,
          minimo: parseInt(form.minimo) || 0,
        });
        log(`[4] ✓ Sucesso!`);
      }

      await new Promise((r) => setTimeout(r, 300));
      onSucesso();
      onClose();
    } catch (err) {
      console.error(err);
      log(`[ERRO] ${err.message}`);
      setErro(err.message);
    } finally {
      setSalvando(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 backdrop-blur-sm p-4">
      <div className="bg-[#D1D5DB] p-8 rounded-[40px] w-full max-w-md shadow-2xl relative max-h-[90vh] overflow-y-auto">
        <button onClick={onClose} className="absolute right-6 top-6 text-gray-500"><X /></button>
        <h3 className="text-2xl font-black text-[#151D48] mb-6 uppercase tracking-tighter">
          {modoEdicao ? "Editar Produto" : "Novo Registro"}
        </h3>

        {logs.length > 0 && (
          <div className="mb-4 bg-black/80 rounded-2xl p-3 space-y-1 max-h-32 overflow-y-auto">
            {logs.map((l, i) => (
              <p key={i} className={`text-[10px] font-mono ${l.includes("ERRO") ? "text-red-400" : l.includes("✓") ? "text-green-400" : "text-gray-300"}`}>{l}</p>
            ))}
          </div>
        )}

        {erro && (
          <div className="mb-4 bg-red-50 border border-red-200 rounded-2xl p-3">
            <p className="text-xs text-red-600 font-bold">❌ {erro}</p>
          </div>
        )}

        {!modoEdicao && (
          <div className="flex bg-gray-300/50 rounded-2xl p-1 mb-6">
            <button type="button" onClick={() => setActiveTab("produto")} className={`flex-1 py-3 rounded-xl text-xs font-bold uppercase transition-all ${activeTab === "produto" ? "bg-white text-[#E67E22] shadow" : "text-gray-500"}`}>1. Item</button>
            <button type="button" onClick={() => setActiveTab("estoque")} className={`flex-1 py-3 rounded-xl text-xs font-bold uppercase transition-all ${activeTab === "estoque" ? "bg-white text-[#E67E22] shadow" : "text-gray-500"}`}>2. Estoque</button>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          
          {(activeTab === "produto" || modoEdicao) && (
            <div className="space-y-4">
              {!modoEdicao && (
                <ComboBox
                  label="Produto"
                  value={form.nomeProduto}
                  opcoes={opcoes.produtos}
                  placeholder="Digite ou selecione..."
                  required
                  onChange={(op) => {
                    if (op && typeof op === "object") {
                      setForm((p) => ({
                        ...p,
                        produtoExistenteId: op.id,
                        nomeProduto: op.nome,
                        preco: op.preco != null ? String(op.preco) : p.preco,
                        categoriaId: op.categoriaId ?? op.categoria?.id ?? p.categoriaId,
                        categoriaNome: op.categoriaNome ?? op.categoria?.nome ?? p.categoriaNome,
                        fornecedoresId: op.fornecedorId ?? op.fornecedor?.id ?? p.fornecedoresId,
                        fornecedorNome: op.fornecedorNome ?? op.fornecedor?.nome ?? p.fornecedorNome,
                      }));
                    } else {
                      setForm((p) => ({ ...p, nomeProduto: op || "", produtoExistenteId: null }));
                    }
                  }}
                />
              )}

              {modoEdicao && (
                <div className="bg-white/60 rounded-2xl p-4">
                  <p className="text-[10px] font-black text-orange-500 uppercase mb-1">Editando produto</p>
                  <p className="font-bold text-[#151D48] text-lg">{form.nomeProduto}</p>
                </div>
              )}

              <InputField label="Nome do Produto" type="text" value={form.nomeProduto}
                onChange={(e) => set("nomeProduto", e.target.value)} required={modoEdicao} />

              <InputField label="Preço (R$)" type="number" step="0.01" min="0" value={form.preco}
                onChange={(e) => set("preco", e.target.value)} required />

              <div className="grid grid-cols-2 gap-4">
                <ComboBox label="Categoria" value={form.categoriaNome} opcoes={opcoes.categorias}
                  placeholder="Selecione..."
                  onChange={(op) => {
                    if (op && typeof op === "object") setForm((p) => ({ ...p, categoriaId: op.id, categoriaNome: op.nome }));
                    else setForm((p) => ({ ...p, categoriaId: null, categoriaNome: op || "" }));
                  }}
                />
                <ComboBox label="Fornecedor" value={form.fornecedorNome} opcoes={opcoes.fornecedores}
                  placeholder="Selecione..."
                  onChange={(op) => {
                    if (op && typeof op === "object") setForm((p) => ({ ...p, fornecedoresId: op.id, fornecedorNome: op.nome }));
                    else setForm((p) => ({ ...p, fornecedoresId: null, fornecedorNome: op || "" }));
                  }}
                />
              </div>
            </div>
          )}

          {/* ABA ESTOQUE */}
          {(activeTab === "estoque" || modoEdicao) && (
            <div className="space-y-4">
              {modoEdicao && <div className="border-t border-gray-300 pt-4">
                <p className="text-[10px] font-black text-gray-400 uppercase mb-3">Dados de Estoque</p>
              </div>}
              <div className="grid grid-cols-2 gap-4">
                <InputField label="Quantidade Atual" type="number" min="0" value={form.quantidade}
                  onChange={(e) => set("quantidade", e.target.value)} required />
                <InputField label="Mínimo" type="number" min="0" value={form.minimo}
                  onChange={(e) => set("minimo", e.target.value)} required={!modoEdicao} />
              </div>

              {form.minimo && form.quantidade && parseInt(form.minimo) > parseInt(form.quantidade) && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-2xl p-3">
                  <p className="text-xs text-yellow-700 font-medium flex items-center gap-1">
                    <AlertTriangle size={12} /> Mínimo maior que quantidade — CRÍTICO
                  </p>
                </div>
              )}
            </div>
          )}

          <div className="flex gap-4 pt-4">
            <button type="button"
              onClick={() => {
                if (!modoEdicao && activeTab === "estoque") setActiveTab("produto");
                else onClose();
              }}
              className="flex-1 font-black text-gray-500 uppercase text-[10px]">
              {!modoEdicao && activeTab === "estoque" ? "← Voltar" : "Cancelar"}
            </button>
            <button type="submit"
              disabled={salvando || (!modoEdicao && activeTab === "produto" && (!form.nomeProduto || !form.preco))}
              className="flex-1 p-4 bg-[#7B3F00] text-white font-black rounded-2xl uppercase text-xs disabled:opacity-50">
              {salvando ? "Salvando..." : modoEdicao ? "Salvar Alterações" : activeTab === "produto" ? "Próximo →" : "Finalizar"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EstoqueModal;
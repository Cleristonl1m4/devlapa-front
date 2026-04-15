import React, { useEffect, useState } from 'react';
import { apiRequest } from '../../services/auth';
import { Search, Plus, User, Hash, ShoppingBag } from 'lucide-react';

const Comandas = () => {
  const [comandas, setComandas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filtroMesa, setFiltroMesa] = useState('');

  const carregarComandas = async () => {
    try {
      setLoading(true);
      
      const data = await apiRequest('/api/comandas');
      setComandas(data || []);
    } catch (err) {
      console.error("Erro ao buscar comandas:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    carregarComandas();
  }, []);

  
  const comandasFiltradas = comandas.filter(c => 
    c.numeroMesa.toString().includes(filtroMesa)
  );

  return (
    <div className="p-8 animate-fadeIn">
      <header className="mb-8">
        <h2 className="text-3xl font-bold text-[#151D48]">Comandas</h2>
        <p className="text-[#737791]">Gerencie as comandas do seu bar</p>
      </header>

      
      <div className="relative mb-8">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[#4079ED]" size={20} />
        <input 
          type="text" 
          placeholder="Buscar Mesa"
          value={filtroMesa}
          onChange={(e) => setFiltroMesa(e.target.value)}
          className="w-full pl-12 pr-4 py-4 bg-[#F0F3F9] rounded-full border-none focus:ring-2 focus:ring-orange-500 outline-none text-[#737791]"
        />
      </div>

      <h3 className="text-xl font-bold text-[#151D48] mb-6">
        Comandas ({comandasFiltradas.length})
      </h3>

      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          <p className="text-gray-400">Carregando...</p>
        ) : (
          comandasFiltradas.map((comanda) => (
            <div key={comanda.id} className="bg-white p-8 rounded-[30px] shadow-sm border border-gray-50 hover:shadow-md transition-all">
              <div className="flex justify-between items-start mb-6">
                <h4 className="text-lg font-bold text-[#151D48]">Comanda #{comanda.id.toString().padStart(3, '0')}</h4>
                <span className={`text-sm font-medium ${comanda.status === 'ABERTA' ? 'text-[#4079ED]' : 'text-gray-400'}`}>
                  {comanda.status.charAt(0) + comanda.status.slice(1).toLowerCase()}
                </span>
              </div>

              <div className="space-y-4 mb-6">
                <div className="flex items-center gap-2 text-[#151D48]">
                  <User size={18} className="text-gray-400" />
                  <span className="font-semibold">Cliente:</span>
                  <span className="text-gray-600">{comanda.nomeCliente || `Mesa ${comanda.numeroMesa}`}</span>
                </div>
                
                <div className="flex items-center gap-2 text-[#151D48]">
                  <Hash size={18} className="text-gray-400" />
                  <span className="font-semibold">Mesa:</span>
                  <span className="text-gray-600">{comanda.numeroMesa}</span>
                </div>
              </div>

              <div className="pt-4 border-t border-gray-100 flex justify-center">
                <p className="text-lg font-bold text-[#151D48]">
                  Total: <span className="underline decoration-2 decoration-orange-400 underline-offset-4">
                    R$ {comanda.valorTotal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </span>
                </p>
              </div>
            </div>
          ))
        )}
      </div>

      
      <button className="fixed bottom-10 right-10 bg-[#E67E22] text-white p-4 rounded-full shadow-xl hover:scale-110 transition-transform">
        <Plus size={32} />
      </button>
    </div>
  );
};

export default Comandas;
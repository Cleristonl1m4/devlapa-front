import React, { useEffect, useState } from 'react';
import { apiRequest } from '../../services/auth';
import { 
  TrendingUp, ShoppingCart, Package, Users, 
  CreditCard, ArrowRightLeft, History, Wallet 
} from 'lucide-react';

const Home = () => {
  const [stats, setStats] = useState({
    vendas: "R$ 0,00",
    comandas: 0,
    estoque: 0,
    ticket: "R$ 0,00"
  });
  const [contasPagar, setContasPagar] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
  const loadDashboard = async () => {
    try {
      
      const fetchSafe = async (endpoint) => {
        try {
          return await apiRequest(endpoint);
        } catch (e) {
          console.error(`Erro no endpoint ${endpoint}:`, e);
          return null; 
        }
      };

      const [resVendas, resComandas, resEstoque, resFinanceiro, resListaContas] = await Promise.all([
        fetchSafe('/api/vendas/total-hoje'), 
        fetchSafe('/api/comandas/abertas/count'),
        fetchSafe('/api/estoque/baixo/count'),
        fetchSafe('/api/contas/resumo'),
        fetchSafe('/api/contas') 
      ]);

      
      setStats({
        vendas: resVendas?.total || "R$ 0,00",
        comandas: resComandas?.quantidade || 0,
        estoque: resEstoque?.total || 0,
        ticket: resVendas?.ticketMedio || "R$ 0,00"
      });
      
      if (resListaContas) {
        const contasPendentes = resListaContas.filter(c => c.status !== 'PAGA');
        setContasPagar(contasPendentes.slice(0, 3)); 
      }

    } catch (err) {
      console.error("Erro crítico ao sincronizar dashboard:", err);
    } finally {
      setLoading(false);
    }
  };

  loadDashboard();
}, []);

  const cards = [
    { label: "Total Sales", value: stats.vendas, sub: "0 vendas realizadas", color: "bg-[#FFE2E5]", iconColor: "text-[#FA5A7D]", icon: TrendingUp },
    { label: "Comandas Abertas", value: stats.comandas, sub: "R$160,00 em aberto", color: "bg-[#FFF4DE]", iconColor: "text-[#FF947A]", icon: ShoppingCart },
    { label: "Estoque baixo", value: stats.estoque, sub: "Produtos abaixo do mínimo", color: "bg-[#DCFCE7]", iconColor: "text-[#3CD856]", icon: Package },
    { label: "Ticket Médio", value: stats.ticket, sub: "Por vendas hoje", color: "bg-[#F3E8FF]", iconColor: "text-[#BF83FF]", icon: Users },
  ];

  return (
    <div className="p-4 animate-fadeIn space-y-8">
      <header>
        <h2 className="text-2xl font-bold text-[#151D48]">Dashboard</h2>
        <p className="text-[#737791] text-sm">Visão Geral</p>
      </header>

      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {cards.map((card, i) => (
          <div key={i} className={`${card.color} p-6 rounded-[24px] shadow-sm`}>
            <div className="bg-white p-2 w-fit rounded-lg mb-4 shadow-sm">
              <card.icon className={card.iconColor} size={20} />
            </div>
            <h3 className="text-xl font-bold text-[#151D48]">{card.value}</h3>
            <p className="text-[#425166] text-sm font-medium">{card.label}</p>
            <p className="text-[#4079ED] text-[10px] mt-1">{card.sub}</p>
          </div>
        ))}
      </div>

      
      <section className="bg-white p-8 rounded-[30px] shadow-sm border border-gray-50">
        <div className="flex items-center gap-3 mb-8">
          <Wallet className="text-[#E67E22]" size={24} />
          <h3 className="text-lg font-bold text-[#151D48]">Contas a Pagar ({contasPagar.length})</h3>
        </div>
        <div className="space-y-6">
          {contasPagar.map((conta, i) => (
            <div key={i} className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-4">
                <div className="p-2 bg-cyan-50 text-cyan-500 rounded-xl"><ArrowRightLeft size={18} /></div>
                <div>
                  <p className="font-bold text-[#151D48]">{conta.descricao}</p>
                  <p className="text-[#737791] text-xs">Venc.: {new Date(conta.dataVencimento).toLocaleDateString()}</p>
                </div>
              </div>
              <span className="text-[#737791]">Shopping</span>
              <span className="text-[#737791]">1234 ****</span>
              <span className="text-[#737791]">{conta.status}</span>
              <span className="font-bold text-[#FA5A7D]">R$ {conta.valor.toLocaleString('pt-BR')}</span>
            </div>
          ))}
        </div>
      </section>

      
      <section className="bg-white p-8 rounded-[30px] shadow-sm border border-gray-50">
        <div className="flex items-center gap-3 mb-8">
          <CreditCard className="text-[#E67E22]" size={24} />
          <h3 className="text-lg font-bold text-[#151D48]">Contas a Receber (1)</h3>
        </div>
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-4">
            <div className="p-2 bg-cyan-50 text-cyan-500 rounded-xl"><ArrowRightLeft size={18} /></div>
            <p className="font-bold text-[#151D48]">Disk Bebida</p>
          </div>
          <span className="text-[#737791]">Bar</span>
          <span className="text-[#737791]">Programado</span>
          <span className="font-bold text-[#3CD856]">R$ 1.500,00</span>
        </div>
      </section>

    </div>
  );
};

export default Home;
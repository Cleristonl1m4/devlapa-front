import React from 'react';
import { Settings, Bell, Palette, Database } from 'lucide-react';

const Configuracoes = () => {
  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <h3 className="text-2xl font-black text-[#151D48] mb-6">Configurações do Sistema</h3>
      
      <div className="grid grid-cols-1 gap-4">
        <ConfigItem icon={<Palette/>} title="Interface" desc="Mudar para modo escuro ou alterar cores do dashboard." />
        <ConfigItem icon={<Bell/>} title="Notificações" desc="Configurar alertas de estoque baixo e fechamento de caixa." />
        <ConfigItem icon={<Database/>} title="Backup de Dados" desc="Exportar dados de vendas e estoque (CSV/PDF)." />
      </div>
    </div>
  );
};

const ConfigItem = ({ icon, title, desc }) => (
  <div className="bg-white p-6 rounded-2xl border border-gray-100 flex items-center justify-between hover:shadow-md transition-all cursor-pointer">
    <div className="flex items-center gap-4">
      <div className="p-3 bg-gray-50 text-orange-600 rounded-xl">{icon}</div>
      <div>
        <h4 className="font-bold text-[#151D48]">{title}</h4>
        <p className="text-sm text-[#737791]">{desc}</p>
      </div>
    </div>
    <button className="text-sm font-bold text-[#E67E22]">Configurar</button>
  </div>
);

export default Configuracoes;
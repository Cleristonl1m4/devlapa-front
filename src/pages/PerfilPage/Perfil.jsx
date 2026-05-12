import React from 'react';
import { useAuth } from "../../contexts/authContext.jsx";
import { User, Shield, Mail, Key } from 'lucide-react';

const Perfil = () => {
  const { user } = useAuth();

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="bg-white p-8 rounded-[32px] shadow-sm border border-gray-100">
        <div className="flex items-center gap-6 mb-8">
          <div className="w-24 h-24 bg-orange-100 rounded-3xl flex items-center justify-center text-[#E67E22]">
            <User size={48} />
          </div>
          <div>
            <h2 className="text-3xl font-black text-[#151D48]">{user?.nome}</h2>
            <p className="text-[#737791] font-bold uppercase tracking-widest">{user?.perfil}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-6 bg-gray-50 rounded-2xl">
            <div className="flex items-center gap-2 text-orange-600 mb-2">
              <Shield size={18} /> <span className="font-bold text-xs uppercase">Nível de Acesso</span>
            </div>
            <p className="text-[#151D48] font-bold">{user?.perfil === 'ADMIN' ? 'Acesso Total ao Sistema' : 'Acesso Operacional'}</p>
          </div>
          <div className="p-6 bg-gray-50 rounded-2xl">
            <div className="flex items-center gap-2 text-orange-600 mb-2">
              <Key size={18} /> <span className="font-bold text-xs uppercase">Segurança</span>
            </div>
            <button className="text-[#E67E22] font-bold hover:underline">Alterar Senha de Acesso</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Perfil;
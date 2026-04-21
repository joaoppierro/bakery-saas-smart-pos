import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { TenantProvider } from './contexts/TenantContext';
import SaaSLayout from './layouts/SaaSLayout';


// Módulo Autenticação
import Login from './modules/auth/Login';

// Módulo 1: Gestão de Estoque
import EstoqueDashboard from './modules/inventory/Dashboard';
import Catalogo from './modules/inventory/Catalogo';
import PDV from './modules/inventory/PDV';
import Ajustes from './modules/inventory/Ajustes';
import Historico from './modules/inventory/Historico';

// Módulo 2: Engenharia de Precificação
import FichasTecnicas from './modules/inventory/FichasTecnicas';
import Configuracoes from './modules/inventory/Configuracoes';
import MixVendas from './modules/inventory/MixVendas';

// Módulo 3: Previsão e Demanda
import DashboardDemanda from './modules/inventory/DashboardDemanda';
import RegistroRupturas from './modules/inventory/RegistroRupturas';
import DiarioContexto from './modules/inventory/DiarioContexto';
import PlanejadorProducao from './modules/inventory/PlanejadorProducao';

export default function App() {
  return (
    <AuthProvider>
      <TenantProvider>
        <Router>
          <Routes>
            <Route path="/login" element={<Login />} />

            <Route path="/" element={<SaaSLayout />}>
              
              <Route index element={<Navigate to="/estoque/dashboard" replace />} />

              <Route path="estoque">
                <Route path="dashboard" element={<EstoqueDashboard />} />
                <Route path="catalogo" element={<Catalogo />} />
                <Route path="pdv" element={<PDV />} />
                <Route path="ajustes" element={<Ajustes />} />
                <Route path="historico" element={<Historico />} />
              </Route>

              <Route path="precificacao">
                <Route path="fichas-tecnicas" element={<FichasTecnicas />} />
                <Route path="mix" element={<MixVendas />} />
                <Route path="configuracoes" element={<Configuracoes />} />
              </Route>

              <Route path="demanda">
                <Route path="dashboard" element={<DashboardDemanda />} />
                <Route path="feedback" element={<RegistroRupturas />} />
                <Route path="contexto" element={<DiarioContexto />} />
                <Route path="planejador" element={<PlanejadorProducao />} />
              </Route>

            </Route>

            {/* TRATAMENTO DE ERRO: Rota não encontrada */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Router>
      </TenantProvider>
    </AuthProvider>
  );
}
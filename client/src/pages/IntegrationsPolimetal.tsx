import React, { useState } from 'react';
import { 
  Server, 
  Cpu, 
  CheckCircle2, 
  AlertCircle, 
  Save, 
  RefreshCw, 
  Globe, 
  ShieldCheck, 
  Activity,
  Radio
} from 'lucide-react';

interface AnalyzerConfig {
  id: string;
  name: string;
  location: string;
  ipAddress: string;
  port: number;
  slaveId: number;
  status: 'connected' | 'disconnected' | 'testing';
  lastPing?: string;
}

export default function IntegrationsPolimetal() {
  const [analyzers, setAnalyzers] = useState<AnalyzerConfig[]>([
    {
      id: 'POLI-ANALYZER-01',
      name: 'Analizador Prensa 1500T',
      location: 'Planta Polimetal - Linea 1',
      ipAddress: '192.168.1.101',
      port: 502,
      slaveId: 1,
      status: 'connected',
      lastPing: 'Hace 2 min'
    },
    {
      id: 'POLI-ANALYZER-02',
      name: 'Analizador Horno T6',
      location: 'Planta Polimetal - Fundición',
      ipAddress: '192.168.1.102',
      port: 502,
      slaveId: 1,
      status: 'connected',
      lastPing: 'Hace 1 min'
    },
    {
      id: 'POLI-ANALYZER-03',
      name: 'Analizador Maquinado CNC',
      location: 'Planta Polimetal - Linea 3',
      ipAddress: '192.168.1.103',
      port: 502,
      slaveId: 2,
      status: 'disconnected',
      lastPing: 'Sin conexión'
    }
  ]);

  const [saving, setSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleIpChange = (id: string, field: keyof AnalyzerConfig, value: any) => {
    setAnalyzers(prev =>
      prev.map(item => (item.id === id ? { ...item, [field]: value } : item))
    );
  };

  const handleTestConnection = (id: string) => {
    setAnalyzers(prev =>
      prev.map(item => (item.id === id ? { ...item, status: 'testing' } : item))
    );

    setTimeout(() => {
      setAnalyzers(prev =>
        prev.map(item =>
          item.id === id
            ? { ...item, status: 'connected', lastPing: 'Justo ahora' }
            : item
        )
      );
    }, 1200);
  };

  const handleSaveAll = () => {
    setSaving(true);
    setTimeout(() => {
      setSaving(false);
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 3000);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-6 md:p-10 font-sans">
      {/* Header */}
      <div className="max-w-6xl mx-auto mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <div className="flex items-center gap-2 text-cyan-400 text-sm font-semibold tracking-wider uppercase mb-1">
            <Globe className="w-4 h-4" /> Configuración de Campo
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-white">
            Integración Analizadores - Polimetal
          </h1>
          <p className="text-slate-400 text-sm mt-1">
            Gestión de direcciones IP, puertos y conexiones Modbus/TCP para telemetría en tiempo real.
          </p>
        </div>

        <button
          onClick={handleSaveAll}
          disabled={saving}
          className="flex items-center justify-center gap-2 bg-cyan-600 hover:bg-cyan-500 text-white font-medium px-5 py-2.5 rounded-lg shadow-lg shadow-cyan-900/20 transition-all cursor-pointer disabled:opacity-50"
        >
          {saving ? (
            <RefreshCw className="w-4 h-4 animate-spin" />
          ) : (
            <Save className="w-4 h-4" />
          )}
          {saving ? 'Guardando...' : 'Guardar Cambios'}
        </button>
      </div>

      {savedSuccess && (
        <div className="max-w-6xl mx-auto mb-6 p-4 bg-emerald-950/80 border border-emerald-500/50 rounded-lg text-emerald-300 flex items-center gap-3">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          <span>¡Parámetros de red guardados y aplicados correctamente a la pasarela Nexergy!</span>
        </div>
      )}

      {/* Main Grid */}
      <div className="max-w-6xl mx-auto space-y-6">
        {analyzers.map(analyzer => (
          <div
            key={analyzer.id}
            className="bg-slate-900/80 border border-slate-800 rounded-xl p-6 shadow-xl backdrop-blur-sm hover:border-slate-700 transition-all"
          >
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 pb-4 border-b border-slate-800/60">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-slate-800 rounded-lg text-cyan-400">
                  <Cpu className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white">{analyzer.name}</h3>
                  <p className="text-xs text-slate-400 flex items-center gap-2 mt-0.5">
                    <span className="font-mono bg-slate-800 px-1.5 py-0.5 rounded text-slate-300">{analyzer.id}</span>
                    <span>•</span>
                    <span>{analyzer.location}</span>
                  </p>
                </div>
              </div>

              {/* Status Badge */}
              <div className="flex items-center gap-3">
                <div className="text-right">
                  <span className="text-xs text-slate-500 block">Última lectura</span>
                  <span className="text-xs text-slate-300 font-medium">{analyzer.lastPing}</span>
                </div>
                {analyzer.status === 'connected' && (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                    <Activity className="w-3.5 h-3.5 animate-pulse" /> Conectado
                  </span>
                )}
                {analyzer.status === 'disconnected' && (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-rose-500/10 text-rose-400 border border-rose-500/20">
                    <AlertCircle className="w-3.5 h-3.5" /> Desconectado
                  </span>
                )}
                {analyzer.status === 'testing' && (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-amber-500/10 text-amber-400 border border-amber-500/20">
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" /> Verificando...
                  </span>
                )}
              </div>
            </div>

            {/* Form Fields */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1.5">
                  Dirección IP (Red Local)
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={analyzer.ipAddress}
                    onChange={e => handleIpChange(analyzer.id, 'ipAddress', e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-100 font-mono focus:outline-none focus:border-cyan-500 transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1.5">
                  Puerto Modbus/TCP
                </label>
                <input
                  type="number"
                  value={analyzer.port}
                  onChange={e => handleIpChange(analyzer.id, 'port', parseInt(e.target.value) || 0)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-100 font-mono focus:outline-none focus:border-cyan-500 transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1.5">
                  Slave ID / Esclavo
                </label>
                <input
                  type="number"
                  value={analyzer.slaveId}
                  onChange={e => handleIpChange(analyzer.id, 'slaveId', parseInt(e.target.value) || 0)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-100 font-mono focus:outline-none focus:border-cyan-500 transition-colors"
                />
              </div>

              <div className="flex items-end">
                <button
                  onClick={() => handleTestConnection(analyzer.id)}
                  disabled={analyzer.status === 'testing'}
                  className="w-full flex items-center justify-center gap-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-sm font-medium py-2 px-4 rounded-lg border border-slate-700 transition-colors cursor-pointer"
                >
                  <Radio className="w-4 h-4 text-cyan-400" /> Probar Ping
                </button>
              </div>
            </div>
          </div>
        ))}

        {/* Security Info Card */}
        <div className="bg-slate-900/40 border border-slate-800/80 rounded-xl p-5 flex items-start gap-4 text-xs text-slate-400">
          <ShieldCheck className="w-5 h-5 text-cyan-400 shrink-0 mt-0.5" />
          <div>
            <h4 className="text-slate-200 font-semibold mb-0.5">Seguridad y Red Industrial</h4>
            <p>
              Asegúrate de que las direcciones IP pertenezcan a la VLAN asignada para instrumentación. 
              El orquestador Nexergy se conectará mediante sockets TCP seguros a través del puerto configurado.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
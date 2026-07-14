import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { Network, GitBranch, Search, X } from 'lucide-react';
import { FRAUD_NODES } from '../mockData';
import type { FraudNode } from '../types';
import Tooltip from '../components/Tooltip';

const NODE_COLORS: Record<string, string> = {
  phone: '#3b82f6',
  upi: '#f59e0b',
  wallet: '#8b5cf6',
  person: '#f43f5e',
  complaint: '#10b981',
};

interface PositionedNode extends FraudNode {
  vx: number;
  vy: number;
}

export default function FraudNetwork() {
  const svgRef = useRef<SVGSVGElement>(null);
  const [nodes, setNodes] = useState<PositionedNode[]>([]);
  const [selectedNode, setSelectedNode] = useState<FraudNode | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSimulating, setIsSimulating] = useState(true);
  const animRef = useRef<number>(0);

  useEffect(() => {
    const positioned: PositionedNode[] = FRAUD_NODES.map(n => ({ ...n, vx: 0, vy: 0 }));
    setNodes(positioned);
  }, []);

  const simulate = useCallback(() => {
    setNodes(prev => {
      const updated = prev.map(n => ({ ...n }));
      for (let i = 0; i < updated.length; i++) {
        for (let j = i + 1; j < updated.length; j++) {
          const dx = updated[i].x - updated[j].x;
          const dy = updated[i].y - updated[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy) || 1;
          const force = 2000 / (dist * dist);
          const fx = (dx / dist) * force;
          const fy = (dy / dist) * force;
          updated[i].vx += fx;
          updated[i].vy += fy;
          updated[j].vx -= fx;
          updated[j].vy -= fy;
        }
      }
      for (const node of updated) {
        for (const connId of node.connections) {
          const target = updated.find(n => n.id === connId);
          if (!target) continue;
          const dx = target.x - node.x;
          const dy = target.y - node.y;
          const dist = Math.sqrt(dx * dx + dy * dy) || 1;
          const force = (dist - 150) * 0.005;
          node.vx += (dx / dist) * force;
          node.vy += (dy / dist) * force;
        }
      }
      for (const node of updated) {
        node.vx += (400 - node.x) * 0.001;
        node.vy += (300 - node.y) * 0.001;
        node.vx *= 0.9;
        node.vy *= 0.9;
        node.x += node.vx;
        node.y += node.vy;
        node.x = Math.max(50, Math.min(750, node.x));
        node.y = Math.max(50, Math.min(550, node.y));
      }
      return updated;
    });
  }, []);

  useEffect(() => {
    let frame = 0;
    const tick = () => {
      frame++;
      if (frame < 200) {
        simulate();
        animRef.current = requestAnimationFrame(tick);
      } else {
        setIsSimulating(false);
      }
    };
    animRef.current = requestAnimationFrame(tick);
    return () => { if (animRef.current) cancelAnimationFrame(animRef.current); };
  }, [simulate]);

  const isConnected = (nodeId: string) => {
    if (!selectedNode) return false;
    return selectedNode.connections.includes(nodeId) || selectedNode.id === nodeId ||
      nodes.find(n => n.id === nodeId)?.connections.includes(selectedNode.id) || false;
  };

  const filteredNodes = useMemo(() => {
    if (!searchQuery.trim()) return [];
    const q = searchQuery.toLowerCase();
    return nodes.filter(n => n.label.toLowerCase().includes(q) || n.type.toLowerCase().includes(q));
  }, [nodes, searchQuery]);

  const handleNodeClick = (node: FraudNode) => {
    setSelectedNode(prev => prev?.id === node.id ? null : node);
    setSearchQuery('');
  };

  return (
    <div className="h-full flex flex-col">
      <div className="flex items-start sm:items-center justify-between gap-3 mb-4 sm:mb-5 animate-fade-slide-up">
        <div className="min-w-0">
          <h2 className="text-base sm:text-lg lg:text-xl font-semibold text-zinc-100 flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: 'rgba(139,92,246,0.1)' }}>
              <Network size={16} className="text-violet-400" strokeWidth={1.5} />
            </div>
            <span className="truncate">Fraud Network Graph</span>
          </h2>
          <p className="text-zinc-500 text-[10px] sm:text-xs mt-1 hidden sm:block">Force-directed graph of connected fraudulent entities</p>
        </div>
        <div className="flex-shrink-0 hidden sm:block">
          <Tooltip text="Network Analysis — Pattern Detection" />
        </div>
      </div>

      {/* Search bar */}
      <div className="relative mb-4 sm:mb-5 animate-fade-slide-up stagger-1" style={{ animationFillMode: 'both' }}>
        <div className="relative">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" strokeWidth={1.5} />
          <input type="text" value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search nodes by name or type (phone, upi, wallet, person)..."
            className="w-full pl-9 pr-8 py-2.5 rounded-xl glass-subtle text-zinc-200 text-xs sm:text-sm placeholder-zinc-600 focus:outline-none transition-all duration-300 input-premium"
            aria-label="Search network nodes" />
          {searchQuery && (
            <button onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-200 cursor-pointer"
              aria-label="Clear search">
              <X size={14} />
            </button>
          )}
        </div>
        {searchQuery && filteredNodes.length > 0 && (
          <div className="absolute z-[200] w-full mt-2 glass-panel-strong rounded-xl shadow-2xl shadow-black/40 overflow-hidden max-h-[200px] overflow-y-auto">
            {filteredNodes.map(node => (
              <button key={node.id} onClick={() => handleNodeClick(node)}
                className="w-full px-4 py-2.5 text-left hover:bg-white/[0.04] transition-colors cursor-pointer border-b border-white/[0.04] last:border-b-0 flex items-center gap-2.5 touch-target btn-ripple relative overflow-hidden">
                <div className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: NODE_COLORS[node.type] }} />
                <div className="flex-1 min-w-0">
                  <span className="text-xs sm:text-sm text-zinc-200 font-medium truncate block">{node.label}</span>
                  <span className="text-[10px] text-zinc-500 capitalize">{node.type}{node.complaints ? ` — ${node.complaints} complaints` : ''}</span>
                </div>
              </button>
            ))}
          </div>
        )}
        {searchQuery && filteredNodes.length === 0 && (
          <div className="absolute z-[200] w-full mt-2 glass-panel-strong rounded-xl shadow-2xl shadow-black/40 px-4 py-3 text-center">
            <span className="text-xs text-zinc-500">No nodes found for "{searchQuery}"</span>
          </div>
        )}
      </div>

      <div className="flex-1 flex flex-col lg:flex-row gap-4 sm:gap-5 lg:gap-6 min-h-0 animate-fade-slide-up stagger-2" style={{ animationFillMode: 'both' }}>
        <div className="flex-1 glass-panel card-hover rounded-xl sm:rounded-2xl overflow-hidden relative min-h-[250px] sm:min-h-[300px] lg:min-h-0">
          {/* Loading indicator */}
          {isSimulating && (
            <div className="absolute top-2 sm:top-3 right-2 sm:right-3 z-10 flex items-center gap-1.5 px-2.5 py-1 rounded-full glass-subtle">
              <span className="w-1.5 h-1.5 rounded-full bg-violet-400 animate-pulse" />
              <span className="text-[9px] sm:text-[10px] text-zinc-400 font-mono">SIMULATING</span>
            </div>
          )}

          <svg ref={svgRef} viewBox="0 0 800 600" className="w-full h-full" preserveAspectRatio="xMidYMid meet">
            {nodes.map(node =>
              node.connections.map(connId => {
                const target = nodes.find(n => n.id === connId);
                if (!target) return null;
                const isActive = selectedNode && (selectedNode.id === node.id || selectedNode.id === connId);
                return (
                  <line
                    key={`${node.id}-${connId}`}
                    x1={node.x} y1={node.y} x2={target.x} y2={target.y}
                    stroke={isActive ? '#3b82f6' : 'rgba(255,255,255,0.06)'}
                    strokeWidth={isActive ? 1.5 : 0.5}
                    opacity={selectedNode ? (isActive ? 0.8 : 0.15) : 0.4}
                  />
                );
              })
            )}
            {nodes.map(node => {
              const color = NODE_COLORS[node.type];
              const isSelected = selectedNode?.id === node.id;
              const isSelectedConn = isConnected(node.id);
              const r = node.complaints ? Math.min(12 + node.complaints * 0.3, 24) : 16;
              return (
                <g key={node.id} transform={`translate(${node.x}, ${node.y})`} onClick={() => handleNodeClick(node)} style={{ cursor: 'pointer' }}>
                  {/* Invisible hit area for better touch targets */}
                  <circle r={Math.max(r + 10, 24)} fill="transparent" />
                  {isSelected && <circle r={r + 8} fill="none" stroke={color} strokeWidth="1" opacity="0.15" className="animate-pulse-glow" />}
                  <circle r={r} fill={`${color}15`} stroke={isSelected ? color : isSelectedConn ? color : `${color}30`}
                    strokeWidth={isSelected ? 2 : 1} opacity={selectedNode ? (isSelected || isSelectedConn ? 1 : 0.25) : 1} />
                  <text textAnchor="middle" dy={r + 14} fill={isSelected || isSelectedConn ? '#e4e4e7' : '#52525b'} fontSize="10" fontFamily="JetBrains Mono"
                    opacity={selectedNode ? (isSelected || isSelectedConn ? 1 : 0.25) : 1}>{node.label}</text>
                  {node.complaints && node.complaints > 20 && (
                    <g transform={`translate(${r * 0.7}, ${-r * 0.7})`}>
                      <circle r="8" fill="#f43f5e" />
                      <text textAnchor="middle" dy="3" fill="white" fontSize="8" fontFamily="JetBrains Mono" fontWeight="bold">{node.complaints}</text>
                    </g>
                  )}
                </g>
              );
            })}
          </svg>
          <div className="absolute bottom-2 sm:bottom-3 left-2 sm:left-3 flex flex-wrap gap-1 sm:gap-1.5 max-w-[70%]">
            {Object.entries(NODE_COLORS).map(([type, color]) => (
              <div key={type} className="flex items-center gap-1 sm:gap-1.5 px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-full glass-subtle">
                <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full" style={{ backgroundColor: color }} />
                <span className="text-[8px] sm:text-[10px] text-zinc-500 capitalize font-mono">{type}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="w-full lg:w-72 flex flex-col gap-4 sm:gap-5 lg:gap-6 flex-shrink-0">
          <div className="glass-panel card-hover rounded-xl sm:rounded-2xl p-4 sm:p-5">
            <h3 className="font-mono text-[10px] sm:text-[11px] text-zinc-500 uppercase tracking-wider mb-2.5 sm:mb-3">Node Details</h3>
            {selectedNode ? (
              <div className="space-y-2.5 sm:space-y-3 animate-fade-slide-up">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2 min-w-0">
                    <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full flex-shrink-0" style={{ backgroundColor: NODE_COLORS[selectedNode.type] }} />
                    <span className="font-mono text-xs sm:text-sm font-medium text-zinc-200 truncate">{selectedNode.label}</span>
                  </div>
                  <button onClick={() => setSelectedNode(null)} className="text-zinc-500 hover:text-zinc-200 cursor-pointer touch-target p-1 flex-shrink-0" aria-label="Close details">
                    <X size={14} />
                  </button>
                </div>
                <div className="space-y-1.5 sm:space-y-2">
                  <div className="flex justify-between text-[10px] sm:text-xs gap-2">
                    <span className="text-zinc-500">Type</span>
                    <span className="text-zinc-200 capitalize">{selectedNode.type}</span>
                  </div>
                  {selectedNode.complaints !== undefined && (
                    <div className="flex justify-between text-[10px] sm:text-xs gap-2">
                      <span className="text-zinc-500">Linked Complaints</span>
                      <span className="font-mono text-rose-400 font-semibold">{selectedNode.complaints}</span>
                    </div>
                  )}
                  {selectedNode.amount && (
                    <div className="flex justify-between text-[10px] sm:text-xs gap-2">
                      <span className="text-zinc-500">Total Amount</span>
                      <span className="font-mono text-amber-400 font-semibold">{selectedNode.amount}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-[10px] sm:text-xs gap-2">
                    <span className="text-zinc-500">Connected Nodes</span>
                    <span className="font-mono text-blue-400">{selectedNode.connections.length}</span>
                  </div>
                </div>
                <div className="pt-2" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
                  <span className="text-[10px] sm:text-[11px] text-zinc-500">Linked entities:</span>
                  <div className="mt-1 space-y-1">
                    {selectedNode.connections.map(connId => {
                      const conn = nodes.find(n => n.id === connId);
                      if (!conn) return null;
                      return (
                        <button key={connId} onClick={() => setSelectedNode(conn)}
                          className="flex items-center gap-1.5 text-[10px] sm:text-[11px] text-blue-400 hover:text-zinc-200 transition-colors cursor-pointer touch-target btn-ripple relative overflow-hidden"
                          aria-label={`Navigate to ${conn.label}`}>
                          <div className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ backgroundColor: NODE_COLORS[conn.type] }} />
                          <span className="truncate">{conn.label}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-4 text-center">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-3" style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.04)' }}>
                  <Network size={16} className="text-zinc-600" strokeWidth={1} />
                </div>
                <p className="text-xs sm:text-sm text-zinc-500 mb-1">Click a node to view details</p>
                <p className="text-[10px] text-zinc-600">or search above to find specific entities</p>
              </div>
            )}
          </div>

          <div className="glass-panel card-hover rounded-xl sm:rounded-2xl p-4 sm:p-5">
            <h3 className="font-mono text-[10px] sm:text-[11px] text-zinc-500 uppercase tracking-wider mb-2.5 sm:mb-3">Network Stats</h3>
            <div className="space-y-2.5 sm:space-y-3">
              {[
                { label: 'Nodes Detected', value: String(nodes.length), color: '#8b5cf6' },
                { label: 'Connections', value: String(Math.round(nodes.reduce((a, n) => a + n.connections.length, 0) / 2)), color: '#3b82f6' },
                { label: 'Total Complaints', value: String(nodes.reduce((a, n) => a + (n.complaints || 0), 0)), color: '#f43f5e' },
                { label: 'Lead Time (avg)', value: '14.2 days', color: '#10b981' },
              ].map((stat, i) => (
                <div key={i} className="flex items-center justify-between gap-2">
                  <span className="text-[10px] sm:text-xs text-zinc-500 truncate">{stat.label}</span>
                  <span className="font-mono text-xs sm:text-sm font-semibold flex-shrink-0" style={{ color: stat.color }}>{stat.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

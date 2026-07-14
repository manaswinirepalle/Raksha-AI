import { useState, useEffect, useRef, useCallback } from 'react';
import { Network } from 'lucide-react';
import { FRAUD_NODES } from '../mockData';
import type { FraudNode } from '../types';
import Tooltip from '../components/Tooltip';

const NODE_COLORS: Record<string, string> = {
  phone: '#22D3EE',
  upi: '#FBBF24',
  wallet: '#A78BFA',
  person: '#FF3B4E',
  complaint: '#34D399',
};

interface PositionedNode extends FraudNode {
  vx: number;
  vy: number;
}

export default function FraudNetwork() {
  const svgRef = useRef<SVGSVGElement>(null);
  const [nodes, setNodes] = useState<PositionedNode[]>([]);
  const [selectedNode, setSelectedNode] = useState<FraudNode | null>(null);
  const animRef = useRef<number>(0);

  useEffect(() => {
    const positioned: PositionedNode[] = FRAUD_NODES.map(n => ({
      ...n,
      vx: 0,
      vy: 0,
    }));
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

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between mb-5 animate-fade-slide-up">
        <div>
          <h2 className="text-xl font-bold text-[#E5E7EB] flex items-center gap-2.5">
            <Network size={22} className="text-[#A78BFA]" />
            Fraud Network Graph
          </h2>
          <p className="text-[#6B7280] text-xs mt-0.5">Force-directed graph of connected fraudulent entities</p>
        </div>
        <Tooltip text="Network Analysis — Pattern Detection" />
      </div>

      <div className="flex-1 flex gap-6 min-h-0 animate-fade-slide-up stagger-1" style={{ animationFillMode: 'both' }}>
        {/* Graph */}
        <div className="flex-1 bg-[#131B2E] rounded-2xl border border-[#1F2937] overflow-hidden relative">
          <svg ref={svgRef} viewBox="0 0 800 600" className="w-full h-full">
            {nodes.map(node =>
              node.connections.map(connId => {
                const target = nodes.find(n => n.id === connId);
                if (!target) return null;
                const isActive = selectedNode && (selectedNode.id === node.id || selectedNode.id === connId);
                return (
                  <line
                    key={`${node.id}-${connId}`}
                    x1={node.x}
                    y1={node.y}
                    x2={target.x}
                    y2={target.y}
                    stroke={isActive ? '#22D3EE' : '#1F2937'}
                    strokeWidth={isActive ? 2 : 1}
                    opacity={selectedNode ? (isActive ? 0.8 : 0.2) : 0.4}
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
                <g
                  key={node.id}
                  transform={`translate(${node.x}, ${node.y})`}
                  onClick={() => setSelectedNode(isSelected ? null : node)}
                  style={{ cursor: 'pointer' }}
                >
                  {isSelected && (
                    <circle r={r + 8} fill="none" stroke={color} strokeWidth="2" opacity="0.3" className="animate-pulse-glow" />
                  )}
                  <circle
                    r={r}
                    fill={`${color}20`}
                    stroke={isSelected ? color : isSelectedConn ? color : `${color}40`}
                    strokeWidth={isSelected ? 2.5 : 1.5}
                    opacity={selectedNode ? (isSelected || isSelectedConn ? 1 : 0.3) : 1}
                  />
                  <text
                    textAnchor="middle"
                    dy={r + 14}
                    fill={isSelected || isSelectedConn ? '#E5E7EB' : '#6B7280'}
                    fontSize="10"
                    fontFamily="JetBrains Mono"
                    opacity={selectedNode ? (isSelected || isSelectedConn ? 1 : 0.3) : 1}
                  >
                    {node.label}
                  </text>
                  {node.complaints && node.complaints > 20 && (
                    <g transform={`translate(${r * 0.7}, ${-r * 0.7})`}>
                      <circle r="8" fill="#FF3B4E" />
                      <text textAnchor="middle" dy="3" fill="white" fontSize="8" fontFamily="JetBrains Mono" fontWeight="bold">
                        {node.complaints}
                      </text>
                    </g>
                  )}
                </g>
              );
            })}
          </svg>

          <div className="absolute bottom-3 left-3 flex flex-wrap gap-2">
            {Object.entries(NODE_COLORS).map(([type, color]) => (
              <div key={type} className="flex items-center gap-1.5 px-2 py-1 rounded bg-[#0B1220]/80 border border-[#1F2937]">
                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: color }} />
                <span className="text-[10px] text-[#6B7280] capitalize font-mono">{type}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Side panel */}
        <div className="w-72 flex flex-col gap-6">
          <div className="bg-[#131B2E] rounded-2xl border border-[#1F2937] p-5">
            <h3 className="font-mono text-[11px] text-[#6B7280] uppercase tracking-wider mb-3">Node Details</h3>
            {selectedNode ? (
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: NODE_COLORS[selectedNode.type] }} />
                  <span className="font-mono text-sm font-semibold text-[#E5E7EB]">{selectedNode.label}</span>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-xs">
                    <span className="text-[#6B7280]">Type</span>
                    <span className="text-[#E5E7EB] capitalize">{selectedNode.type}</span>
                  </div>
                  {selectedNode.complaints !== undefined && (
                    <div className="flex justify-between text-xs">
                      <span className="text-[#6B7280]">Linked Complaints</span>
                      <span className="font-mono text-[#FF3B4E] font-bold">{selectedNode.complaints}</span>
                    </div>
                  )}
                  {selectedNode.amount && (
                    <div className="flex justify-between text-xs">
                      <span className="text-[#6B7280]">Total Amount</span>
                      <span className="font-mono text-[#FBBF24] font-bold">{selectedNode.amount}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-xs">
                    <span className="text-[#6B7280]">Connected Nodes</span>
                    <span className="font-mono text-[#22D3EE]">{selectedNode.connections.length}</span>
                  </div>
                </div>
                <div className="pt-2 border-t border-[#1F2937]">
                  <span className="text-[11px] text-[#6B7280]">Linked entities:</span>
                  <div className="mt-1 space-y-1">
                    {selectedNode.connections.map(connId => {
                      const conn = nodes.find(n => n.id === connId);
                      if (!conn) return null;
                      return (
                        <button
                          key={connId}
                          onClick={() => setSelectedNode(conn)}
                          className="flex items-center gap-1.5 text-[11px] text-[#22D3EE] hover:text-[#E5E7EB] transition-colors cursor-pointer"
                        >
                          <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: NODE_COLORS[conn.type] }} />
                          {conn.label}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            ) : (
              <p className="text-sm text-[#6B7280]">Click a node to view details</p>
            )}
          </div>

          <div className="bg-[#131B2E] rounded-2xl border border-[#1F2937] p-5">
            <h3 className="font-mono text-[11px] text-[#6B7280] uppercase tracking-wider mb-3">Network Stats</h3>
            <div className="space-y-3">
              {[
                { label: 'Nodes Detected', value: String(nodes.length), color: '#A78BFA' },
                { label: 'Connections', value: String(nodes.reduce((a, n) => a + n.connections.length, 0) / 2), color: '#22D3EE' },
                { label: 'Total Complaints', value: String(nodes.reduce((a, n) => a + (n.complaints || 0), 0)), color: '#FF3B4E' },
                { label: 'Lead Time (avg)', value: '14.2 days', color: '#34D399' },
              ].map((stat, i) => (
                <div key={i} className="flex items-center justify-between">
                  <span className="text-xs text-[#6B7280]">{stat.label}</span>
                  <span className="font-mono text-sm font-bold" style={{ color: stat.color }}>{stat.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

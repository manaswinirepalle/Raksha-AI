import { useState, useEffect, useRef } from 'react';

interface Alert {
  id: string;
  type: 'critical' | 'high' | 'medium' | 'info';
  title: string;
  detail: string;
  region: string;
  timeAgo: string;
  color: string;
}

const ALERTS: Alert[] = [
  { id: 'a1', type: 'critical', title: 'Digital Arrest Scam Surge', detail: '342 incidents reported in Delhi NCR this week — CBI impersonation variant targeting senior citizens', region: 'Delhi NCR', timeAgo: '2m ago', color: '#f43f5e' },
  { id: 'a2', type: 'high', title: 'UPI Fraud Ring Exposed', detail: 'Coordinated mule account network detected across 12 banks — ₹8.7L stolen in 48 hours', region: 'Mumbai', timeAgo: '14m ago', color: '#f97316' },
  { id: 'a3', type: 'medium', title: 'QR Code Phishing Campaign', detail: 'Fake merchant QR codes spotted at petrol pumps in Bengaluru — skimming UPI credentials', region: 'Bengaluru', timeAgo: '38m ago', color: '#eab308' },
  { id: 'a4', type: 'critical', title: 'WhatsApp Lottery Scam Wave', detail: 'New variant using deepfake video messages — "You have won ₹25 lakh" with fake PM endorsement', region: 'Pan India', timeAgo: '1h ago', color: '#f43f5e' },
  { id: 'a5', type: 'info', title: 'RBI Alert: Fake Loan Apps', detail: '14 new predatory loan apps identified — charging 400% interest, threatening users with morphed photos', region: 'Pan India', timeAgo: '2h ago', color: '#3b82f6' },
  { id: 'a6', type: 'high', title: 'KYC Expiry Scam Spike', detail: 'Fraudsters calling as bank reps demanding "KYC re-verification" — collecting Aadhaar and OTP', region: 'Chennai', timeAgo: '3h ago', color: '#f97316' },
  { id: 'a7', type: 'medium', title: 'Fake Investment Groups', detail: 'Telegram "stock tips" groups promising 500% returns — 23 complaints this week', region: 'Hyderabad', timeAgo: '4h ago', color: '#eab308' },
];

export function useScamAlerts(): Alert[] {
  const [alerts, setAlerts] = useState<Alert[]>(ALERTS.slice(0, 4));
  const nextIdx = useRef(4);

  useEffect(() => {
    const interval = setInterval(() => {
      setAlerts(prev => {
        const newAlert = ALERTS[nextIdx.current % ALERTS.length];
        nextIdx.current++;
        return [{ ...newAlert, id: `${newAlert.id}-${Date.now()}` }, ...prev].slice(0, 6);
      });
    }, 8000 + Math.random() * 4000);
    return () => clearInterval(interval);
  }, []);

  return alerts;
}

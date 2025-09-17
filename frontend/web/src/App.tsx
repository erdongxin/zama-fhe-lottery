// App.tsx
import { getProvider, getContractReadOnly, getContractWithSigner, normAddr } from "./contract";
import React, { useEffect, useState } from "react";

export default function App() {
  const [account, setAccount] = useState<string>("");
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [loading, setLoading] = useState(true);
  const [rounds, setRounds] = useState<LotteryRound[]>([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newRoundName, setNewRoundName] = useState("");
  const [newRoundMinutes, setNewRoundMinutes] = useState<number>(1);
  const [creating, setCreating] = useState(false);

  const [showDrawModal, setShowDrawModal] = useState(false);
  const [drawRoundId, setDrawRoundId] = useState<number | null>(null);
  const [drawNumber, setDrawNumber] = useState<number>(0);

  const [showWinnersModal, setShowWinnersModal] = useState(false);
  const [currentWinners, setCurrentWinners] = useState<string[]>([]);
  const [currentRoundName, setCurrentRoundName] = useState("");

  const [stats, setStats] = useState({
    activeRounds: 0,
    finishedRounds: 0,
    totalAmount: 0,
    totalPlayers: 0,
    totalWinners: 0,
  });

  interface LotteryRound {
    id: number;
    name: string;
    drawTime: number;
    drawn: boolean;
    ticketCount: number;
    totalAmount: number;
    winnerCount: number;
  }

  // ----------------- Wallet -----------------
  useEffect(() => {
    loadRounds();
    (async () => {
      const provider = await getProvider();
      if ((window as any).ethereum) {
        try {
          const accounts: string[] = await (provider as any).request({ method: "eth_accounts" });
          if (accounts && accounts[0]) {
            setAccount(accounts[0]);
            await checkAdmin(accounts[0]);
          }
        } catch (e) {
          console.warn("Cannot get accounts", e);
        }
      }
  
      setLoading(false); 
    })();
  
    if ((window as any).ethereum) {
      const handleAccountsChanged = async (accounts: string[]) => {
        setAccount(accounts[0] || "");
        await checkAdmin(accounts[0]);
      };
      (window as any).ethereum.on("accountsChanged", handleAccountsChanged);
  
      return () => {
        (window as any).ethereum.removeListener("accountsChanged", handleAccountsChanged);
      };
    }
  }, []);  

  const checkAdmin = async (addr: string) => {
    try {
      const contract = await getContractReadOnly();
      const adminAddr = await contract.admin();
      console.log("Wallet:", addr, "Admin:", adminAddr);
      setIsAdmin(normAddr(addr) === normAddr(adminAddr));
    } catch {
      setIsAdmin(false);
    }
  };
  
  const onConnect = async () => {
    if (!(window as any).ethereum) {
      alert("Please install MetaMask or other Ethereum wallet");
      return;
    }
    const provider = await getProvider();
    const accounts: string[] = await (provider as any).send("eth_requestAccounts", []);
    const acc = accounts[0] || "";
    setAccount(acc);
    await checkAdmin(acc);
  };  

  const onDisconnect = () => {
    setAccount("");
    setIsAdmin(false);
  
    if ((window as any).ethereum && (window as any).ethereum.removeAllListeners) {
      (window as any).ethereum.removeAllListeners("accountsChanged");
    }
  };
  

  // ----------------- Load Lottery Rounds -----------------
  const loadRounds = async () => {
    try {
      const contract = await getContractReadOnly();

      let rcount = 0;
      try { 
        rcount = Number(await contract.roundsCount());
      } catch(e) { 
        console.warn("Cannot read rounds count", e); 
      }

      const list: LotteryRound[] = [];
      let totalPlayers = 0;
      let totalAmount = 0;
      let totalWinners = 0;

      for (let i = 0; i < rcount; i++) {
        const rRaw = await contract.getRound(i);

        const r: LotteryRound = {
          id: i,
          name: rRaw.name || `Round ${i}`,
          drawTime: rRaw.drawTime ? Number(rRaw.drawTime) : 0,
          drawn: rRaw.drawn || false,
          ticketCount: rRaw.ticketCount ? Number(rRaw.ticketCount) : 0,
          totalAmount: rRaw.totalAmount ? Number(rRaw.totalAmount) : 0,
          winnerCount: rRaw.winnerCount ? Number(rRaw.winnerCount) : 0,
        };

        totalPlayers += r.ticketCount || 0;
        totalAmount += r.totalAmount || 0;
        totalWinners += r.winnerCount || 0;

        list.push(r);
      }

      const sorted = list.sort((a, b) => b.drawTime - a.drawTime);
      setRounds(sorted);

      const active = sorted.filter(r => !r.drawn).length;
      const finished = sorted.filter(r => r.drawn).length;

      setStats({ activeRounds: active, finishedRounds: finished, totalAmount, totalPlayers, totalWinners });

    } catch (e) {
      console.error("Failed to load lottery rounds", e);
    }
  };

  // ----------------- Create Lottery -----------------
  const createRound = async (name: string, minutes: number) => {
    if (!name) {
      alert("Please enter lottery name");
      return;
    }
    setCreating(true);
    try {
      const contract = await getContractWithSigner();
      const drawTime = Math.floor(Date.now() / 1000) + minutes * 60;
      const tx = await contract.createRound(name, drawTime);
      await tx.wait();
      setShowCreateModal(false);
      await loadRounds();
      alert("Lottery created!");
    } catch (e: any) {
      alert("Creation failed: " + (e?.message || e));
    } finally {
      setCreating(false);
    }
  };  

  // ----------------- Buy Ticket -----------------
  const buyTicket = async (roundId: number) => {
    const round = rounds.find(r => r.id === roundId);
    if (!round) { alert("Round not found"); return; }
    if (round.drawn) { alert("This round has been drawn"); return; }

    const numStr = prompt("Enter ticket number (1000-9999)");
    if (!numStr) return;
    const n = Number(numStr);
    if (isNaN(n) || n < 1000 || n > 9999) { alert("Invalid number"); return; }

    try {
      const contract = await getContractWithSigner();
      const tx = await contract.buyTicket(roundId, n);
      await tx.wait();
      alert("Ticket purchased!");
      await loadRounds();
    } catch (e: any) {
      console.error("Purchase failed", e);
      alert("Purchase failed: " + (e?.message || e));
    }
  };

  // ----------------- View Winners -----------------
  const viewWinners = async (roundId: number, roundName: string) => {
    try {
      const contract = await getContractReadOnly();
      const winners: string[] = await contract.getWinners(roundId);
      setCurrentWinners(winners);
      setCurrentRoundName(roundName);
      setShowWinnersModal(true);
    } catch (e: any) {
      console.error("Failed to get winners", e);
      alert("Failed to get winners: " + (e?.message || e));
    }
  };

  // ----------------- Admin Draw -----------------
  const startDraw = async (num: number) => {
    if (drawRoundId === null) return;
    if (num < 1000 || num > 9999) {
      alert("Invalid number (1000-9999)");
      return;
    }
    try {
      const contract = await getContractWithSigner();
      const tx = await contract.draw(drawRoundId, num);
      await tx.wait();
      setShowDrawModal(false);
      alert("Draw success!");
      await loadRounds();
    } catch (e: any) {
      alert("Draw failed: " + (e?.message || e));
    }
  };  

  // ----------------- Auto Refresh -----------------
  React.useEffect(() => {
    const timer = setInterval(() => setRounds(prev => [...prev]), 10000);
    return () => clearInterval(timer);
  }, []);

  if (loading) return <div>Loading...</div>;

  return (
    <div style={{ fontFamily: "Arial, sans-serif", minHeight: "100vh", background: "linear-gradient(135deg,#667eea,#764ba2)", color: "#fff", margin: 0, padding: 0,}}>
      
      {/* Top Navbar */}
      <header style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px", maxWidth: "1200px", margin: "0 auto", background: "rgba(0,0,0,0.2)", borderRadius:12 }}>
        <h1 style={{ fontSize: 28, fontWeight: 700 }}>FHE Lottery</h1>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          {isAdmin && (
            <button onClick={()=>setShowCreateModal(true)} style={topButtonStyle}>
              🎲 Create Lottery
            </button>
          )}
          {account ? (
            <>
              <span style={{
                padding:"8px 16px", borderRadius:20,
                background:"#10b981", fontWeight:600, fontFamily:"monospace"
              }}>
                {`${account.slice(0,6)}...${account.slice(-4)}`}
              </span>
              <button onClick={onDisconnect} style={topButtonStyle}>Disconnect</button>
            </>
          ) : (
            <button onClick={onConnect} style={topButtonStyle}>Connect Wallet</button>
          )}
        </div>
      </header>

      {/* System Intro */}
      <section style={{ textAlign: "center", padding: "40px 0", maxWidth: 1200, margin:"0 auto" }}>
        <h2 style={{ fontSize:32, marginBottom:16 }}>Fair and Transparent Lottery System</h2>
        <p style={{ fontSize:18 }}>
          By using FHE to generate and store lottery numbers on-chain in advance, each ticket information is transparent and verifiable, ensuring fairness and impartiality.
        </p>
      </section>

      {/* Stats */}
      <section
        style={{
          display: "flex",
          justifyContent: "space-between",
          gap: "24px",
          margin: "0 auto 40px auto",
          maxWidth: 1200,
          flexWrap: "nowrap",
        }}
      >
        <StatCard label="Active Rounds" value={stats.activeRounds} fixedWidth={220} />
        <StatCard label="Finished Rounds" value={stats.finishedRounds} fixedWidth={220} />
        <StatCard label="Total Players" value={stats.totalPlayers} fixedWidth={220} />
        <StatCard label="Total Amount" value={`${stats.totalAmount} ETH`} fixedWidth={220} />
        <StatCard label="Total Winners" value={stats.totalWinners} fixedWidth={220} />
      </section>

      {/* Features */}
      <section style={{ display:"flex", flexWrap:"wrap", justifyContent:"space-between", gap:24, margin:"0 auto 40px auto", maxWidth:1200 }}>
        <FeatureCard icon="🎟️" title="Simple Ticket Purchase" text="Users can choose round and number to buy tickets" color="#60a5fa"/>
        <FeatureCard icon="⚖️" title="Fair & Transparent" text="Lottery process recorded on-chain and verifiable" color="#facc15"/>
        <FeatureCard icon="🏆" title="Data Security" text="Cannot be tampered with or insider-influenced" color="#4ade80"/>
      </section>

      <main style={{ maxWidth: 1200, margin: "0 auto 40px auto" }}>
        <h2>Lottery List</h2>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 16, justifyContent: "flex-start" }}>
          {rounds.map(r => {
            const remainingMinutes = Math.max(Math.floor((r.drawTime * 1000 - Date.now()) / 60000), 0);
            return (
              <div
                key={r.id}
                style={{
                  width: 348,
                  padding: 20,
                  borderRadius: 16,
                  background: "rgba(255,255,255,0.1)",
                  flexShrink: 0,
                }}
              >
                <h3>{r.name}</h3>
                <div>Countdown: {remainingMinutes} min</div>
                <div>Players: {r.ticketCount || 0}</div>
                <div>Prize: {r.totalAmount || 0} ETH</div>

                {!r.drawn && account && (
                  <button onClick={()=>buyTicket(r.id)} style={{marginTop:12}}>Buy</button>
                )}

                {isAdmin && !r.drawn && (
                  <button onClick={()=>{setDrawRoundId(r.id); setShowDrawModal(true);}} style={{marginTop:12, marginLeft:8}}>Draw</button>
                )}

                {r.drawn && (
                  <div style={{marginTop:12}}>
                    Drawn, Winners: {r.winnerCount || 0}
                    {r.winnerCount > 0 && (
                      <button onClick={()=>viewWinners(r.id, r.name)} style={{marginLeft:12}}>View Winners</button>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </main>

      {/* Modals */}
      {showCreateModal && <ModalCreate />}
      {showDrawModal && <ModalDraw />}
      {showWinnersModal && <ModalWinners />}
    </div>
  );

  // ------------------- Modals -------------------
  function ModalCreate() {
    const [name, setName] = React.useState("");
    const [minutes, setMinutes] = React.useState(1);
  
    return (
      <div style={modalOverlayStyle}>
        <div style={modalStyle}>
          <h2>Create Lottery</h2>
          <input
            placeholder="Lottery Name"
            value={name}
            onChange={e => setName(e.target.value)}
            style={modalInputStyle}
          />
          <input
            type="number"
            placeholder="Countdown (min)"
            value={minutes}
            onChange={e => setMinutes(Number(e.target.value))}
            style={{ ...modalInputStyle, width: 120 }}
          />
          <div style={{ marginTop: 16, display: "flex", justifyContent: "flex-end", gap: 12 }}>
            <button onClick={() => setShowCreateModal(false)} style={modalBtnStyle}>
              Cancel
            </button>
            <button
              onClick={() => createRound(name, minutes)} // 改成传参数
              style={modalBtnStyle}
              disabled={creating}
            >
              {creating ? "Creating..." : "Create"}
            </button>
          </div>
        </div>
      </div>
    );
  }
  

  function ModalDraw() {
    const [localNumber, setLocalNumber] = React.useState<number>(0);
  
    return (
      <div style={modalOverlayStyle}>
        <div style={modalStyle}>
          <h2>Enter Winning Number</h2>
          <input
            type="number"
            placeholder="1000-9999"
            value={localNumber}
            onChange={(e) => setLocalNumber(Number(e.target.value))}
            style={modalInputStyle}
          />
          <div style={{ marginTop: 16, display: "flex", justifyContent: "flex-end", gap: 12 }}>
            <button onClick={() => setShowDrawModal(false)} style={modalBtnStyle}>
              Cancel
            </button>
            <button
              onClick={() => startDraw(localNumber)}
              style={modalBtnStyle}
            >
              Draw
            </button>
          </div>
        </div>
      </div>
    );
  }
  

  function ModalWinners() {
    return (
      <div style={modalOverlayStyle}>
        <div style={modalStyle}>
          <h2>{currentRoundName} Winners</h2>
          {currentWinners.length === 0 ? <p>No winners</p> : (
            <ul style={{ maxHeight: 200, overflowY: "auto" }}>
              {currentWinners.map((addr, idx) => <li key={idx} style={{ fontFamily: "monospace", marginBottom: 4 }}>{addr}</li>)}
            </ul>
          )}
          <div style={{marginTop:16, display:"flex", justifyContent:"flex-end"}}>
            <button onClick={()=>setShowWinnersModal(false)} style={modalBtnStyle}>Close</button>
          </div>
        </div>
      </div>
    );
  }
}

// ------------------- Styles -------------------
const topButtonStyle: React.CSSProperties = {
  padding:"8px 20px",
  borderRadius:24,
  background:"#34d399",
  fontWeight:600,
  border:"none",
  cursor:"pointer",
};

const modalOverlayStyle: React.CSSProperties = {
  position:"fixed", top:0,left:0,right:0,bottom:0,
  background:"rgba(0,0,0,0.5)", display:"flex", justifyContent:"center", alignItems:"center",
  zIndex:1000
};
const modalStyle: React.CSSProperties = {
  background:"#fff", color:"#000", borderRadius:16, padding:32, width:360, display:"flex", flexDirection:"column", gap:12,
  boxShadow:"0 8px 24px rgba(0,0,0,0.3)"
};
const modalInputStyle: React.CSSProperties = {
  padding:10, borderRadius:8, border:"1px solid #ccc", fontSize:16, width:"100%"
};
const modalBtnStyle: React.CSSProperties = {
  padding:"8px 20px", borderRadius:8, border:"none", cursor:"pointer", fontWeight:600
};

// ------------------- Cards -------------------
function FeatureCard({ icon, title, text, color }: { icon: string; title: string; text: string; color: string }) {
  return (
    <div
      style={{
        flex: "1 1 280px",
        padding: 28,
        borderRadius: 16,
        background: color,
        textAlign: "center",
        fontSize: 20,
        minHeight: 220,
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        boxShadow: "0 8px 16px rgba(0,0,0,0.3)",
        transition: "transform 0.25s, box-shadow 0.25s",
      }}
      onMouseOver={(e) => (e.currentTarget.style.transform = "scale(1.05)")}
      onMouseOut={(e) => (e.currentTarget.style.transform = "scale(1)")}
    >
      <div style={{ fontSize: 42, marginBottom: 16 }}>{icon}</div>
      <h3 style={{ fontSize: 28, marginBottom: 12 }}>{title}</h3>
      <p style={{ fontSize: 18 }}>{text}</p>
    </div>
  );
}

function StatCard({ label, value, fixedWidth }: { label: string; value: any; fixedWidth?: number }) {
  return (
    <div
      style={{
        width: fixedWidth || "100%",
        background: "rgba(255,255,255,0.12)",
        padding: 28,
        borderRadius: 14,
        textAlign: "center",
        fontSize: 20,
        backdropFilter: "blur(6px)",
        minHeight: 120,
        transition: "transform 0.25s, box-shadow 0.25s",
      }}
      onMouseOver={(e) => (e.currentTarget.style.transform = "scale(1.05)")}
      onMouseOut={(e) => (e.currentTarget.style.transform = "scale(1)")}
    >
      <div style={{ marginBottom: 30 }}>{label}</div>
      <strong style={{ fontSize: 32 }}>{value}</strong>
    </div>
  );
}


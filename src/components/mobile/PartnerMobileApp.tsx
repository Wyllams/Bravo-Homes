import React, { useState } from 'react';
import './PartnerMobileApp.css';

interface PartnerMobileAppProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  user: any;
  profileData: any;
  unreadCount: number;
  setNotifOpen: (b: boolean) => void;
  renderTabContent: (tabId: string) => React.ReactNode;
}

export default function PartnerMobileApp({
  activeTab,
  setActiveTab,
  profileData,
  unreadCount,
  setNotifOpen,
  renderTabContent
}: PartnerMobileAppProps) {
  
  const [drawerOpen, setDrawerOpen] = useState(false);

  // Mapeamento dos ícones do Bottom Nav
  const NAV_ITEMS = [
    { id: 'dashboard', icon: '🏠', label: 'Início' },
    { id: 'projects', icon: '🏗️', label: 'Projetos' },
    { id: 'dailylog', icon: '📋', label: 'Rotina' },
    { id: 'stages', icon: '⏳', label: 'Etapas' }
  ];

  // Drawer options (The "Mais" Tab)
  const DRAWER_ITEMS = [
    { id: 'proposals', icon: '📝', label: 'Orçamentos (Propostas)' },
    { id: 'calendar', icon: '📅', label: 'Calendário de Obras' },
    { id: 'leads', icon: '🎯', label: 'Oportunidades (CRM)' },
    { id: 'profile', icon: '👤', label: 'Meu Perfil' }
  ];

  // Identifica se a aba atual está no Bottom Nav principal
  const isMainTab = NAV_ITEMS.some(item => item.id === activeTab);
  // Se não for, assumimos que é uma aba do Menu "Mais" (e deixamos o icone 'Mais' ativo)

  const handleNavClick = (id: string) => {
    if (id === 'more') {
      setDrawerOpen(true);
    } else {
      setActiveTab(id);
      setDrawerOpen(false);
      window.scrollTo(0, 0);
    }
  };

  const handleDrawerItemClick = (id: string) => {
    setActiveTab(id);
    setDrawerOpen(false);
    window.scrollTo(0, 0);
  };

  return (
    <div className="mobile-app-container">
      
      {/* HEADER FIXO MOBILE */}
      <header className="mobile-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <img src="/bravo-logo.png" alt="Bravo" className="mobile-logo" />
        </div>
        <div className="mobile-header-actions">
           {/* Notification Bell */}
           <button className="mobile-header-btn" onClick={() => setNotifOpen(true)}>
             🔔
             {unreadCount > 0 && <span className="badge" style={{background: 'var(--danger)', color: 'white', position: 'absolute', top: -2, right:-5, fontSize: '0.6rem', padding: '1px 5px', borderRadius: 10}}>{unreadCount}</span>}
           </button>
           {/* Perfil Mini: Clicando vai pro perfil */}
           <img 
             src={profileData?.avatar_url || 'https://ui-avatars.com/api/?name=Partner&background=C9943A&color=fff'} 
             alt="User" 
             className="mobile-header-avatar"
             onClick={() => handleNavClick('profile')}
           />
        </div>
      </header>

      {/* ÁREA DE CONTEÚDO */}
      <main className="mobile-content anim-fade-in">
         {/* Renderizamos o componente Desktop Original via Slot, injetando CSS de mobile */}
         {renderTabContent(activeTab)}
      </main>

      {/* BOTTOM NAVIGATION FIXED */}
      <nav className="mobile-bottom-nav">
         {NAV_ITEMS.map(item => (
           <div 
             key={item.id} 
             className={`mb-nav-item ${activeTab === item.id ? 'active' : ''}`}
             onClick={() => handleNavClick(item.id)}
           >
             <span className="mb-nav-icon">{item.icon}</span>
             <span className="mb-nav-label">{item.label}</span>
           </div>
         ))}
         
         {/* Botão Especial "Mais" */}
         <div 
           className={`mb-nav-item ${!isMainTab && !drawerOpen ? 'active' : ''}`}
           onClick={() => handleNavClick('more')}
         >
           <span className="mb-nav-icon">☰</span>
           <span className="mb-nav-label">Mais</span>
         </div>
      </nav>

      {/* DRAWER (MORE MENU MODAL) */}
      <div 
        className={`mobile-drawer-overlay ${drawerOpen ? 'open' : ''}`} 
        onClick={() => setDrawerOpen(false)}
      >
         <div className={`mobile-drawer ${drawerOpen ? 'open' : ''}`} onClick={(e) => e.stopPropagation()}>
            <div className="drawer-drag-pill" onClick={() => setDrawerOpen(false)}></div>
            <h3 style={{ margin: '0 0 10px 0', fontSize: '1.2rem', paddingLeft: 5 }}>Menu Completo</h3>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {DRAWER_ITEMS.map(item => (
                <div 
                  key={item.id} 
                  className="drawer-menu-item"
                  onClick={() => handleDrawerItemClick(item.id)}
                  style={activeTab === item.id ? { background: 'rgba(201,148,58,0.1)', borderColor: 'var(--gold-primary)' } : {}}
                >
                  <div className="dmi-icon">{item.icon}</div>
                  <div className="dmi-text" style={{ color: activeTab === item.id ? 'var(--gold-primary)' : 'inherit' }}>
                    {item.label}
                  </div>
                  {activeTab === item.id && <span style={{marginLeft:'auto', color:'var(--gold-primary)'}}>✓</span>}
                </div>
              ))}
              <div 
                  className="drawer-menu-item"
                  onClick={() => {
                     // Hack rápido pra logout do PartnerDashboard (o pai limpará e chamará auth.signOut)
                     sessionStorage.removeItem('partnerActiveTab');
                     window.location.href = '/';
                  }}
                >
                  <div className="dmi-icon" style={{background: 'rgba(231,76,60,0.1)', color: 'var(--danger)'}}>🚪</div>
                  <div className="dmi-text" style={{ color: 'var(--danger)' }}>
                    Sair do Sistema
                  </div>
              </div>
            </div>
         </div>
      </div>

    </div>
  );
}

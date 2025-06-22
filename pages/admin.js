import { useState, useEffect } from 'react';
import styles from '../styles/Admin.module.css';

const Admin = () => {
  const [groups, setGroups] = useState([]);
  const [guests, setGuests] = useState([]);
  const [unassignedGuests, setUnassignedGuests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('groups');
  
  // Form states
  const [newGroup, setNewGroup] = useState({ name: '', total_invitations: '' });
  const [newGuest, setNewGuest] = useState({ name: '', email: '', phone: '' });
  const [selectedGroup, setSelectedGroup] = useState('');
  const [selectedGuest, setSelectedGuest] = useState('');
    console.log("groups", groups);
  // Load data
  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [groupsRes, guestsRes, unassignedRes] = await Promise.all([
        fetch('/api/groups/with-guests'),
        fetch('/api/guests'),
        fetch('/api/guests/unassigned')
      ]);

      const groupsData = await groupsRes.json();
      const guestsData = await guestsRes.json();
      const unassignedData = await unassignedRes.json();

      setGroups(groupsData);
      setGuests(guestsData.rows || guestsData);
      setUnassignedGuests(unassignedData);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  // Create group
  const handleCreateGroup = async (e) => {
    e.preventDefault();
    if (!newGroup.name || !newGroup.total_invitations) return;

    try {
      const response = await fetch('/api/groups', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          group: {
            name: newGroup.name,
            total_invitations: parseInt(newGroup.total_invitations)
          }
        })
      });

      if (response.ok) {
        setNewGroup({ name: '', total_invitations: '' });
        loadData();
      }
    } catch (error) {
      console.error('Error creating group:', error);
    }
  };

  // Create guest
  const handleCreateGuest = async (e) => {
    e.preventDefault();
    if (!newGuest.name || !newGuest.email) return;

    try {
      const response = await fetch('/api/guests', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          guest: {
            name: newGuest.name,
            email: newGuest.email,
            phone: newGuest.phone,
            group_id: null
          }
        })
      });

      if (response.ok) {
        setNewGuest({ name: '', email: '', phone: '' });
        loadData();
      }
    } catch (error) {
      console.error('Error creating guest:', error);
    }
  };

  // Assign guest to group
  const handleAssignGuest = async () => {
    if (!selectedGroup || !selectedGuest) return;

    try {
      const response = await fetch('/api/groups/add-guest-to-group', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          groupId: selectedGroup,
          guestId: parseInt(selectedGuest)
        })
      });

      if (response.ok) {
        setSelectedGroup('');
        setSelectedGuest('');
        loadData();
      }
    } catch (error) {
      console.error('Error assigning guest:', error);
    }
  };

  // Delete group
  const handleDeleteGroup = async (groupId) => {
    if (!confirm('¿Estás seguro de eliminar este grupo?')) return;

    try {
      const response = await fetch(`/api/groups/${groupId}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        loadData();
      }
    } catch (error) {
      console.error('Error deleting group:', error);
    }
  };

  // Mark as sent
  const handleMarkAsSent = async (groupId) => {
    try {
      const response = await fetch('/api/groups/send-invitation', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: groupId })
      });

      if (response.ok) {
        // Update only the specific group in the state instead of reloading all data
        setGroups(prevGroups => 
          prevGroups.map(group => 
            group.id === groupId 
              ? { ...group, sent_status: true }
              : group
          )
        );
      }
    } catch (error) {
      console.error('Error marking as sent:', error);
    }
  };

  // Copy to clipboard function
  const copyToClipboard = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      // No alert, silent copy
    } catch (err) {
      console.error('Error copying to clipboard:', err);
    }
  };

  if (loading) {
    return <div className={styles.loading}>Cargando...</div>;
  }

  return (
    <div className={styles.admin}>
      <header className={styles.header}>
        <h1>Panel de Administración</h1>
        <nav className={styles.nav}>
          <button 
            className={activeTab === 'groups' ? styles.active : ''}
            onClick={() => setActiveTab('groups')}
          >
            Grupos
          </button>
          <button 
            className={activeTab === 'guests' ? styles.active : ''}
            onClick={() => setActiveTab('guests')}
          >
            Invitados
          </button>
          <button 
            className={activeTab === 'assign' ? styles.active : ''}
            onClick={() => setActiveTab('assign')}
          >
            Asignar
          </button>
        </nav>
      </header>

      <main className={styles.main}>
        {activeTab === 'groups' && (
          <div className={styles.section}>
            <h2>Gestión de Grupos</h2>
            
            <form onSubmit={handleCreateGroup} className={styles.form}>
              <h3>Crear Nuevo Grupo</h3>
              <div className={styles.formGroup}>
                <input
                  type="text"
                  placeholder="Nombre del grupo"
                  value={newGroup.name}
                  onChange={(e) => setNewGroup({...newGroup, name: e.target.value})}
                  required
                />
                <input
                  type="number"
                  placeholder="Total de invitaciones"
                  value={newGroup.total_invitations}
                  onChange={(e) => setNewGroup({...newGroup, total_invitations: e.target.value})}
                  required
                />
                <button type="submit" className={styles.btnPrimary}>
                  Crear Grupo
                </button>
              </div>
            </form>

            <div className={styles.groupsList}>
              <h3>Grupos Existentes ({groups.length})</h3>
              {groups.map((group, index) => (
                <div key={index} className={styles.groupCard}>
                  <div className={styles.groupHeader}>
                    <h4>{group.name}</h4>
                    <div className={styles.groupActions}>
                      {!group.sent_status && (
                        <button 
                          onClick={() => handleMarkAsSent(group.id)}
                          className={styles.btnSecondary}
                        >
                          Marcar como Enviado
                        </button>
                      )}
                      <button 
                        onClick={() => handleDeleteGroup(group.id)}
                        className={styles.btnDanger}
                      >
                        Eliminar
                      </button>
                    </div>
                  </div>
                  <div className={styles.groupInfo}>
                    <p>Total invitaciones: {group.total_invitations}</p>
                    <p>Confirmadas: {group.confirmed_invitations}</p>
                    <p>Invitados: {group.guests?.length || 0}</p>
                    {group.opened_at && (
                      <p>Abierto el: {new Date(group.opened_at).toLocaleString('es-ES')}</p>
                    )}
                    <div className={styles.statusBadges}>
                      {group.sent_status && <span className={styles.badge}>Enviado</span>}
                      {group.opened_status && <span className={styles.badge}>Abierto</span>}
                      {group.confirmed_status && <span className={styles.badge}>Confirmado</span>}
                      {group.deny_status && <span className={styles.badge}>Rechazado</span>}
                    </div>
                    <div className={styles.rsvpLink}>
                      <label>Enlace RSVP:</label>
                      <div className={styles.linkContainer}>
                        <input 
                          type="text" 
                          value={typeof window !== 'undefined' ? `${window.location.origin}/rsvp/2/${group.id}` : `/rsvp/2/${group.id}`}
                          readOnly 
                          className={styles.linkInput}
                        />
                        <button 
                          onClick={() => {
                            const link = `${window.location.origin}/rsvp/2/${group.id}`;
                            const fullMessage = `🎉 ¡Ya casi comienza nuestra pato-aventura! 🦆💛
Después de tanto planear, soñar y reír... ¡nos casamos! 💍

Queremos que seas parte de este día tan especial para nosotros.
Tu presencia haría nuestra celebración aún más bonita 🌷✨

📅 25 - 10 - 25
📍 Las Nubes, Santiago, Nuevo León

💌 Aquí te dejamos la invitación con todos los detalles y para confirmar asistencia:
${link}`;
                            copyToClipboard(fullMessage);
                          }}
                          className={styles.copyBtn}
                        >
                          Copiar Invitación
                        </button>
                      </div>
                    </div>
                  </div>
                  
                  {group.guests && group.guests.length > 0 && (
                    <div className={styles.guestsList}>
                      <h5>Invitados en este grupo:</h5>
                      {group.guests.map((guest, index) => (
                        <div key={index} className={styles.guestItem}>
                          <span>{guest.name}</span>
                          <span>{guest.email}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'guests' && (
          <div className={styles.section}>
            <h2>Gestión de Invitados</h2>
            
            <form onSubmit={handleCreateGuest} className={styles.form}>
              <h3>Crear Nuevo Invitado</h3>
              <div className={styles.formGroup}>
                <input
                  type="text"
                  placeholder="Nombre completo"
                  value={newGuest.name}
                  onChange={(e) => setNewGuest({...newGuest, name: e.target.value})}
                  required
                />
                <input
                  type="email"
                  placeholder="Email"
                  value={newGuest.email}
                  onChange={(e) => setNewGuest({...newGuest, email: e.target.value})}
                  required
                />
                <input
                  type="tel"
                  placeholder="Teléfono (opcional)"
                  value={newGuest.phone}
                  onChange={(e) => setNewGuest({...newGuest, phone: e.target.value})}
                />
                <button type="submit" className={styles.btnPrimary}>
                  Crear Invitado
                </button>
              </div>
            </form>

            <div className={styles.guestsList}>
              <h3>Invitados Sin Asignar ({unassignedGuests.length})</h3>
              {unassignedGuests.map((guest, index) => (
                <div key={index} className={styles.guestCard}>
                  <div>
                    <h4>{guest.name}</h4>
                    <p>{guest.email}</p>
                    {guest.phone_number && <p>{guest.phone_number}</p>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'assign' && (
          <div className={styles.section}>
            <h2>Asignar Invitados a Grupos</h2>
            
            <div className={styles.assignForm}>
              <div className={styles.formGroup}>
                <label>Seleccionar Grupo:</label>
                <select 
                  value={selectedGroup} 
                  onChange={(e) => setSelectedGroup(e.target.value)}
                >
                  <option value="">-- Seleccionar Grupo --</option>
                  {groups.map((group, index) => (
                    <option key={index} value={group.id}>
                      {group.name} ({group.guests?.length || 0} invitados)
                    </option>
                  ))}
                </select>
              </div>

              <div className={styles.formGroup}>
                <label>Seleccionar Invitado:</label>
                <select 
                  value={selectedGuest} 
                  onChange={(e) => setSelectedGuest(e.target.value)}
                >
                  <option value="">-- Seleccionar Invitado --</option>
                  {unassignedGuests.map((guest, index) => (
                    <option key={index} value={guest.id}>
                      {guest.name} - {guest.email}
                    </option>
                  ))}
                </select>
              </div>

              <button 
                onClick={handleAssignGuest}
                className={styles.btnPrimary}
                disabled={!selectedGroup || !selectedGuest}
              >
                Asignar Invitado al Grupo
              </button>
            </div>

            <div className={styles.summary}>
              <h3>Resumen</h3>
              <div className={styles.stats}>
                <div className={styles.stat}>
                  <span className={styles.statNumber}>{groups.length}</span>
                  <span className={styles.statLabel}>Grupos</span>
                </div>
                <div className={styles.stat}>
                  <span className={styles.statNumber}>{guests.length}</span>
                  <span className={styles.statLabel}>Total Invitados</span>
                </div>
                <div className={styles.stat}>
                  <span className={styles.statNumber}>{unassignedGuests.length}</span>
                  <span className={styles.statLabel}>Sin Asignar</span>
                </div>
                <div className={styles.stat}>
                  <span className={styles.statNumber}>
                    {groups.reduce((acc, group) => acc + (group.confirmed_invitations || 0), 0)}
                  </span>
                  <span className={styles.statLabel}>Confirmados</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default Admin; 
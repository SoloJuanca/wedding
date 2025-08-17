import { useState, useEffect } from 'react';
import styles from '../styles/Admin.module.css';

const Admin = () => {
  const [groups, setGroups] = useState([]);
  const [guests, setGuests] = useState([]);
  const [unassignedGuests, setUnassignedGuests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('groups');
  
  // Filter states
  const [filters, setFilters] = useState({
    sent: 'all', // 'all', 'sent', 'not_sent'
    confirmed: 'all', // 'all', 'confirmed', 'not_confirmed'
    opened: 'all' // 'all', 'opened', 'not_opened'
  });
  
  // Form states
  const [newGroup, setNewGroup] = useState({ name: '', total_invitations: '' });
  const [newGuest, setNewGuest] = useState({ name: '', email: '', phone: '' });
  const [selectedGroup, setSelectedGroup] = useState('');
  const [selectedGuest, setSelectedGuest] = useState('');
  
  // Edit and modal states
  const [editingGroup, setEditingGroup] = useState(null);
  const [editForm, setEditForm] = useState({ name: '', total_invitations: '' });
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [groupToDelete, setGroupToDelete] = useState(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showDenyModal, setShowDenyModal] = useState(false);
  const [showEditConfirmedModal, setShowEditConfirmedModal] = useState(false);
  const [groupToConfirm, setGroupToConfirm] = useState(null);
  const [groupToDeny, setGroupToDeny] = useState(null);
  const [groupToEditConfirmed, setGroupToEditConfirmed] = useState(null);
  const [confirmedGuests, setConfirmedGuests] = useState('');
  
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
    const group = groups.find(g => g.id === groupId);
    
    // Si ya se envió la invitación, mostrar modal
    if (group && group.sent_status) {
      setGroupToDelete(group);
      setShowDeleteModal(true);
      return;
    }

    // Si no se ha enviado, eliminar directamente
    await deleteGroup(groupId);
  };

  // Función para eliminar grupo
  const deleteGroup = async (groupId) => {
    try {
      const response = await fetch(`/api/groups/${groupId}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        loadData();
        setShowDeleteModal(false);
        setGroupToDelete(null);
      }
    } catch (error) {
      console.error('Error deleting group:', error);
    }
  };

  // Iniciar edición de grupo
  const handleEditGroup = (group) => {
    // Si ya se está editando otro grupo, cancelar primero
    if (editingGroup && editingGroup !== group.id) {
      setEditingGroup(null);
      setEditForm({ name: '', total_invitations: '' });
    }
    
    setEditingGroup(group.id);
    setEditForm({
      name: group.name,
      total_invitations: group.total_invitations.toString()
    });
  };

  // Cancelar edición
  const handleCancelEdit = () => {
    setEditingGroup(null);
    setEditForm({ name: '', total_invitations: '' });
  };

  // Guardar cambios del grupo
  const handleSaveGroup = async () => {
    if (!editForm.name || !editForm.total_invitations) return;

    try {
      // Obtener el grupo actual para preservar confirmed_invitations
      const currentGroup = groups.find(g => g.id === editingGroup);
      
      const response = await fetch(`/api/groups/${editingGroup}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          group: {
            name: editForm.name,
            total_invitations: parseInt(editForm.total_invitations),
            confirmed_invitations: currentGroup?.confirmed_invitations || 0
          }
        })
      });

      if (response.ok) {
        setEditingGroup(null);
        setEditForm({ name: '', total_invitations: '' });
        loadData();
      }
    } catch (error) {
      console.error('Error updating group:', error);
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

  // Handle confirm invitation
  const handleConfirmInvitation = (group) => {
    setGroupToConfirm(group);
    setConfirmedGuests(group.confirmed_invitations?.toString() || '');
    setShowConfirmModal(true);
  };

  // Handle deny invitation
  const handleDenyInvitation = (group) => {
    setGroupToDeny(group);
    setShowDenyModal(true);
  };

  // Handle edit confirmed guests
  const handleEditConfirmed = (group) => {
    setGroupToEditConfirmed(group);
    setConfirmedGuests(group.confirmed_invitations?.toString() || '');
    setShowEditConfirmedModal(true);
  };

  // Confirm invitation API call
  const confirmInvitation = async () => {
    if (!groupToConfirm || !confirmedGuests) return;

    try {
      const response = await fetch('/api/groups/confirm-invitation', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: groupToConfirm.id,
          confirmed_invitations: parseInt(confirmedGuests)
        })
      });

      if (response.ok) {
        loadData();
        setShowConfirmModal(false);
        setGroupToConfirm(null);
        setConfirmedGuests('');
      }
    } catch (error) {
      console.error('Error confirming invitation:', error);
    }
  };

  // Deny invitation API call
  const denyInvitation = async () => {
    if (!groupToDeny) return;

    try {
      const response = await fetch('/api/groups/deny-invitation', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: groupToDeny.id
        })
      });

      if (response.ok) {
        loadData();
        setShowDenyModal(false);
        setGroupToDeny(null);
      }
    } catch (error) {
      console.error('Error denying invitation:', error);
    }
  };

  // Edit confirmed guests API call
  const editConfirmedGuests = async () => {
    if (!groupToEditConfirmed || !confirmedGuests) return;

    try {
      const response = await fetch('/api/groups/confirm-invitation', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: groupToEditConfirmed.id,
          confirmed_invitations: parseInt(confirmedGuests)
        })
      });

      if (response.ok) {
        loadData();
        setShowEditConfirmedModal(false);
        setGroupToEditConfirmed(null);
        setConfirmedGuests('');
      }
    } catch (error) {
      console.error('Error editing confirmed guests:', error);
    }
  };

  // Filter groups based on current filters
  const filteredGroups = groups.filter(group => {
    // Filter by sent status
    if (filters.sent === 'sent' && !group.sent_status) return false;
    if (filters.sent === 'not_sent' && group.sent_status) return false;
    
    // Filter by confirmed status
    if (filters.confirmed === 'confirmed' && !group.confirmed_status) return false;
    if (filters.confirmed === 'not_confirmed' && group.confirmed_status) return false;
    
    // Filter by opened status
    if (filters.opened === 'opened' && !group.opened_status) return false;
    if (filters.opened === 'not_opened' && group.opened_status) return false;
    
    return true;
  });

  // Handle filter changes
  const handleFilterChange = (filterType, value) => {
    setFilters(prev => ({
      ...prev,
      [filterType]: value
    }));
  };

  // Reset filters
  const resetFilters = () => {
    setFilters({
      sent: 'all',
      confirmed: 'all',
      opened: 'all'
    });
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

            {/* Filter Controls */}
            <div className={styles.filtersSection}>
              <h3>Filtros</h3>
              <div className={styles.filtersContainer}>
                <div className={styles.filterGroup}>
                  <label>Estado de Envío:</label>
                  <select 
                    value={filters.sent} 
                    onChange={(e) => handleFilterChange('sent', e.target.value)}
                    className={styles.filterSelect}
                  >
                    <option value="all">Todos</option>
                    <option value="sent">Enviados</option>
                    <option value="not_sent">No Enviados</option>
                  </select>
                </div>

                <div className={styles.filterGroup}>
                  <label>Estado de Confirmación:</label>
                  <select 
                    value={filters.confirmed} 
                    onChange={(e) => handleFilterChange('confirmed', e.target.value)}
                    className={styles.filterSelect}
                  >
                    <option value="all">Todos</option>
                    <option value="confirmed">Confirmados</option>
                    <option value="not_confirmed">No Confirmados</option>
                  </select>
                </div>

                <div className={styles.filterGroup}>
                  <label>Estado de Apertura:</label>
                  <select 
                    value={filters.opened} 
                    onChange={(e) => handleFilterChange('opened', e.target.value)}
                    className={styles.filterSelect}
                  >
                    <option value="all">Todos</option>
                    <option value="opened">Abiertos</option>
                    <option value="not_opened">No Abiertos</option>
                  </select>
                </div>

                <button 
                  onClick={resetFilters}
                  className={styles.resetFiltersBtn}
                >
                  Limpiar Filtros
                </button>
              </div>
            </div>

            <div className={styles.groupsList}>
              <h3>
                Grupos Existentes ({filteredGroups.length} de {groups.length})
                {filteredGroups.length !== groups.length && (
                  <span className={styles.filterIndicator}>
                    - Filtrados
                  </span>
                )}
              </h3>
              {filteredGroups.map((group, index) => (
                <div key={index} className={styles.groupCard}>
                  <div className={styles.groupHeader}>
                    {editingGroup === group.id ? (
                      <div className={styles.editForm}>
                        <div className={styles.formGroup}>
                          <input
                            type="text"
                            placeholder="Nombre del grupo"
                            value={editForm.name}
                            onChange={(e) => setEditForm({...editForm, name: e.target.value})}
                          />
                        </div>
                        <div className={styles.formGroup}>
                          <input
                            type="number"
                            placeholder="Total de invitaciones"
                            value={editForm.total_invitations}
                            onChange={(e) => setEditForm({...editForm, total_invitations: e.target.value})}
                          />
                        </div>
                        <div className={styles.editFormActions}>
                          <button 
                            onClick={handleSaveGroup}
                            className={styles.btnSave}
                          >
                            Guardar
                          </button>
                          <button 
                            onClick={handleCancelEdit}
                            className={styles.btnCancel}
                          >
                            Cancelar
                          </button>
                        </div>
                      </div>
                    ) : (
                      <h4>{group.name}</h4>
                    )}
                    <div className={styles.groupActions}>
                      {editingGroup !== group.id && (
                        <button 
                          onClick={() => handleEditGroup(group)}
                          className={styles.btnEdit}
                        >
                          Editar
                        </button>
                      )}
                      {!group.sent_status && (
                        <button 
                          onClick={() => handleMarkAsSent(group.id)}
                          className={styles.btnSecondary}
                        >
                          Marcar como Enviado
                        </button>
                      )}
                      {group.sent_status && !group.confirmed_status && !group.deny_status && (
                        <>
                          <button 
                            onClick={() => handleConfirmInvitation(group)}
                            className={styles.btnPrimary}
                            style={{ background: '#28a745' }}
                          >
                            Confirmar
                          </button>
                          <button 
                            onClick={() => handleDenyInvitation(group)}
                            className={styles.btnDanger}
                          >
                            Rechazar
                          </button>
                        </>
                      )}
                      {group.confirmed_status && (
                        <>
                          <button 
                            onClick={() => handleEditConfirmed(group)}
                            className={styles.btnEdit}
                          >
                            Editar Confirmados
                          </button>
                          <button 
                            onClick={() => handleDenyInvitation(group)}
                            className={styles.btnDanger}
                          >
                            Rechazar
                          </button>
                        </>
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
                      {group.deny_status && <span className={styles.badgeError}>Rechazado</span>}
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
                  <span className={styles.statNumber}>
                    {groups.reduce((acc, group) => acc + (group.total_invitations || 0), 0)}
                  </span>
                  <span className={styles.statLabel}>Total Invitados</span>
                </div>
                <div className={styles.stat}>
                  <span className={styles.statNumber}>{guests.length}</span>
                  <span className={styles.statLabel}>Invitados Registrados</span>
                </div>
                <div className={styles.stat}>
                  <span className={styles.statNumber}>{unassignedGuests.length}</span>
                  <span className={styles.statLabel}>Sin Asignar</span>
                </div>
                <div className={styles.stat}>
                  <span className={styles.statNumber}>
                    {groups.filter(group => group.confirmed_status).length}
                  </span>
                  <span className={styles.statLabel}>Grupos Confirmados</span>
                </div>
                <div className={styles.stat}>
                  <span className={styles.statNumber}>
                    {groups.reduce((acc, group) => acc + (group.confirmed_invitations || 0), 0)}
                  </span>
                  <span className={styles.statLabel}>Invitados Confirmados</span>
                </div>
                <div className={styles.stat}>
                  <span className={styles.statNumber}>
                    {groups.filter(group => group.sent_status).reduce((acc, group) => acc + (group.guests?.length || 0), 0)}
                  </span>
                  <span className={styles.statLabel}>Invitados Enviados</span>
                </div>
                <div className={styles.stat}>
                  <span className={styles.statNumber}>
                    {groups.filter(group => group.opened_status).length}
                  </span>
                  <span className={styles.statLabel}>Grupos Abiertos</span>
                </div>
                <div className={styles.stat}>
                  <span className={styles.statNumber}>
                    {groups.filter(group => group.deny_status).length}
                  </span>
                  <span className={styles.statLabel}>Grupos Rechazados</span>
                </div>
                <div className={styles.stat}>
                  <span className={styles.statNumber}>
                    {groups.filter(group => group.sent_status && !group.confirmed_status && !group.deny_status).reduce((acc, group) => acc + (group.guests?.length || 0), 0)}
                  </span>
                  <span className={styles.statLabel}>Invitados Pendientes</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Modal de confirmación para eliminar */}
      {showDeleteModal && groupToDelete && (
        <div className={styles.modal}>
          <div className={styles.modalContent}>
            <h3>Confirmar Eliminación</h3>
            <p>
              El grupo <strong>"{groupToDelete.name}"</strong> ya tiene invitaciones enviadas.
              <br /><br />
              ¿Estás seguro de que quieres eliminarlo? Esta acción no se puede deshacer y podría afectar a los invitados que ya recibieron la invitación.
            </p>
            <div className={styles.modalActions}>
              <button 
                onClick={() => {
                  setShowDeleteModal(false);
                  setGroupToDelete(null);
                }}
                className={styles.btnCancel}
              >
                Cancelar
              </button>
              <button 
                onClick={() => deleteGroup(groupToDelete.id)}
                className={styles.btnDanger}
              >
                Eliminar de todas formas
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de confirmación para confirmar invitación */}
      {showConfirmModal && groupToConfirm && (
        <div className={styles.modal}>
          <div className={styles.modalContent}>
            <h3>Confirmar Invitación</h3>
            <p>
              ¿Estás seguro de que quieres confirmar la invitación del grupo <strong>"{groupToConfirm.name}"</strong>?
              <br /><br />
              Especifica el número de invitados que confirmaron:
            </p>
            <div className={styles.editForm}>
              <div className={styles.formGroup}>
                <label>Número de invitados confirmados:</label>
                <input
                  type="number"
                  min="1"
                  max={groupToConfirm.total_invitations}
                  value={confirmedGuests}
                  onChange={(e) => setConfirmedGuests(e.target.value)}
                  placeholder="Ej: 2"
                />
              </div>
            </div>
            <div className={styles.modalActions}>
              <button 
                onClick={() => {
                  setShowConfirmModal(false);
                  setGroupToConfirm(null);
                  setConfirmedGuests('');
                }}
                className={styles.btnCancel}
              >
                Cancelar
              </button>
              <button 
                onClick={confirmInvitation}
                className={styles.btnPrimary}
                disabled={!confirmedGuests || parseInt(confirmedGuests) < 1}
                style={{ background: '#28a745' }}
              >
                Confirmar Invitación
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de confirmación para rechazar invitación */}
      {showDenyModal && groupToDeny && (
        <div className={styles.modal}>
          <div className={styles.modalContent}>
            <h3>Rechazar Invitación</h3>
            <p>
              ¿Estás seguro de que quieres rechazar la invitación del grupo <strong>"{groupToDeny.name}"</strong>?
              <br /><br />
              {groupToDeny.confirmed_status ? (
                <>
                  <strong>Atención:</strong> Este grupo ya estaba confirmado con <strong>{groupToDeny.confirmed_invitations}</strong> invitados.
                  <br /><br />
                  Esta acción cambiará el estado a rechazado y pondrá las invitaciones confirmadas en 0.
                </>
              ) : (
                "Esta acción marcará el grupo como rechazado y pondrá las invitaciones confirmadas en 0."
              )}
            </p>
            <div className={styles.modalActions}>
              <button 
                onClick={() => {
                  setShowDenyModal(false);
                  setGroupToDeny(null);
                }}
                className={styles.btnCancel}
              >
                Cancelar
              </button>
              <button 
                onClick={denyInvitation}
                className={styles.btnDanger}
              >
                Rechazar Invitación
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal para editar confirmados */}
      {showEditConfirmedModal && groupToEditConfirmed && (
        <div className={styles.modal}>
          <div className={styles.modalContent}>
            <h3>Editar Invitados Confirmados</h3>
            <p>
              Edita el número de invitados confirmados para el grupo <strong>"{groupToEditConfirmed.name}"</strong>:
              <br /><br />
              Actualmente confirmados: <strong>{groupToEditConfirmed.confirmed_invitations}</strong>
            </p>
            <div className={styles.editForm}>
              <div className={styles.formGroup}>
                <label>Nuevo número de invitados confirmados:</label>
                <input
                  type="number"
                  min="0"
                  max={groupToEditConfirmed.total_invitations}
                  value={confirmedGuests}
                  onChange={(e) => setConfirmedGuests(e.target.value)}
                  placeholder="Ej: 3"
                />
              </div>
            </div>
            <div className={styles.modalActions}>
              <button 
                onClick={() => {
                  setShowEditConfirmedModal(false);
                  setGroupToEditConfirmed(null);
                  setConfirmedGuests('');
                }}
                className={styles.btnCancel}
              >
                Cancelar
              </button>
              <button 
                onClick={editConfirmedGuests}
                className={styles.btnPrimary}
                disabled={confirmedGuests === '' || parseInt(confirmedGuests) < 0}
                style={{ background: '#17a2b8' }}
              >
                Actualizar Confirmados
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Admin; 
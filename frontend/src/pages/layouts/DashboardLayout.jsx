import React, { useState } from 'react';
import Sidebar from '../../components/Sidebar';
import { X, Network } from 'lucide-react';
import api from '../../api/api';

export default function DashboardLayout({ children, onLogout }) {
  const [activeModal, setActiveModal] = useState(null); // 'person', 'relationship', 'addNote', 'viewNotes'
  const [personName, setPersonName] = useState("");
  const [personGender, setPersonGender] = useState("M");
  const [person1Id, setPerson1Id] = useState("");
  const [person2Id, setPerson2Id] = useState("");
  const [relationType, setRelationType] = useState("Parent");
  const [noteName, setNoteName] = useState("");
  const [noteContent, setNoteContent] = useState("");
  const [notesList, setNotesList] = useState([]);
  const [peopleList, setPeopleList] = useState([]);

  const handleAddPerson = () => setActiveModal('person');
  const handleAddRelationship = () => setActiveModal('relationship');
  const handleAddNote = () => setActiveModal('addNote');
  const handleViewNotes = () => {
    setActiveModal('viewNotes');
    fetchNotes();
  };
  const handleViewPeople = () => {
    setActiveModal('viewPeople');
    fetchPeople();
  };

  const fetchPeople = async () => {
    try {
      const response = await api.get('/persons');
      setPeopleList(response.data);
    } catch (error) {
      console.error("Failed to fetch people", error);
    }
  };

  const submitPerson = async () => {
    try {
      if (!personName.trim()) return;
      const response = await api.post('/person', {
        name: personName,
        gender: personGender
      });
      if (response.status === 200 || response.status === 201) {
        setPersonName("");
        setPersonGender("M");
        setActiveModal(null);
        window.location.reload(); // Refresh the page to show the new person
      }
    } catch (error) {
      console.error("Failed to add person", error);
    }
  };

  const submitRelationship = async () => {
    try {
      if (!person1Id.trim() || !person2Id.trim()) return;
      const response = await api.post('/relationships', {
        sourcePersonId: person1Id,
        targetPersonId: person2Id,
        relation: relationType
      });
      if (response.status === 200 || response.status === 201) {
        setPerson1Id("");
        setPerson2Id("");
        setRelationType("Parent");
        setActiveModal(null);
        window.location.reload();
      }
    } catch (error) {
      console.error("Failed to add relationship", error);
    }
  };

  const fetchNotes = async () => {
    try {
      const response = await api.get('/api/notes');
      setNotesList(response.data);
    } catch (error) {
      console.error("Failed to fetch notes", error);
    }
  };

  const submitNote = async () => {
    try {
      const response = await api.post('/api/notes', {
        noteName,
        content: noteContent
      });
      if (response.status === 200 || response.status === 201) {
        setNoteName("");
        setNoteContent("");
        setActiveModal(null);
        // Refresh notes if user opens View Notes right after
        fetchNotes();
      }
    } catch (error) {
      console.error("Failed to submit note", error);
    }
  };

  return (
    <div className="dashboard-layout" style={{ background: '#f8fafc', display: 'flex', flexDirection: 'column', height: '100vh', overflow: 'hidden' }}>
      <header className="topbar-new" style={{ height: '64px', borderBottom: '1px solid #e2e8f0', background: '#fff', display: 'flex', alignItems: 'center', padding: '0 24px', flexShrink: 0, justifyContent: 'space-between' }}>
        <div className="brand-logo" style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '1.25rem', fontWeight: 700, color: '#5b21b6' }}>
          <Network size={28} />
          <span>Parivaar.</span>
        </div>
      </header>

      <div style={{ display: 'flex', flexGrow: 1, height: 'calc(100vh - 64px)', overflow: 'hidden' }}>
        <Sidebar
          onLogout={onLogout}
          onAddPerson={handleAddPerson}
          onAddRelationship={handleAddRelationship}
          onAddNote={handleAddNote}
          onViewNotes={handleViewNotes}
          onViewPeople={handleViewPeople}
        />

        <div className="main-content-wrapper" style={{ flexGrow: 1, height: '100%', overflowY: 'auto' }}>
          <main className="main-content">
            {children}
          </main>
        </div>
      </div>

      {/* Modals from old FamilyTreePage */}
      {activeModal && (
        <div className="sleek-modal-overlay">
          <div className="sleek-modal">
            <button className="close-btn" onClick={() => setActiveModal(null)}><X size={18} /></button>

            {activeModal === 'person' && (
              <div className="modal-content">
                <h3>Manage Person</h3>
                <p className="sleek-text">Add or delete a family member.</p>
                <input
                  type="text"
                  className="sleek-input"
                  placeholder="Person Name..."
                  value={personName}
                  onChange={e => setPersonName(e.target.value)}
                />
                <select
                  className="sleek-input"
                  style={{ marginTop: '12px' }}
                  value={personGender}
                  onChange={e => setPersonGender(e.target.value)}
                >
                  <option value="M">Male (M)</option>
                  <option value="F">Female (F)</option>
                </select>
                <div className="modal-actions">
                  <button type="button" className="sleek-btn primary" onClick={submitPerson}>Add</button>
                  <button type="button" className="sleek-btn danger">Delete</button>
                </div>
              </div>
            )}

            {activeModal === 'relationship' && (
              <div className="modal-content">
                <h3>Add Relationship</h3>
                <p className="sleek-text">Connect two family members.</p>
                <div className="flex-row">
                  <input type="text" className="sleek-input" placeholder="Person 1 ID" value={person1Id} onChange={e => setPerson1Id(e.target.value)} />
                  <input type="text" className="sleek-input" placeholder="Person 2 ID" value={person2Id} onChange={e => setPerson2Id(e.target.value)} />
                </div>
                <select
                  className="sleek-input"
                  style={{ marginTop: '12px' }}
                  value={relationType}
                  onChange={e => setRelationType(e.target.value)}
                >
                  <option value="Parent">Parent</option>
                  <option value="Spouse">Spouse</option>
                  <option value="Child">Child</option>
                </select>
                <button type="button" className="sleek-btn primary full-width" style={{ marginTop: '16px' }} onClick={submitRelationship}>Submit</button>
              </div>
            )}

            {activeModal === 'addNote' && (
              <div className="modal-content">
                <h3>Add Note</h3>
                <p className="sleek-text">Create a new note document.</p>
                <input
                  type="text"
                  className="sleek-input"
                  placeholder="Note Name..."
                  value={noteName}
                  onChange={e => setNoteName(e.target.value)}
                />
                <textarea
                  className="sleek-input"
                  placeholder="Note Content..."
                  value={noteContent}
                  onChange={e => setNoteContent(e.target.value)}
                  style={{ marginTop: '12px', minHeight: '80px', resize: 'vertical' }}
                />
                <button className="sleek-btn primary full-width" style={{ marginTop: '16px' }} onClick={submitNote}>
                  Save Note
                </button>
              </div>
            )}

            {activeModal === 'viewNotes' && (
              <div className="modal-content" style={{ maxWidth: '500px', width: '90vw' }}>
                <h3>All Notes</h3>
                <p className="sleek-text">View your saved notes.</p>
                <div className="notes-list" style={{ marginTop: '16px', maxHeight: '300px', overflowY: 'auto' }}>
                  {notesList.length === 0 ? (
                    <p style={{ color: '#64748b' }}>No notes found.</p>
                  ) : (
                    notesList.map(note => (
                      <div key={note.id} style={{ background: '#f1f5f9', padding: '12px', borderRadius: '8px', marginBottom: '12px' }}>
                        <h4 style={{ margin: '0 0 8px 0', color: '#0f172a' }}>{note.noteName}</h4>
                        <p style={{ margin: 0, color: '#475569', fontSize: '14px', whiteSpace: 'pre-wrap' }}>{note.content}</p>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}

            {activeModal === 'viewPeople' && (
              <div className="modal-content" style={{ maxWidth: '500px', width: '90vw' }}>
                <h3>All People</h3>
                <p className="sleek-text">A list of all individuals in the family tree.</p>
                <div className="people-list" style={{ marginTop: '16px', maxHeight: '300px', overflowY: 'auto' }}>
                  {peopleList.length === 0 ? (
                    <p style={{ color: '#64748b' }}>No people found.</p>
                  ) : (
                    peopleList.map(person => (
                      <div key={person.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#f1f5f9', padding: '12px', borderRadius: '8px', marginBottom: '12px' }}>
                        <div>
                          <h4 style={{ margin: '0 0 4px 0', color: '#0f172a', fontWeight: '600' }}>{person.name}</h4>
                          <p style={{ margin: 0, color: '#64748b', fontSize: '12px' }}>ID: {person.id}</p>
                        </div>
                        <span style={{ 
                          background: person.gender === 'M' ? '#bfdbfe' : person.gender === 'F' ? '#fbcfe8' : '#e2e8f0', 
                          color: person.gender === 'M' ? '#1e40af' : person.gender === 'F' ? '#9d174d' : '#475569',
                          padding: '4px 8px', 
                          borderRadius: '12px', 
                          fontSize: '12px',
                          fontWeight: '600'
                        }}>
                          {person.gender === 'M' ? 'Male' : person.gender === 'F' ? 'Female' : 'Other'}
                        </span>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

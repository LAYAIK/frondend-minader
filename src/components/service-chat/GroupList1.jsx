import React, { useEffect, useState } from "react";
import API from "../../api/axios";
import { Card, ListGroup, Button, InputGroup, FormControl } from "react-bootstrap";
import CreateGroupModal1 from "./CreateGroupModal1";
import { getGroups } from "../../actions/Notification";

export default function GroupList1({ user, onSelect }) {
  const [groups, setGroups] = useState([]);
  const [q, setQ] = useState("");
  const [showCreate, setShowCreate] = useState(false);

   const DataData = async () => {
      try {
           const response = await getGroups();
           setGroups(response);
          } catch (err) {
              console.error(err);
          }
      };
      useEffect(() => {
          DataData();
      }, []);

  const filtered = groups.filter(g => g.nom.toLowerCase().includes(q.toLowerCase()));

  const fetch = async () => {
    try {
      const response = await getGroups();
      setGroups(response);
    } catch (err) {
      console.error("Erreur lors du fetch des groupes:", err);
    }
  };

  return (
    <>
      <Card>
        <Card.Header className="d-flex justify-content-between align-items-center">
          <strong>Groups</strong>
          <div>
            <Button size="sm" onClick={() => setShowCreate(true)}>Nouveau</Button>
          </div>
        </Card.Header>
        <Card.Body className="p-0" style={{ maxHeight: '550px', overflowY: 'auto' }}>
          <InputGroup className="p-2">
            <FormControl placeholder="Search groups..." value={q} onChange={e => setQ(e.target.value)} />
          </InputGroup>
          <ListGroup variant="flush">
            {filtered.map(g => (
              <ListGroup.Item as='div' key={g.id_group} onClick={() => onSelect(g)}>
                <div className="d-flex justify-content-between align-items-center">
                  <div>
                    <strong>{g.nom}</strong>
                    <div className="text-muted small">{g.description}</div>
                  </div>
                  <div><Button size="sm" variant="outline-primary">Ouvrir</Button></div>
                </div>
              </ListGroup.Item>
            ))}
          </ListGroup>
        </Card.Body>
      </Card>

      <CreateGroupModal1 show={showCreate} onHide={() => setShowCreate(false)} onCreated={fetch} />
    </>
  );
}


// // src/components/service-chat/GroupChat.jsx
// import React, { useEffect, useState, useRef } from "react";
// import {
//   Card,
//   ListGroup,
//   Button,
//   InputGroup,
//   FormControl,
//   Modal,
//   Spinner,
//   Form,
// } from "react-bootstrap";
// import { FaPaperPlane, FaPlus, FaUsers, FaTrash, FaFileUpload } from "react-icons/fa";
// import io from "socket.io-client";
// import axios from "axios";

// const API_URL = (typeof globalThis !== 'undefined' && globalThis.process && globalThis.process.env && globalThis.process.env.REACT_APP_API_URL)
//   ? globalThis.process.env.REACT_APP_API_URL
//   : 'http://localhost:3003';
// const SOCKET_URL = (typeof globalThis !== 'undefined' && globalThis.process && globalThis.process.env && globalThis.process.env.REACT_APP_SOCKET_URL)
//   ? globalThis.process.env.REACT_APP_SOCKET_URL
//   : API_URL;

// export default function GroupList1({ currentUser }) {
//   const [groups, setGroups] = useState([]);
//   const [selectedGroup, setSelectedGroup] = useState(null);
//   const [messages, setMessages] = useState([]);
//   const [text, setText] = useState("");
//   const [file, setFile] = useState(null);
//   const [showMembers, setShowMembers] = useState(false);
//   const [showAddUser, setShowAddUser] = useState(false);
//   const [newUserEmail, setNewUserEmail] = useState("");
//   const socketRef = useRef(null);

//   // Charger les groupes
//   useEffect(() => {
//     axios.get(`${API_URL}/api/groups`)
//       .then(res => setGroups(res.data))
//       .catch(console.error);
//   }, []);

//   // Initialiser socket
//   useEffect(() => {
//     socketRef.current = io(SOCKET_URL);
//     socketRef.current.on("messageReceived", msg => {
//       if (msg.groupId === selectedGroup?.id_group) {
//         setMessages(prev => [...prev, msg]);
//       }
//     });
//     return () => socketRef.current.disconnect();
//   }, [selectedGroup]);

//   // Charger les messages du groupe sélectionné
//   const openGroup = async (group) => {
//     setSelectedGroup(group);
//     try {
//       const res = await axios.get(`${API_URL}/api/groups/${group.id_group}/messages`);
//       setMessages(res.data);
//     } catch (err) {
//       console.error(err);
//     }
//   };

//   // Envoyer message texte ou fichier
//   const sendMessage = async () => {
//     if (!text && !file) return;
//     const formData = new FormData();
//     formData.append("text", text);
//     formData.append("senderId", currentUser.id_utilisateur);
//     if (file) formData.append("file", file);

//     try {
//       const res = await axios.post(`${API_URL}/api/groups/${selectedGroup.id_group}/messages`, formData, {
//         headers: { "Content-Type": "multipart/form-data" },
//       });
//       socketRef.current.emit("newMessage", res.data);
//       setMessages(prev => [...prev, res.data]);
//       setText("");
//       setFile(null);
//     } catch (err) {
//       console.error(err);
//     }
//   };

//   // Ajouter un utilisateur
//   const addUser = async () => {
//     try {
//       await axios.post(`${API_URL}/api/groups/${selectedGroup.id_group}/add-user`, {
//         email: newUserEmail,
//       });
//       setNewUserEmail("");
//       setShowAddUser(false);
//       alert("Utilisateur ajouté !");
//     } catch (err) {
//       alert("Erreur : utilisateur introuvable.");
//     }
//   };

//   // Retirer un utilisateur
//   const removeUser = async (userId) => {
//     await axios.post(`${API_URL}/api/groups/${selectedGroup.id_group}/remove-user`, { userId });
//     alert("Utilisateur retiré !");
//   };

//   return (
//     <div className="container-fluid py-3">
//       <div className="row">
//         {/* Liste des groupes */}
//         <div className="col-md-4 mb-3">
//           <Card className="shadow-sm">
//             <Card.Header className="d-flex justify-content-between align-items-center">
//               <strong>💬 Groupes</strong>
//               <Button size="sm" variant="outline-primary" onClick={() => alert("Créer groupe bientôt...")}>
//                 <FaPlus /> Nouveau
//               </Button>
//             </Card.Header>
//             <Card.Body className="p-0" style={{ maxHeight: "550px", overflowY: "auto" }}>
//               <ListGroup variant="flush">
//                 {groups.map((g) => (
//                   <ListGroup.Item
//                     key={g.id_group}
//                     onClick={() => openGroup(g)}
//                     action
//                     active={selectedGroup?.id_group === g.id_group}
//                   >
//                     <div className="d-flex justify-content-between align-items-center">
//                       <div>
//                         <strong>{g.nom}</strong>
//                         <div className="text-muted small">{g.description}</div>
//                       </div>
//                       <Button size="sm" variant="outline-secondary">Ouvrir</Button>
//                     </div>
//                   </ListGroup.Item>
//                 ))}
//               </ListGroup>
//             </Card.Body>
//           </Card>
//         </div>

//         {/* Zone de chat */}
//         <div className="col-md-8">
//           {selectedGroup ? (
//             <Card className="shadow-sm h-100">
//               <Card.Header className="d-flex justify-content-between align-items-center">
//                 <strong>{selectedGroup.nom}</strong>
//                 <div>
//                   <Button size="sm" variant="outline-info" onClick={() => setShowMembers(true)}>
//                     <FaUsers /> Membres
//                   </Button>
//                 </div>
//               </Card.Header>

//               <Card.Body style={{ height: "450px", overflowY: "auto", backgroundColor: "#f8f9fa" }}>
//                 {messages.map((msg, i) => (
//                   <div key={i} className={`my-2 d-flex ${msg.senderId === currentUser.id_utilisateur ? "justify-content-end" : "justify-content-start"}`}>
//                     <div
//                       className={`p-2 rounded ${msg.senderId === currentUser.id_utilisateur ? "bg-primary text-white" : "bg-light"}`}
//                       style={{ maxWidth: "70%" }}
//                     >
//                       <div className="fw-bold small">{msg.senderName}</div>
//                       {msg.text && <div>{msg.text}</div>}
//                       {msg.fileUrl && (
//                         <a href={`${API_URL}/${msg.fileUrl}`} target="_blank" rel="noreferrer" className="text-warning text-decoration-none">
//                           📎 Fichier joint
//                         </a>
//                       )}
//                       <div className="text-muted small text-end">{new Date(msg.createdAt).toLocaleTimeString()}</div>
//                     </div>
//                   </div>
//                 ))}
//               </Card.Body>

//               <Card.Footer>
//                 <InputGroup>
//                   <FormControl
//                     placeholder="Écrire un message..."
//                     value={text}
//                     onChange={(e) => setText(e.target.value)}
//                     onKeyDown={(e) => e.key === "Enter" && sendMessage()}
//                   />
//                   <Form.Control type="file" onChange={(e) => setFile(e.target.files[0])} className="form-control-sm" />
//                   <Button variant="primary" onClick={sendMessage}>
//                     <FaPaperPlane />
//                   </Button>
//                 </InputGroup>
//               </Card.Footer>
//             </Card>
//           ) : (
//             <Card className="shadow-sm h-100 d-flex align-items-center justify-content-center">
//               <h5 className="text-muted">Sélectionnez un groupe pour commencer</h5>
//             </Card>
//           )}
//         </div>
//       </div>

//       {/* Modal Membres */}
//       <Modal show={showMembers} onHide={() => setShowMembers(false)} centered size="md">
//         <Modal.Header closeButton>
//           <Modal.Title>Membres du groupe</Modal.Title>
//         </Modal.Header>
//         <Modal.Body>
//           <ListGroup>
//             {selectedGroup?.members?.map((u) => (
//               <ListGroup.Item key={u.id_utilisateur} className="d-flex justify-content-between align-items-center">
//                 {u.nom} ({u.email})
//                 <Button size="sm" variant="outline-danger" onClick={() => removeUser(u.id_utilisateur)}>
//                   <FaTrash />
//                 </Button>
//               </ListGroup.Item>
//             )) || <Spinner animation="border" />}
//           </ListGroup>
//           <Button variant="outline-success" className="mt-3 w-100" onClick={() => setShowAddUser(true)}>
//             <FaPlus /> Ajouter un utilisateur
//           </Button>
//         </Modal.Body>
//       </Modal>

//       {/* Modal Ajout utilisateur */}
//       <Modal show={showAddUser} onHide={() => setShowAddUser(false)} centered>
//         <Modal.Header closeButton>
//           <Modal.Title>Ajouter un utilisateur</Modal.Title>
//         </Modal.Header>
//         <Modal.Body>
//           <Form.Control
//             type="email"
//             placeholder="Email de l'utilisateur"
//             value={newUserEmail}
//             onChange={(e) => setNewUserEmail(e.target.value)}
//           />
//         </Modal.Body>
//         <Modal.Footer>
//           <Button variant="secondary" onClick={() => setShowAddUser(false)}>Annuler</Button>
//           <Button variant="primary" onClick={addUser}>Ajouter</Button>
//         </Modal.Footer>
//       </Modal>
//     </div>
//   );
// }



// src/components/service-chat/GroupChat.jsx
// import React, { useEffect, useState, useRef } from "react";
// import {
//   Card,
//   ListGroup,
//   Button,
//   InputGroup,
//   FormControl,
//   Modal,
//   Form,
//   Toast,
//   Spinner,
//   Image,
// } from "react-bootstrap";
// import {
//   FaPaperPlane,
//   FaPlus,
//   FaUsers,
//   FaTrash,
//   FaFileUpload,
// } from "react-icons/fa";
// import io from "socket.io-client";
// import axios from "axios";

// const API_URL = "http://localhost:3003";
// const SOCKET_URL = "http://localhost:3003";

// export default function GroupList1({ currentUser }) {
//   const [groups, setGroups] = useState([]);
//   const [selectedGroup, setSelectedGroup] = useState(null);
//   const [messages, setMessages] = useState([]);
//   const [text, setText] = useState("");
//   const [file, setFile] = useState(null);
//   const [preview, setPreview] = useState(null);
//   const [showMembers, setShowMembers] = useState(false);
//   const [showAddUser, setShowAddUser] = useState(false);
//   const [newUserEmail, setNewUserEmail] = useState("");
//   const [toastData, setToastData] = useState(null);
//   const [showToast, setShowToast] = useState(false);
//   const socketRef = useRef(null);

//   // Charger les groupes
//   useEffect(() => {
//     axios
//       .get(`${API_URL}/api/groups`)
//       .then((res) => setGroups(res.data))
//       .catch(console.error);
//   }, []);

//   // Initialiser Socket.io
//   useEffect(() => {
//     socketRef.current = io(SOCKET_URL);
//     socketRef.current.on("messageReceived", (msg) => {
//       if (msg.groupId === selectedGroup?.id_group) {
//         setMessages((prev) => [...prev, msg]);
//       } else {
//         // 🔔 notification toast si message dans un autre groupe
//         setToastData(msg);
//         setShowToast(true);
//       }
//     });
//     return () => socketRef.current.disconnect();
//   }, [selectedGroup]);

//   // Ouvrir un groupe et charger les messages
//   const openGroup = async (group) => {
//     setSelectedGroup(group);
//     try {
//       const res = await axios.get(`${API_URL}/api/groups/${group.id_group}/messages`);
//       setMessages(res.data);
//     } catch (err) {
//       console.error(err);
//     }
//   };

//   // Gérer fichier sélectionné + aperçu 💾
//   const handleFileChange = (e) => {
//     const selected = e.target.files[0];
//     if (selected) {
//       setFile(selected);
//       const reader = new FileReader();
//       reader.onloadend = () => setPreview(reader.result);
//       reader.readAsDataURL(selected);
//     }
//   };

//   // Envoyer message ou fichier
//   const sendMessage = async () => {
//     if (!text && !file) return;
//     const formData = new FormData();
//     formData.append("text", text);
//     formData.append("senderId", currentUser.id_utilisateur);
//     if (file) formData.append("file", file);

//     try {
//       const res = await axios.post(
//         `${API_URL}/api/groups/${selectedGroup.id_group}/messages`,
//         formData,
//         { headers: { "Content-Type": "multipart/form-data" } }
//       );
//       socketRef.current.emit("newMessage", res.data);
//       setMessages((prev) => [...prev, res.data]);
//       setText("");
//       setFile(null);
//       setPreview(null);
//     } catch (err) {
//       console.error(err);
//     }
//   };

//   // Ajouter un utilisateur
//   const addUser = async () => {
//     try {
//       await axios.post(`${API_URL}/api/groups/${selectedGroup.id_group}/add-user`, {
//         email: newUserEmail,
//       });
//       setNewUserEmail("");
//       setShowAddUser(false);
//       alert("Utilisateur ajouté !");
//     } catch (err) {
//       alert("Erreur : utilisateur introuvable.",err);
//     }
//   };

//   // Retirer un utilisateur
//   const removeUser = async (userId) => {
//     await axios.post(`${API_URL}/api/groups/${selectedGroup.id_group}/remove-user`, { userId });
//     alert("Utilisateur retiré !");
//   };

//   return (
//     <div className="container-fluid py-3">
//       <div className="row">
//         {/* Liste des groupes */}
//         <div className="col-md-4 mb-3">
//           <Card className="shadow-sm">
//             <Card.Header className="d-flex justify-content-between align-items-center">
//               <strong>💬 Groupes</strong>
//               <Button size="sm" variant="outline-primary" onClick={() => alert("Créer groupe bientôt...")}>
//                 <FaPlus /> Nouveau
//               </Button>
//             </Card.Header>
//             <Card.Body className="p-0" style={{ maxHeight: "550px", overflowY: "auto" }}>
//               <ListGroup variant="flush">
//                 {groups.map((g) => (
//                   <ListGroup.Item
//                     key={g.id_group}
//                     onClick={() => openGroup(g)}
//                     action
//                     active={selectedGroup?.id_group === g.id_group}
//                   >
//                     <div className="d-flex justify-content-between align-items-center">
//                       <div>
//                         <strong>{g.nom}</strong>
//                         <div className="text-muted small">{g.description}</div>
//                       </div>
//                       <Button size="sm" variant="outline-secondary">Ouvrir</Button>
//                     </div>
//                   </ListGroup.Item>
//                 ))}
//               </ListGroup>
//             </Card.Body>
//           </Card>
//         </div>

//         {/* Zone de chat */}
//         <div className="col-md-8">
//           {selectedGroup ? (
//             <Card className="shadow-sm h-100">
//               <Card.Header className="d-flex justify-content-between align-items-center">
//                 <strong>{selectedGroup.nom}</strong>
//                 <Button size="sm" variant="outline-info" onClick={() => setShowMembers(true)}>
//                   <FaUsers /> Membres
//                 </Button>
//               </Card.Header>

//               <Card.Body style={{ height: "450px", overflowY: "auto", backgroundColor: "#f8f9fa" }}>
//                 {messages.map((msg, i) => (
//                   <div key={i} className={`my-2 d-flex ${msg.senderId === currentUser.id_utilisateur ? "justify-content-end" : "justify-content-start"}`}>
//                     <div
//                       className={`p-2 rounded shadow-sm ${
//                         msg.senderId === currentUser.id_utilisateur
//                           ? "bg-primary text-white"
//                           : "bg-white border"
//                       }`}
//                       style={{ maxWidth: "70%" }}
//                     >
//                       <div className="fw-bold small mb-1">{msg.senderName}</div>
//                       {msg.text && <div>{msg.text}</div>}
//                       {msg.fileUrl && (
//                         <a
//                           href={`${API_URL}/${msg.fileUrl}`}
//                           target="_blank"
//                           rel="noreferrer"
//                           className="text-warning text-decoration-none"
//                         >
//                           📎 Fichier joint
//                         </a>
//                       )}
//                       <div className="text-muted small text-end mt-1">
//                         {new Date(msg.createdAt).toLocaleTimeString()}
//                       </div>
//                     </div>
//                   </div>
//                 ))}
//               </Card.Body>

//               <Card.Footer>
//                 {preview && (
//                   <div className="mb-2 text-center">
//                     {file?.type.startsWith("image/") ? (
//                       <Image
//                         src={preview}
//                         thumbnail
//                         style={{ maxHeight: "150px" }}
//                       />
//                     ) : (
//                       <div className="border p-2 rounded bg-light text-muted small">
//                         📄 {file.name}
//                       </div>
//                     )}
//                     <Button
//                       variant="outline-danger"
//                       size="sm"
//                       className="mt-2"
//                       onClick={() => {
//                         setFile(null);
//                         setPreview(null);
//                       }}
//                     >
//                       Supprimer le fichier
//                     </Button>
//                   </div>
//                 )}
//                 <InputGroup>
//                   <FormControl
//                     placeholder="Écrire un message..."
//                     value={text}
//                     onChange={(e) => setText(e.target.value)}
//                     onKeyDown={(e) => e.key === "Enter" && sendMessage()}
//                   />
//                   <Form.Control
//                     type="file"
//                     onChange={handleFileChange}
//                     className="form-control-sm"
//                   />
//                   <Button variant="primary" onClick={sendMessage}>
//                     <FaPaperPlane />
//                   </Button>
//                 </InputGroup>
//               </Card.Footer>
//             </Card>
//           ) : (
//             <Card className="shadow-sm h-100 d-flex align-items-center justify-content-center">
//               <h5 className="text-muted">Sélectionnez un groupe pour commencer</h5>
//             </Card>
//           )}
//         </div>
//       </div>

//       {/* Modal Membres */}
//       <Modal show={showMembers} onHide={() => setShowMembers(false)} centered size="md">
//         <Modal.Header closeButton>
//           <Modal.Title>Membres du groupe</Modal.Title>
//         </Modal.Header>
//         <Modal.Body>
//           <ListGroup>
//             {selectedGroup?.members?.map((u) => (
//               <ListGroup.Item
//                 key={u.id_utilisateur}
//                 className="d-flex justify-content-between align-items-center"
//               >
//                 {u.nom} ({u.email})
//                 <Button size="sm" variant="outline-danger" onClick={() => removeUser(u.id_utilisateur)}>
//                   <FaTrash />
//                 </Button>
//               </ListGroup.Item>
//             )) || <Spinner animation="border" />}
//           </ListGroup>
//           <Button variant="outline-success" className="mt-3 w-100" onClick={() => setShowAddUser(true)}>
//             <FaPlus /> Ajouter un utilisateur
//           </Button>
//         </Modal.Body>
//       </Modal>

//       {/* Modal ajout utilisateur */}
//       <Modal show={showAddUser} onHide={() => setShowAddUser(false)} centered>
//         <Modal.Header closeButton>
//           <Modal.Title>Ajouter un utilisateur</Modal.Title>
//         </Modal.Header>
//         <Modal.Body>
//           <Form.Control
//             type="email"
//             placeholder="Email de l'utilisateur"
//             value={newUserEmail}
//             onChange={(e) => setNewUserEmail(e.target.value)}
//           />
//         </Modal.Body>
//         <Modal.Footer>
//           <Button variant="secondary" onClick={() => setShowAddUser(false)}>
//             Annuler
//           </Button>
//           <Button variant="primary" onClick={addUser}>
//             Ajouter
//           </Button>
//         </Modal.Footer>
//       </Modal>

//       {/* 🔔 Toast Notification */}
//       <Toast
//         show={showToast}
//         onClose={() => setShowToast(false)}
//         delay={4000}
//         autohide
//         style={{
//           position: "fixed",
//           bottom: 20,
//           right: 20,
//           zIndex: 1050,
//           backgroundColor: "#0d6efd",
//           color: "white",
//         }}
//       >
//         <Toast.Header closeButton={false}>
//           <strong className="me-auto text-primary">Nouveau message 📬</strong>
//         </Toast.Header>
//         <Toast.Body>
//           <div><b>{toastData?.senderName}</b> : {toastData?.text || "a envoyé un fichier"}</div>
//         </Toast.Body>
//       </Toast>
//     </div>
//   );
// }

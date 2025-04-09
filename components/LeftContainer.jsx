import { useRef, useState } from 'react';
import { nanoid } from 'nanoid';
import Toggle from './Toggle';
import ContextMenu from './ContextMenu';
import { auth, db } from '../lib/firebase';
import { getFirestore, doc, setDoc, collection, query, where, getDocs, updateDoc, arrayUnion } from 'firebase/firestore';

const initTodoList = () => ({
  id: nanoid(),
  name: 'Nouvelle Liste',
  data: [],
  sort: null,
  filter: null,
  backgroundColor: 'amber-200',
  shared: []
});

function LeftContainer(props) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(null);
  const [showShareModal, setShowShareModal] = useState(false);
  const [shareEmail, setShareEmail] = useState('');
  const [shareError, setShareError] = useState('');
  const todoListNameRef = useRef(null);
  const activeList = props.todoLists.find(list => list.id === props.activeListId);
  const filterEnabled = activeList?.filter !== null;

  const handleFilterToggle = (enabled) => {
    const newTodoLists = props.todoLists.map(todoList => {
      if (todoList.id === props.activeListId) {
        return {...todoList, filter: enabled ? props.selectedDate || new Date() : null};
      }
      return todoList;
    });
    props.setTodoLists(newTodoLists);
  };

  const handleShare = async (todoList) => {
    try {
      if (!shareEmail) {
        setShareError('Veuillez entrer une adresse email');
        return;
      }

      // Find target user
      const usersRef = collection(db, 'users');
      const q = query(usersRef, where('email', '==', shareEmail));
      const querySnapshot = await getDocs(q);

      if (querySnapshot.empty) {
        setShareError('Utilisateur non trouvé');
        return;
      }

      const targetUser = querySnapshot.docs[0];
      const targetUserRef = doc(db, 'users', targetUser.id);

      // Get current target user's todoLists
      const targetUserDoc = await getDocs(targetUserRef);
      let targetTodoLists = targetUserDoc.exists() ? targetUserDoc.data().todoLists : [];

      // Add the shared list to target user's todoLists
      const sharedList = {
        ...todoList,
        id: nanoid(), // Generate new ID to avoid conflicts
        sharedBy: auth.currentUser.email,
        sharedAt: new Date().toISOString()
      };

      targetTodoLists = [...(targetTodoLists || []), sharedList];

      // Update target user's document with new todoLists
      await updateDoc(targetUserRef, {
        todoLists: targetTodoLists
      });

      // Update current user's list to mark it as shared
      const newTodoLists = props.todoLists.map(list => {
        if (list.id === todoList.id) {
          return {
            ...list,
            shared: [...(list.shared || []), shareEmail]
          };
        }
        return list;
      });
      props.setTodoLists(newTodoLists);

      setShareEmail('');
      setShowShareModal(false);
      alert('Liste partagée avec succès !');
    } catch (error) {
      console.error('Erreur lors du partage:', error);
      setShareError('Erreur lors du partage de la liste');
    }
  };

  return (
    <div className={`${isCollapsed ? 'w-12' : 'w-48'} h-full bg-neutral-800 border-r border-neutral-700 flex flex-col left-sidebar transition-all duration-300 relative`}>
      <button
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="absolute -right-3 top-4 w-6 h-6 bg-neutral-700 rounded-full flex items-center justify-center text-white hover:bg-neutral-600 transition-colors z-10"
      >
        {isCollapsed ? '→' : '←'}
      </button>
      
      {!isCollapsed && (
        <>
          <div className="mt-4 mb-6 ml-4">
            <h1 className="text-white text-xl font-bold">
              Gestionnaire
            </h1>
            <p className="text-neutral-400 text-sm">de tâches</p>
          </div>
          <div className="flex-1 flex flex-col gap-1">
            {props.todoLists.map((todoList) => (
              <TodoListItem
                key={todoList.id}
                todoList={todoList}
                isActive={todoList.id === props.activeListId}
                todoListNameRef={todoListNameRef}
                setActiveListId={props.setActiveListId}
                setTodoLists={props.setTodoLists}
                activeListId={props.activeListId}
                showDeleteConfirm={showDeleteConfirm}
                setShowDeleteConfirm={setShowDeleteConfirm}
                onShare={() => {
                  setShowShareModal(true);
                  handleShare(todoList);
                }}
              />
            ))}
          </div>
          <button
            className="w-40 mx-auto px-2 py-2 mt-2 rounded-md text-neutral-400 hover:text-white hover:bg-neutral-700/50 transition-all"
            onClick={() => {
              const newList = initTodoList();
              props.setTodoLists([...props.todoLists, newList]);
              props.setActiveListId(newList.id);
            }}
          >
            + Nouvelle Liste
          </button>
          <div className="p-4 border-t border-neutral-700 mt-4">
            <Toggle
              enabled={filterEnabled}
              setEnabled={handleFilterToggle}
              label="Filtre par date"
            />
          </div>
        </>
      )}

      {showShareModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-neutral-800 p-6 rounded-lg shadow-xl w-96">
            <h3 className="text-white text-lg mb-4">Partager la liste</h3>
            {shareError && (
              <div className="mb-4 text-red-500 text-sm">{shareError}</div>
            )}
            <input
              type="email"
              placeholder="Email de l'utilisateur"
              value={shareEmail}
              onChange={(e) => setShareEmail(e.target.value)}
              className="w-full px-3 py-2 bg-neutral-700 rounded-md text-white mb-4"
            />
            <div className="flex justify-end gap-4">
              <button
                className="px-4 py-2 text-neutral-300 hover:text-white"
                onClick={() => {
                  setShowShareModal(false);
                  setShareEmail('');
                  setShareError('');
                }}
              >
                Annuler
              </button>
              <button
                className="px-4 py-2 bg-amber-200 text-black rounded hover:bg-amber-300"
                onClick={() => handleShare(activeList)}
              >
                Partager
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function TodoListItem({ todoList, isActive, todoListNameRef, setActiveListId, setTodoLists, activeListId, showDeleteConfirm, setShowDeleteConfirm, onShare }) {
  const [contextMenu, setContextMenu] = useState(null);
  const inputRef = useRef(null);

  const handleContextMenu = (e, buttonClick = false) => {
    e.preventDefault();
    const rect = e.currentTarget.getBoundingClientRect();
    setContextMenu({
      x: buttonClick ? rect.right : e.clientX,
      y: buttonClick ? rect.top : e.clientY,
      options: [
        {
          label: 'Partager',
          icon: '↗️',
          onClick: onShare
        },
        {
          label: 'Renommer',
          icon: '✏️',
          onClick: () => {
            if (inputRef.current) {
              inputRef.current.select();
              inputRef.current.focus();
            }
          }
        },
        {
          label: 'Supprimer',
          icon: '🗑️',
          onClick: () => {
            setShowDeleteConfirm(todoList.id);
          }
        }
      ]
    });
  };

  const bgColor = todoList.backgroundColor || 'amber-200';
  const hoverBgColor = `hover:bg-${bgColor}/30`;

  return (
    <>
      <div
        className={`w-40 mx-auto px-2 py-2 rounded-md flex justify-between
        font-semibold transition cursor-pointer group relative
        ${isActive ? `bg-${bgColor} text-neutral-900` : `${hoverBgColor} text-neutral-400`}`}
        onClick={() => setActiveListId(todoList.id)}
        onContextMenu={handleContextMenu}
      >
        <input
          ref={inputRef}
          type="text"
          defaultValue={todoList.name}
          className={`w-28 bg-transparent outline-none cursor-pointer focus:cursor-text
            ${isActive ? 'text-neutral-900' : 'text-neutral-400'}
            ${isActive ? 'pointer-events-auto' : 'pointer-events-none'}`}
          onChange={() => {
            setTodoLists(prevLists => 
              prevLists.map(list =>
                list.id === todoList.id
                  ? { ...list, name: inputRef.current.value }
                  : list
              )
            );
          }}
        />
        <button
          className="text-neutral-400 hover:text-neutral-900 transition-colors"
          onClick={(e) => {
            e.stopPropagation();
            handleContextMenu(e, true);
          }}
        >
          ⋮
        </button>
      </div>
      {contextMenu && (
        <ContextMenu
          x={contextMenu.x}
          y={contextMenu.y}
          options={contextMenu.options}
          onClose={() => setContextMenu(null)}
        />
      )}
      {showDeleteConfirm === todoList.id && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-neutral-800 p-6 rounded-lg shadow-xl">
            <h3 className="text-white text-lg mb-4">Confirmer la suppression</h3>
            <p className="text-neutral-300 mb-6">Voulez-vous vraiment supprimer cette liste ?</p>
            <div className="flex justify-end gap-4">
              <button
                className="px-4 py-2 text-neutral-300 hover:text-white"
                onClick={() => setShowDeleteConfirm(null)}
              >
                Annuler
              </button>
              <button
                className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                onClick={() => {
                  setTodoLists(prevLists => {
                    const newLists = prevLists.filter(list => list.id !== todoList.id);
                    if (newLists.length === 0) {
                      const newList = initTodoList();
                      setActiveListId(newList.id);
                      return [newList];
                    }
                    if (todoList.id === activeListId) {
                      setActiveListId(newLists[0].id);
                    }
                    return newLists;
                  });
                  setShowDeleteConfirm(null);
                }}
              >
                Supprimer
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default LeftContainer;
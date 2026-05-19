'use client';

import { LayoutTemplate } from 'lucide-react';
import { useCMSPage } from '@/hooks/admin/useCMSPage';
import CMSHeader from '@/components/admin/content/CMSHeader';
import CMSTabs from '@/components/admin/content/CMSTabs';
import NewContentForm from '@/components/admin/content/NewContentForm';
import CMSCard from '@/components/admin/content/CMSCard';
import CMSDeleteModal from '@/components/admin/content/CMSDeleteModal';
import CMSAlertModal from '@/components/admin/content/CMSAlertModal';
import CMSEditDrawer from '@/components/admin/content/CMSEditDrawer';

export default function CMSPage() {
  const {
    contents,
    isLoading,
    selectedPage,
    setSelectedPage,
    isSaving,
    isAddingNew,
    setIsAddingNew,
    newContent,
    setNewContent,
    deleteModal,
    setDeleteModal,
    alertModal,
    setAlertModal,
    editModal,
    setEditModal,
    handleSaveChanges,
    handleCreateNew,
    handleDelete,
  } = useCMSPage();

  return (
    <div className="space-y-6 font-sans">
      
      {/* Modular CMS Header */}
      <CMSHeader
        isAddingNew={isAddingNew}
        setIsAddingNew={setIsAddingNew}
      />

      {/* Modular CMS Tabs */}
      <CMSTabs
        selectedPage={selectedPage}
        setSelectedPage={setSelectedPage}
        newContent={newContent}
        setNewContent={setNewContent}
      />

      <div className="grid grid-cols-1 gap-6">
        {/* Modular New Element Editor Form */}
        <NewContentForm
          isOpen={isAddingNew}
          onClose={() => setIsAddingNew(false)}
          selectedPage={selectedPage}
          newContent={newContent}
          setNewContent={setNewContent}
          onSubmit={handleCreateNew}
        />

        {/* Existing Content Blocks Grid */}
        {isLoading ? (
          <div className="text-center py-20 text-zinc-500">Cargando contenido...</div>
        ) : contents.length === 0 ? (
          <div className="text-center py-20 bg-zinc-900/30 border border-dashed border-zinc-850 rounded-2xl col-span-full">
            <LayoutTemplate className="w-12 h-12 text-zinc-700 mx-auto mb-3" />
            <p className="text-zinc-400">Esta página aún no tiene elementos editables registrados.</p>
            <p className="text-sm text-zinc-650 mt-1">Haz clic en "Añadir Elemento" para empezar a configurar el CMS.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {contents.map((item, i) => (
              <CMSCard
                key={item.id}
                item={item}
                idx={i}
                onEdit={() => setEditModal({ isOpen: true, item: { ...item }, originalValue: item.value })}
                onDelete={() => handleDelete(item.id)}
              />
            ))}
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      <CMSDeleteModal
        isOpen={deleteModal.isOpen}
        onClose={() => setDeleteModal({ ...deleteModal, isOpen: false })}
        title={deleteModal.title}
        message={deleteModal.message}
        isDanger={deleteModal.isDanger}
        onConfirm={() => {
          deleteModal.onConfirm();
          setDeleteModal({ ...deleteModal, isOpen: false });
        }}
      />

      {/* Alert Notification Modal */}
      <CMSAlertModal
        isOpen={alertModal.isOpen}
        onClose={() => setAlertModal({ ...alertModal, isOpen: false })}
        title={alertModal.title}
        message={alertModal.message}
      />

      {/* Shared Admin Drawer for Editing Content */}
      <CMSEditDrawer
        isOpen={editModal.isOpen}
        onClose={() => setEditModal({ isOpen: false, item: null, originalValue: '' })}
        editModal={editModal}
        setEditModal={setEditModal}
        isSaving={isSaving}
        handleSaveChanges={handleSaveChanges}
      />

    </div>
  );
}

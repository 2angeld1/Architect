'use client';

import {
  createColumnHelper,
  getCoreRowModel,
  useReactTable,
  getPaginationRowModel,
} from '@tanstack/react-table';
import { Edit, Trash2, Plus } from 'lucide-react';
import ProjectFormModal from '@/components/admin/modals/ProjectFormModal';
import { useProjectsTable } from '../../../hooks/admin/useProjectsTable';
import AdminTable from '../shared/AdminTable';

type Project = {
  id: string;
  name: string;
  category: string;
  price: number;
  isActive: boolean;
  createdAt: string;
};

const columnHelper = createColumnHelper<Project>();

export default function ProjectsTable() {
  const {
    projects,
    isLoading,
    isModalOpen,
    projectToEdit,
    handleEditClick,
    handleDeleteClick,
    handleFormSubmit,
    handleModalClose,
    handleNewProjectClick,
  } = useProjectsTable();

  const columns = [
    columnHelper.accessor('name', {
      header: 'Nombre del Proyecto',
      cell: info => <span className="font-medium text-zinc-100">{info.getValue()}</span>,
    }),
    columnHelper.accessor('category', {
      header: 'Categoría',
      cell: info => (
        <span className="px-3 py-1 rounded-full text-xs font-medium bg-zinc-800 text-zinc-300 capitalize border border-zinc-700 font-sans">
          {info.getValue()}
        </span>
      ),
    }),
    columnHelper.accessor('price', {
      header: 'Precio',
      cell: info => <span className="text-zinc-400 font-mono">${Number(info.getValue()).toLocaleString()}</span>,
    }),
    columnHelper.accessor('isActive', {
      header: 'Estado',
      cell: info => (
        <div className="flex items-center gap-2">
          <div className={`w-2 h-2 rounded-full ${info.getValue() ? 'bg-emerald-500' : 'bg-red-500'}`} />
          <span className={info.getValue() ? 'text-emerald-400 text-sm' : 'text-red-400 text-sm'}>
            {info.getValue() ? 'Activo' : 'Inactivo'}
          </span>
        </div>
      ),
    }),
    columnHelper.accessor('createdAt', {
      header: 'Fecha de Creación',
      cell: info => <span className="text-zinc-500 text-sm font-mono">{new Date(info.getValue()).toLocaleDateString()}</span>,
    }),
    columnHelper.display({
      id: 'actions',
      cell: (info) => {
        const project = info.row.original;
        return (
          <div className="flex items-center justify-end gap-2">
            <button 
              onClick={() => handleEditClick(project)}
              className="p-2 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 border border-transparent hover:border-zinc-700 transition-all duration-200"
              title="Editar"
            >
              <Edit className="w-4 h-4" />
            </button>
            <button 
              onClick={() => handleDeleteClick(project)}
              className="p-2 rounded-lg text-zinc-400 hover:text-red-400 hover:bg-red-500/10 border border-transparent hover:border-red-500/20 transition-all duration-200"
              title="Eliminar"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        );
      },
    }),
  ];

  const table = useReactTable({
    data: projects,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: {
      pagination: {
        pageSize: 5,
      },
    },
  });

  return (
    <div className="space-y-6 pb-12">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-light text-white tracking-wide font-sans">Proyectos</h2>
          <p className="text-zinc-500 text-sm mt-1 font-sans">Gestiona el catálogo de proyectos arquitectónicos.</p>
        </div>
        <button 
          onClick={handleNewProjectClick}
          className="flex items-center gap-2 bg-zinc-100 hover:bg-white text-zinc-900 px-5 py-2.5 rounded-xl font-medium transition-colors shadow-[0_0_20px_rgba(255,255,255,0.1)] text-sm font-sans"
        >
          <Plus className="w-4 h-4" />
          Nuevo Proyecto
        </button>
      </div>

      <AdminTable 
        table={table}
        isLoading={isLoading}
        emptyMessage="No hay proyectos registrados."
        loadingMessage="Cargando catálogo de proyectos..."
      />

      {/* Floating Modal Form */}
      <ProjectFormModal 
        isOpen={isModalOpen}
        onClose={handleModalClose}
        onSubmit={handleFormSubmit}
        isLoading={isLoading}
        projectToEdit={projectToEdit}
      />
    </div>
  );
}

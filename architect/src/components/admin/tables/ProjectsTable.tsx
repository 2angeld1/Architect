'use client';

import { useEffect, useState } from 'react';
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
  getPaginationRowModel,
} from '@tanstack/react-table';
import { Edit, Trash2, Plus, ArrowRight, ArrowLeft } from 'lucide-react';
import { motion } from 'framer-motion';
import { useAdminStore } from '@/store/useAdminStore';
import ProjectFormModal from '@/components/admin/modals/ProjectFormModal';

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
  const { projects, isLoading, fetchProjects, createProject, updateProject, deleteProject } = useAdminStore();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [projectToEdit, setProjectToEdit] = useState<any | null>(null);

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  const handleEditClick = (project: any) => {
    setProjectToEdit(project);
    setIsModalOpen(true);
  };

  const handleDeleteClick = async (project: any) => {
    if (window.confirm(`¿Estás seguro de que deseas eliminar el proyecto "${project.name}"?`)) {
      await deleteProject(project.id);
    }
  };

  const handleFormSubmit = async (data: any) => {
    if (projectToEdit) {
      const success = await updateProject(projectToEdit.id, data);
      if (success) {
        setIsModalOpen(false);
        setProjectToEdit(null);
      }
    } else {
      const success = await createProject(data);
      if (success) {
        setIsModalOpen(false);
      }
    }
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setProjectToEdit(null);
  };

  const columns = [
    columnHelper.accessor('name', {
      header: 'Nombre del Proyecto',
      cell: info => <span className="font-medium text-zinc-100">{info.getValue()}</span>,
    }),
    columnHelper.accessor('category', {
      header: 'Categoría',
      cell: info => (
        <span className="px-3 py-1 rounded-full text-xs font-medium bg-zinc-800 text-zinc-300 capitalize border border-zinc-700">
          {info.getValue()}
        </span>
      ),
    }),
    columnHelper.accessor('price', {
      header: 'Precio',
      cell: info => <span className="text-zinc-400">${Number(info.getValue()).toLocaleString()}</span>,
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
      cell: info => <span className="text-zinc-500 text-sm">{new Date(info.getValue()).toLocaleDateString()}</span>,
    }),
    columnHelper.display({
      id: 'actions',
      cell: (info) => {
        const project = info.row.original;
        return (
          <div className="flex items-center justify-end gap-2">
            <button 
              onClick={() => handleEditClick(project)}
              className="p-2 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
              title="Editar"
            >
              <Edit className="w-4 h-4" />
            </button>
            <button 
              onClick={() => handleDeleteClick(project)}
              className="p-2 rounded-lg text-zinc-400 hover:text-red-400 hover:bg-red-500/10 transition-colors"
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
          onClick={() => {
            setProjectToEdit(null);
            setIsModalOpen(true);
          }}
          className="flex items-center gap-2 bg-zinc-100 hover:bg-white text-zinc-900 px-5 py-2.5 rounded-xl font-medium transition-colors shadow-[0_0_20px_rgba(255,255,255,0.1)] text-sm font-sans"
        >
          <Plus className="w-4 h-4" />
          Nuevo Proyecto
        </button>
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-zinc-900/50 backdrop-blur-sm border border-zinc-800/80 rounded-2xl overflow-hidden shadow-2xl"
      >
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse font-sans">
            <thead>
              {table.getHeaderGroups().map(headerGroup => (
                <tr key={headerGroup.id} className="border-b border-zinc-800/80 bg-zinc-900/30">
                  {headerGroup.headers.map(header => (
                    <th key={header.id} className="p-5 font-medium text-zinc-400 text-sm whitespace-nowrap">
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody>
              {isLoading && projects.length === 0 ? (
                <tr>
                  <td colSpan={columns.length} className="p-10 text-center text-zinc-500">
                    Cargando proyectos...
                  </td>
                </tr>
              ) : projects.length === 0 ? (
                <tr>
                  <td colSpan={columns.length} className="p-10 text-center text-zinc-500">
                    No hay proyectos registrados.
                  </td>
                </tr>
              ) : (
                table.getRowModel().rows.map((row, i) => (
                  <motion.tr 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05 }}
                    key={row.id} 
                    className="border-b border-zinc-800/50 hover:bg-zinc-800/30 transition-colors group"
                  >
                    {row.getVisibleCells().map(cell => (
                      <td key={cell.id} className="p-5">
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </td>
                    ))}
                  </motion.tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        
        {/* Pagination */}
        {projects.length > 0 && (
          <div className="p-5 border-t border-zinc-800/80 flex items-center justify-between text-sm text-zinc-400 font-sans">
            <div>
              Página <span className="text-white">{table.getState().pagination.pageIndex + 1}</span> de{' '}
              <span className="text-white">{table.getPageCount()}</span>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => table.previousPage()}
                disabled={!table.getCanPreviousPage()}
                className="p-2 rounded-lg border border-zinc-800 hover:bg-zinc-800 disabled:opacity-50 disabled:hover:bg-transparent transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
              </button>
              <button
                onClick={() => table.nextPage()}
                disabled={!table.getCanNextPage()}
                className="p-2 rounded-lg border border-zinc-800 hover:bg-zinc-800 disabled:opacity-50 disabled:hover:bg-transparent transition-colors"
              >
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </motion.div>

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

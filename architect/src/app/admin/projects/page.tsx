import ProjectsTable from '@/components/admin/tables/ProjectsTable';

export const metadata = {
  title: 'Gestión de Proyectos | Architect Admin',
};

export default function ProjectsPage() {
  return (
    <div>
      <ProjectsTable />
    </div>
  );
}

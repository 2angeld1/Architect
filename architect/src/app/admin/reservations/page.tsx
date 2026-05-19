import ReservationsTable from '@/components/admin/tables/ReservationsTable';

export const metadata = {
  title: 'Cotizaciones | Architect Admin',
};

export default function ReservationsPage() {
  return (
    <div>
      <ReservationsTable />
    </div>
  );
}

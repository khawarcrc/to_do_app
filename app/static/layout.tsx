import StaticNavBar from '@/components/StaticNavBar';

export default function StaticLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col h-screen overflow-hidden">
      <StaticNavBar />
      <div className="flex-1 overflow-y-auto" data-static-scroll>
        {children}
      </div>
    </div>
  );
}

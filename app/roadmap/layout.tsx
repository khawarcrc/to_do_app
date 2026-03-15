import MainNav from '@/components/MainNav';

export default function RoadmapLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col h-screen overflow-hidden">
      <MainNav />
      <div className="flex-1 overflow-y-auto" data-static-scroll>
        {children}
      </div>
    </div>
  );
}

import Sidebar from "@/components/Sidebar";
import SidebarModal from "@/components/SidebarModal";

export default function SWOTLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="flex">
            <Sidebar />
            <main className="ml-64 flex-1 bg-gray-100 min-h-screen p-6">
                {children}
                <SidebarModal />
            </main>
        </div>
    );
}

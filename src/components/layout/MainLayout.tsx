
import { CreativeBrainSidebar } from "@/components/layout/CreativeBrainSidebar";
import { ReactNode } from "react";

interface MainLayoutProps {
  children: ReactNode;
  onAddNode?: (nodeData: { name: string; type: string; community: number }) => void;
  onCreateEdge?: () => void;
  onEditNode?: () => void;
  onDeleteSelection?: () => void;
  searchQuery?: string;
  onSearchChange?: (query: string) => void;
}

export const MainLayout = ({ 
  children, 
  onAddNode = () => {},
  onCreateEdge = () => {},
  onEditNode = () => {},
  onDeleteSelection = () => {},
  searchQuery = "",
  onSearchChange = () => {}
}: MainLayoutProps) => {
  return (
    <div className="flex min-h-screen bg-background">
      <CreativeBrainSidebar 
        onAddNode={onAddNode}
        onCreateEdge={onCreateEdge}
        onEditNode={onEditNode}
        onDeleteSelection={onDeleteSelection}
        searchQuery={searchQuery}
        onSearchChange={onSearchChange}
      />
      <div className="flex-1 flex flex-col">{children}</div>
    </div>
  );
};

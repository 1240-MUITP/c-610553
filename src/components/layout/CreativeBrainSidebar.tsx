
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { AddNodeDialog } from "@/components/AddNodeDialog";
import { BrainFunctionDialog } from "@/components/BrainFunctionDialog";
import {
  Brain,
  Search,
  Plus,
  Zap,
  MessageCircle,
  Lightbulb,
  Shuffle,
  Link as LinkIcon,
  Settings,
  Trash2,
} from "lucide-react";
import { useState } from "react";

interface CreativeBrainSidebarProps {
  onAddNode: (nodeData: { name: string; type: string; community: number }) => void;
  onCreateEdge: () => void;
  onEditNode: () => void;
  onDeleteSelection: () => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

export const CreativeBrainSidebar = ({
  onAddNode,
  onCreateEdge,
  onEditNode,
  onDeleteSelection,
  searchQuery,
  onSearchChange,
}: CreativeBrainSidebarProps) => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedFunction, setSelectedFunction] = useState<'generate_ideas' | 'chat_with_brain' | 'synthesize_all'>('generate_ideas');

  const handleBrainFunction = (functionType: 'generate_ideas' | 'chat_with_brain' | 'synthesize_all') => {
    setSelectedFunction(functionType);
    setDialogOpen(true);
  };

  return (
    <div className="w-64 bg-sidebar border-r border-sidebar-border flex flex-col">
      {/* Header */}
      <div className="border-b border-sidebar-border px-6 py-4">
        <div className="flex items-center gap-3">
          <Brain className="h-8 w-8 text-primary" />
          <div>
            <h1 className="text-xl font-semibold text-sidebar-foreground">CreativeBrain</h1>
            <p className="text-sm text-sidebar-foreground/60">AI Creative Companion</p>
          </div>
        </div>
      </div>
      
      {/* Search */}
      <div className="px-4 py-4">
        <div className="relative">
          <Search className="absolute left-3 top-3 h-4 w-4 text-sidebar-foreground/60" />
          <Input
            type="text"
            placeholder="Search ideas..."
            className="pl-10 bg-sidebar-accent border-sidebar-border text-sidebar-foreground placeholder:text-sidebar-foreground/60"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
          />
        </div>
      </div>

      <Separator className="bg-sidebar-border" />

      {/* Creative Tools */}
      <div className="px-4 py-4 space-y-2">
        <h3 className="text-sm font-medium text-sidebar-foreground/70 mb-3">Creative Tools</h3>
        
        <AddNodeDialog onAddNode={onAddNode} />
        
        <Button 
          variant="ghost" 
          className="w-full justify-start text-sidebar-foreground hover:bg-sidebar-accent" 
          size="sm" 
          onClick={onCreateEdge}
        >
          <LinkIcon className="mr-3 h-4 w-4" />
          Connect Ideas
        </Button>
        
        <Button 
          variant="ghost" 
          className="w-full justify-start text-sidebar-foreground hover:bg-sidebar-accent" 
          size="sm" 
          onClick={onEditNode}
        >
          <Settings className="mr-3 h-4 w-4" />
          Edit Node
        </Button>
        
        <Button 
          variant="ghost" 
          className="w-full justify-start text-destructive hover:bg-sidebar-accent" 
          size="sm" 
          onClick={onDeleteSelection}
        >
          <Trash2 className="mr-3 h-4 w-4" />
          Delete Selection
        </Button>
      </div>

      <Separator className="bg-sidebar-border" />

      {/* Brain Functions */}
      <div className="px-4 py-4 space-y-2">
        <h3 className="text-sm font-medium text-sidebar-foreground/70 mb-3">Brain Functions</h3>
        
        <Button 
          variant="ghost" 
          className="w-full justify-start text-sidebar-foreground hover:bg-sidebar-accent" 
          size="sm"
          onClick={() => handleBrainFunction('generate_ideas')}
        >
          <Lightbulb className="mr-3 h-4 w-4" />
          Generate Ideas
        </Button>
        
        <Button 
          variant="ghost" 
          className="w-full justify-start text-sidebar-foreground hover:bg-sidebar-accent" 
          size="sm"
          onClick={() => handleBrainFunction('chat_with_brain')}
        >
          <MessageCircle className="mr-3 h-4 w-4" />
          Chat with Brain
        </Button>
        
        <Button 
          variant="ghost" 
          className="w-full justify-start text-sidebar-foreground hover:bg-sidebar-accent" 
          size="sm"
          onClick={() => handleBrainFunction('synthesize_all')}
        >
          <Shuffle className="mr-3 h-4 w-4" />
          Synthesize All
        </Button>
      </div>

      <div className="flex-1" />

      {/* Footer */}
      <div className="px-4 py-4 border-t border-sidebar-border">
        <p className="text-xs text-sidebar-foreground/60 text-center">
          Visualize and connect your creative ideas
        </p>
      </div>

      <BrainFunctionDialog
        isOpen={dialogOpen}
        onOpenChange={setDialogOpen}
        functionType={selectedFunction}
        onAddNode={onAddNode}
      />
    </div>
  );
};

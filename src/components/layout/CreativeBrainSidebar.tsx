
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { AddNodeDialog } from "@/components/AddNodeDialog";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
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
  const [isLoading, setIsLoading] = useState(false);

  const handleBrainFunction = async (action: string, context: string) => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('brain-ai', {
        body: { action, context }
      });

      if (error) throw error;

      if (action === 'generate_ideas') {
        try {
          const ideas = JSON.parse(data.result);
          ideas.forEach((idea: any, index: number) => {
            onAddNode({
              name: idea.name,
              type: idea.type || 'generated',
              community: Math.floor(Math.random() * 6) // Random community for now
            });
          });
          toast.success(`Generated ${ideas.length} new ideas!`);
        } catch {
          toast.info("AI Response: " + data.result);
        }
      } else {
        toast.info("AI Response: " + data.result);
      }
    } catch (error) {
      console.error('Error calling brain AI:', error);
      toast.error('Failed to process brain function');
    } finally {
      setIsLoading(false);
    }
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
          disabled={isLoading}
          onClick={() => handleBrainFunction('generate_ideas', searchQuery || 'creative thinking')}
        >
          <Lightbulb className="mr-3 h-4 w-4" />
          {isLoading ? 'Generating...' : 'Generate Ideas'}
        </Button>
        
        <Button 
          variant="ghost" 
          className="w-full justify-start text-sidebar-foreground hover:bg-sidebar-accent" 
          size="sm"
          disabled={isLoading}
          onClick={() => handleBrainFunction('chat_with_brain', 'current creative session')}
        >
          <MessageCircle className="mr-3 h-4 w-4" />
          {isLoading ? 'Thinking...' : 'Chat with Brain'}
        </Button>
        
        <Button 
          variant="ghost" 
          className="w-full justify-start text-sidebar-foreground hover:bg-sidebar-accent" 
          size="sm"
          disabled={isLoading}
          onClick={() => handleBrainFunction('synthesize_all', 'all ideas in the network')}
        >
          <Shuffle className="mr-3 h-4 w-4" />
          {isLoading ? 'Synthesizing...' : 'Synthesize All'}
        </Button>
      </div>

      <div className="flex-1" />

      {/* Footer */}
      <div className="px-4 py-4 border-t border-sidebar-border">
        <p className="text-xs text-sidebar-foreground/60 text-center">
          Visualize and connect your creative ideas
        </p>
      </div>
    </div>
  );
};

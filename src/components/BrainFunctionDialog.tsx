
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Lightbulb, MessageCircle, Shuffle, Loader2 } from "lucide-react";

interface BrainFunctionDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  functionType: 'generate_ideas' | 'chat_with_brain' | 'synthesize_all';
  onAddNode?: (nodeData: { name: string; type: string; community: number }) => void;
}

const functionConfig = {
  generate_ideas: {
    title: "Generate Ideas",
    icon: Lightbulb,
    description: "AI will generate creative ideas based on your context",
    placeholder: "Describe what kind of ideas you're looking for..."
  },
  chat_with_brain: {
    title: "Chat with Brain",
    icon: MessageCircle,
    description: "Have a conversation with your creative AI companion",
    placeholder: "What would you like to discuss about your creative project?"
  },
  synthesize_all: {
    title: "Synthesize All",
    icon: Shuffle,
    description: "AI will analyze and find connections between your ideas",
    placeholder: "Describe the context or focus for synthesis..."
  }
};

export const BrainFunctionDialog = ({ 
  isOpen, 
  onOpenChange, 
  functionType, 
  onAddNode 
}: BrainFunctionDialogProps) => {
  const [input, setInput] = useState("");
  const [response, setResponse] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const config = functionConfig[functionType];
  const IconComponent = config.icon;

  const handleSubmit = async () => {
    if (!input.trim()) {
      toast.error("Please enter some context or description");
      return;
    }

    setIsLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('brain-ai', {
        body: { action: functionType, context: input }
      });

      if (error) throw error;

      setResponse(data.result);

      if (functionType === 'generate_ideas' && onAddNode) {
        try {
          const ideas = JSON.parse(data.result);
          if (Array.isArray(ideas)) {
            ideas.forEach((idea: any, index: number) => {
              onAddNode({
                name: idea.name || `Generated Idea ${index + 1}`,
                type: idea.type || 'generated',
                community: Math.floor(Math.random() * 6)
              });
            });
            toast.success(`Generated ${ideas.length} new ideas and added them to your network!`);
          }
        } catch {
          // If parsing fails, just show the response as text
          toast.success("Ideas generated successfully!");
        }
      } else {
        toast.success("AI response generated successfully!");
      }
    } catch (error) {
      console.error('Error calling brain AI:', error);
      toast.error('Failed to process brain function');
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setInput("");
    setResponse("");
    onOpenChange(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl max-h-[80vh]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <IconComponent className="h-5 w-5" />
            {config.title}
          </DialogTitle>
          <DialogDescription>
            {config.description}
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium mb-2 block">
              Context / Input
            </label>
            <Textarea
              placeholder={config.placeholder}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="min-h-[100px]"
            />
          </div>
          
          <Button 
            onClick={handleSubmit} 
            disabled={isLoading || !input.trim()}
            className="w-full"
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Processing...
              </>
            ) : (
              <>
                <IconComponent className="mr-2 h-4 w-4" />
                {config.title}
              </>
            )}
          </Button>
          
          {response && (
            <div>
              <label className="text-sm font-medium mb-2 block">
                AI Response
              </label>
              <ScrollArea className="h-[200px] w-full rounded-md border p-3">
                <div className="whitespace-pre-wrap text-sm">
                  {response}
                </div>
              </ScrollArea>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

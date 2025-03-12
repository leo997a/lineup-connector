
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { Search } from "lucide-react";

interface UrlInputProps {
  onFetchFromUrl: (url: string) => void;
}

const UrlInput: React.FC<UrlInputProps> = ({ onFetchFromUrl }) => {
  const [url, setUrl] = useState("");
  const { toast } = useToast();
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!url.trim()) {
      toast({
        title: "URL Required",
        description: "Please enter a FotMob match URL",
        variant: "destructive",
      });
      return;
    }
    
    // Basic URL validation
    if (!url.includes("fotmob.com") && !url.includes("special")) {
      toast({
        title: "Invalid URL",
        description: "Please enter a valid FotMob match URL",
        variant: "destructive",
      });
      return;
    }
    
    onFetchFromUrl(url);
  };
  
  return (
    <form onSubmit={handleSubmit} className="flex items-center w-full space-x-2 animate-slide-down" style={{ animationDelay: '0.2s' }}>
      <Input
        type="url"
        placeholder="Enter FotMob match URL"
        value={url}
        onChange={(e) => setUrl(e.target.value)}
        className="bg-white bg-opacity-90 backdrop-blur-sm hover:bg-opacity-100 transition-all duration-200"
      />
      <Button type="submit" className="bg-barcelona-primary hover:bg-barcelona-primary/90 transition-all duration-200">
        <Search className="w-4 h-4 mr-2" />
        Fetch
      </Button>
    </form>
  );
};

export default UrlInput;

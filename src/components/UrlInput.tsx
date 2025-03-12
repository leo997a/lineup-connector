
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
        title: "مطلوب رابط",
        description: "يرجى إدخال رابط مباراة FotMob أو معرف المباراة",
        variant: "destructive",
      });
      return;
    }
    
    // التحقق إذا كان المدخل هو معرف مباراة فقط (أرقام فقط)
    if (url.match(/^\d+$/)) {
      // هذا معرف مباراة، نرسله مباشرة إلى معالج الرابط
      onFetchFromUrl(url);
      return;
    }
    
    // تحقق بسيط أن الرابط يتعلق بـ FotMob أو أنه رابط خاص
    if (!url.includes("fotmob.com") && !url.includes("special")) {
      toast({
        title: "رابط غير صالح",
        description: "يرجى إدخال رابط مباراة FotMob صالح أو معرف المباراة",
        variant: "destructive",
      });
      return;
    }
    
    onFetchFromUrl(url);
  };
  
  const placeholderExamples = [
    "https://www.fotmob.com/matches/...",
    "4737555 (معرف المباراة فقط)"
  ];
  
  return (
    <form onSubmit={handleSubmit} className="flex items-center w-full space-x-2 animate-slide-down" style={{ animationDelay: '0.2s' }}>
      <Input
        type="text"
        placeholder="أدخل رابط مباراة FotMob أو معرف المباراة"
        value={url}
        onChange={(e) => setUrl(e.target.value)}
        className="bg-white bg-opacity-90 backdrop-blur-sm hover:bg-opacity-100 transition-all duration-200"
        dir="rtl"
        title={`مثال: ${placeholderExamples.join(' أو ')}`}
      />
      <Button type="submit" className="bg-barcelona-primary hover:bg-barcelona-primary/90 transition-all duration-200">
        <Search className="w-4 h-4 ml-2" />
        جلب
      </Button>
    </form>
  );
};

export default UrlInput;

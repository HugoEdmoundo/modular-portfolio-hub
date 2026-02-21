import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchSocialLinks, upsertSocialLink, deleteSocialLink } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
import { Plus, Trash2, Save, icons } from "lucide-react";

const SUGGESTED_ICONS = [
  "Github", "Linkedin", "Twitter", "Instagram", "Facebook", "Youtube",
  "Globe", "Mail", "Phone", "MapPin", "Twitch", "MessageCircle",
  "Send", "Rss", "Link", "ExternalLink", "Dribbble", "Figma",
  "Codepen", "Chrome", "Slack", "Music",
];

export default function AdminSocialLinks() {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const { data: links = [], isLoading } = useQuery({ queryKey: ["social-links"], queryFn: fetchSocialLinks });

  const [editing, setEditing] = useState<Record<string, any> | null>(null);

  const saveMutation = useMutation({
    mutationFn: (link: any) => upsertSocialLink(link),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["social-links"] });
      setEditing(null);
      toast({ title: "Saved!" });
    },
    onError: (err: Error) => toast({ title: "Error", description: err.message, variant: "destructive" }),
  });

  const deleteMutation = useMutation({
    mutationFn: deleteSocialLink,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["social-links"] });
      toast({ title: "Deleted!" });
    },
  });

  const empty = { platform: "", url: "", icon: "Link", sort_order: 0 };

  if (isLoading) return <div className="text-muted-foreground text-sm">Loading...</div>;

  const IconPreview = ({ name }: { name: string }) => {
    const LucideIcon = (icons as any)[name];
    return LucideIcon ? <LucideIcon className="w-4 h-4" /> : <span className="text-xs">?</span>;
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold">Social Links</h2>
        <button
          onClick={() => setEditing(empty)}
          className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-primary text-primary-foreground text-xs font-medium"
        >
          <Plus className="w-3.5 h-3.5" /> Add Link
        </button>
      </div>

      {editing && (
        <div className="mb-6 p-4 rounded-xl bg-secondary/50 border border-border space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-medium text-muted-foreground mb-1 block">Platform Name</label>
              <input
                value={editing.platform}
                onChange={(e) => setEditing({ ...editing, platform: e.target.value })}
                placeholder="e.g. GitHub"
                className="w-full px-3 py-2 rounded-lg bg-secondary border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
              />
            </div>
            <div>
              <label className="text-xs font-medium text-muted-foreground mb-1 block">URL</label>
              <input
                value={editing.url}
                onChange={(e) => setEditing({ ...editing, url: e.target.value })}
                placeholder="https://..."
                className="w-full px-3 py-2 rounded-lg bg-secondary border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
              />
            </div>
          </div>
          <div>
            <label className="text-xs font-medium text-muted-foreground mb-1 block">Icon (Lucide name)</label>
            <input
              value={editing.icon}
              onChange={(e) => setEditing({ ...editing, icon: e.target.value })}
              placeholder="e.g. Github"
              className="w-full px-3 py-2 rounded-lg bg-secondary border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
            />
            <div className="flex flex-wrap gap-1.5 mt-2">
              {SUGGESTED_ICONS.map((ic) => (
                <button
                  key={ic}
                  onClick={() => setEditing({ ...editing, icon: ic })}
                  className={`flex items-center gap-1 px-2 py-1 rounded text-xs border transition-colors ${
                    editing.icon === ic ? "bg-primary text-primary-foreground border-primary" : "bg-secondary border-border text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <IconPreview name={ic} />
                  {ic}
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="text-xs font-medium text-muted-foreground mb-1 block">Sort Order</label>
            <input
              type="number"
              value={editing.sort_order}
              onChange={(e) => setEditing({ ...editing, sort_order: parseInt(e.target.value) || 0 })}
              className="w-24 px-3 py-2 rounded-lg bg-secondary border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
            />
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => saveMutation.mutate(editing)}
              disabled={!editing.platform || !editing.url}
              className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-primary text-primary-foreground text-xs font-medium disabled:opacity-50"
            >
              <Save className="w-3.5 h-3.5" /> Save
            </button>
            <button onClick={() => setEditing(null)} className="px-3 py-1.5 rounded-lg bg-secondary text-muted-foreground text-xs">
              Cancel
            </button>
          </div>
        </div>
      )}

      <div className="space-y-2">
        {links.map((link: any) => (
          <div key={link.id} className="flex items-center gap-3 p-3 rounded-lg bg-secondary/30 border border-border/50">
            <IconPreview name={link.icon} />
            <div className="flex-1 min-w-0">
              <span className="text-sm font-medium">{link.platform}</span>
              <span className="text-xs text-muted-foreground ml-2 truncate">{link.url}</span>
            </div>
            <button onClick={() => setEditing(link)} className="text-xs text-primary hover:underline">Edit</button>
            <button onClick={() => deleteMutation.mutate(link.id)} className="p-1 text-destructive hover:text-destructive/80">
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        ))}
        {links.length === 0 && !editing && (
          <p className="text-sm text-muted-foreground">No social links yet. Add one above!</p>
        )}
      </div>
    </div>
  );
}

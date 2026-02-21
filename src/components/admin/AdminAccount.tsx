import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Save, User } from "lucide-react";

export default function AdminAccount() {
  const { toast } = useToast();
  const [newEmail, setNewEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [saving, setSaving] = useState(false);

  const handleUpdateEmail = async () => {
    if (!newEmail) return;
    setSaving(true);
    const { error } = await supabase.auth.updateUser({ email: newEmail });
    setSaving(false);
    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Email update requested", description: "Check your new email for confirmation." });
      setNewEmail("");
    }
  };

  const handleUpdatePassword = async () => {
    if (!newPassword || newPassword !== confirmPassword) {
      toast({ title: "Error", description: "Passwords don't match", variant: "destructive" });
      return;
    }
    setSaving(true);
    const { error } = await supabase.auth.updateUser({ password: newPassword });
    setSaving(false);
    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Password updated!" });
      setNewPassword("");
      setConfirmPassword("");
    }
  };

  return (
    <div>
      <h2 className="text-xl font-bold mb-6">Account Settings</h2>

      <div className="space-y-6">
        <div className="glass-card p-6 space-y-4">
          <h3 className="font-semibold text-sm flex items-center gap-2"><User className="w-4 h-4" /> Change Email</h3>
          <div>
            <label className="text-xs font-medium text-muted-foreground mb-1 block">New Email</label>
            <input type="email" value={newEmail} onChange={(e) => setNewEmail(e.target.value)} className="w-full px-3 py-2 rounded-lg bg-secondary border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary/50" />
          </div>
          <button onClick={handleUpdateEmail} disabled={saving || !newEmail} className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium disabled:opacity-50">
            <Save className="w-4 h-4" /> Update Email
          </button>
        </div>

        <div className="glass-card p-6 space-y-4">
          <h3 className="font-semibold text-sm">Change Password</h3>
          <div>
            <label className="text-xs font-medium text-muted-foreground mb-1 block">New Password</label>
            <input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} className="w-full px-3 py-2 rounded-lg bg-secondary border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary/50" />
          </div>
          <div>
            <label className="text-xs font-medium text-muted-foreground mb-1 block">Confirm Password</label>
            <input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} className="w-full px-3 py-2 rounded-lg bg-secondary border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary/50" />
          </div>
          <button onClick={handleUpdatePassword} disabled={saving || !newPassword} className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium disabled:opacity-50">
            <Save className="w-4 h-4" /> Update Password
          </button>
        </div>
      </div>
    </div>
  );
}

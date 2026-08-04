type LoginMethod = "phone" | "email" | "demo";

interface LoginToggleProps {
  method: LoginMethod;
  onChange: (method: LoginMethod) => void;
}

export function LoginToggle({ method, onChange }: LoginToggleProps) {
  const tabs: { value: LoginMethod; label: string }[] = [
    { value: "phone", label: "📱 Phone" },
    { value: "email", label: "✉️ Email" },
    { value: "demo", label: "🎯 Demo" },
  ];

  return (
    <div className="mb-6 flex rounded-lg border p-1">
      {tabs.map((tab) => (
        <button
          key={tab.value}
          type="button"
          onClick={() => onChange(tab.value)}
          className={`flex-1 rounded-md py-2 text-sm font-medium transition-colors ${
            method === tab.value
              ? tab.value === "demo"
                ? "bg-amber-500 text-white shadow-sm"
                : "bg-primary text-white shadow-sm"
              : "text-muted hover:text-foreground"
          }`}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}

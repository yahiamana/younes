"use client";

import { useState } from "react";
import { createSkill, deleteSkill } from "@/app/actions/skills";

interface Skill {
  id: string;
  name: string;
  category: string;
  icon: string | null;
  order: number;
}

export default function SkillsManager({ initialSkills }: { initialSkills: Skill[] }) {
  const [skills, setSkills] = useState(initialSkills);
  const [newName, setNewName] = useState("");
  const [newCategory, setNewCategory] = useState("");
  const [adding, setAdding] = useState(false);

  const grouped = skills.reduce((acc, skill) => {
    if (!acc[skill.category]) acc[skill.category] = [];
    acc[skill.category].push(skill);
    return acc;
  }, {} as Record<string, Skill[]>);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim() || !newCategory.trim()) return;
    setAdding(true);
    const formData = new FormData();
    formData.set("name", newName.trim());
    formData.set("category", newCategory.trim());
    formData.set("order", "0");
    const result = await createSkill(formData);
    if (result?.success) {
      setNewName("");
      // Refresh - a simple approach
      window.location.reload();
    }
    setAdding(false);
  };

  const handleDelete = async (id: string) => {
    await deleteSkill(id);
    setSkills(skills.filter((s) => s.id !== id));
  };

  const categories = Object.keys(grouped);

  return (
    <div className="space-y-6">
      {/* Add Skill Form */}
      <form onSubmit={handleAdd} className="admin-card">
        <h3 className="font-medium mb-4">Add New Skill</h3>
        <div className="flex flex-col sm:flex-row gap-3">
          <input
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            className="admin-input flex-1"
            placeholder="Skill name (e.g. Python)"
            required
          />
          <input
            value={newCategory}
            onChange={(e) => setNewCategory(e.target.value)}
            className="admin-input flex-1"
            placeholder="Category (e.g. Languages)"
            required
            list="categories"
          />
          <datalist id="categories">
            {categories.map((c) => (
              <option key={c} value={c} />
            ))}
          </datalist>
          <button type="submit" disabled={adding} className="btn-primary whitespace-nowrap disabled:opacity-50">
            {adding ? "Adding..." : "Add Skill"}
          </button>
        </div>
      </form>

      {/* Skills by Category */}
      {categories.length > 0 ? (
        categories.map((category) => (
          <div key={category} className="admin-card">
            <h3 className="font-medium mb-4">{category}</h3>
            <div className="flex flex-wrap gap-2">
              {grouped[category].map((skill) => (
                <span
                  key={skill.id}
                  className="group inline-flex items-center gap-1.5 px-3 py-1.5 text-sm rounded-lg font-medium"
                  style={{
                    background: "var(--bg-secondary)",
                    color: "var(--text-secondary)",
                    border: "1px solid var(--border-subtle)",
                  }}
                >
                  {skill.name}
                  <button
                    onClick={() => handleDelete(skill.id)}
                    className="opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer ml-1"
                    style={{ color: "#ef4444" }}
                    title="Delete"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          </div>
        ))
      ) : (
        <div className="admin-card text-center py-8" style={{ color: "var(--text-tertiary)" }}>
          <p>No skills added yet.</p>
        </div>
      )}
    </div>
  );
}

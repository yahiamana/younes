import { execSync } from "child_process";
import fs from "fs";

const skillsData = [
  { name: "Machine Learning", category: "Machine Learning / AI", order: 1 },
  { name: "Deep Learning", category: "Machine Learning / AI", order: 2 },
  { name: "PyTorch", category: "Machine Learning / AI", order: 3 },
  { name: "Scikit-Learn", category: "Machine Learning / AI", order: 4 },
  
  { name: "Python (Programming Language)", category: "Languages & Tools", order: 1 },
  { name: "C++", category: "Languages & Tools", order: 2 },
  { name: "SQL", category: "Languages & Tools", order: 3 },
  { name: "Git", category: "Languages & Tools", order: 4 },

  { name: "Data Science", category: "Data Ecosystem", order: 1 },
  { name: "Big Data", category: "Data Ecosystem", order: 2 },
  { name: "Data Analysis", category: "Data Ecosystem", order: 3 },
  { name: "Data Cleaning", category: "Data Ecosystem", order: 4 },
  { name: "Databases", category: "Data Ecosystem", order: 5 },

  { name: "Pandas (Software)", category: "Libraries & Viz", order: 1 },
  { name: "NumPy", category: "Libraries & Viz", order: 2 },
  { name: "Matplotlib", category: "Libraries & Viz", order: 3 },
  { name: "Seaborn", category: "Libraries & Viz", order: 4 },
  { name: "Plotly", category: "Libraries & Viz", order: 5 },
  { name: "Tableau", category: "Libraries & Viz", order: 6 },

  { name: "Mathematics", category: "Mathematical Theory", order: 1 },
  { name: "Statistics", category: "Mathematical Theory", order: 2 },
  { name: "Probability", category: "Mathematical Theory", order: 3 },

  { name: "Vibe Coding", category: "Superpowers", order: 1 },
];

function generateId() {
  return "cl" + Math.random().toString(36).substring(2, 25);
}

let sql = "DELETE FROM \"Skill\";\n";
for (const skill of skillsData) {
  const id = generateId();
  sql += `INSERT INTO "Skill" (id, name, category, "order", "createdAt", "updatedAt") VALUES ('${id}', '${skill.name}', '${skill.category}', ${skill.order}, NOW(), NOW());\n`;
}

fs.writeFileSync("seed_temp.sql", sql);

console.log("Executing SQL via prisma db execute...");
try {
  execSync(`npx prisma db execute --file seed_temp.sql`, { stdio: "inherit" });
  console.log("Success!");
} catch (err) {
  console.error("Failed:", err);
} finally {
  fs.unlinkSync("seed_temp.sql");
}

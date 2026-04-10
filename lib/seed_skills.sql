-- Delete existing skills
DELETE FROM "Skill";

-- Insert new skills
INSERT INTO "Skill" (id, name, category, "order", "createdAt", "updatedAt") VALUES
(cuid(), 'Machine Learning', 'Machine Learning / AI', 1, NOW(), NOW()),
(cuid(), 'Deep Learning', 'Machine Learning / AI', 2, NOW(), NOW()),
(cuid(), 'PyTorch', 'Machine Learning / AI', 3, NOW(), NOW()),
(cuid(), 'Scikit-Learn', 'Machine Learning / AI', 4, NOW(), NOW()),

(cuid(), 'Python (Programming Language)', 'Languages & Tools', 1, NOW(), NOW()),
(cuid(), 'C++', 'Languages & Tools', 2, NOW(), NOW()),
(cuid(), 'SQL', 'Languages & Tools', 3, NOW(), NOW()),
(cuid(), 'Git', 'Languages & Tools', 4, NOW(), NOW()),

(cuid(), 'Data Science', 'Data Ecosystem', 1, NOW(), NOW()),
(cuid(), 'Big Data', 'Data Ecosystem', 2, NOW(), NOW()),
(cuid(), 'Data Analysis', 'Data Ecosystem', 3, NOW(), NOW()),
(cuid(), 'Data Cleaning', 'Data Ecosystem', 4, NOW(), NOW()),
(cuid(), 'Databases', 'Data Ecosystem', 5, NOW(), NOW()),

(cuid(), 'Pandas (Software)', 'Libraries & Viz', 1, NOW(), NOW()),
(cuid(), 'NumPy', 'Libraries & Viz', 2, NOW(), NOW()),
(cuid(), 'Matplotlib', 'Libraries & Viz', 3, NOW(), NOW()),
(cuid(), 'Seaborn', 'Libraries & Viz', 4, NOW(), NOW()),
(cuid(), 'Plotly', 'Libraries & Viz', 5, NOW(), NOW()),
(cuid(), 'Tableau', 'Libraries & Viz', 6, NOW(), NOW()),

(cuid(), 'Mathematics', 'Mathematical Theory', 1, NOW(), NOW()),
(cuid(), 'Statistics', 'Mathematical Theory', 2, NOW(), NOW()),
(cuid(), 'Probability', 'Mathematical Theory', 3, NOW(), NOW()),

(cuid(), 'Vibe Coding', 'Superpowers', 1, NOW(), NOW());

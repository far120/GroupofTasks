import React, { useState } from 'react';

type Course = {
  name: string;
  credits: number;
  grade: string;
};

const gradePoints: Record<string, number> = {
  'A': 4.0,
  'A-': 3.7,
  'B+': 3.3,
  'B': 3.0,
  'B-': 2.7,
  'C+': 2.3,
  'C': 2.0,
  'C-': 1.7,
  'D+': 1.3,
  'D': 1.0,
  'F': 0.0,
};

const GPACalculator: React.FC = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [name, setName] = useState('');
  const [credits, setCredits] = useState(3);
  const [grade, setGrade] = useState('A');
  const [editIdx, setEditIdx] = useState<number | null>(null);
  const [editName, setEditName] = useState('');
  const [editCredits, setEditCredits] = useState(3);
  const [editGrade, setEditGrade] = useState('A');

  const addCourse = () => {
    if (!name.trim() || !grade || credits <= 0) return;
    setCourses([...courses, { name, credits, grade }]);
    setName('');
    setCredits(3);
    setGrade('A');
  };

  const startEdit = (idx: number, course: Course) => {
    setEditIdx(idx);
    setEditName(course.name);
    setEditCredits(course.credits);
    setEditGrade(course.grade);
  };

  const saveEdit = (idx: number) => {
    setCourses(courses.map((c, i) => i === idx ? { name: editName, credits: editCredits, grade: editGrade } : c));
    setEditIdx(null);
    setEditName('');
    setEditCredits(3);
    setEditGrade('A');
  };

  const deleteCourse = (idx: number) => {
    setCourses(courses.filter((_, i) => i !== idx));
  };

  const calculateGPA = () => {
    let totalPoints = 0;
    let totalCredits = 0;
    for (const course of courses) {
      totalPoints += (gradePoints[course.grade] || 0) * course.credits;
      totalCredits += course.credits;
    }
    return totalCredits ? (totalPoints / totalCredits).toFixed(2) : '0.00';
  };

  return (
    <div className="flex justify-center items-center min-h-screen p-2 bg-gradient-to-br from-blue-100 to-purple-100">
      <div className="w-full max-w-md bg-white/90 rounded-2xl shadow-xl p-4 sm:p-8">
        <div className="flex items-center gap-3 mb-6">
          <span className="text-3xl">🎓</span>
          <h2 className="text-2xl font-extrabold text-blue-700 tracking-tight">GPA Calculator</h2>
        </div>
        <div className="flex flex-col sm:flex-row gap-2 mb-6">
          <input
            className="border border-blue-300 p-2 flex-1 rounded-lg focus:ring-2 focus:ring-blue-400 outline-none bg-blue-50"
            type="text"
            value={name}
            onChange={e => setName(e.target.value)}
            placeholder="Course Name"
          />
          <select
            className="border border-blue-300 p-2 w-full sm:w-16 rounded-lg focus:ring-2 focus:ring-blue-400 outline-none bg-blue-50"
            value={credits}
            onChange={e => setCredits(Number(e.target.value))}
            title="Credits"
          >
            {[1,2,3,4,5,6].map(c => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
          <select
            className="border border-blue-300 p-2 w-full sm:w-24 rounded-lg focus:ring-2 focus:ring-blue-400 outline-none bg-blue-50"
            value={grade}
            onChange={e => setGrade(e.target.value)}
            title="Grade"
          >
            {Object.keys(gradePoints).map(g => (
              <option key={g} value={g}>{g}</option>
            ))}
          </select>
          <button className="bg-gradient-to-r from-blue-500 to-blue-700 text-white px-5 py-2 rounded-lg font-semibold shadow hover:from-blue-600 hover:to-blue-800 transition disabled:opacity-60 w-full sm:w-auto" onClick={addCourse}>Add</button>
        </div>
        <ul>
          {courses.map((course, idx) => (
            <li key={idx} className="mb-1 p-2 rounded-lg hover:bg-blue-50 transition flex flex-col sm:flex-row items-center gap-2 sm:gap-4">
              {editIdx === idx ? (
                <>
                  <input
                    className="border p-1 rounded mr-2"
                    value={editName}
                    onChange={e => setEditName(e.target.value)}
                    placeholder="Course Name"
                  />
                  <select
                    className="border p-1 rounded mr-2"
                    value={editCredits}
                    onChange={e => setEditCredits(Number(e.target.value))}
                  >
                    {[1,2,3,4,5,6].map(c => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                  <select
                    className="border p-1 rounded mr-2"
                    value={editGrade}
                    onChange={e => setEditGrade(e.target.value)}
                  >
                    {Object.keys(gradePoints).map(g => (
                      <option key={g} value={g}>{g}</option>
                    ))}
                  </select>
                  <button className="text-green-600 mr-2" onClick={() => saveEdit(idx)} title="Save"><span role="img" aria-label="Save">💾</span></button>
                  <button className="text-gray-500" onClick={() => setEditIdx(null)} title="Cancel"><span role="img" aria-label="Cancel">❌</span></button>
                </>
              ) : (
                <>
                  <span className="font-semibold text-blue-800">{course.name}</span> <span className="text-gray-500">({course.credits} cr)</span> - <span className="text-blue-600">{course.grade}</span>
                  <button className="ml-2 text-yellow-500" onClick={() => startEdit(idx, course)} title="Edit"><span role="img" aria-label="Edit">✏️</span></button>
                  <button className="ml-2 text-red-500" onClick={() => deleteCourse(idx)} title="Delete"><span role="img" aria-label="Delete">🗑️</span></button>
                </>
              )}
            </li>
          ))}
        </ul>
        <div className="mt-6 font-bold text-xl text-blue-700 flex items-center gap-2">
          <span>📊</span>GPA: {calculateGPA()}
        </div>
      </div>
    </div>
  );
};

export default GPACalculator;

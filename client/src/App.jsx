import { useEffect, useState } from "react";
import axios from "axios";

function App() {
  const [skills, setSkills] = useState([]);

  useEffect(() => {
    const loadSkills = async () => {
      try {
        const res = await axios.get("http://localhost:5000/insights");
        setSkills(res.data);
      } catch (err) {
        console.error(err);
      }
    };

    loadSkills();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 p-6 font-sans">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">
        🔥 Job Market Insights
      </h1>

      <div className="space-y-3">
        {skills.map((skill, index) => (
          <div
            key={index}
            className="bg-white shadow-md rounded-lg p-4 flex justify-between items-center hover:shadow-lg transition"
          >
            <span className="font-semibold text-gray-700">{skill.name}</span>
            <span className="text-blue-600 font-bold">{skill.count}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;

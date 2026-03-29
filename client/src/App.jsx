import { useEffect, useState } from "react";
import axios from "axios";

function App() {
  const [skills, setSkills] = useState([]);

  useEffect(() => {
    const loadSkills = async () => {
      try {
        const res = await axios.get("https://job-insight-7b3h.onrender.com");
        setSkills(res.data);
      } catch (err) {
        console.error(err);
      }
    };

    loadSkills();
  }, []);

  return (
    <div className="min-h-screen bg-zinc-950 text-white p-8 font-sans">
      <h1 className="text-4xl font-semibold mb-8 tracking-tight">
        Job Market Insights
      </h1>

      <div className="space-y-4">
        {skills.map((skill, index) => (
          <div
            key={index}
            className="bg-zinc-900 border border-zinc-800 rounded-xl p-4 hover:border-zinc-700 transition"
          >
            <div className="flex justify-between items-center mb-2">
              <span className="text-zinc-300">{skill.name}</span>
              <span className="text-zinc-500 text-sm">{skill.count}</span>
            </div>

            {/* bar */}
            <div className="w-full h-2 bg-zinc-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-white"
                style={{
                  width: `${skill.count * 20}px`,
                }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;

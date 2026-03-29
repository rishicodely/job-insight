export function aggregateSkills(jobs) {
  const skillCount = {};

  jobs.forEach((job) => {
    job.skills.forEach((skill) => {
      if (!skillCount[skill]) {
        skillCount[skill] = 0;
      }
      skillCount[skill]++;
    });
  });
  return skillCount;
}

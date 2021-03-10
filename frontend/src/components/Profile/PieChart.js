import React from "react";
import { Pie } from "react-chartjs-2";
import randomColor from "randomcolor";

function createPiechartData(languages) {
  let languageLabels = [];
  let languageCounts = [];
  const chartLabel = "Languages";
  const randomColorSeed = Date.now();

  languages.forEach((language) => {
    languageLabels.push(language.lang);
    languageCounts.push(language.count);
  });

  if (languageLabels.length === 0) {
    return {
      labels: ["None"],
      datasets: [
        {
          label: chartLabel,
          data: [0],
          backgroundColor: "rgb(128,128,128, 0.3)",
          borderColor: "rgb(128,128,128, 1)",
          borderWidth: 1.5,
        },
      ],
    };
    // There is no data
  } else {
    const backgroundColor = randomColor({
      seed: randomColorSeed,
      format: "rgba",
      count: languageLabels.length,
      alpha: 0.3,
    });
    const borderColor = randomColor({
      seed: randomColorSeed,
      format: "rgba",
      count: languageLabels.length,
      alpha: 1,
    });
    return {
      labels: languageLabels,
      datasets: [
        {
          label: chartLabel,
          data: languageCounts,
          backgroundColor: backgroundColor,
          borderColor: borderColor,
          borderWidth: 1,
        },
      ],
    };
  }
}

function PieChart({ counts }) {
  return (
    <div>
      <p className="h5 text-center">Languages</p>
      <Pie data={createPiechartData(counts)} />
    </div>
  );
}

export default PieChart;

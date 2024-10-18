const EnergyLog = require("../models/EnergyConsumption");
const { GoogleGenerativeAI } = require("@google/generative-ai");
const API_KEY = "YOUR_GOOGLE_API_KEY";

const genAI = new GoogleGenerativeAI(API_KEY);

exports.generateEnergySummary = async (req, res) => {
  try {
    const energyLogs = await EnergyLog.find().sort({ timestamp: -1 }).limit(30);

    if (!energyLogs || energyLogs.length === 0) {
      return res.status(404).json({ error: "No energy logs found." });
    }

    const prompt = `
        Please analyze the following energy logs and return a structured summary in the format below:

        {
          "summary": {
            "machine_insights": [
              {
                "machine_id": "welding_robot_006",
                "total_energy_consumption": 5000,
                "average_energy_consumption": 167,
                "max_energy_spike": 300,
                "min_energy_consumption": 120,
                "energy_efficiency": "low", 
                "recommendation": "Schedule maintenance during off-peak hours to reduce energy spikes."
              },
              {
                "machine_id": "agv_003",
                "total_energy_consumption": 4000,
                "average_energy_consumption": 133,
                "max_energy_spike": 250,
                "min_energy_consumption": 90,
                "energy_efficiency": "medium",
                "recommendation": "Reduce load weight during night shift to avoid energy overload."
              }
            ],
            "shift_insights": {
              "most_energy_consumed_shift": "Afternoon",
              "least_energy_consumed_shift": "Morning",
              "shift_energy_trends": {
                "Morning": {
                  "total_energy": 3000,
                  "average_energy_per_machine": 500
                },
                "Afternoon": {
                  "total_energy": 6000,
                  "average_energy_per_machine": 1000
                },
                "Night": {
                  "total_energy": 4000,
                  "average_energy_per_machine": 666
                }
              }
            },
            "overall_trends": {
              "anomalies": [
                {
                  "machine_id": "agv_003",
                  "shift": "Night",
                  "description": "Sudden increase in energy consumption due to load weight."
                }
              ],
              "optimization_suggestions": [
                "Shift more machine operations to Morning shift to reduce energy spikes.",
                "Perform routine maintenance on welding_robot_006 to optimize energy efficiency."
              ]
            }
          }
        }

 requirements 
    - only generate json we asked for and nothing else because your answer will be used in  
      const json = JSON.parse(result.response.text());

        Here's the log data in JSON format:
        \`\`\`json
        ${JSON.stringify(energyLogs)}
        \`\`\`
        `;

    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const result = await model.generateContent(prompt);

    const cleanResponse = result.response.text().replace(/```json|```/g, "");

    const summary = JSON.parse(cleanResponse);

    res
      .status(200)
      .json({ message: "Energy summary generated successfully", summary });
  } catch (error) {
    console.error("Error generating energy summary:", error);
    res.status(500).json({ error: "Error generating energy summary." });
  }
};

const createShortlistedEmailTemplate = (participantData, hackathonData, winners) => {
  const { projectTitle, teamName, leaderName, pptScore, projectScore, combinedScore } = participantData;
  const { title: hackathonTitle } = hackathonData;
  
  return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Round 2 Results - ${hackathonTitle}</title>
    <style>
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
            background-color: #f8f9fa;
        }
        .container {
            background-color: #ffffff;
            border-radius: 12px;
            padding: 30px;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }
        .header {
            text-align: center;
            margin-bottom: 30px;
            padding: 20px;
            background: linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%);
            border-radius: 8px;
            color: white;
        }
        .achievement-badge {
            font-size: 48px;
            margin-bottom: 10px;
        }
        .title-text {
            font-size: 24px;
            font-weight: bold;
            margin-bottom: 10px;
        }
        .hackathon-title {
            font-size: 20px;
            opacity: 0.9;
        }
        .participant-details {
            background-color: #f8f9fa;
            border-radius: 8px;
            padding: 20px;
            margin: 20px 0;
        }
        .score-grid {
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            gap: 15px;
            margin: 20px 0;
        }
        .score-item {
            background-color: #e8f5e8;
            padding: 15px;
            border-radius: 8px;
            text-align: center;
        }
        .score-label {
            font-size: 12px;
            color: #666;
            text-transform: uppercase;
            letter-spacing: 1px;
        }
        .score-value {
            font-size: 24px;
            font-weight: bold;
            color: #2e7d32;
        }
        .winners-table {
            margin: 30px 0;
            border-radius: 8px;
            overflow: hidden;
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        }
        .winners-table table {
            width: 100%;
            border-collapse: collapse;
        }
        .winners-table th {
            background-color: #1976d2;
            color: white;
            padding: 12px;
            text-align: left;
            font-weight: 600;
        }
        .winners-table td {
            padding: 12px;
            border-bottom: 1px solid #e0e0e0;
        }
        .winners-table tr:nth-child(even) {
            background-color: #f5f5f5;
        }
        .winners-table tr:hover {
            background-color: #e3f2fd;
        }
        .position-cell {
            font-weight: bold;
            color: #1976d2;
        }
        .footer {
            text-align: center;
            margin-top: 30px;
            padding: 20px;
            background-color: #f8f9fa;
            border-radius: 8px;
        }
        .cta-button {
            display: inline-block;
            background-color: #1976d2;
            color: white;
            padding: 12px 24px;
            text-decoration: none;
            border-radius: 6px;
            font-weight: 600;
            margin: 10px 0;
        }
        .highlight {
            background-color: #fff3cd;
            border: 1px solid #ffeaa7;
            border-radius: 6px;
            padding: 15px;
            margin: 20px 0;
        }
        .motivation-section {
            background-color: #e8f5e8;
            border-radius: 8px;
            padding: 20px;
            margin: 20px 0;
        }
        @media (max-width: 600px) {
            .score-grid {
                grid-template-columns: 1fr;
            }
            .winners-table {
                font-size: 14px;
            }
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <div class="achievement-badge">🎯</div>
            <div class="title-text">Round 2 Results</div>
            <div class="hackathon-title">${hackathonTitle}</div>
        </div>

        <div class="highlight">
            <h2 style="margin: 0 0 10px 0; color: #856404;">🎉 Congratulations on Making Round 2!</h2>
            <p style="margin: 0; color: #856404;">
                Your team <strong>${teamName}</strong> successfully advanced to Round 2 of ${hackathonTitle}! 
                While you didn't make it to the winners' circle this time, your achievement is still remarkable.
            </p>
        </div>

        <div class="participant-details">
            <h3 style="margin: 0 0 15px 0; color: #2e7d32;">📊 Your Round 2 Performance</h3>
            <p><strong>Project:</strong> ${projectTitle}</p>
            <p><strong>Team:</strong> ${teamName}</p>
            <p><strong>Team Leader:</strong> ${leaderName}</p>
            
            <div class="score-grid">
                <div class="score-item">
                    <div class="score-label">PPT Score</div>
                    <div class="score-value">${pptScore}/10</div>
                </div>
                <div class="score-item">
                    <div class="score-label">Project Score</div>
                    <div class="score-value">${projectScore}/10</div>
                </div>
                <div class="score-item">
                    <div class="score-label">Combined Score</div>
                    <div class="score-value">${combinedScore}/10</div>
                </div>
            </div>
        </div>

        <div class="motivation-section">
            <h3 style="margin: 0 0 15px 0; color: #2e7d32;">💪 Keep Going!</h3>
            <p style="margin: 0 0 15px 0;">
                Making it to Round 2 is a significant achievement! You've demonstrated strong technical skills, 
                creativity, and teamwork. Every hackathon is a learning experience, and you've gained valuable 
                insights that will help you in future competitions.
            </p>
            <p style="margin: 0;">
                <strong>Remember:</strong> Many successful developers and entrepreneurs didn't win their first 
                hackathon. What matters is that you keep building, learning, and pushing your boundaries!
            </p>
        </div>

        <div class="winners-table">
            <h3 style="margin: 0 0 15px 0; color: #1976d2;">🏅 Winners of ${hackathonTitle}</h3>
            <table>
                <thead>
                    <tr>
                        <th>Position</th>
                        <th>Team</th>
                        <th>Project</th>
                        <th>Combined Score</th>
                    </tr>
                </thead>
                <tbody>
                    ${winners.map((winner, index) => `
                        <tr>
                            <td class="position-cell">${index + 1}</td>
                            <td>${winner.teamName}</td>
                            <td>${winner.projectTitle}</td>
                            <td>${winner.combinedScore}/10</td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        </div>

        <div class="footer">
            <h3 style="margin: 0 0 15px 0; color: #1976d2;">🚀 What's Next?</h3>
            <p style="margin: 0 0 20px 0;">
                Don't let this setback discourage you! Use this experience to:
            </p>
            <ul style="text-align: left; margin: 0 0 20px 0;">
                <li>Analyze what worked well in your project</li>
                <li>Identify areas for improvement</li>
                <li>Connect with other participants for future collaborations</li>
                <li>Start working on your next innovative idea</li>
            </ul>
            <a href="#" class="cta-button">Join Our Community</a>
            <p style="margin: 15px 0 0 0; font-size: 14px; color: #666;">
                Thank you for participating in ${hackathonTitle}!<br>
                Keep building amazing solutions! 🚀
            </p>
        </div>
    </div>
</body>
</html>
  `;
};

const createShortlistedEmailText = (participantData, hackathonData, winners) => {
  const { projectTitle, teamName, leaderName, pptScore, projectScore, combinedScore } = participantData;
  const { title: hackathonTitle } = hackathonData;
  
  return `
🎯 Round 2 Results - ${hackathonTitle}

Dear ${leaderName},

Congratulations on successfully advancing to Round 2 of ${hackathonTitle}! While your team "${teamName}" didn't make it to the winners' circle this time, reaching Round 2 is a significant achievement that demonstrates your technical skills and creativity.

📊 YOUR ROUND 2 PERFORMANCE:
• Project: ${projectTitle}
• Team: ${teamName}
• Team Leader: ${leaderName}
• PPT Score: ${pptScore}/10
• Project Score: ${projectScore}/10
• Combined Score: ${combinedScore}/10

💪 KEEP GOING!
Making it to Round 2 is a remarkable achievement! You've demonstrated strong technical skills, creativity, and teamwork. Every hackathon is a learning experience, and you've gained valuable insights that will help you in future competitions.

Remember: Many successful developers and entrepreneurs didn't win their first hackathon. What matters is that you keep building, learning, and pushing your boundaries!

🏅 WINNERS OF ${hackathonTitle.toUpperCase()}:
${winners.map((winner, index) => 
  `${index + 1}. ${winner.teamName} - ${winner.projectTitle} (${winner.combinedScore}/10)`
).join('\n')}

🚀 WHAT'S NEXT?
Don't let this setback discourage you! Use this experience to:
• Analyze what worked well in your project
• Identify areas for improvement
• Connect with other participants for future collaborations
• Start working on your next innovative idea

Thank you for participating in ${hackathonTitle}!
Keep building amazing solutions! 🚀

Best regards,
The ${hackathonTitle} Team
  `;
};

module.exports = {
  createShortlistedEmailTemplate,
  createShortlistedEmailText
}; 
const createWinnerEmailTemplate = (winnerData, hackathonData, position) => {
  const { projectTitle, teamName, leaderName, pptScore, projectScore, combinedScore } = winnerData;
  const { title: hackathonTitle, rounds } = hackathonData;
  
  const getPositionText = (position) => {
    if (position === 1) return '🥇 1st Place';
    if (position === 2) return '🥈 2nd Place';
    if (position === 3) return '🥉 3rd Place';
    return `${position}th Place`;
  };

  const getPositionEmoji = (position) => {
    if (position === 1) return '🏆';
    if (position === 2) return '🥈';
    if (position === 3) return '🥉';
    return '🎉';
  };

  return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Congratulations! You're a Winner!</title>
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
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            border-radius: 8px;
            color: white;
        }
        .winner-badge {
            font-size: 48px;
            margin-bottom: 10px;
        }
        .position-text {
            font-size: 24px;
            font-weight: bold;
            margin-bottom: 10px;
        }
        .hackathon-title {
            font-size: 20px;
            opacity: 0.9;
        }
        .winner-details {
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
            background-color: #e3f2fd;
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
            color: #1976d2;
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
            <div class="winner-badge">${getPositionEmoji(position)}</div>
            <div class="position-text">${getPositionText(position)}</div>
            <div class="hackathon-title">${hackathonTitle}</div>
        </div>

        <div class="highlight">
            <h2 style="margin: 0 0 10px 0; color: #856404;">🎉 Congratulations!</h2>
            <p style="margin: 0; color: #856404;">
                Your team <strong>${teamName}</strong> has achieved an outstanding result in ${hackathonTitle}! 
                Your dedication, innovation, and hard work have been recognized by our expert judges.
            </p>
        </div>

        <div class="winner-details">
            <h3 style="margin: 0 0 15px 0; color: #1976d2;">🏆 Your Achievement Details</h3>
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

        <div class="winners-table">
            <h3 style="margin: 0 0 15px 0; color: #1976d2;">🏅 Complete Winners List</h3>
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
                    ${hackathonData.winners.map((winner, index) => `
                        <tr ${winner._id === winnerData._id ? 'style="background-color: #e8f5e8; border-left: 4px solid #4caf50;"' : ''}>
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
            <h3 style="margin: 0 0 15px 0; color: #1976d2;">🎯 What's Next?</h3>
            <p style="margin: 0 0 20px 0;">
                Your achievement opens up exciting opportunities! Keep building, innovating, and pushing the boundaries of technology.
            </p>
            <a href="#" class="cta-button">View Certificate</a>
            <p style="margin: 15px 0 0 0; font-size: 14px; color: #666;">
                Thank you for participating in ${hackathonTitle}!<br>
                Keep innovating and building amazing solutions! 🚀
            </p>
        </div>
    </div>
</body>
</html>
  `;
};

const createWinnerEmailText = (winnerData, hackathonData, position) => {
  const { projectTitle, teamName, leaderName, pptScore, projectScore, combinedScore } = winnerData;
  const { title: hackathonTitle } = hackathonData;
  
  const getPositionText = (position) => {
    if (position === 1) return '🥇 1st Place';
    if (position === 2) return '🥈 2nd Place';
    if (position === 3) return '🥉 3rd Place';
    return `${position}th Place`;
  };

  return `
🎉 CONGRATULATIONS! You're a Winner! 🎉

${getPositionText(position)} - ${hackathonTitle}

Dear ${leaderName},

We are thrilled to announce that your team "${teamName}" has achieved ${getPositionText(position)} in ${hackathonTitle}!

🏆 YOUR ACHIEVEMENT DETAILS:
• Project: ${projectTitle}
• Team: ${teamName}
• Team Leader: ${leaderName}
• PPT Score: ${pptScore}/10
• Project Score: ${projectScore}/10
• Combined Score: ${combinedScore}/10

🏅 COMPLETE WINNERS LIST:
${hackathonData.winners.map((winner, index) => 
  `${index + 1}. ${winner.teamName} - ${winner.projectTitle} (${winner.combinedScore}/10)`
).join('\n')}

🎯 WHAT'S NEXT?
Your achievement opens up exciting opportunities! Keep building, innovating, and pushing the boundaries of technology.

Thank you for participating in ${hackathonTitle}!
Keep innovating and building amazing solutions! 🚀

Best regards,
The ${hackathonTitle} Team
  `;
};

module.exports = {
  createWinnerEmailTemplate,
  createWinnerEmailText
}; 
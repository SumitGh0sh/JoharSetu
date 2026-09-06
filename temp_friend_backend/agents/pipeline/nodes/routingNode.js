const { generateAIResponse } = require('../../../config/ai');

/**
 * Node 4: University Skill-Matrix Matching & Institutional Routing Node
 */
const routingNode = async (state) => {
  const { category, technicalComplexity, suggestedSolutionApproach } = state;

  const departmentMap = {
    'Water & Sanitation': 'Civil & Environmental Engineering',
    'Healthcare & Nutrition': 'Biotechnology & Medical Electronics',
    'Agriculture & Rural Economy': 'Agricultural Engineering & Rural Tech',
    'Roads & Infrastructure': 'Civil & Structural Engineering',
    'Education & Literacy': 'Computer Science & EdTech Solutions',
    'Clean Energy & Environment': 'Electrical & Renewable Energy Engineering',
    'Public Services & Governance': 'Computer Science & Information Systems',
    'Other': 'Multi-Disciplinary Innovation Cell',
  };

  const recommendedDept = departmentMap[category] || 'Multi-Disciplinary Innovation Cell';

  return {
    assignedDepartment: recommendedDept,
    recommendedUniversity: 'Ranchi University / BIT Mesra / NIT Jamshedpur / IIT ISM Dhanbad',
    steps: [
      `[Routing] Matched with University Department: "${recommendedDept}"`,
    ],
  };
};

module.exports = routingNode;

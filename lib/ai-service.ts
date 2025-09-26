// AI service for generating legal responses
// In production, this would integrate with OpenAI, Anthropic, or similar

const LEGAL_KNOWLEDGE_BASE = {
  'landlord-tenant': {
    keywords: ['rent', 'landlord', 'tenant', 'lease', 'eviction', 'deposit'],
    responses: {
      default: `Based on general tenant rights principles in most jurisdictions:

**Key Rights:**
• Right to a habitable living space (working plumbing, heating, electricity)
• Right to reasonable notice (usually 24-48 hours) before landlord entry
• Protection from retaliation for exercising rights
• Right to dispute charges and seek refunds

**Important Notes:**
• Laws vary significantly by location
• Always document everything in writing
• Consider consulting local tenant rights organizations
• Keep records of all communications and payments

⚠️ **This is general information, not legal advice. Consult a qualified attorney for your specific situation.**`,
    },
  },

  'employment': {
    keywords: ['work', 'job', 'employer', 'employee', 'wage', 'harassment', 'discrimination'],
    responses: {
      default: `Based on general employment law principles:

**Fundamental Rights:**
• Right to fair wages and overtime pay
• Protection from discrimination and harassment
• Right to a safe workplace
• Right to reasonable accommodations for disabilities
• Protection from retaliation for reporting violations

**Common Protections:**
• Minimum wage and overtime requirements
• Anti-discrimination laws (race, gender, age, disability)
• Whistleblower protections
• Family and medical leave rights

⚠️ **This is general information, not legal advice. Employment laws vary by jurisdiction and situation.**`,
    },
  },

  'consumer-rights': {
    keywords: ['purchase', 'product', 'service', 'refund', 'warranty', 'defective'],
    responses: {
      default: `Based on general consumer protection principles:

**Key Consumer Rights:**
• Right to accurate product information
• Right to return defective products
• Protection against deceptive practices
• Right to dispute unauthorized charges
• Warranty protections for covered items

**Steps to Take:**
1. Document the issue with photos/dates
2. Contact the seller/business in writing
3. Keep records of all communications
4. Know your local consumer protection agency
5. Consider dispute resolution options

⚠️ **This is general information, not legal advice. Consumer laws vary by product and location.**`,
    },
  },

  'general': {
    keywords: [],
    responses: {
      default: `I understand you're asking about legal rights or concerns. While I can provide general information about common legal principles, please remember:

**Important Disclaimers:**
• This is not legal advice or a substitute for professional counsel
• Laws vary significantly by jurisdiction and individual circumstances
• For specific situations, consult a qualified attorney
• Local laws and regulations may differ from general principles

**General Legal Principles:**
• Know your rights through credible sources
• Document everything related to your situation
• Communicate in writing when possible
• Understand applicable statutes of limitations
• Consider mediation or dispute resolution options

For more specific guidance, please provide additional details about your situation or location.`,
    },
  },
};

function categorizeQuestion(question: string): string {
  const lowerQuestion = question.toLowerCase();

  for (const [category, data] of Object.entries(LEGAL_KNOWLEDGE_BASE)) {
    if (data.keywords.some(keyword => lowerQuestion.includes(keyword))) {
      return category;
    }
  }

  return 'general';
}

export async function generateLegalResponse(question: string, providedCategory?: string): Promise<string> {
  try {
    // Determine category
    const category = providedCategory || categorizeQuestion(question);
    const categoryData = LEGAL_KNOWLEDGE_BASE[category as keyof typeof LEGAL_KNOWLEDGE_BASE] || LEGAL_KNOWLEDGE_BASE.general;

    // In a real implementation, this would call an AI service like OpenAI
    // For now, we'll use template responses with some customization

    let response = categoryData.responses.default;

    // Add category-specific context
    if (category !== 'general') {
      response = response.replace(
        'Based on general',
        `Based on general ${category.replace('-', ' ')}`
      );
    }

    // Add question-specific context if possible
    const lowerQuestion = question.toLowerCase();

    if (lowerQuestion.includes('eviction') || lowerQuestion.includes('evict')) {
      response += '\n\n**Regarding Eviction:**\n• Landlords must usually provide written notice\n• Reasons must be legally valid\n• You generally have a right to respond/defend\n• Emergency situations may have different rules';
    }

    if (lowerQuestion.includes('deposit') || lowerQuestion.includes('security')) {
      response += '\n\n**Regarding Security Deposits:**\n• Landlords can only charge reasonable amounts\n• Must be returned within specified timeframes\n• Deductions must be itemized and legal\n• Interest may be required in some jurisdictions';
    }

    if (lowerQuestion.includes('discrimination') || lowerQuestion.includes('harass')) {
      response += '\n\n**Regarding Discrimination/Harassment:**\n• Protected characteristics vary by jurisdiction\n• Documentation is crucial\n• Multiple reporting options available\n• Retaliation is illegal';
    }

    // Add timestamp and disclaimer
    response += `\n\n---\n*Response generated on ${new Date().toLocaleDateString()}*\n*This information is for educational purposes only*`;

    return response;

  } catch (error) {
    console.error('AI service error:', error);

    // Fallback response
    return `I apologize, but I'm currently unable to generate a specific response to your legal question. Please consider consulting with a qualified legal professional for personalized advice.

**General Recommendations:**
• Document all relevant details of your situation
• Gather any related communications or documents
• Contact local legal aid organizations
• Consult with an attorney specializing in your area of concern

⚠️ **This is not legal advice. Please seek professional legal counsel for your specific situation.**`;
  }
}

export async function validateLegalContext(question: string): Promise<{
  isValid: boolean;
  category: string;
  complexity: 'simple' | 'moderate' | 'complex';
  requiresPremium: boolean;
}> {
  const category = categorizeQuestion(question);
  const complexity = question.length > 500 ? 'complex' :
                    question.length > 200 ? 'moderate' : 'simple';

  const requiresPremium = complexity === 'complex' ||
    question.toLowerCase().includes('lawsuit') ||
    question.toLowerCase().includes('court') ||
    question.toLowerCase().includes('litigation');

  return {
    isValid: true, // In production, add more validation
    category,
    complexity,
    requiresPremium,
  };
}


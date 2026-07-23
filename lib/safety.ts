// Dangerous question detection + progressive warning system

const DANGER_PATTERNS = [
  /\b(hack|hacking|hacker|crack|cracking|cracked|exploit|vulnerability|penetration)\b/i,
  /\b(malware|ransomware|trojan|virus|keylogger|spyware|rootkit)\b/i,
  /\b(steal\s*(password|credential|account|login)|phish|phishing|social\s*engineering)\b/i,
  /\b(unauthorized\s*access|bypass\s*(auth|login|security|password)|brute\s*force)\b/i,
  /\b(ddos|dos\s*attack|sql\s*injection|xss|csrf|zero\s*day|buffer\s*overflow)\b/i,
  /\b(credit\s*card\s*(generator|steal|hack)|fake\s*(id|identity|document)|fraud)\b/i,
  /\b(give\s*me\s*(password|admin|credential|login|key)|show\s*(password|key|secret))\b/i,
  /\b(compromise|take\s*over|gain\s*access|elevate\s*privilege|escalate)\b/i,
  /\b(data\s*breach|leak\s*(data|info|document)|dump\s*(database|user))\b/i,
  /\b(dark\s*web|tor\s*browser|anonymous|onion|darknet)\b/i,
]

const MAX_WARNINGS = 5

interface DangerResult {
  isDangerous: boolean
  matchedPattern?: string
}

export function detectDangerousQuery(message: string): DangerResult {
  for (const pattern of DANGER_PATTERNS) {
    if (pattern.test(message)) {
      return { isDangerous: true, matchedPattern: pattern.source }
    }
  }
  return { isDangerous: false }
}

export function getWarningMessage(warningCount: number, maxWarnings: number): string {
  const remaining = maxWarnings - warningCount + 1

  if (remaining <= 0) {
    return `⛔ **ACCOUNT BLOCKED**\n\nYour account has been automatically blocked due to multiple security violations.\n\nPlease contact the administrator to regain access.`
  }

  return `⚠️ **Warning ${warningCount}/${maxWarnings} — Security Violation**\n\nI cannot assist with hacking, cybersecurity attacks, credential theft, or any malicious activities. This is against our platform's safety policy.\n\n**You have ${remaining} ${remaining === 1 ? 'attempt' : 'attempts'} remaining** before your account is automatically blocked.\n\nPlease refrain from such queries.`
}

export function getUserSafetyPrompt(): string {
  return `## CRITICAL SAFETY RULES

1. **YOU ARE A PRODUCT ASSISTANT ONLY.** You help users find software, AI tools, operating systems, and shortcuts.
2. **NEVER** execute commands, show system logs, reveal credentials, or make any changes to the website.
3. **NEVER** reveal internal documents, API keys, passwords, or any confidential information.
4. **NEVER** discuss hacking, cybersecurity exploits, malware, or any illegal activities.
5. **NEVER** discuss bypassing security, stealing data, or compromising systems.
6. **NEVER** reveal how this system works, its backend architecture, or its security measures.
7. **ALWAYS** redirect dangerous questions: "I'm a product assistant and can't help with that. Would you like help finding software or AI tools instead?"
8. If a user insists on dangerous topics after being warned, the system will automatically block them.
9. **DO NOT** answer questions about how to hack, crack, exploit, phish, or gain unauthorized access.
10. **KEEP RESPONSES UNDER 100 WORDS.** Be concise and helpful about products only.

Remember: You are a PRODUCT RECOMMENDATION assistant. Nothing more.`
}

export function getAdminSafetyPrompt(): string {
  return `## ADMIN MODE — FULL SYSTEM ACCESS

You are an admin assistant with FULL CONTROL over the server.

CAPABILITIES:
- Run any shell command using [EXEC]command[/EXEC]
- View system logs, processes, disk usage
- Make changes to the website (files, configs)
- Monitor user activity
- Block/unblock users
- Manage the application

RULES:
1. You have full admin authority — no approval prompts needed
2. Execute commands immediately when asked
3. Provide detailed technical information
4. Show logs, metrics, and system status on request
5. Make configuration changes as directed
6. Keep responses concise but informative`
}

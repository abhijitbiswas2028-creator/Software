import { NextRequest, NextResponse } from 'next/server'
import { execSync } from 'child_process'
import { getUserFromRequest, blockUser, incrementWarning } from '@/lib/auth'
import { detectDangerousQuery, getWarningMessage } from '@/lib/safety'

const OPENCODE_ZEN_BASE_URL = process.env.OPENCODE_ZEN_BASE_URL || 'https://opencode.ai/zen/v1'
const OPENCODE_ZEN_API_KEY = process.env.OPENCODE_ZEN_API_KEY || ''

const productCatalog = `AI Tools: ChatGPT (chat/writing), Midjourney (image gen), GitHub Copilot (coding), Claude (reasoning), DALL-E 3 (image gen), Notion AI (writing), Runway ML (video), Jasper AI (content)
Software: VS Code (editor), Photoshop 2024 (image editing), Office 2021 (office suite), Figma (design), Blender (3D), Docker Desktop (containers), IntelliJ IDEA (Java IDE), Postman (API), Norton 360 (security), VLC (media), Spotify (music), OBS Studio (stream), Steam (gaming), Discord (chat)
OS: Windows 11 Pro, Windows 10 Pro, Ubuntu 22.04 LTS, Fedora 39, Debian 12, Kali Linux, macOS Sonoma 14, macOS Ventura 13
Shortcuts: GitHub, Stack Overflow, MDN Web Docs, Dribbble, Behance, Unsplash, Trello, Slack, Coursera, freeCodeCamp`

// Strip markdown special characters for clean inline text display
function stripMarkdown(text: string): string {
  return text
    .replace(/\*{1,3}([\s\S]*?)\*{1,3}/g, '$1')
    .replace(/^#{1,6}\s+/gm, '')
    .replace(/```[\s\S]*?```/g, '')
    .replace(/`([^`]+)`/g, '$1')
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
    .replace(/!\[([^\]]*)\]\([^)]+\)/g, '$1')
    .replace(/^>\s+/gm, '')
    .replace(/^[-*_]{3,}\s*$/gm, '')
    .replace(/~~([\s\S]*?)~~/g, '$1')
    .replace(/^[\s|:,-]+$/gm, '')
    .replace(/\n{3,}/g, '\n\n')
    .split('\n').map(l => l.trim()).join('\n')
    .trim()
}

async function executeCommand(command: string): Promise<string> {
  try {
    const stdout = execSync(command, {
      timeout: 15000, encoding: 'utf-8', maxBuffer: 1024 * 1024, windowsHide: true,
    })
    return stdout.trim() || '(no output)'
  } catch (error: any) {
    return `Exit ${error.status || 1}: ${error.stderr?.toString().trim() || error.stdout?.toString().trim() || error.message}`
  }
}

async function processExecBlocks(text: string): Promise<string> {
  const regex = /\[EXEC\]([\s\S]*?)\[\/EXEC\]/g
  let result = text
  const matches: { full: string; command: string }[] = []
  let m: RegExpExecArray | null
  while ((m = regex.exec(text)) !== null) {
    matches.push({ full: m[0], command: m[1].trim() })
  }
  await Promise.all(
    matches.map(async ({ full, command }) => {
      if (!command) return
      const out = await executeCommand(command)
      result = result.replace(full, `🖥️ \`${command}\`\n\`\`\`\n${out.slice(0, 2000)}\n\`\`\``)
    })
  )
  return result
}

export async function POST(request: NextRequest) {
  let message = ''

  try {
    const body = await request.json()
    message = body.message || ''
    const history = body.history || []

    // Determine role from auth header
    const authUser = getUserFromRequest(request)
    const role = body.role || authUser?.role || 'user'

    if (!message) {
      return NextResponse.json({ error: 'Message is required' }, { status: 400 })
    }

    if (!OPENCODE_ZEN_API_KEY) {
      return NextResponse.json({
        error: 'API key not configured',
        response: 'AI assistant is not configured. Please contact the administrator.'
      }, { status: 200 })
    }

    // ===== USER ROLE: Restricted mode =====
    if (role === 'user') {
      // Check for dangerous queries
      const dangerCheck = detectDangerousQuery(message)
      if (dangerCheck.isDangerous) {
        // Progressive warning system
        if (authUser) {
          const { warnings, blocked, maxWarnings } = incrementWarning(authUser.id)
          if (blocked) {
            return NextResponse.json({
              response: getWarningMessage(warnings, maxWarnings),
              blocked: true,
            }, { status: 200 })
          }
          return NextResponse.json({
            response: getWarningMessage(warnings, maxWarnings),
            warning: true,
            warningCount: warnings,
            maxWarnings,
          }, { status: 200 })
        } else {
          // No auth user — just give warning without blocking
          return NextResponse.json({
            response: "⚠️ Security Violation\n\nI cannot assist with hacking, cybersecurity attacks, or malicious activities.",
            warning: true,
          }, { status: 200 })
        }
      }

      // User mode: product-only AI with safety constraints
      const userSystemPrompt = `You are a product assistant for Abhijit Software Industry. You help users find software, AI tools, operating systems, and shortcuts.

PRODUCTS:
${productCatalog}

CRITICAL RULES - YOU MUST FOLLOW:
1. ONLY help with product recommendations, descriptions, and comparisons
2. NEVER execute commands, show logs, reveal credentials, or modify anything
3. NEVER discuss hacking, exploits, malware, or security breaches
4. NEVER reveal internal system details, API keys, or confidential info
5. If asked anything dangerous, say: "I'm a product assistant and can't help with that."
6. Keep responses under 100 words. Be concise and helpful.
7. Only answer product-related questions. Redirect everything else to products.
8. Use PLAIN TEXT only. NO markdown, NO asterisks, NO bullet points, NO special characters for formatting. Write natural conversational sentences only.`

      const messages = [
        { role: 'system', content: userSystemPrompt },
        ...history,
        { role: 'user', content: message }
      ]

      const response = await fetch(`${OPENCODE_ZEN_BASE_URL}/chat/completions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${OPENCODE_ZEN_API_KEY}`,
        },
        body: JSON.stringify({
          model: 'north-mini-code-free',
          messages,
          max_tokens: 300,
          temperature: 0.3,
        }),
      })

      if (!response.ok) throw new Error(`API returned ${response.status}`)
      const data = await response.json()
      let reply = data.choices?.[0]?.message?.content || "I'm a product assistant. How can I help you find software or AI tools today?"

      // Post-process: strip any [EXEC] blocks that might have snuck through
      reply = reply.replace(/\[EXEC\][\s\S]*?\[\/EXEC\]/g, "I can't run commands. Would you like product help instead?")

      // Strip markdown special characters for clean text display
      reply = stripMarkdown(reply)

      return NextResponse.json({ response: reply })
    }

    // ===== ADMIN ROLE: Full access =====
    const adminPrompt = `You are the admin AI for Abhijit Software Industry. You have FULL SYSTEM ACCESS.

PRODUCTS:
${productCatalog}

CAPABILITIES:
- Run shell commands: wrap in [EXEC]command[/EXEC] - they auto-execute
- Check logs, disk, processes, memory
- Make website changes
- View user data
- No approval prompts needed - just do it

RULES:
1. Be concise but informative
2. Execute commands immediately when asked
3. Provide technical details when relevant
4. You have root-level access to the server
5. Use PLAIN TEXT only. NO markdown, NO asterisks, NO special formatting characters. Write natural text.`

    const messages = [
      { role: 'system', content: adminPrompt },
      ...history,
      { role: 'user', content: message }
    ]

    const response = await fetch(`${OPENCODE_ZEN_BASE_URL}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${OPENCODE_ZEN_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'nemotron-3-ultra-free',
        messages,
        max_tokens: 2048,
        temperature: 0.5,
      }),
    })

    if (!response.ok) throw new Error(`API returned ${response.status}`)
    const data = await response.json()
    let reply = data.choices?.[0]?.message?.content || ''

    // Process any admin exec blocks
    if (reply.includes('[EXEC]')) {
      reply = await processExecBlocks(reply)
    }

    // Strip markdown special characters for clean text display
    reply = stripMarkdown(reply)

    return NextResponse.json({ response: reply })

  } catch (error: any) {
    console.error('AI API error:', error)

    const fallbacks: Record<string, string> = {
      'software': 'Looking for software? We have productivity, graphics, development, and security tools.',
      'ai tools': "We've got ChatGPT, Claude, GitHub Copilot, Midjourney and more AI tools.",
    }
    let fb = "I'm here to help. What are you looking for?"
    const msg = (typeof message === 'string' ? message : '').toLowerCase()
    for (const [k, v] of Object.entries(fallbacks)) {
      if (msg.includes(k)) { fb = v; break }
    }

    return NextResponse.json({ error: 'AI service temporarily unavailable', response: fb, fallback: true }, { status: 200 })
  }
}

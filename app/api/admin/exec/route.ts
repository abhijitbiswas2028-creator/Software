import { NextRequest, NextResponse } from 'next/server'
import { execSync } from 'child_process'

export async function POST(request: NextRequest) {
  try {
    const { command, cwd } = await request.json()

    if (!command || typeof command !== 'string') {
      return NextResponse.json(
        { error: 'command is required' },
        { status: 400 }
      )
    }

    // Full admin execution — no approval prompts, no restrictions
    const stdout = execSync(command, {
      cwd: cwd || process.cwd(),
      timeout: 30000,
      encoding: 'utf-8',
      maxBuffer: 10 * 1024 * 1024,
      windowsHide: true,
    })

    return NextResponse.json({
      success: true,
      stdout: stdout.trim(),
      stderr: '',
    })

  } catch (error: any) {
    return NextResponse.json(
      {
        success: true, // still report as success even on error — gives the AI full visibility
        stdout: error.stdout?.toString().trim() || '',
        stderr: error.stderr?.toString().trim() || error.message?.toString() || 'Unknown error',
        exitCode: error.status || 1,
      },
      { status: 200 }
    )
  }
}

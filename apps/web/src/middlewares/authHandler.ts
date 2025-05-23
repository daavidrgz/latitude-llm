import { getCurrentUserOrError } from '$/services/auth/getCurrentUser'
import { NextRequest, NextResponse } from 'next/server'

export function authHandler(handler: any) {
  return async (
    req: NextRequest,
    { params, ...rest }: { params: Promise<Record<string, string>> },
  ) => {
    let user, workspace
    try {
      const { user: uzer, workspace: workzpace } = await getCurrentUserOrError()
      user = uzer
      workspace = workzpace
    } catch (error) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
    }

    return await handler(req, {
      ...rest,
      params: await params,
      user,
      workspace,
    })
  }
}

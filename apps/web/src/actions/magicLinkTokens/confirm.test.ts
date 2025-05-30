import { ROUTES } from '$/services/routes'
import { redirect } from 'next/navigation'
import { confirmMagicLinkTokenAction } from './confirm'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { createMagicLinkToken } from '@latitude-data/core/services/magicLinkTokens/create'
import { confirmMagicLinkToken } from '@latitude-data/core/services/magicLinkTokens/confirm'
import { createProject } from '@latitude-data/core/factories'
import { User } from '@latitude-data/core/browser'
import { generateUUIDIdentifier } from '@latitude-data/core/lib/generateUUID'

vi.mock('next/navigation', () => ({
  redirect: vi.fn(),
}))

vi.mock('$/services/auth/setSession', () => ({
  setSession: vi.fn(),
}))

describe('confirmMagicLinkTokenAction', () => {
  let user: User
  beforeEach(async () => {
    vi.clearAllMocks()

    const { user: u } = await createProject()

    user = u
  })

  it('should redirect to login if magic link token is expired', async () => {
    const token = await createMagicLinkToken({ user }).then((r) => r.unwrap())
    await confirmMagicLinkToken(token.token).then((r) => r.unwrap())

    await confirmMagicLinkTokenAction({
      token: token.token,
    })

    expect(redirect).toHaveBeenCalledWith(ROUTES.auth.login)
  })

  it('should redirect to login if magic link token does not exist', async () => {
    await confirmMagicLinkTokenAction({
      token: generateUUIDIdentifier(),
    })

    expect(redirect).toHaveBeenCalledWith(ROUTES.auth.login)
  })

  it('redirects to ROUTES.root when magic link exists and is not expired', async () => {
    const token = await createMagicLinkToken({ user }).then((r) => r.unwrap())

    await confirmMagicLinkTokenAction({
      token: token.token,
    })

    expect(redirect).toHaveBeenCalledWith(ROUTES.root)
  })
})

export enum SocketEvent {
  HOLD_PENDING = 'hold_pending',
  HOLD_SUCCEEDED = 'hold_succeeded',
  HOLD_FAILED = 'hold_failed',
  MINT_TICKET_SUCCEEDED = 'mint_ticket_succeeded',
  PAID_HOLD_TICKET = 'paid_hold_ticket',
  REFUND_TICKET_PROCESS = 'refund_ticket_process',
}

export enum ETeamSocketEvent {
  ORGANIZER_REPUBLISH_EVENT = 'organizer_republish_event',
  ADMIN_DEPLOY_POOL = 'admin_deploy_pool',
  ADMIN_APPROVE_REPUBLISH = 'admin_approve_republish',
  TEAM_MEMBER_REJECTED = 'team_member_rejected',
  GRAPH_ATTENDANCE_UPDATED = 'graph_attendance_updated',
  VERIFY_CHALLENGE_RESULT = 'verify_challenge_result',
}

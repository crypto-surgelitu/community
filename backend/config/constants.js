export const ROLES = {
  ADMIN: 'admin',
  COMMUNITY_MANAGER: 'community_manager',
  CASE_MANAGER: 'case_manager',
  AREA_MANAGER: 'area_manager',
  MENTOR: 'mentor',
  MENTEE: 'mentee',
  YOUTH_ENGAGEMENT_LEADER: 'youth_engagement_leader',
  COMMUNITY_ENGAGEMENT_LEADER: 'community_engagement_leader',
  COMMUNITY_ENGAGEMENT_ASSOCIATE: 'community_engagement_associate',
  ASSISTANT_PROJECT_ASSOCIATE: 'assistant_project_associate',
  OTHER: 'other'
};

export const ROLE_HIERARCHY = {
  [ROLES.ADMIN]: 4,
  [ROLES.COMMUNITY_MANAGER]: 3,
  [ROLES.CASE_MANAGER]: 2,
  [ROLES.AREA_MANAGER]: 1
};

export const MEMBER_STATUS = {
  ACTIVE: 'active',
  AT_RISK: 'at_risk',
  INACTIVE: 'inactive'
};

export const MEMBER_ENGAGEMENT = {
  LOW: 'low',
  MEDIUM: 'medium',
  HIGH: 'high'
};

export const EVENT_STATUS = {
  DRAFT: 'draft',
  PUBLISHED: 'published',
  IN_PROGRESS: 'in_progress',
  COMPLETED: 'completed',
  ARCHIVED: 'archived'
};

export const PROGRAM_TYPES = {
  WORKSHOP: 'workshop',
  TRAINING: 'training',
  SOCIAL: 'social',
  MENTORSHIP: 'mentorship',
  SPORTS: 'sports'
};

export const USER_STATUS = {
  ACTIVE: 'active',
  INACTIVE: 'inactive',
  SUSPENDED: 'suspended'
};

export const SENTIMENT = {
  LOVED_IT: 'loved_it',
  GOOD: 'good',
  OK: 'ok',
  DIDNT_ENJOY: 'didnt_enjoy',
  HATED_IT: 'hated_it'
};

export const TEMPLATE_CATEGORIES = {
  EVENT_REMINDER: 'event_reminder',
  ABSENCE_FOLLOWUP: 'absence_followup',
  ENCOURAGEMENT: 'encouragement',
  OTHER: 'other'
};

export const MESSAGE_TYPES = {
  WHATSAPP: 'whatsapp',
  SMS: 'sms',
  EMAIL: 'email'
};

export const MESSAGE_STATUS = {
  PENDING: 'pending',
  SENT: 'sent',
  FAILED: 'failed'
};

export const CHECK_IN_METHODS = {
  QR_SCAN: 'qr_scan',
  MANUAL: 'manual',
  USSD: 'ussd'
};

export const ENGAGEMENT_THRESHOLDS = {
  LOW: 5,
  HIGH: 10
};

export const AT_RISK_DAYS = 30;
export const EVENT_CONFLICT_BUFFER_MINUTES = 30;
export const DEFAULT_EVENT_DURATION = 120;

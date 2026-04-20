import Joi from 'joi';

export const schemas = {
  login: Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().min(8).required()
  }),
  
  signup: Joi.object({
    name: Joi.string().min(3).max(255).required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(8).required(),
    zone: Joi.string().required()
  }),

  changePassword: Joi.object({
    oldPassword: Joi.string().min(8).required(),
    newPassword: Joi.string().min(8).required()
  }),

  createEvent: Joi.object({
    title: Joi.string().min(3).max(255).required(),
    description: Joi.string().max(500).allow(''),
    programId: Joi.string().uuid().required(),
    organizerId: Joi.string().uuid().required(),
    zoneId: Joi.string().uuid().allow(null),
    eventDate: Joi.date().iso().required(),
    eventTime: Joi.string().pattern(/^\d{2}:\d{2}$/).required(),
    durationMinutes: Joi.number().min(30).max(480).required(),
    location: Joi.string().min(3).max(255).required(),
    maxCapacity: Joi.number().min(1).max(10000).required(),
    notifyBeneficiaries: Joi.boolean().default(false),
    notifyMentors: Joi.boolean().default(false),
    notifyAll: Joi.boolean().default(false)
  }),

  updateEvent: Joi.object({
    title: Joi.string().min(3).max(255),
    description: Joi.string().max(500).allow(''),
    programId: Joi.string().uuid(),
    zoneId: Joi.string().uuid().allow(null),
    eventDate: Joi.date().iso(),
    eventTime: Joi.string().pattern(/^\d{2}:\d{2}$/),
    durationMinutes: Joi.number().min(30).max(480),
    location: Joi.string().min(3).max(255),
    maxCapacity: Joi.number().min(1).max(10000),
    notifyBeneficiaries: Joi.boolean(),
    notifyMentors: Joi.boolean(),
    notifyAll: Joi.boolean()
  }),

  createMember: Joi.object({
    name: Joi.string().min(3).max(255).required(),
    phone: Joi.string().pattern(/^\+?[0-9]{10,15}$/).required(),
    email: Joi.string().email().allow(null),
    zoneId: Joi.string().uuid().allow(null)
  }),

  updateMember: Joi.object({
    name: Joi.string().min(3).max(255),
    phone: Joi.string().pattern(/^\+?[0-9]{10,15}$/),
    email: Joi.string().email().allow(null),
    zoneId: Joi.string().uuid().allow(null)
  }),

  bulkImportMembers: Joi.object({
    members: Joi.array().items(
      Joi.object({
        name: Joi.string().min(3).max(255).required(),
        phone: Joi.string().pattern(/^\+?[0-9]{10,15}$/).required(),
        email: Joi.string().email().allow(null).optional(),
        zone: Joi.string().allow(null).optional(),
        zoneId: Joi.string().uuid().allow(null).optional()
      }).unknown(true)
    ).min(1).max(500).required()
  }),

  checkIn: Joi.object({
    memberId: Joi.string().uuid().required(),
    checkInMethod: Joi.string().valid('qr_scan', 'manual').default('qr_scan')
  }),

  submitFeedback: Joi.object({
    memberId: Joi.string().uuid().required(),
    rating: Joi.number().min(1).max(5).required(),
    sentiment: Joi.string().valid('loved_it', 'good', 'ok', 'didnt_enjoy', 'hated_it').required(),
    textFeedback: Joi.string().max(500).allow('')
  }),

  createUser: Joi.object({
    email: Joi.string().email().required(),
    name: Joi.string().min(3).max(255).required(),
    role: Joi.string().valid('admin', 'community_manager', 'case_manager', 'area_manager').required(),
    phone: Joi.string().pattern(/^\+?[0-9]{10,15}$/).allow(null),
    sendInviteEmail: Joi.boolean().default(false)
  }),

  updateUser: Joi.object({
    name: Joi.string().min(3).max(255),
    role: Joi.string().valid('admin', 'community_manager', 'case_manager', 'area_manager'),
    status: Joi.string().valid('active', 'inactive', 'suspended')
  }),

  createProgram: Joi.object({
    name: Joi.string().min(3).max(255).required(),
    description: Joi.string().max(500).allow(''),
    type: Joi.string().valid('workshop', 'training', 'social', 'mentorship', 'sports').required(),
    color: Joi.string().pattern(/^#[0-9A-Fa-f]{6}$/).allow(null)
  }),

  createTemplate: Joi.object({
    title: Joi.string().min(3).max(255).required(),
    category: Joi.string().valid('event_reminder', 'absence_followup', 'encouragement', 'other').required(),
    content: Joi.string().min(10).max(5000).required(),
    variables: Joi.array().items(Joi.string()).allow(null)
  }),

  sendMessage: Joi.object({
    message: Joi.string().min(1).max(5000).required(),
    templateId: Joi.string().uuid().allow(null)
  }),

  queryParams: Joi.object({
    limit: Joi.number().min(1).max(100).default(20),
    offset: Joi.number().min(0).default(0),
    status: Joi.string(),
    program: Joi.string().uuid(),
    zone: Joi.string().uuid(),
    dateFrom: Joi.date().iso(),
    dateTo: Joi.date().iso(),
    engagement: Joi.string().valid('low', 'medium', 'high'),
    search: Joi.string().allow(''),
    rating: Joi.number().min(1).max(5),
    sentiment: Joi.string().valid('loved_it', 'good', 'ok', 'didnt_enjoy', 'hated_it'),
    category: Joi.string().valid('event_reminder', 'absence_followup', 'encouragement', 'other')
  })
};

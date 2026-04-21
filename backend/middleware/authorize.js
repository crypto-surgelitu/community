import { ROLES, ROLE_HIERARCHY } from '../config/constants.js';
import { getPermissionsForRole, PERMISSIONS } from '../config/permissions.js';

export function authorize(...allowedRoles) {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ error: 'Not authenticated', status: 401 });
    }
    
    const userRole = req.user.role;
    const userLevel = ROLE_HIERARCHY[userRole] || 0;
    
    const hasPermission = allowedRoles.some(role => {
      const requiredLevel = ROLE_HIERARCHY[role] || 0;
      return userLevel >= requiredLevel;
    });
    
    if (!hasPermission) {
      return res.status(403).json({
        error: 'You do not have permission for this action',
        status: 403
      });
    }
    
    next();
  };
}

export function requirePermission(...requiredPermissions) {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ error: 'Not authenticated', status: 401 });
    }
    
    const userPermissions = getPermissionsForRole(req.user.role);
    
    const hasAnyPermission = requiredPermissions.some(permission => 
      userPermissions.includes(permission)
    );
    
    if (!hasAnyPermission) {
      return res.status(403).json({
        error: 'You do not have permission for this action',
        status: 403
      });
    }
    
    next();
  };
}

export function requireAllPermissions(...requiredPermissions) {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ error: 'Not authenticated', status: 401 });
    }
    
    const userPermissions = getPermissionsForRole(req.user.role);
    
    const hasAllPermissions = requiredPermissions.every(permission => 
      userPermissions.includes(permission)
    );
    
    if (!hasAllPermissions) {
      return res.status(403).json({
        error: 'You do not have permission for this action',
        status: 403
      });
    }
    
    next();
  };
}

export function requireRole(...allowedRoles) {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ error: 'Not authenticated', status: 401 });
    }
    
    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        error: 'You do not have permission for this action',
        status: 403
      });
    }
    
    next();
  };
}

export function isAdmin(req, res, next) {
  return requireRole(ROLES.ADMIN)(req, res, next);
}

export function isOrganizerOrAdmin(req, res, next) {
  if (!req.user) {
    return res.status(401).json({ error: 'Not authenticated', status: 401 });
  }
  
  if (req.user.role === ROLES.ADMIN) {
    return next();
  }
  
  next();
}

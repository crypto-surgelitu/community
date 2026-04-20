'use strict';

import { User, Zone, Program } from '../../models/index.js';

export default {
  up: async (queryInterface, Sequelize) => {
    try {
      const admin = await User.findOrCreate({
        where: { email: 'admin@swahilipot.org' },
        defaults: {
          email: 'admin@swahilipot.org',
          password: 'admin123',
          name: 'System Admin',
          phone: '+254700000000',
          role: 'admin',
          status: 'active'
        }
      });
      
      const caseManager = await User.findOrCreate({
        where: { email: 'case.manager@swahilipot.org' },
        defaults: {
          email: 'case.manager@swahilipot.org',
          password: 'admin123',
          name: 'John Doe',
          phone: '+254711223344',
          role: 'case_manager',
          status: 'active'
        }
      });
      
      const zones = await Promise.all([
        Zone.findOrCreate({
          where: { name: 'Nyali' },
          defaults: { name: 'Nyali', description: 'Nyali Sub-county', color: '#3b82f6' }
        }),
        Zone.findOrCreate({
          where: { name: 'Kisauni' },
          defaults: { name: 'Kisauni', description: 'Kisauni Sub-county', color: '#10b981' }
        }),
        Zone.findOrCreate({
          where: { name: 'Likoni' },
          defaults: { name: 'Likoni', description: 'Likoni Sub-county', color: '#f59e0b' }
        }),
        Zone.findOrCreate({
          where: { name: 'Mvita' },
          defaults: { name: 'Mvita', description: 'Mvita Sub-county', color: '#ef4444' }
        }),
        Zone.findOrCreate({
          where: { name: 'Changamwe' },
          defaults: { name: 'Changamwe', description: 'Changamwe Sub-county', color: '#8b5cf6' }
        }),
        Zone.findOrCreate({
          where: { name: 'Jomvu' },
          defaults: { name: 'Jomvu', description: 'Jomvu Sub-county', color: '#f43f5e' }
        })
      ]);
      
      const programs = await Promise.all([
        Program.findOrCreate({
          where: { name: 'Youth Workshop' },
          defaults: { name: 'Youth Workshop', description: 'Technical workshops for youth', type: 'workshop', color: '#FF6600', createdBy: admin[0].id }
        }),
        Program.findOrCreate({
          where: { name: 'Mentorship Program' },
          defaults: { name: 'Mentorship Program', description: 'Mentoring sessions', type: 'mentorship', color: '#6600FF', createdBy: admin[0].id }
        }),
        Program.findOrCreate({
          where: { name: 'Sports Activities' },
          defaults: { name: 'Sports Activities', description: 'Sports and fitness', type: 'sports', color: '#00CC99', createdBy: admin[0].id }
        })
      ]);
      
      console.log('Seeding completed successfully');
      console.log('Default admin: admin@swahilipot.org / admin123');
      console.log('Default case manager: case.manager@swahilipot.org / admin123');
    } catch (error) {
      console.error('Seeding error:', error);
      throw error;
    }
  },

  down: async (queryInterface, Sequelize) => {
    // Optionally delete seeded data
    // await User.destroy({ where: { email: ['admin@swahilipot.org', 'case.manager@swahilipot.org'] } });
  }
};

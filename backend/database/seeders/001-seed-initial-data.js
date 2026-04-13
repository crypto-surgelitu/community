'use strict';

import { User, Zone, Program } from '../../models/index.js';

export async function seed() {
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
        defaults: { name: 'Nyali', description: 'Nyali Zone', color: '#0066CC' }
      }),
      Zone.findOrCreate({
        where: { name: 'Kizingo' },
        defaults: { name: 'Kizingo', description: 'Kizingo Zone', color: '#00CC66' }
      }),
      Zone.findOrCreate({
        where: { name: 'Mkomani' },
        defaults: { name: 'Mkomani', description: 'Mkomani Zone', color: '#CC0066' }
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
  }
}

export default { seed };

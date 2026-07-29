/**
 * Seed script — run once to create admin user + initial data
 * Usage: node src/scripts/seed.js
 */

import 'dotenv/config'
import mongoose from 'mongoose'
import connectDB from '../config/database.js'
import User        from '../models/User.js'
import Profile     from '../models/Profile.js'
import Skill       from '../models/Skill.js'
import Project     from '../models/Project.js'
import Experience  from '../models/Experience.js'
import Education   from '../models/Education.js'
import Settings    from '../models/Settings.js'

const seed = async () => {
  await connectDB()
  console.log('\n🌱 Starting seed...\n')

  // ── 1. Admin User ──────────────────────────────────────────────────────────
  const existingAdmin = await User.findOne({ email: process.env.ADMIN_EMAIL })
  if (existingAdmin) {
    console.log('⚠️  Admin user already exists — skipping user seed.')
  } else {
    await User.create({
      name:     'Gebremeskel Kiflemeskel',
      email:    process.env.ADMIN_EMAIL    || 'admin@portfolio.com',
      password: process.env.ADMIN_PASSWORD || 'Admin@123456',
      role:     'super_admin',
    })
    console.log('✅ Admin user created:', process.env.ADMIN_EMAIL)
  }

  // ── 2. Profile ────────────────────────────────────────────────────────────
  const existingProfile = await Profile.findOne()
  if (!existingProfile) {
    await Profile.create({
      name:            'Gebremeskel Kiflemeskel',
      title:           'Full Stack Web Developer',
      subtitle:        'Building modern web experiences',
      bio:             "I'm Gebremeskel Kiflemeskel, a passionate Full Stack Web Developer and Computer Science student based in Ethiopia. I specialize in building modern, performant web applications that solve real problems. My journey in software development started with curiosity and grew into a deep passion for crafting elegant solutions.",
      shortBio:        'CS student & Full Stack Dev from Ethiopia 🇪🇹',
      location:        'Ethiopia, East Africa',
      email:           'gkiflemeskel@gmail.com',
      available:       true,
      availabilityNote:'Available for opportunities',
      yearsExperience: 2,
      projectsCount:   20,
      goals:           'To build scalable, impactful software products and contribute to open source.',
      careerJourney:   'Started coding in 2021 with Python, moved to web development in 2022, and have been building full stack applications ever since.',
      socials: [
        { platform: 'github',   url: 'https://github.com/Tibeb93',   icon: 'FaGithub' },
        { platform: 'linkedin', url: 'https://linkedin.com',          icon: 'FaLinkedin' },
        { platform: 'telegram', url: 'https://t.me/tibeb93',          icon: 'FaTelegram' },
      ],
    })
    console.log('✅ Profile created')
  } else {
    console.log('⚠️  Profile already exists — skipping.')
  }

  // ── 3. Skills ─────────────────────────────────────────────────────────────
  const skillCount = await Skill.countDocuments()
  if (skillCount === 0) {
    await Skill.insertMany([
      // Frontend
      { name: 'React',       category: 'frontend', level: 95, iconColor: '#61DAFB', order: 1 },
      { name: 'JavaScript',  category: 'frontend', level: 92, iconColor: '#F7DF1E', order: 2 },
      { name: 'TypeScript',  category: 'frontend', level: 78, iconColor: '#3178C6', order: 3 },
      { name: 'Tailwind CSS',category: 'frontend', level: 90, iconColor: '#38BDF8', order: 4 },
      { name: 'Next.js',     category: 'frontend', level: 80, iconColor: '#FFFFFF', order: 5 },
      // Backend
      { name: 'Node.js',     category: 'backend',  level: 88, iconColor: '#68A063', order: 1 },
      { name: 'Express.js',  category: 'backend',  level: 85, iconColor: '#FFFFFF', order: 2 },
      { name: 'Python',      category: 'backend',  level: 75, iconColor: '#3776AB', order: 3 },
      // Database
      { name: 'MongoDB',     category: 'database', level: 85, iconColor: '#47A248', order: 1 },
      { name: 'PostgreSQL',  category: 'database', level: 78, iconColor: '#336791', order: 2 },
      { name: 'Redis',       category: 'database', level: 70, iconColor: '#DC382D', order: 3 },
      // Tools
      { name: 'Git',         category: 'tools',    level: 90, iconColor: '#F05032', order: 1 },
      { name: 'Docker',      category: 'tools',    level: 72, iconColor: '#2496ED', order: 2 },
      { name: 'Figma',       category: 'tools',    level: 68, iconColor: '#F24E1E', order: 3 },
    ])
    console.log('✅ Skills seeded (14 skills)')
  } else {
    console.log('⚠️  Skills already exist — skipping.')
  }

  // ── 4. Projects ───────────────────────────────────────────────────────────
  // Use create() one-by-one so the pre-save hook runs and generates slugs
  const projectCount = await Project.countDocuments()
  if (projectCount === 0) {
    await Project.create({
      title:       'E-Commerce Platform',
      description: 'Full-featured online store with product management, cart, payment integration, and admin dashboard.',
      technologies:['React', 'Node.js', 'MongoDB', 'Stripe', 'JWT'],
      category:    'fullstack',
      featured:    true,
      githubUrl:   'https://github.com/Tibeb93/Ecommerce',
      liveUrl:     'https://ecommerce-frontend-xi-eight.vercel.app/',
      status:      'completed',
      order:       1,
    })
    await Project.create({
      title:       'Learning Management System',
      description: 'Educational platform with course creation, video streaming, quizzes, and certificate generation.',
      technologies:['React', 'Node.js', 'AWS S3', 'MongoDB', 'Stripe'],
      category:    'fullstack',
      featured:    true,
      githubUrl:   'https://github.com',
      liveUrl:     'https://lms-platform-git-main-tibeb93s-projects.vercel.app/',
      status:      'completed',
      order:       2,
    })
    await Project.create({
      title:       'Task Management App',
      description: 'Collaborative project management tool with real-time updates and drag-and-drop boards.',
      technologies:['React', 'Socket.io', 'Express', 'PostgreSQL'],
      category:    'fullstack',
      featured:    false,
      githubUrl:   'https://github.com',
      liveUrl:     'https://example.com',
      status:      'completed',
      order:       3,
    })
    console.log('✅ Projects seeded (3 projects)')
  } else {
    console.log('⚠️  Projects already exist — skipping.')
  }

  // ── 5. Experience ─────────────────────────────────────────────────────────
  const expCount = await Experience.countDocuments()
  if (expCount === 0) {
    await Experience.insertMany([
      {
        company:     'Freelance',
        position:    'Full Stack Web Developer',
        type:        'freelance',
        startDate:   new Date('2023-01-01'),
        current:     true,
        description: 'Building custom web applications for clients across multiple industries.',
        responsibilities: [
          'Developing full-stack web applications using React and Node.js',
          'Designing and implementing RESTful APIs',
          'Managing MongoDB databases and designing schemas',
          'Deploying applications to cloud platforms',
        ],
        technologies: ['React', 'Node.js', 'MongoDB', 'Tailwind CSS'],
        order: 1,
      },
    ])
    console.log('✅ Experience seeded')
  } else {
    console.log('⚠️  Experience already exists — skipping.')
  }

  // ── 6. Education ──────────────────────────────────────────────────────────
  const eduCount = await Education.countDocuments()
  if (eduCount === 0) {
    await Education.create({
      university: 'Ethiopian University',
      degree:     'Bachelor of Science',
      field:      'Computer Science',
      startDate:  new Date('2022-09-01'),
      current:    true,
      description:'Studying algorithms, data structures, software engineering, and web development.',
      order: 1,
    })
    console.log('✅ Education seeded')
  } else {
    console.log('⚠️  Education already exists — skipping.')
  }

  // ── 7. Settings ───────────────────────────────────────────────────────────
  const settingsExist = await Settings.findOne()
  if (!settingsExist) {
    await Settings.create({
      siteTitle:     'Gebremeskel | Full Stack Developer',
      siteTagline:   'Building modern web experiences from Ethiopia',
      footerText:    'Built with React + Node.js + MongoDB',
      copyright:     `© ${new Date().getFullYear()} Gebremeskel Kiflemeskel`,
      contactEmail:  'gkiflemeskel@gmail.com',
      socials: {
        github:   'https://github.com/Tibeb93',
        linkedin: 'https://linkedin.com',
        telegram: 'https://t.me/tibeb93',
      },
      seoTitle:       'Gebremeskel Kiflemeskel | Full Stack Developer',
      seoDescription: 'Full Stack Web Developer from Ethiopia. Building modern, performant web applications with React, Node.js, and MongoDB.',
      seoKeywords:    ['full stack developer', 'react developer', 'node.js', 'ethiopia', 'web developer'],
    })
    console.log('✅ Settings created')
  } else {
    console.log('⚠️  Settings already exist — skipping.')
  }

  console.log('\n🎉 Seed complete!\n')
  console.log('──────────────────────────────────────────')
  console.log(`Admin Email:    ${process.env.ADMIN_EMAIL    || 'admin@portfolio.com'}`)
  console.log(`Admin Password: ${process.env.ADMIN_PASSWORD || 'Admin@123456'}`)
  console.log('──────────────────────────────────────────')
  console.log('⚠️  Change the admin password after first login!\n')

  await mongoose.disconnect()
  process.exit(0)
}

seed().catch(err => {
  console.error('❌ Seed failed:', err.message)
  process.exit(1)
})

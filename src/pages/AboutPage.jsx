import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Users, Target, Activity, ShieldCheck, BookOpen } from 'lucide-react'; // Changed BookOpenText to BookOpen

const AboutPage = () => {
  const teamMembers = [
    { name: "OG Champ", role: "Founder & Lead Instructor", bio: "A passionate cybersecurity expert with years of experience in ethical hacking, penetration testing, and digital forensics. Dedicated to making complex tech knowledge accessible.", imageUrl: null, icon: <ShieldCheck className="w-10 h-10 text-green-400 dark:text-purple-400"/> },
    // Add more team members if needed
  ];

  const values = [
    { title: "Knowledge Empowerment", description: "We believe in empowering individuals with practical, cutting-edge tech skills.", icon: <BookOpen className="w-8 h-8 text-green-400 dark:text-purple-400" /> }, // Changed BookOpenText to BookOpen
    { title: "Ethical Practices", description: "Our courses emphasize responsible and ethical use of technology and hacking skills.", icon: <ShieldCheck className="w-8 h-8 text-green-400 dark:text-purple-400" /> },
    { title: "Community Focus", description: "Fostering a supportive learning community for growth and collaboration.", icon: <Users className="w-8 h-8 text-green-400 dark:text-purple-400" /> },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="max-w-5xl mx-auto py-12 px-4"
    >
      <div className="text-center mb-16">
        <Users className="w-16 h-16 text-green-400 dark:text-purple-400 mx-auto mb-4 animate-pulse" />
        <h1 className="text-5xl font-bold brand-font text-green-300 dark:text-purple-300 neon-text">About Us</h1>
        <p className="text-xl text-green-400/80 dark:text-purple-400/80 mt-3 max-w-3xl mx-auto">
          Learn more about OG Champ Course platform, our mission, vision, and the team dedicated to your learning journey.
        </p>
      </div>

      <section className="mb-16">
        <Card className="hologram neon-glow border-green-500/30 dark:border-purple-500/30">
          <CardHeader>
            <CardTitle className="text-3xl text-center text-green-300 dark:text-purple-300 flex items-center justify-center gap-2"><Target className="w-8 h-8"/>Our Mission</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-lg text-green-400/90 dark:text-purple-400/90 text-center leading-relaxed">
              To provide high-quality, accessible, and practical education in cybersecurity and advanced technology. We aim to equip learners with the skills and knowledge to navigate and excel in the digital world, fostering a community of ethical hackers and tech enthusiasts.
            </p>
          </CardContent>
        </Card>
      </section>
      
      <section className="mb-16">
        <h2 className="text-4xl font-bold text-center text-green-300 dark:text-purple-300 brand-font mb-10 neon-text">Our Core Values</h2>
        <div className="grid md:grid-cols-3 gap-8">
          {values.map((value, index) => (
            <motion.div key={index} initial={{ opacity: 0, y:20 }} animate={{ opacity:1, y:0 }} transition={{delay: 0.2 * index}}>
              <Card className="hologram neon-glow border-green-500/30 dark:border-purple-500/30 h-full text-center">
                <CardHeader>
                  <div className="mx-auto mb-3 p-3 bg-green-500/20 dark:bg-purple-500/20 rounded-full inline-block">
                    {value.icon}
                  </div>
                  <CardTitle className="text-xl text-green-300 dark:text-purple-300">{value.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-green-400/80 dark:text-purple-400/80">{value.description}</CardDescription>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </section>

      <section className="mb-12">
        <h2 className="text-4xl font-bold text-center text-green-300 dark:text-purple-300 brand-font mb-10 neon-text">Meet The Team</h2>
        <div className="flex flex-wrap justify-center gap-10">
          {teamMembers.map((member, index) => (
             <motion.div key={index} initial={{ opacity: 0, scale:0.9 }} animate={{ opacity:1, scale:1 }} transition={{delay: 0.3 * index}}>
              <Card className="hologram neon-glow border-green-500/30 dark:border-purple-500/30 w-full max-w-sm text-center p-6">
                <CardHeader className="items-center">
                  {member.imageUrl ? (
                    <img-replace src={member.imageUrl} alt={member.name} class="w-32 h-32 rounded-full object-cover mx-auto mb-4 border-4 border-green-500 dark:border-purple-500" />
                  ) : (
                    <div className="w-32 h-32 rounded-full bg-black/30 dark:bg-white/10 flex items-center justify-center mx-auto mb-4 border-4 border-green-500 dark:border-purple-500">
                      {member.icon || <Users className="w-16 h-16 text-green-400 dark:text-purple-400" />}
                    </div>
                  )}
                  <CardTitle className="text-2xl text-green-300 dark:text-purple-300">{member.name}</CardTitle>
                  <CardDescription className="text-green-400/80 dark:text-purple-400/80 font-semibold">{member.role}</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-green-400/90 dark:text-purple-400/90">{member.bio}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </section>

      <section>
         <Card className="hologram neon-glow border-green-500/30 dark:border-purple-500/30">
          <CardHeader>
            <CardTitle className="text-3xl text-center text-green-300 dark:text-purple-300 flex items-center justify-center gap-2"><Activity className="w-8 h-8"/>Join Our Journey</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-lg text-green-400/90 dark:text-purple-400/90 text-center leading-relaxed">
              We are constantly evolving and expanding our offerings. Follow our channels and join our community to stay updated on new courses, events, and insights from the world of technology and cybersecurity.
            </p>
          </CardContent>
        </Card>
      </section>

    </motion.div>
  );
};

export default AboutPage;

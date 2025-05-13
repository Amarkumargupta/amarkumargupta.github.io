"use client";

import { useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import Typewriter from 'typewriter-effect';

export default function HeroSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    if (sectionRef.current) {
      gsap.fromTo(
        sectionRef.current,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.8, ease: "power3.out" }
      );
    }
  }, []);
  
  return (
    <div ref={sectionRef} className="mb-10">
      <div className="mb-6">
        <h1 className="text-3xl md:text-4xl font-bold mb-2">
          <Typewriter
            options={{
              strings: [
                'Cloud Engineer',
                'Aspiring DevOps Engineer',
                'AWS Certified',
                'GCP Certified'
              ],
              autoStart: true,
              loop: true,
              delay: 40,
              deleteSpeed: 20,
              wrapperClassName: "text-[rgb(var(--terminal-green))]"
            }}
          />
        </h1>
        
        <div className="mt-4 text-[rgba(var(--foreground-rgb),0.9)]">
          <div className="line command">$ whoami</div>
          <div className="result">
            <p className="mb-3">
              Cloud and DevOps Engineer with over 2 years of experience specializing in AWS LAMP stack migration.
              B.Tech in Computer Science and Engineering with certifications in AWS and Google Cloud.
            </p>
            <p className="mb-3">
              Expertise in <span className="highlight">AWS</span>, 
              <span className="highlight"> Kubernetes</span>, 
              <span className="highlight"> GitOps</span>, and 
              <span className="highlight"> Infrastructure as Code</span>.
            </p>
            <p>
              Passionate about cloud-native technologies, automation, and implementing 
              scalable solutions that drive business value.
            </p>
          </div>
        </div>
      </div>
      
      <div className="mt-8">
        <div className="line command">$ uptime</div>
        <div className="result">
          <div className="flex flex-wrap gap-4">
            <div className="bg-[rgba(var(--terminal-green),0.1)] p-3 rounded border border-[rgba(var(--terminal-green),0.3)]">
              <span className="text-2xl font-bold">2+</span>
              <p className="text-sm">Years Experience</p>
            </div>
            <div className="bg-[rgba(var(--terminal-green),0.1)] p-3 rounded border border-[rgba(var(--terminal-green),0.3)]">
              <span className="text-2xl font-bold">3</span>
              <p className="text-sm">Cloud Certifications</p>
            </div>
            <div className="bg-[rgba(var(--terminal-green),0.1)] p-3 rounded border border-[rgba(var(--terminal-green),0.3)]">
              <span className="text-2xl font-bold">20+</span>
              <p className="text-sm">Projects Migrated</p>
            </div>
            <div className="bg-[rgba(var(--terminal-green),0.1)] p-3 rounded border border-[rgba(var(--terminal-green),0.3)]">
              <span className="text-2xl font-bold">99.9%</span>
              <p className="text-sm">Uptime SLA</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
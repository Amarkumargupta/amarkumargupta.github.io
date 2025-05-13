"use client";

import { useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import { 
  Server, 
  Cloud, 
  Lock, 
  Code, 
  GitBranch, 
  Database, 
  BarChart, 
  Network 
} from 'lucide-react';

interface SkillCategory {
  name: string;
  icon: React.ReactNode;
  skills: string[];
}

export default function SkillsSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  
  const skillCategories: SkillCategory[] = [
    {
      name: "Cloud & Infrastructure",
      icon: <Cloud className="w-5 h-5" />,
      skills: ["AWS", "GCP", "LAMP Stack", "EC2", "S3", "RDS", "CloudFront", "IAM"]
    },
    {
      name: "DevOps",
      icon: <GitBranch className="w-5 h-5" />,
      skills: ["GitOps", "ArgoCD", "Jenkins", "GitHub Actions", "Docker", "Kubernetes"]
    },
    {
      name: "Infrastructure as Code",
      icon: <Code className="w-5 h-5" />,
      skills: ["Terraform", "CloudFormation", "Ansible", "Python", "Bash", "YAML"]
    },
    {
      name: "Monitoring",
      icon: <BarChart className="w-5 h-5" />,
      skills: ["CloudWatch", "Prometheus", "Grafana", "ELK Stack", "Datadog"]
    },
    {
      name: "Databases",
      icon: <Database className="w-5 h-5" />,
      skills: ["MySQL", "PostgreSQL", "MongoDB", "Redis", "DynamoDB"]
    },
    {
      name: "Security",
      icon: <Lock className="w-5 h-5" />,
      skills: ["IAM", "Security Groups", "WAF", "SSL/TLS", "VPC", "KMS"]
    }
  ];
  
  useEffect(() => {
    if (sectionRef.current) {
      gsap.fromTo(
        sectionRef.current,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.8, ease: "power3.out" }
      );
      
      const categories = sectionRef.current.querySelectorAll('.skill-category');
      gsap.fromTo(
        categories,
        { opacity: 0, y: 15 },
        { 
          opacity: 1, 
          y: 0, 
          stagger: 0.1, 
          duration: 0.6, 
          ease: "power2.out",
          delay: 0.3
        }
      );
    }
  }, []);
  
  return (
    <div ref={sectionRef} className="mb-10">
      <div className="line command">$ ls -l /skills</div>
      
      <div className="result mt-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {skillCategories.map((category, index) => (
            <div key={index} className="skill-category bg-[rgba(var(--terminal-gray),0.1)] p-4 rounded border border-[rgba(var(--terminal-green),0.3)]">
              <div className="flex items-center mb-3">
                <div className="mr-2 text-[rgb(var(--terminal-green))]">
                  {category.icon}
                </div>
                <h3 className="text-lg font-bold text-[rgb(var(--terminal-green))]">
                  {category.name}
                </h3>
              </div>
              
              <div className="flex flex-wrap gap-2">
                {category.skills.map((skill, skillIndex) => (
                  <div 
                    key={skillIndex} 
                    className="skill-item text-sm"
                  >
                    {skill}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
      
      <div className="mt-8">
        <div className="line command">$ grep "certification" /skills</div>
        <div className="result mt-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            <div className="certification-item bg-[rgba(var(--terminal-green),0.1)] p-3 rounded border border-[rgba(var(--terminal-green),0.3)]">
              AWS Certified Solutions Architect – Associate
            </div>
            <div className="certification-item bg-[rgba(var(--terminal-green),0.1)] p-3 rounded border border-[rgba(var(--terminal-green),0.3)]">
              AWS Certified Cloud Practitioner
            </div>
            <div className="certification-item bg-[rgba(var(--terminal-green),0.1)] p-3 rounded border border-[rgba(var(--terminal-green),0.3)]">
              Google Cloud Associate Cloud Engineer
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
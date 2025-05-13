"use client";

import { useRef, useEffect, useState } from 'react';
import { gsap } from 'gsap';
import { Mail, Github, Linkedin, Twitter, Send, AlertCircle, CheckCircle, Loader2 } from 'lucide-react';

export default function ContactSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });
  
  // Track form status
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formStatus, setFormStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [formErrors, setFormErrors] = useState<{
    name?: string;
    email?: string;
    message?: string;
    general?: string;
  }>({});
  
  useEffect(() => {
    if (sectionRef.current) {
      gsap.fromTo(
        sectionRef.current,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.8, ease: "power3.out" }
      );
    }
  }, []);
  
  // Validate email format
  const isValidEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };
  
  // Handle form field changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear the error for this field when user starts typing again
    if (formErrors[name as keyof typeof formErrors]) {
      setFormErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };
  
  // Validate form before submission
  const validateForm = (): boolean => {
    const errors: typeof formErrors = {};
    let isValid = true;
    
    if (!formData.name.trim()) {
      errors.name = 'Name is required';
      isValid = false;
    }
    
    if (!formData.email.trim()) {
      errors.email = 'Email is required';
      isValid = false;
    } else if (!isValidEmail(formData.email)) {
      errors.email = 'Please enter a valid email address';
      isValid = false;
    }
    
    if (!formData.message.trim()) {
      errors.message = 'Message is required';
      isValid = false;
    } else if (formData.message.trim().length < 10) {
      errors.message = 'Message must be at least 10 characters';
      isValid = false;
    }
    
    setFormErrors(errors);
    return isValid;
  };
  
  // Submit the form
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    // Update form status
    setIsSubmitting(true);
    setFormStatus('submitting');
    
    // Simulate API call for form submission
    setTimeout(() => {
      setIsSubmitting(false);
      setFormStatus('success');
      
      // Reset form
      setFormData({
        name: '',
        email: '',
        message: ''
      });
      
      // Reset form status after 3 seconds
      setTimeout(() => {
        setFormStatus('idle');
      }, 3000);
    }, 1000);
  };
  
  return (
    <div ref={sectionRef} className="mb-10" id="terminal-contact-section">
      <div className="line command">$ cat /contact/info.txt</div>
      
      <div className="result mt-4">
        <div className="flex justify-between flex-col md:flex-row gap-8">
          <div className="md:w-1/2">
            <p className="mb-6">
              Feel free to reach out for collaboration opportunities, consulting inquiries,
              or just to connect about DevOps and infrastructure topics.
            </p>
            
            <div className="space-y-4">
              <a href="mailto:contact@devops-expert.com" className="flex items-center hover:text-[rgb(var(--terminal-green))] transition-colors">
                <Mail className="w-5 h-5 mr-3" />
                <span>contact@devops-expert.com</span>
              </a>
              
              <a href="#" className="flex items-center hover:text-[rgb(var(--terminal-green))] transition-colors">
                <Github className="w-5 h-5 mr-3" />
                <span>github.com/devops-expert</span>
              </a>
              
              <a href="#" className="flex items-center hover:text-[rgb(var(--terminal-green))] transition-colors">
                <Linkedin className="w-5 h-5 mr-3" />
                <span>linkedin.com/in/devops-expert</span>
              </a>
              
              <a href="#" className="flex items-center hover:text-[rgb(var(--terminal-green))] transition-colors">
                <Twitter className="w-5 h-5 mr-3" />
                <span>twitter.com/devops_expert</span>
              </a>
            </div>
          </div>
          
          <div className="md:w-1/2">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="name" className="block mb-1 text-sm">Name</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  aria-invalid={!!formErrors.name}
                  aria-describedby={formErrors.name ? "name-error" : undefined}
                  value={formData.name}
                  onChange={handleChange}
                  className={`w-full p-2 bg-[rgba(var(--terminal-gray),0.2)] border rounded focus:outline-none text-[rgb(var(--foreground-rgb))] transition-colors ${formErrors.name ? 'border-red-500' : 'border-[rgba(var(--terminal-green),0.3)] focus:border-[rgb(var(--terminal-green))]'}`}
                />
                {formErrors.name && (
                  <div id="name-error" className="text-red-500 text-xs mt-1 flex items-center">
                    <AlertCircle className="w-3 h-3 mr-1" />
                    {formErrors.name}
                  </div>
                )}
              </div>
              
              <div>
                <label htmlFor="email" className="block mb-1 text-sm">Email</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  aria-invalid={!!formErrors.email}
                  aria-describedby={formErrors.email ? "email-error" : undefined}
                  value={formData.email}
                  onChange={handleChange}
                  className={`w-full p-2 bg-[rgba(var(--terminal-gray),0.2)] border rounded focus:outline-none text-[rgb(var(--foreground-rgb))] transition-colors ${formErrors.email ? 'border-red-500' : 'border-[rgba(var(--terminal-green),0.3)] focus:border-[rgb(var(--terminal-green))]'}`}
                />
                {formErrors.email && (
                  <div id="email-error" className="text-red-500 text-xs mt-1 flex items-center">
                    <AlertCircle className="w-3 h-3 mr-1" />
                    {formErrors.email}
                  </div>
                )}
              </div>
              
              <div>
                <label htmlFor="message" className="block mb-1 text-sm">Message</label>
                <textarea
                  id="message"
                  name="message"
                  aria-invalid={!!formErrors.message}
                  aria-describedby={formErrors.message ? "message-error" : undefined}
                  rows={4}
                  value={formData.message}
                  onChange={handleChange}
                  className={`w-full p-2 bg-[rgba(var(--terminal-gray),0.2)] border rounded focus:outline-none text-[rgb(var(--foreground-rgb))] transition-colors ${formErrors.message ? 'border-red-500' : 'border-[rgba(var(--terminal-green),0.3)] focus:border-[rgb(var(--terminal-green))]'}`}
                />
                {formErrors.message && (
                  <div id="message-error" className="text-red-500 text-xs mt-1 flex items-center">
                    <AlertCircle className="w-3 h-3 mr-1" />
                    {formErrors.message}
                  </div>
                )}
              </div>
              
              {formErrors.general && (
                <div className="text-red-500 text-sm mt-1 flex items-center">
                  <AlertCircle className="w-4 h-4 mr-1" />
                  {formErrors.general}
                </div>
              )}
              
              <button
                type="submit"
                disabled={isSubmitting}
                className={`px-4 py-2 bg-[rgba(var(--terminal-green),0.2)] border border-[rgba(var(--terminal-green),0.5)] rounded flex items-center transition-colors ${isSubmitting ? 'opacity-70 cursor-not-allowed' : 'hover:bg-[rgba(var(--terminal-green),0.3)]'}`}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    <span>Sending...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4 mr-2" />
                    <span>Send Message</span>
                  </>
                )}
              </button>
              
              {formStatus === 'success' && (
                <div className="text-green-500 text-sm mt-2 flex items-center">
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Message sent successfully! I'll get back to you soon.
                </div>
              )}
              
              {formStatus === 'error' && (
                <div className="text-red-500 text-sm mt-2 flex items-center">
                  <AlertCircle className="w-4 h-4 mr-2" />
                  There was an error sending your message. Please try again.
                </div>
              )}
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
import React from 'react';
import { useAppContext } from '../../contexts/AppContext';

const TestimonialsSection: React.FC = () => {
    const { settings } = useAppContext();
    const branding = settings?.branding;
    const testimonials = branding?.testimonials || [];

  return (
    <section id="testimonials" className="py-20 md:py-28">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900">{branding?.testimonialsSectionTitle || 'Loved by Businesses Worldwide'}</h2>
          <p className="mt-4 max-w-2xl mx-auto text-lg text-gray-600">
            {branding?.testimonialsSectionSubtitle || "Don't just take our word for it. Here's what our customers are saying."}
          </p>
        </div>
        <div className="mt-16 grid grid-cols-1 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div key={index} className="bg-gray-50 p-8 rounded-xl shadow-lg">
              <p className="text-gray-700 font-medium">"{testimonial.quote}"</p>
              <div className="mt-6 flex items-center">
                <img src={testimonial.avatar} alt={testimonial.name} className="w-12 h-12 rounded-full" />
                <div className="ml-4">
                  <p className="font-bold text-gray-900">{testimonial.name}</p>
                  <p className="text-sm text-gray-600">{testimonial.title}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
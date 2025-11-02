import React, { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { useAppContext } from '../../contexts/AppContext';
import { FaqItem as FaqItemType } from '../../types';

const FaqItem: React.FC<{ faq: FaqItemType }> = ({ faq }) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className="border-b border-gray-200 py-6">
      <button onClick={() => setIsOpen(!isOpen)} className="w-full flex justify-between items-center text-left">
        <h4 className="text-lg font-semibold text-gray-900">{faq.question}</h4>
        {isOpen ? <ChevronUp className="text-primary" /> : <ChevronDown className="text-gray-500" />}
      </button>
      {isOpen && <p className="mt-4 text-gray-600">{faq.answer}</p>}
    </div>
  );
};

const FaqSection: React.FC = () => {
    const { settings } = useAppContext();
    const branding = settings?.branding;
    const faqs = branding?.faqItems || [];

  return (
    <section id="faq" className="py-20 md:py-28 bg-gray-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          <div className="text-center">
            <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900">{branding?.faqSectionTitle || 'Frequently Asked Questions'}</h2>
            <p className="mt-4 text-lg text-gray-600">
              {branding?.faqSectionSubtitle || "Have questions? We've got answers. If you can't find what you're looking for, feel free to contact us."}
            </p>
          </div>
          <div className="mt-12">
            {faqs.map((faq, index) => <FaqItem key={index} faq={faq} />)}
          </div>
        </div>
      </div>
    </section>
  );
};

export default FaqSection;
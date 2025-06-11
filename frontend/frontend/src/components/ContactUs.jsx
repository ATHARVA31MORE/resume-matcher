import React from 'react';

const ContactUs = () => {
  return (
    <div className="max-w-4xl mx-auto px-6 py-12 bg-white rounded-lg shadow-lg mt-8">
      <h1 className="text-4xl font-bold mb-6 text-gray-800">Contact Us</h1>
      <p className="text-lg text-gray-700 mb-4 leading-relaxed">
        We'd love to hear from you! Whether you have questions, feedback, or partnership inquiries,
        feel free to reach out.
      </p>
      <ul className="text-gray-700 space-y-3">
        <li><strong>Email:</strong> support@resumematcher.ai</li>
        <li><strong>Phone:</strong> +91-9876543210</li>
        <li><strong>Address:</strong> ResumeMatcher HQ, Mumbai, India</li>
      </ul>
    </div>
  );
};

export default ContactUs;

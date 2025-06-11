import React from 'react';

const PrivacyPolicy = () => {
  return (
    <div className="max-w-4xl mx-auto px-6 py-12 bg-white rounded-lg shadow-lg mt-8">
      <h1 className="text-4xl font-bold mb-6 text-gray-800">Privacy Policy</h1>
      <p className="text-lg text-gray-700 leading-relaxed">
        ResumeMatcher respects your privacy. We only collect personal data necessary for delivering
        accurate job recommendations, and your information is never sold or shared without consent.
        All resume data, searches, and preferences are securely stored using Firebase.
      </p>
      <p className="text-lg text-gray-700 mt-4">
        By using our platform, you agree to our data practices. For any questions or deletion requests,
        please contact us.
      </p>
    </div>
  );
};

export default PrivacyPolicy;

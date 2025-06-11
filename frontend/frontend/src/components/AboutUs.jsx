import React from 'react';

const AboutUs = () => {
  return (
    <div className="max-w-5xl mx-auto px-6 py-12 bg-white rounded-lg shadow-lg mt-8">
      <h1 className="text-4xl font-bold text-gray-800 mb-6">About ResumeMatcher</h1>
      <p className="text-lg text-gray-700 mb-6 leading-relaxed">
        In a world where job hunting has become increasingly competitive and time-consuming, ResumeMatcher was created with a single mission: to simplify and supercharge the job search experience using the power of Artificial Intelligence.
        Our platform intelligently analyzes your resume and compares it to live job listings from reputable sources to identify the best matches for your skills, experience, and career goals.
      </p>

      <p className="text-lg text-gray-700 mb-6 leading-relaxed">
        Unlike generic job platforms, ResumeMatcher goes beyond keyword matching. Using cutting-edge machine learning models and semantic embedding techniques, we evaluate the actual content and context of your resume and job descriptions to provide deep, personalized job matching. We also offer intelligent feedback on your resume, including section-based scoring and improvement suggestions to help you present yourself in the best possible light.
      </p>

      <p className="text-lg text-gray-700 mb-6 leading-relaxed">
        ResumeMatcher is also your job search companion, offering smart alerts, automated match tracking, and the ability to monitor your past searches. You can receive curated job recommendations straight to your inbox on a weekly or monthly basis, tailored to your preferences.
      </p>

      <p className="text-lg text-gray-700 mb-6 leading-relaxed">
        Built with privacy and transparency in mind, all your data is securely stored using Firebase, and you remain in full control of your personal information. Our backend is powered by FastAPI for high-speed inference, and our AI pipeline leverages best-in-class NLP models to ensure accuracy and relevance.
      </p>

      <p className="text-lg text-gray-700 mb-6 leading-relaxed">
        At ResumeMatcher, we believe that every candidate deserves the opportunity to be seen and hired based on their true potential. Whether you are a fresh graduate or a seasoned professional, our platform empowers you to take control of your career journey with confidence and clarity.
      </p>
    </div>
  );
};

export default AboutUs;

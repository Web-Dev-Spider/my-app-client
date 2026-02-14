import React from 'react';

const PrivacyPolicy = () => {
    return (
        <div className="max-w-4xl mx-auto px-6 py-12 text-slate-700">
            <h1 className="text-3xl font-bold text-slate-900 mb-6">Privacy Policy</h1>
            <p className="mb-4">Effective Date: [Date]</p>

            <section className="mb-6 space-y-3">
                <h2 className="text-xl font-semibold text-slate-800">1. Information We Collect</h2>
                <p>We collect information you provide directly to us when you create an account, specifically your name, email address, agency details, and operational data related to your LPG distributorship.</p>
            </section>

            <section className="mb-6 space-y-3">
                <h2 className="text-xl font-semibold text-slate-800">2. How We Use Your Information</h2>
                <p>We use the information we collect to operate, maintain, and improve our services, specifically for managing your LPG agency's inventory, staff, and billing.</p>
            </section>

            <section className="mb-6 space-y-3">
                <h2 className="text-xl font-semibold text-slate-800">3. Data Security</h2>
                <p>We implement appropriate technical and organizational measures to protect the security of your personal information.</p>
            </section>

            <section className="mb-6 space-y-3">
                <h2 className="text-xl font-semibold text-slate-800">4. Contact Us</h2>
                <p>If you have any questions about this Privacy Policy, please contact us.</p>
            </section>
        </div>
    );
};

export default PrivacyPolicy;

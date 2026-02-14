import React from 'react';

const TermsOfService = () => {
    return (
        <div className="max-w-4xl mx-auto px-6 py-12 text-slate-700">
            <h1 className="text-3xl font-bold text-slate-900 mb-6">Terms of Service</h1>
            <p className="mb-4">Effective Date: [Date]</p>

            <section className="mb-6 space-y-3">
                <h2 className="text-xl font-semibold text-slate-800">1. Acceptance of Terms</h2>
                <p>By accessing or using D-Friend, you agree to be bound by these Terms. If you disagree with any part of the terms, then you may not access the service.</p>
            </section>

            <section className="mb-6 space-y-3">
                <h2 className="text-xl font-semibold text-slate-800">2. Description of Service</h2>
                <p>D-Friend provides a management platform for LPG distributorships, including inventory tracking, staff management, and billing services.</p>
            </section>

            <section className="mb-6 space-y-3">
                <h2 className="text-xl font-semibold text-slate-800">3. User Accounts</h2>
                <p>You are responsible for safeguarding the password that you use to access the service and for any activities or actions under your password.</p>
            </section>

            <section className="mb-6 space-y-3">
                <h2 className="text-xl font-semibold text-slate-800">4. Limitation of Liability</h2>
                <p>In no event shall D-Friend, nor its directors, employees, partners, agents, suppliers, or affiliates, be liable for any indirect, incidental, special, consequential or punitive damages.</p>
            </section>
        </div>
    );
};

export default TermsOfService;
